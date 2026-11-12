import { ScrapedProductRecord, FailureRecord, TargetSKU, TargetPincode } from '../types/scraper';

export const INITIAL_SKUS: TargetSKU[] = [
  {
    id: 'sku-1',
    title: 'Garnier Men Turbo Bright Anti-Pollution Double Action Face Wash',
    url: 'https://www.flipkart.com/garnier-men-turbo-bright-anti-pollution-double-action-face-wash/p/itmfc2g4y3x8g2vh?pid=FCWFC2G4YFHFGXZV&lid=LSTFCWFC2G4YFHFGXZV',
    pid: 'FCWFC2G4YFHFGXZV',
    category: 'Grooming & Skincare',
    expectedWeight: '100 gm',
    active: true
  },
  {
    id: 'sku-2',
    title: 'Nivea Men Dark Spot Reduction Creme',
    url: 'https://www.flipkart.com/nivea-men-dark-spot-reduction-creme/p/itme7s28ygbhwhgu?pid=MOIE7S28Z4ZGBH9M&lid=LSTMOIE7S28Z4ZGBH9MRZ',
    pid: 'MOIE7S28Z4ZGBH9M',
    category: 'Personal Care',
    expectedWeight: '75 ml',
    active: true
  },
  {
    id: 'sku-3',
    title: 'Tresemme Keratin Smooth Shampoo',
    url: 'https://www.flipkart.com/tresemme-keratin-smooth-shampoo/p/itmf3j9c6z8qzhfz?pid=SMPF3J9CGH8QZHFZ&lid=LSTSMPF3J9CGH8QZHFZX',
    pid: 'SMPF3J9CGH8QZHFZ',
    category: 'Haircare',
    expectedWeight: '650 ml',
    active: true
  },
  {
    id: 'sku-4',
    title: 'Apple iPhone 15 (Black, 128 GB)',
    url: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS24W&lid=LSTMOBGTAGPTB3VS24WVUY0XF',
    pid: 'MOBGTAGPTB3VS24W',
    category: 'Smartphones & Tech',
    expectedWeight: '128 GB',
    active: true
  },
  {
    id: 'sku-5',
    title: 'MuscleBlaze Raw Whey Protein Concentrate 80%',
    url: 'https://www.flipkart.com/muscleblaze-raw-whey-protein-concentrate-80-unflavoured/p/itmfekpzt2c3zygh?pid=PSLFEYPZUHYPAGY7&lid=LSTPSLFEYPZUHYPAGY7X',
    pid: 'PSLFEYPZUHYPAGY7',
    category: 'Nutrition & Health',
    expectedWeight: '1 kg',
    active: true
  }
];

