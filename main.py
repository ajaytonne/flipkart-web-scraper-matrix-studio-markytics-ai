"""
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

# Output Directory & File paths
OUTPUT_DIR = "output"
SCRAPED_DATA_CSV = os.path.join(OUTPUT_DIR, "scraped_data.csv")
FAILURE_LOG_CSV = os.path.join(OUTPUT_DIR, "failure_log.csv")

# Define the exact 20 mandatory fields
TARGET_COLUMNS = [
    "platform_id",
    "product_id",
    "area_id",
    "crawl_date",
    "seller_name",
    "main_seller",
    "price",
    "promo",
    "availability",
    "overall_rating",
    "bestseller_rank",
    "product_weight",
    "total_ratings",
    "five_stars_rating",
    "four_stars_rating",
    "three_stars_rating",
    "two_stars_rating",
    "one_star_rating",
    "delivery_date",
    "prime_delivery_date"
]

FAILURE_COLUMNS = [
    "product_url",
    "product_id",
    "pincode",
    "crawl_date",
    "failure_reason"
]


def ensure_output_directory():
    """Creates output folder if it doesn't already exist."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def load_existing_keys() -> Set[Tuple[str, str, str]]:
    """
    Loads existing (product_id, area_id, crawl_date) tuples from scraped_data.csv
    to enforce deduplication across repeated matrix executions.
    """
    existing_keys: Set[Tuple[str, str, str]] = set()
    if os.path.exists(SCRAPED_DATA_CSV):
        try:
            df = pd.read_csv(SCRAPED_DATA_CSV, dtype=str)
            if {"product_id", "area_id", "crawl_date"}.issubset(df.columns):
                for _, row in df.iterrows():
                    key = (str(row["product_id"]).strip(), str(row["area_id"]).strip(), str(row["crawl_date"]).strip())
                    existing_keys.add(key)
                logger.info(f"Loaded {len(existing_keys)} existing unique records for deduplication.")
        except Exception as e:
            logger.warning(f"Could not read existing {SCRAPED_DATA_CSV} for deduplication: {e}")
    return existing_keys


def append_scraped_data(rows: List[Dict[str, Any]]):
    """Appends newly scraped records into scraped_data.csv."""
    if not rows:
        return
    df_new = pd.DataFrame(rows, columns=TARGET_COLUMNS)
    file_exists = os.path.exists(SCRAPED_DATA_CSV)
    df_new.to_csv(SCRAPED_DATA_CSV, mode="a" if file_exists else "w", header=not file_exists, index=False)
    logger.info(f"Appended {len(rows)} records to {SCRAPED_DATA_CSV}")


def append_failure_log(failure_rows: List[Dict[str, Any]]):
    """Appends failed crawls into failure_log.csv."""
    if not failure_rows:
        return
    df_fail = pd.DataFrame(failure_rows, columns=FAILURE_COLUMNS)
    file_exists = os.path.exists(FAILURE_LOG_CSV)
    df_fail.to_csv(FAILURE_LOG_CSV, mode="a" if file_exists else "w", header=not file_exists, index=False)
    logger.info(f"Appended {len(failure_rows)} failure records to {FAILURE_LOG_CSV}")


def run_pipeline(delay_between_requests: float = 2.0):
    """
    Executes the SKU x Pincode matrix loop, capturing 20 data fields
    with out-of-stock tolerance, dynamic location updating, and failure logging.
    """
    ensure_output_directory()
    existing_keys = load_existing_keys()
    
    total_skus = len(SKU_URLS)
    total_pincodes = len(PINCODES)
    total_combinations = total_skus * total_pincodes
    
    logger.info("=" * 60)
    logger.info(f"STARTING FLIPKART MATRIX CRAWLER")
    logger.info(f"Total Target SKUs: {total_skus}")
    logger.info(f"Total Target Pincodes: {total_pincodes}")
    logger.info(f"Total Matrix Combinations: {total_combinations}")
    logger.info("=" * 60)

    scraped_records: List[Dict[str, Any]] = []
    failed_records: List[Dict[str, Any]] = []
    
    crawl_date = datetime.now().strftime("%Y-%m-%d")
    current_step = 0

    # Initialize Scraper
    scraper = None
    try:
        scraper = FlipkartScraper(headless=True, timeout=15)
        
        for url in SKU_URLS:
            pid = FlipkartScraper.extract_product_id(url)
            if not pid:
                logger.error(f"Could not extract 'pid' parameter from URL: {url}. Marking failed for all pincodes.")
                for pin in PINCODES:
                    failed_records.append({
                        "product_url": url,
                        "product_id": "",
                        "pincode": pin,
                        "crawl_date": crawl_date,
                        "failure_reason": "Missing or invalid 'pid' parameter in product URL"
                    })
                continue

            for pincode in PINCODES:
                current_step += 1
                progress = (current_step / total_combinations) * 100
                logger.info(f"[{current_step}/{total_combinations}] ({progress:.1f}%) Processing PID: {pid} | Pincode: {pincode}")

                # Deduplication Check
                dedup_key = (str(pid).strip(), str(pincode).strip(), crawl_date)
                if dedup_key in existing_keys:
                    logger.info(f"Skipping duplicate record for PID {pid}, Pincode {pincode}, Date {crawl_date}")
                    continue

                try:
                    data = scraper.scrape_product(url, pincode)
                    scraped_records.append(data)
                    existing_keys.add(dedup_key)
                    
                    # Periodic checkpoint save every 5 records
                    if len(scraped_records) >= 5:
                        append_scraped_data(scraped_records)
                        scraped_records = []

                except Exception as e:
                    logger.error(f"Error scraping PID {pid} for pincode {pincode}: {e}")
                    failed_records.append({
                        "product_url": url,
                        "product_id": pid,
                        "pincode": pincode,
                        "crawl_date": crawl_date,
                        "failure_reason": str(e)
                    })

                # Polite delay between requests to avoid IP bans
                time.sleep(delay_between_requests)

        # Flush remaining records
        if scraped_records:
            append_scraped_data(scraped_records)
        if failed_records:
            append_failure_log(failed_records)

    finally:
        if scraper:
            scraper.close()

    # Final Summary Report
    logger.info("=" * 60)
    logger.info("FLIPKART MATRIX CRAWL COMPLETE")
    logger.info("=" * 60)
    
    if os.path.exists(SCRAPED_DATA_CSV):
        final_df = pd.read_csv(SCRAPED_DATA_CSV)
        logger.info(f"Total Unique Scraped Records in {SCRAPED_DATA_CSV}: {len(final_df)}")
        print("\n--- SAMPLE EXTRACTED DATA (First 5 Rows) ---")
        print(final_df.head())
        print("\n--- AVAILABILITY & PRICE SUMMARY ---")
        if "availability" in final_df.columns:
            print(f"Available (1): {(final_df['availability'] == 1).sum()} items")
            print(f"Out of Stock (0): {(final_df['availability'] == 0).sum()} items")
        if "price" in final_df.columns:
            print(f"Average Price: ₹{final_df['price'].mean():.2f}")
    
    if os.path.exists(FAILURE_LOG_CSV):
        fail_df = pd.read_csv(FAILURE_LOG_CSV)
        logger.info(f"Total Logged Failures in {FAILURE_LOG_CSV}: {len(fail_df)}")


if __name__ == "__main__":
    run_pipeline()
