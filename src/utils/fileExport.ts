import { ScrapedProductRecord, FailureRecord } from '../types/scraper';

export function downloadTextFile(filename: string, content: string, contentType: string = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportScrapedDataCSV(records: ScrapedProductRecord[]) {
  const headers = [
    'platform_id',
    'product_id',
    'area_id',
    'crawl_date',
    'seller_name',
    'main_seller',
    'price',
    'promo',
    'availability',
    'overall_rating',
    'bestseller_rank',
    'product_weight',
    'total_ratings',
    'five_stars_rating',
    'four_stars_rating',
    'three_stars_rating',
    'two_stars_rating',
    'one_star_rating',
    'delivery_date',
    'prime_delivery_date'
  ];

  const rows = records.map(r => {
    return [
      r.platform_id,
      r.product_id,
      r.area_id,
      r.crawl_date,
      r.seller_name ? `"${r.seller_name.replace(/"/g, '""')}"` : '',
      r.main_seller,
      r.price !== null ? r.price : '',
      r.promo !== null ? r.promo : '',
      r.availability,
      r.overall_rating !== null ? r.overall_rating : '',
      r.bestseller_rank ? `"${r.bestseller_rank.replace(/"/g, '""')}"` : '',
      r.product_weight ? `"${r.product_weight.replace(/"/g, '""')}"` : '',
      r.total_ratings,
      r.five_stars_rating,
      r.four_stars_rating,
      r.three_stars_rating,
      r.two_stars_rating,
      r.one_star_rating,
      r.delivery_date ? `"${r.delivery_date.replace(/"/g, '""')}"` : '',
      r.prime_delivery_date ? `"${r.prime_delivery_date.replace(/"/g, '""')}"` : ''
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadTextFile('scraped_data.csv', csvContent, 'text/csv;charset=utf-8;');
}

export function exportFailureLogCSV(failures: FailureRecord[]) {
  const headers = ['product_url', 'product_id', 'pincode', 'crawl_date', 'failure_reason'];
  const rows = failures.map(f => [
    `"${f.product_url.replace(/"/g, '""')}"`,
    f.product_id,
    f.pincode,
    f.crawl_date,
    `"${f.failure_reason.replace(/"/g, '""')}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadTextFile('failure_log.csv', csvContent, 'text/csv;charset=utf-8;');
}

export function exportScrapedDataJSON(records: ScrapedProductRecord[]) {
  const jsonContent = JSON.stringify(records, null, 2);
  downloadTextFile('scraped_data.json', jsonContent, 'application/json');
}