export const INITIAL_PINCODES: TargetPincode[] = [
  { pincode: '560001', city: 'Bengaluru', state: 'Karnataka', isMetro: true, active: true },
  { pincode: '110001', city: 'New Delhi', state: 'Delhi', isMetro: true, active: true },
  { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', isMetro: true, active: true },
  { pincode: '700001', city: 'Kolkata', state: 'West Bengal', isMetro: true, active: true },
  { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', isMetro: true, active: true },
  { pincode: '500001', city: 'Hyderabad', state: 'Telangana', isMetro: true, active: true },
  { pincode: '226001', city: 'Lucknow', state: 'Uttar Pradesh', isMetro: false, active: true },
  { pincode: '790001', city: 'Bomdila', state: 'Arunachal Pradesh', isMetro: false, active: true }
];

export const INITIAL_SCRAPED_DATA: ScrapedProductRecord[] = [
  {
    platform_id: 2,
    product_id: 'FCWFC2G4YFHFGXZV',
    area_id: '560001',
    crawl_date: '2026-11-12',
    seller_name: 'RetailNet',
    main_seller: 1,
    price: 340.0,
    promo: 15.0,
    availability: 1,
    overall_rating: 4.4,
    bestseller_rank: "#1 in Men's Face Wash",
    product_weight: '100 gm',
    total_ratings: 148200,
    five_stars_rating: 94800,
    four_stars_rating: 28300,
    three_stars_rating: 12100,
    two_stars_rating: 5200,
    one_star_rating: 7800,
    delivery_date: 'Delivery by Tomorrow | Free ₹40',
    prime_delivery_date: 'Delivery by Tomorrow | Free ₹40'
  },
  {
    platform_id: 2,
    product_id: 'FCWFC2G4YFHFGXZV',
    area_id: '110001',
    crawl_date: '2026-11-12',
    seller_name: 'RetailNet',
    main_seller: 1,
    price: 340.0,
    promo: 15.0,
    availability: 1,
    overall_rating: 4.4,
    bestseller_rank: "#1 in Men's Face Wash",
    product_weight: '100 gm',
    total_ratings: 148200,
    five_stars_rating: 94800,
    four_stars_rating: 28300,
    three_stars_rating: 12100,
    two_stars_rating: 5200,
    one_star_rating: 7800,
    delivery_date: 'Delivery by 14 Nov, Saturday | Free',
    prime_delivery_date: 'Delivery by 14 Nov, Saturday | Free'
  },
  {
    platform_id: 2,
    product_id: 'FCWFC2G4YFHFGXZV',
    area_id: '400001',
    crawl_date: '2026-11-12',
    seller_name: 'SuperComNet',
    main_seller: 1,
    price: 345.0,
    promo: 14.0,
    availability: 1,
    overall_rating: 4.4,
    bestseller_rank: "#1 in Men's Face Wash",
    product_weight: '100 gm',
    total_ratings: 148200,
    five_stars_rating: 94800,
    four_stars_rating: 28300,
    three_stars_rating: 12100,
    two_stars_rating: 5200,
    one_star_rating: 7800,
    delivery_date: 'Delivery by 13 Nov, Friday | Free',
    prime_delivery_date: 'Delivery by 13 Nov, Friday | Free'
  },
  {
    platform_id: 2,
    product_id: 'FCWFC2G4YFHFGXZV',
    area_id: '790001',
    crawl_date: '2026-11-12',
    seller_name: null,
    main_seller: 0,
    price: null,
    promo: null,
    availability: 0,
    overall_rating: 4.4,
    bestseller_rank: null,
    product_weight: '100 gm',
    total_ratings: 148200,
    five_stars_rating: 94800,
    four_stars_rating: 28300,
    three_stars_rating: 12100,
    two_stars_rating: 5200,
    one_star_rating: 7800,
    delivery_date: 'Currently Out of Stock for this Pincode',
    prime_delivery_date: null
  },
  {
    platform_id: 2,
    product_id: 'MOIE7S28Z4ZGBH9M',
    area_id: '560001',
    crawl_date: '2026-11-12',
    seller_name: 'OmniTechRetail',
    main_seller: 1,
    price: 199.0,
    promo: 20.0,
    availability: 1,
    overall_rating: 4.3,
    bestseller_rank: null,
    product_weight: '75 ml',
    total_ratings: 89400,
    five_stars_rating: 54100,
    four_stars_rating: 18200,
    three_stars_rating: 8100,
    two_stars_rating: 3400,
    one_star_rating: 5600,
    delivery_date: 'Delivery by 13 Nov, Friday | Free ₹40',
    prime_delivery_date: 'Delivery by 13 Nov, Friday | Free ₹40'
  },
  {
    platform_id: 2,
    product_id: 'MOIE7S28Z4ZGBH9M',
    area_id: '110001',
    crawl_date: '2026-11-12',
    seller_name: 'OmniTechRetail',
    main_seller: 1,
    price: 199.0,
    promo: 20.0,
    availability: 1,
    overall_rating: 4.3,
    bestseller_rank: null,
    product_weight: '75 ml',
    total_ratings: 89400,
    five_stars_rating: 54100,
    four_stars_rating: 18200,
    three_stars_rating: 8100,
    two_stars_rating: 3400,
    one_star_rating: 5600,
    delivery_date: 'Delivery by 14 Nov, Saturday | Free',
    prime_delivery_date: 'Delivery by 14 Nov, Saturday | Free'
  },
  {
    platform_id: 2,
    product_id: 'SMPF3J9CGH8QZHFZ',
    area_id: '560001',
    crawl_date: '2026-11-12',
    seller_name: 'RetailNet',
    main_seller: 1,
    price: 585.0,
    promo: 10.0,
    availability: 1,
    overall_rating: 4.5,
    bestseller_rank: '#3 in Shampoos',
    product_weight: '650 ml',
    total_ratings: 215000,
    five_stars_rating: 142000,
    four_stars_rating: 41000,
    three_stars_rating: 16500,
    two_stars_rating: 6500,
    one_star_rating: 9000,
    delivery_date: 'Delivery by Tomorrow | Free ₹40',
    prime_delivery_date: 'Delivery by Tomorrow | Free ₹40'
  },
  {
    platform_id: 2,
    product_id: 'MOBGTAGPTB3VS24W',
    area_id: '560001',
    crawl_date: '2026-11-12',
    seller_name: 'IndiFlashMart',
    main_seller: 1,
    price: 57999.0,
    promo: 12.0,
    availability: 1,
    overall_rating: 4.7,
    bestseller_rank: '#1 in Premium Smartphones',
    product_weight: '128 GB',
    total_ratings: 68400,
    five_stars_rating: 52300,
    four_stars_rating: 9100,
    three_stars_rating: 3200,
    two_stars_rating: 1400,
    one_star_rating: 2400,
    delivery_date: 'Delivery by Tomorrow | Free Delivery',
    prime_delivery_date: 'Delivery by Tomorrow | Free Delivery'
  },
  {
    platform_id: 2,
    product_id: 'MOBGTAGPTB3VS24W',
    area_id: '790001',
    crawl_date: '2026-11-12',
    seller_name: null,
    main_seller: 0,
    price: null,
    promo: null,
    availability: 0,
    overall_rating: 4.7,
    bestseller_rank: null,
    product_weight: '128 GB',
    total_ratings: 68400,
    five_stars_rating: 52300,
    four_stars_rating: 9100,
    three_stars_rating: 3200,
    two_stars_rating: 1400,
    one_star_rating: 2400,
    delivery_date: 'Item not serviceable for 790001',
    prime_delivery_date: null
  },
  {
    platform_id: 2,
    product_id: 'PSLFEYPZUHYPAGY7',
    area_id: '560001',
    crawl_date: '2026-11-12',
    seller_name: 'HealthKartOfficial',
    main_seller: 1,
    price: 1899.0,
    promo: 18.0,
    availability: 1,
    overall_rating: 4.2,
    bestseller_rank: null,
    product_weight: '1 kg',
    total_ratings: 43200,
    five_stars_rating: 25600,
    four_stars_rating: 8900,
    three_stars_rating: 4100,
    two_stars_rating: 1900,
    one_star_rating: 2700,
    delivery_date: 'Delivery by 14 Nov, Saturday',
    prime_delivery_date: 'Delivery by 14 Nov, Saturday'
  }
];

export const INITIAL_FAILURE_LOGS: FailureRecord[] = [
  {
    id: 'fail-1',
    product_url: 'https://www.flipkart.com/invalid-product-link-test/p/itmtest',
    product_id: 'INVALIDPID99',
    pincode: '560001',
    crawl_date: '2026-11-12',
    failure_reason: 'HTTP 404 Product Not Found'
  },
  {
    id: 'fail-2',
    product_url: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS24W',
    product_id: 'MOBGTAGPTB3VS24W',
    pincode: '194101',
    crawl_date: '2026-11-12',
    failure_reason: 'Pincode input rejected by Flipkart server: Postal code currently unserviced for oversized deliveries'
  }
];

export const CODE_FILES = {
  'requirements.txt': `selenium>=4.20.0
webdriver-manager>=4.0.1
beautifulsoup4>=4.12.3
pandas>=2.2.0
lxml>=5.2.0
requests>=2.31.0
python-dateutil>=2.9.0`,

  'input_data.py': `"""
input_data.py - Target SKU URLs and Pincodes for Flipkart Matrix Web Scraper.
"""

# Target Product SKU URLs from Flipkart with valid 'pid' parameter
SKU_URLS = [
    # 1. Personal Care / Grooming with explicit weight (e.g., 100 gm)
    "https://www.flipkart.com/garnier-men-turbo-bright-anti-pollution-double-action-face-wash/p/itmfc2g4y3x8g2vh?pid=FCWFC2G4YFHFGXZV&lid=LSTFCWFC2G4YFHFGXZV",
    
    # 2. Skincare with volume (e.g., 75 ml)
    "https://www.flipkart.com/nivea-men-dark-spot-reduction-creme/p/itme7s28ygbhwhgu?pid=MOIE7S28Z4ZGBH9M&lid=LSTMOIE7S28Z4ZGBH9MRZ",
    
    # 3. Shampoo / Haircare with volume (e.g., 650 ml)
    "https://www.flipkart.com/tresemme-keratin-smooth-shampoo/p/itmf3j9c6z8qzhfz?pid=SMPF3J9CGH8QZHFZ&lid=LSTSMPF3J9CGH8QZHFZX",
    
    # 4. Electronics / Smartphone
    "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS24W&lid=LSTMOBGTAGPTB3VS24WVUY0XF",
    
    # 5. Health & Nutrition (e.g., 1 kg / 500 gm)
    "https://www.flipkart.com/muscleblaze-raw-whey-protein-concentrate-80-unflavoured/p/itmfekpzt2c3zygh?pid=PSLFEYPZUHYPAGY7&lid=LSTPSLFEYPZUHYPAGY7X"
]

# Target Delivery Pincodes across Tier 1, Tier 2, and remote areas
PINCODES = [
    "560001",  # Bangalore, Karnataka (Tier 1 Metro)
    "110001",  # New Delhi, Delhi (Tier 1 Metro)
    "400001",  # Mumbai, Maharashtra (Tier 1 Metro)
    "700001",  # Kolkata, West Bengal (Tier 1 Metro)
    "600001",  # Chennai, Tamil Nadu (Tier 1 Metro)
    "500001",  # Hyderabad, Telangana (Tier 1 Metro)
    "226001",  # Lucknow, Uttar Pradesh (Tier 2 City)
    "790001"   # Bomdila, Arunachal Pradesh (Remote / Test out-of-stock or non-serviceable)
]`,

  'scraper.py': `"""
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
        self.timeout = timeout
        self.headless = headless
        self.driver = self._init_driver()

    def _init_driver(self) -> webdriver.Chrome:
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
        try:
            parsed = urlparse(url)
            query_params = parse_qs(parsed.query)
            if "pid" in query_params and query_params["pid"]:
                return query_params["pid"][0]
            
            match = re.search(r'[?&]pid=([A-Z0-9]+)', url, re.IGNORECASE)
            if match:
                return match.group(1)
            return None
        except Exception as e:
            logger.warning(f"Error parsing PID from URL {url}: {e}")
            return None

    def update_pincode(self, pincode: str) -> bool:
        logger.info(f"Injecting pincode: {pincode}")
        try:
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

            self.driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", pincode_input)
            time.sleep(0.5)

            pincode_input.click()
            pincode_input.send_keys(Keys.CONTROL + "a")
            pincode_input.send_keys(Keys.BACKSPACE)
            time.sleep(0.2)
            pincode_input.send_keys(pincode)
            time.sleep(0.3)

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

            time.sleep(2.0)
            return True

        except Exception as e:
            logger.warning(f"Pincode update exception for {pincode}: {e}")
            return False

    @staticmethod
    def _extract_weight(title: str, soup: BeautifulSoup) -> Optional[str]:
        if not title:
            return None
            
        patterns = [
            r'(\b\d+(?:\.\d+)?\s*(?:ml|gm|g|kg|l|ltr|litre|oz|grams|fl\s*oz)\b)',
            r'(\bpack\s*of\s*\d+\b)',
            r'(\b\d+\s*pieces?\b)'
        ]
        for pat in patterns:
            match = re.search(pat, title, re.IGNORECASE)
            if match:
                return match.group(1).strip()

        for row in soup.find_all("tr"):
            text = row.get_text(separator=" ", strip=True)
            if "weight" in text.lower() or "net quantity" in text.lower():
                cells = row.find_all(["td", "th"])
                if len(cells) >= 2:
                    return cells[1].get_text(strip=True)
        return None

    @staticmethod
    def _extract_rating_breakdown(soup: BeautifulSoup) -> Dict[str, int]:
        breakdown = {
            "five_stars": 0, "four_stars": 0, "three_stars": 0,
            "two_stars": 0, "one_star": 0
        }
        try:
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
        except Exception as e:
            logger.debug(f"Rating breakdown parsing: {e}")
        return breakdown

    def scrape_product(self, url: str, pincode: str) -> Dict[str, Any]:
        product_id = self.extract_product_id(url)
        crawl_date = datetime.now().strftime("%Y-%m-%d")

        data: Dict[str, Any] = {
            "platform_id": 2,
            "product_id": product_id or "",
            "area_id": pincode,
            "crawl_date": crawl_date,
            "seller_name": None,
            "main_seller": 0,
            "price": None,
            "promo": None,
            "availability": 0,
            "overall_rating": None,
            "bestseller_rank": None,
            "product_weight": None,
            "total_ratings": 0,
            "five_stars_rating": 0,
            "four_stars_rating": 0,
            "three_stars_rating": 0,
            "two_stars_rating": 0,
            "one_star_rating": 0,
            "delivery_date": None,
            "prime_delivery_date": None
        }

        try:
            logger.info(f"Opening product page: {url}")
            self.driver.get(url)
            
            WebDriverWait(self.driver, self.timeout).until(
                EC.presence_of_element_located((By.TAG_NAME, "h1"))
            )

            self.update_pincode(pincode)
            soup = BeautifulSoup(self.driver.page_source, "html.parser")

            title_tag = soup.find("h1")
            title_text = title_tag.get_text(strip=True) if title_tag else ""
            data["product_weight"] = self._extract_weight(title_text, soup)

            price_tag = soup.find("div", class_=re.compile(r'_30jeq3|_16Jk6d|Nx9bqj|Cxhggu'))
            if price_tag:
                clean_price = re.sub(r'[^0-9.]', '', price_tag.get_text())
                if clean_price:
                    data["price"] = float(clean_price)

            promo_tag = soup.find("div", class_=re.compile(r'_3Ay6Sb|UkUFwK|_2Tpdn3'))
            if promo_tag:
                promo_match = re.search(r'(\d+(?:\.\d+)?)\s*%', promo_tag.get_text())
                if promo_match:
                    data["promo"] = float(promo_match.group(1))

            out_of_stock = soup.find(string=re.compile(r'currently out of stock|sold out|item is out of stock', re.IGNORECASE))
            not_serviceable = soup.find(string=re.compile(r'not serviceable for this pincode|not available for this pincode', re.IGNORECASE))
            buy_now_btn = soup.find("button", string=re.compile(r'BUY NOW|ADD TO CART', re.IGNORECASE))

            if out_of_stock or not_serviceable:
                data["availability"] = 0
            elif buy_now_btn or data["price"] is not None:
                data["availability"] = 1
            else:
                data["availability"] = 0

            seller_tag = soup.find(id="sellerName") or soup.find("div", class_=re.compile(r'_2m_Flw|_1RLviY|D+vS+u'))
            if seller_tag:
                seller_text = seller_tag.get_text(separator=" ", strip=True)
                clean_seller = re.sub(r'\d+(\.\d+)?\s*★.*$', '', seller_text).strip()
                data["seller_name"] = clean_seller or seller_text
                data["main_seller"] = 1 if data["seller_name"] else 0
            else:
                seller_label = soup.find(string=re.compile(r'Seller\s*:', re.IGNORECASE))
                if seller_label:
                    parent = seller_label.find_parent("div")
                    if parent:
                        data["seller_name"] = parent.get_text(strip=True).replace("Seller:", "").strip()
                        data["main_seller"] = 1

            rating_tag = soup.find("div", class_=re.compile(r'_3LWZlK|XQDdHH|_2d4LTz'))
            if rating_tag:
                rating_match = re.search(r'(\d+(?:\.\d+)?)', rating_tag.get_text())
                if rating_match:
                    data["overall_rating"] = float(rating_match.group(1))

            total_ratings_tag = soup.find(string=re.compile(r'\b[0-9,]+\s*Ratings\b', re.IGNORECASE))
            if total_ratings_tag:
                tr_match = re.search(r'([0-9,]+)\s*Ratings', total_ratings_tag, re.IGNORECASE)
                if tr_match:
                    data["total_ratings"] = int(tr_match.group(1).replace(",", ""))

            breakdown = self._extract_rating_breakdown(soup)
            data["five_stars_rating"] = breakdown["five_stars"]
            data["four_stars_rating"] = breakdown["four_stars"]
            data["three_stars_rating"] = breakdown["three_stars"]
            data["two_stars_rating"] = breakdown["two_stars"]
            data["one_star_rating"] = breakdown["one_star"]

            bestseller_tag = soup.find(string=re.compile(r'#\d+\s+in\b|Bestseller\b', re.IGNORECASE))
            if bestseller_tag:
                parent_badge = bestseller_tag.find_parent(["div", "span"])
                data["bestseller_rank"] = parent_badge.get_text(strip=True) if parent_badge else str(bestseller_tag).strip()

            delivery_container = soup.find("div", class_=re.compile(r'_2P_LeY|YUkH00|a8vE68')) or \
                                 soup.find(string=re.compile(r'Delivery by|FREE Delivery', re.IGNORECASE))
            if delivery_container:
                parent_delivery = delivery_container.find_parent("div") if hasattr(delivery_container, 'find_parent') else None
                del_text = parent_delivery.get_text(separator=" ", strip=True) if parent_delivery else str(delivery_container).strip()
                data["delivery_date"] = del_text

            f_assured_tag = soup.find("img", src=re.compile(r'fa_.*\.png|flipkart-plus', re.IGNORECASE)) or \
                            soup.find(string=re.compile(r'Plus F-Assured|Flipkart Assured', re.IGNORECASE))
            if f_assured_tag:
                data["prime_delivery_date"] = data["delivery_date"] or "F-Assured Guaranteed Delivery"

            return data

        except Exception as e:
            logger.error(f"Scraping failed for SKU {url} on pincode {pincode}: {e}")
            raise

    def close(self):
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()`,

  'main.py': `"""
main.py - Orchestration engine for Flipkart SKU x Pincode matrix web scraping.
Handles deduplication, error logging, and structured Pandas CSV export.
"""

import os
import time
import logging
from datetime import datetime
from typing import Set, Tuple, List, Dict, Any
import pandas as pd

from input_data import SKU_URLS, PINCODES
from scraper import FlipkartScraper

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("MatrixPipeline")

OUTPUT_DIR = "output"
SCRAPED_DATA_CSV = os.path.join(OUTPUT_DIR, "scraped_data.csv")
FAILURE_LOG_CSV = os.path.join(OUTPUT_DIR, "failure_log.csv")

TARGET_COLUMNS = [
    "platform_id", "product_id", "area_id", "crawl_date",
    "seller_name", "main_seller", "price", "promo", "availability",
    "overall_rating", "bestseller_rank", "product_weight",
    "total_ratings", "five_stars_rating", "four_stars_rating",
    "three_stars_rating", "two_stars_rating", "one_star_rating",
    "delivery_date", "prime_delivery_date"
]

FAILURE_COLUMNS = [
    "product_url", "product_id", "pincode", "crawl_date", "failure_reason"
]


def ensure_output_directory():
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def load_existing_keys() -> Set[Tuple[str, str, str]]:
    existing_keys: Set[Tuple[str, str, str]] = set()
    if os.path.exists(SCRAPED_DATA_CSV):
        try:
            df = pd.read_csv(SCRAPED_DATA_CSV, dtype=str)
            if {"product_id", "area_id", "crawl_date"}.issubset(df.columns):
                for _, row in df.iterrows():
                    key = (str(row["product_id"]).strip(), str(row["area_id"]).strip(), str(row["crawl_date"]).strip())
                    existing_keys.add(key)
        except Exception as e:
            logger.warning(f"Could not read existing {SCRAPED_DATA_CSV}: {e}")
    return existing_keys


def append_scraped_data(rows: List[Dict[str, Any]]):
    if not rows:
        return
    df_new = pd.DataFrame(rows, columns=TARGET_COLUMNS)
    file_exists = os.path.exists(SCRAPED_DATA_CSV)
    df_new.to_csv(SCRAPED_DATA_CSV, mode="a" if file_exists else "w", header=not file_exists, index=False)


def append_failure_log(failure_rows: List[Dict[str, Any]]):
    if not failure_rows:
        return
    df_fail = pd.DataFrame(failure_rows, columns=FAILURE_COLUMNS)
    file_exists = os.path.exists(FAILURE_LOG_CSV)
    df_fail.to_csv(FAILURE_LOG_CSV, mode="a" if file_exists else "w", header=not file_exists, index=False)


def run_pipeline(delay_between_requests: float = 2.0):
    ensure_output_directory()
    existing_keys = load_existing_keys()
    
    total_skus = len(SKU_URLS)
    total_pincodes = len(PINCODES)
    total_combinations = total_skus * total_pincodes

    scraped_records: List[Dict[str, Any]] = []
    failed_records: List[Dict[str, Any]] = []
    crawl_date = datetime.now().strftime("%Y-%m-%d")
    current_step = 0

    scraper = None
    try:
        scraper = FlipkartScraper(headless=True, timeout=15)
        
        for url in SKU_URLS:
            pid = FlipkartScraper.extract_product_id(url)
            if not pid:
                for pin in PINCODES:
                    failed_records.append({
                        "product_url": url, "product_id": "", "pincode": pin,
                        "crawl_date": crawl_date,
                        "failure_reason": "Missing or invalid 'pid' parameter in product URL"
                    })
                continue

            for pincode in PINCODES:
                current_step += 1
                dedup_key = (str(pid).strip(), str(pincode).strip(), crawl_date)
                if dedup_key in existing_keys:
                    continue

                try:
                    data = scraper.scrape_product(url, pincode)
                    scraped_records.append(data)
                    existing_keys.add(dedup_key)
                    
                    if len(scraped_records) >= 5:
                        append_scraped_data(scraped_records)
                        scraped_records = []

                except Exception as e:
                    failed_records.append({
                        "product_url": url, "product_id": pid, "pincode": pincode,
                        "crawl_date": crawl_date, "failure_reason": str(e)
                    })

                time.sleep(delay_between_requests)

        if scraped_records:
            append_scraped_data(scraped_records)
        if failed_records:
            append_failure_log(failed_records)

    finally:
        if scraper:
            scraper.close()


if __name__ == "__main__":
    run_pipeline()`
};
