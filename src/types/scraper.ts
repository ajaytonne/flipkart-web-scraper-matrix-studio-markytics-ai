export interface ScrapedProductRecord {
  platform_id: number;           // 1. Flipkart = 2
  product_id: string;            // 2. Extracted from URL 'pid' parameter
  area_id: string;               // 3. Pincode
  crawl_date: string;            // 4. Current system date YYYY-MM-DD
  seller_name: string | null;    // 5. seller_name
  main_seller: number;           // 6. 1 if primary seller identified, else 0
  price: number | null;          // 7. Current selling price as float
  promo: number | null;          // 8. Promotional discount percentage as float
  availability: number;          // 9. 1 = Available, 0 = Unavailable/Sold out
  overall_rating: number | null; // 10. Float
  bestseller_rank: string | null;// 11. Bestseller rank if available
  product_weight: string | null; // 12. Quantity/weight e.g., 75 ml, 100 gm
  total_ratings: number;         // 13. Integer count
  five_stars_rating: number;     // 14. 5-star count
  four_stars_rating: number;     // 15. 4-star count
  three_stars_rating: number;    // 16. 3-star count
  two_stars_rating: number;      // 17. 2-star count
  one_star_rating: number;       // 18. 1-star count
  delivery_date: string | null;  // 19. Expected delivery text
  prime_delivery_date: string | null; // 20. F-Assured / Prime delivery date
}

export interface FailureRecord {
  id?: string;
  product_url: string;
  product_id: string;
  pincode: string;
  crawl_date: string;
  failure_reason: string;
}

export interface TargetSKU {
  id: string;
  title: string;
  url: string;
  pid: string;
  category: string;
  expectedWeight: string;
  active: boolean;
}

export interface TargetPincode {
  pincode: string;
  city: string;
  state: string;
  isMetro: boolean;
  active: boolean;
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  message: string;
  pid?: string;
  pincode?: string;
}
