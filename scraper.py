"""
scraper.py - Flipkart Web Scraper module using Selenium and BeautifulSoup.
Extracts 20 structured fields across a Product SKU x Pincode matrix.
"""

import re
import time
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from urllib.parse import urlparse, parse_qs

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("FlipkartScraper")


class FlipkartScraper:
    """
    Production-grade web scraper for Flipkart product pages with dynamic pincode injection.
    """

    def __init__(self, headless: bool = True, timeout: int = 15):
        """
        Initializes Chrome WebDriver with stealth options and headers.
        
        :param headless: Whether to run Chrome in headless mode.
        :param timeout: Maximum explicit wait time in seconds.
        """
        self.timeout = timeout
        self.headless = headless
        self.driver = self._init_driver()

    def _init_driver(self) -> webdriver.Chrome:
        """
        Configures Chrome options with anti-detection flags and user-agent rotation.
        """
        chrome_options = Options()
        if self.headless:
            chrome_options.add_argument("--headless=new")
        
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument(
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
        
        # Experimental flags to bypass basic bot-detection
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option("useAutomationExtension", False)

        try:
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
            driver.set_page_load_timeout(30)
            return driver
        except Exception as e:
            logger.error(f"Failed to initialize Chrome Driver: {e}")
            raise

    @staticmethod
    def extract_product_id(url: str) -> Optional[str]:
        """
        Extracts the 'pid' query parameter from a Flipkart product URL.
        Example: https://flipkart.com/.../p/itm...?pid=FCWFC2G4YFHFGXZV -> FCWFC2G4YFHFGXZV
        """
        try:
            parsed = urlparse(url)
            query_params = parse_qs(parsed.query)
            if "pid" in query_params and query_params["pid"]:
                return query_params["pid"][0]
            
            # Fallback regex search for pid pattern in URL
            match = re.search(r'[?&]pid=([A-Z0-9]+)', url, re.IGNORECASE)
            if match:
                return match.group(1)
            return None
        except Exception as e:
            logger.warning(f"Error parsing PID from URL {url}: {e}")
            return None

    def update_pincode(self, pincode: str) -> bool:
        """
        Locates the delivery pincode input on Flipkart, sends the new pincode,
        submits it, and waits for dynamic location elements to refresh.
        
        :param pincode: 6-digit Indian postal code string.
        :return: True if pincode update succeeded or refreshed, False otherwise.
        """
        logger.info(f"Injecting pincode: {pincode}")
        try:
            # Common Flipkart pincode input element locators across revisions
            input_selectors = [
                (By.ID, "pincodeInputId"),
                (By.XPATH, "//input[contains(@placeholder, 'pincode') or contains(@placeholder, 'Pincode')]"),
                (By.XPATH, "//input[@type='text' and contains(@class, '_166SQN')]"),
                (By.XPATH, "//input[contains(@class, 'AFqTwm')]")
            ]

            pincode_input = None
            for by_type, selector in input_selectors:
                try:
                    pincode_input = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((by_type, selector))
                    )
                    if pincode_input.is_displayed():
                        break
                except TimeoutException:
                    continue

            if not pincode_input:
                logger.warning("Pincode input field not found on page.")
                return False

            # Scroll into view and interact
            self.driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", pincode_input)
            time.sleep(0.5)

            # Clear existing value using keyboard shortcut (Backspace) to handle stubborn inputs
            pincode_input.click()
            pincode_input.send_keys(Keys.CONTROL + "a")
            pincode_input.send_keys(Keys.BACKSPACE)
            time.sleep(0.2)
            pincode_input.send_keys(pincode)
            time.sleep(0.3)

            # Click the 'Check' button or press Enter
            check_clicked = False
            check_buttons = self.driver.find_elements(By.XPATH, "//span[contains(text(), 'Check') or contains(text(), 'Change')]")
            for btn in check_buttons:
                if btn.is_displayed():
                    try:
                        btn.click()
                        check_clicked = True
                        break
                    except Exception:
                        pass

            if not check_clicked:
                pincode_input.send_keys(Keys.ENTER)

            # Wait for the delivery information / availability to refresh in DOM
            time.sleep(2.0)
            return True

        except Exception as e:
            logger.warning(f"Pincode update exception for {pincode}: {e}")
            return False

    @staticmethod
    def _extract_weight(title: str, soup: BeautifulSoup) -> Optional[str]:
        """
        Extracts product weight or volume quantity (e.g. 75 ml, 100 gm, 1 kg)
        from title or specifications table.
        """
        if not title:
            return None
            
        # Common weight / volume regex patterns
        patterns = [
            r'(\b\d+(?:\.\d+)?\s*(?:ml|gm|g|kg|l|ltr|litre|oz|grams|fl\s*oz)\b)',
            r'(\bpack\s*of\s*\d+\b)',
            r'(\b\d+\s*pieces?\b)'
        ]
        for pat in patterns:
            match = re.search(pat, title, re.IGNORECASE)
            if match:
                return match.group(1).strip()

        # Check specification tables for 'Weight' or 'Quantity'
        for row in soup.find_all("tr"):
            text = row.get_text(separator=" ", strip=True)
            if "weight" in text.lower() or "net quantity" in text.lower():
                cells = row.find_all(["td", "th"])
                if len(cells) >= 2:
                    return cells[1].get_text(strip=True)
        return None

    @staticmethod
    def _extract_rating_breakdown(soup: BeautifulSoup) -> Dict[str, int]:
        """
        Extracts counts for 5-star, 4-star, 3-star, 2-star, 1-star ratings.
        """
        breakdown = {
            "five_stars": 0,
            "four_stars": 0,
            "three_stars": 0,
            "two_stars": 0,
            "one_star": 0
        }
        
        try:
            # Flipkart typically displays rating bars in order: 5 down to 1
            # Look for elements containing star counts
            star_containers = soup.find_all("div", class_=re.compile(r'_1u5LfN|B1brd4|_113Zdt'))
            counts = []
            for container in star_containers:
                num_text = re.sub(r'[^0-9]', '', container.get_text())
                if num_text:
                    counts.append(int(num_text))
            
            if len(counts) >= 5:
                breakdown["five_stars"] = counts[0]
                breakdown["four_stars"] = counts[1]
                breakdown["three_stars"] = counts[2]
                breakdown["two_stars"] = counts[3]
                breakdown["one_star"] = counts[4]
            else:
                # Secondary selector strategy: searching by star label rows
                rows = soup.find_all("div", string=re.compile(r'^[1-5]★?'))
                for r in rows:
                    parent = r.find_parent("div")
                    if parent:
                        matches = re.findall(r'([1-5])\s*★.*?([0-9,]+)', parent.get_text())
                        for star, cnt in matches:
                            clean_cnt = int(cnt.replace(",", ""))
                            if star == "5": breakdown["five_stars"] = clean_cnt
                            elif star == "4": breakdown["four_stars"] = clean_cnt
                            elif star == "3": breakdown["three_stars"] = clean_cnt
                            elif star == "2": breakdown["two_stars"] = clean_cnt
                            elif star == "1": breakdown["one_star"] = clean_cnt
        except Exception as e:
            logger.debug(f"Could not parse granular star breakdown: {e}")

        return breakdown

    def scrape_product(self, url: str, pincode: str) -> Dict[str, Any]:
        """
        Navigates to the product URL, updates the pincode, and extracts all 20 required fields.
        
        :param url: Flipkart SKU product URL.
        :param pincode: 6-digit Indian postal code.
        :return: Dictionary containing all 20 target fields.
        """
        product_id = self.extract_product_id(url)
        crawl_date = datetime.now().strftime("%Y-%m-%d")

        # Fallback default dictionary schema
        data: Dict[str, Any] = {
            "platform_id": 2,                  # 1. platform_id (Flipkart = 2)
            "product_id": product_id or "",    # 2. product_id
            "area_id": pincode,                # 3. area_id (pincode)
            "crawl_date": crawl_date,          # 4. crawl_date
            "seller_name": None,               # 5. seller_name
            "main_seller": 0,                  # 6. main_seller (1 or 0)
            "price": None,                     # 7. price (float)
            "promo": None,                     # 8. promo (discount % float)
            "availability": 0,                 # 9. availability (1 or 0)
            "overall_rating": None,            # 10. overall_rating (float)
            "bestseller_rank": None,           # 11. bestseller_rank
            "product_weight": None,            # 12. product_weight
            "total_ratings": 0,                # 13. total_ratings (int)
            "five_stars_rating": 0,            # 14. five_stars_rating (int)
            "four_stars_rating": 0,            # 15. four_stars_rating (int)
            "three_stars_rating": 0,           # 16. three_stars_rating (int)
            "two_stars_rating": 0,             # 17. two_stars_rating (int)
            "one_star_rating": 0,              # 18. one_star_rating (int)
            "delivery_date": None,             # 19. delivery_date
            "prime_delivery_date": None        # 20. prime_delivery_date
        }

        try:
            logger.info(f"Opening product page: {url}")
            self.driver.get(url)
            
            # Wait for main product container or title
            WebDriverWait(self.driver, self.timeout).until(
                EC.presence_of_element_located((By.TAG_NAME, "h1"))
            )

            # Update Pincode to get accurate area-level pricing, delivery, and availability
            self.update_pincode(pincode)

            # Parse page source with BeautifulSoup
            soup = BeautifulSoup(self.driver.page_source, "html.parser")

            # 1. Product Title & Weight
            title_tag = soup.find("h1")
            title_text = title_tag.get_text(strip=True) if title_tag else ""
            data["product_weight"] = self._extract_weight(title_text, soup)

            # 2. Price Extraction (Float)
            # Flipkart price selectors: ._30jeq3, ._16Jk6d, .Nx9bqj
            price_tag = soup.find("div", class_=re.compile(r'_30jeq3|_16Jk6d|Nx9bqj|Cxhggu'))
            if price_tag:
                clean_price = re.sub(r'[^0-9.]', '', price_tag.get_text())
                if clean_price:
                    data["price"] = float(clean_price)

            # 3. Promotional Discount (% Float)
            # Flipkart promo selectors: ._3Ay6Sb, .UkUFwK
            promo_tag = soup.find("div", class_=re.compile(r'_3Ay6Sb|UkUFwK|_2Tpdn3'))
            if promo_tag:
                promo_match = re.search(r'(\d+(?:\.\d+)?)\s*%', promo_tag.get_text())
                if promo_match:
                    data["promo"] = float(promo_match.group(1))

            # 4. Availability Check (1 or 0)
            # Check for Out of Stock indicators or Sold Out badges
            out_of_stock = soup.find(string=re.compile(r'currently out of stock|sold out|item is out of stock', re.IGNORECASE))
            not_serviceable = soup.find(string=re.compile(r'not serviceable for this pincode|not available for this pincode', re.IGNORECASE))
            buy_now_btn = soup.find("button", string=re.compile(r'BUY NOW|ADD TO CART', re.IGNORECASE))

            if out_of_stock or not_serviceable:
                data["availability"] = 0
            elif buy_now_btn or data["price"] is not None:
                data["availability"] = 1
            else:
                data["availability"] = 0

            # 5. Seller Details & Main Seller
            # Flipkart seller name is often under id="sellerName" or class="_2m_Flw" or "_1RLviY"
            seller_tag = soup.find(id="sellerName") or soup.find("div", class_=re.compile(r'_2m_Flw|_1RLviY|D+vS+u'))
            if seller_tag:
                # Text may include rating e.g., "RetailNet 4.8"
                seller_text = seller_tag.get_text(separator=" ", strip=True)
                clean_seller = re.sub(r'\d+(\.\d+)?\s*★.*$', '', seller_text).strip()
                data["seller_name"] = clean_seller or seller_text
                data["main_seller"] = 1 if data["seller_name"] else 0
            else:
                # Look for "Seller:" label
                seller_label = soup.find(string=re.compile(r'Seller\s*:', re.IGNORECASE))
                if seller_label:
                    parent = seller_label.find_parent("div")
                    if parent:
                        data["seller_name"] = parent.get_text(strip=True).replace("Seller:", "").strip()
                        data["main_seller"] = 1

            # 6. Overall Rating (Float) & Total Ratings (Int)
            rating_tag = soup.find("div", class_=re.compile(r'_3LWZlK|XQDdHH|_2d4LTz'))
            if rating_tag:
                rating_match = re.search(r'(\d+(?:\.\d+)?)', rating_tag.get_text())
                if rating_match:
                    data["overall_rating"] = float(rating_match.group(1))

            # Total ratings e.g., "12,450 Ratings & 1,230 Reviews"
            total_ratings_tag = soup.find(string=re.compile(r'\b[0-9,]+\s*Ratings\b', re.IGNORECASE))
            if total_ratings_tag:
                tr_match = re.search(r'([0-9,]+)\s*Ratings', total_ratings_tag, re.IGNORECASE)
                if tr_match:
                    data["total_ratings"] = int(tr_match.group(1).replace(",", ""))

            # 7. Granular Rating Breakdown (5 to 1 Stars)
            breakdown = self._extract_rating_breakdown(soup)
            data["five_stars_rating"] = breakdown["five_stars"]
            data["four_stars_rating"] = breakdown["four_stars"]
            data["three_stars_rating"] = breakdown["three_stars"]
            data["two_stars_rating"] = breakdown["two_stars"]
            data["one_star_rating"] = breakdown["one_star"]

            # 8. Bestseller Rank (if present)
            bestseller_tag = soup.find(string=re.compile(r'#\d+\s+in\b|Bestseller\b', re.IGNORECASE))
            if bestseller_tag:
                parent_badge = bestseller_tag.find_parent(["div", "span"])
                data["bestseller_rank"] = parent_badge.get_text(strip=True) if parent_badge else str(bestseller_tag).strip()

            # 9. Delivery Date & Prime / F-Assured Delivery Date
            # Look for delivery notice e.g. "Delivery by 15 Nov, Friday"
            delivery_container = soup.find("div", class_=re.compile(r'_2P_LeY|YUkH00|a8vE68')) or \
                                 soup.find(string=re.compile(r'Delivery by|FREE Delivery', re.IGNORECASE))
            if delivery_container:
                parent_delivery = delivery_container.find_parent("div") if hasattr(delivery_container, 'find_parent') else None
                del_text = parent_delivery.get_text(separator=" ", strip=True) if parent_delivery else str(delivery_container).strip()
                data["delivery_date"] = del_text

            # Flipkart Assured (F-Assured / Prime equivalent)
            f_assured_tag = soup.find("img", src=re.compile(r'fa_.*\.png|flipkart-plus', re.IGNORECASE)) or \
                            soup.find(string=re.compile(r'Plus F-Assured|Flipkart Assured', re.IGNORECASE))
            if f_assured_tag:
                # Capture fast delivery date or indicate F-Assured presence
                data["prime_delivery_date"] = data["delivery_date"] or "F-Assured Guaranteed Delivery"

            logger.info(f"Successfully scraped PID {product_id} for pincode {pincode}: Price={data['price']}, Avail={data['availability']}")
            return data

        except TimeoutException as e:
            logger.error(f"Timeout while loading SKU URL {url}: {e}")
            raise
        except Exception as e:
            logger.error(f"Scraping failed for SKU {url} on pincode {pincode}: {e}")
            raise

    def close(self):
        """Safely terminates the browser session."""
        if self.driver:
            try:
                self.driver.quit()
                logger.info("WebDriver session closed successfully.")
            except Exception as e:
                logger.warning(f"Error while quitting driver: {e}")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
