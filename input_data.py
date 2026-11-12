"""
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
]
