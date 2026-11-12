# Flipkart SKU x Pincode Matrix Web Scraping Pipeline

A modular, production-ready Python web scraping system built with **Selenium**, **BeautifulSoup (bs4)**, and **Pandas** to extract product pricing, seller details, delivery timelines, and availability across a cross-matrix of Product SKU URLs and Delivery Pincodes on Flipkart.

---

## 1. Architecture & Directory Structure

```text
flipkart_scraper/
│
├── requirements.txt         # Project dependencies (Selenium, bs4, pandas, etc.)
├── input_data.py           # Configurable target SKU URLs and Pincodes list
├── scraper.py              # Selenium + BeautifulSoup engine & 20-field extractor
├── main.py                 # Matrix orchestrator, deduplication, & CSV export
├── README.md               # Step-by-step setup and operation guide
│
└── output/
    ├── scraped_data.csv    # Deduplicated 20-field extracted product data
    └── failure_log.csv     # Unhandled exceptions and network failure logs
```

---

## 2. Extracted Data Schema (20 Mandatory Fields)

| # | Field Name | Type | Description |
|---|---|---|---|
| 1 | `platform_id` | Integer | Hardcoded Flipkart platform identifier (`2`) |
| 2 | `product_id` | String | Extracted Flipkart PID parameter (e.g., `FCWFC2G4YFHFGXZV`) |
| 3 | `area_id` | String | 6-digit Indian Postal Pincode (e.g., `560001`) |
| 4 | `crawl_date` | Date | Crawl date in `YYYY-MM-DD` format |
| 5 | `seller_name` | String | Name of the primary seller or merchant |
| 6 | `main_seller` | Integer | `1` if seller identified, `0` otherwise |
| 7 | `price` | Float | Current selling price in INR (stripped of currency signs) |
| 8 | `promo` | Float | Promotional discount percentage (e.g., `15.0`) |
| 9 | `availability` | Integer | `1` = Available / In Stock, `0` = Unavailable / Out of Stock |
| 10 | `overall_rating` | Float | Star rating score (e.g., `4.4`) |
| 11 | `bestseller_rank` | String | Rank label (e.g., `#1 in Men's Face Wash`) |
| 12 | `product_weight` | String | Item volume/weight/pack size (e.g., `75 ml`, `100 gm`, `1 kg`) |
| 13 | `total_ratings` | Integer | Total verified consumer rating count |
| 14 | `five_stars_rating` | Integer | Count of 5-star ratings from review breakdown |
| 15 | `four_stars_rating` | Integer | Count of 4-star ratings |
| 16 | `three_stars_rating` | Integer | Count of 3-star ratings |
| 17 | `two_stars_rating` | Integer | Count of 2-star ratings |
| 18 | `one_star_rating` | Integer | Count of 1-star ratings |
| 19 | `delivery_date` | String | Estimated delivery string for the target pincode |
| 20 | `prime_delivery_date` | String | F-Assured / Express guaranteed delivery timeline |

---

## 3. Step-by-Step Installation & Setup

### Prerequisites
* Python 3.9+ installed on your system.
* Google Chrome installed on your machine or headless server.

### Step 1: Clone or Navigate to the Project Directory
```bash
cd flipkart_scraper
```

### Step 2: Create and Activate a Python Virtual Environment
On macOS / Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

On Windows:
```cmd
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Required Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```
*(Chrome WebDriver is automatically managed via `webdriver-manager` — no manual driver downloads needed).*

---

## 4. How to Configure & Run

### Step 1: Customize SKUs and Pincodes
Edit `input_data.py` to add or modify target URLs and Pincodes:
```python
SKU_URLS = [
    "https://www.flipkart.com/example-product/p/itm...?pid=YOUR_PID_HERE"
]

PINCODES = [
    "560001",
    "110001"
]
```

### Step 2: Launch the Scraper Matrix Pipeline
```bash
python main.py
```

### Step 3: Monitor Execution
- Real-time progress percentage `[X/N]` is printed to the terminal console.
- Deduplication prevents re-scraping already processed combinations on the same date.
- Periodic batch saves ensure intermediate results are preserved even if execution is interrupted.

### Step 4: Inspect Extracted Outputs
- Clean dataset: `output/scraped_data.csv`
- Failure details: `output/failure_log.csv`

---

## 5. Production Reliability & Anti-Bot Best Practices

1. **Headless Execution**: Configured with `--headless=new` and `--disable-blink-features=AutomationControlled` to minimize memory usage and avoid headless fingerprints.
2. **Dynamic Pincode Injection**: Handles asynchronous DOM updates, clears existing values with keyboard sequences, and awaits delivery text updates.
3. **Out-of-Stock Resilience**: Gracefully logs missing delivery/pricing elements without throwing fatal crashes.
4. **Deduplication Engine**: Built-in check on `(product_id, area_id, crawl_date)` tuple prevents redundant web requests.
5. **Rate Limiting**: Configurable polite delays (`delay_between_requests=2.0`) protect against temporary IP blocks.
