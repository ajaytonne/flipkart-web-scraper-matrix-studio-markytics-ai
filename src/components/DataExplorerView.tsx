import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  Star, 
  Package, 
  Truck, 
  Calendar,
  DollarSign,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { ScrapedProductRecord } from '../types/scraper';
import { exportScrapedDataCSV, exportScrapedDataJSON } from '../utils/fileExport';

interface DataExplorerViewProps {
  records: ScrapedProductRecord[];
}

export const DataExplorerView: React.FC<DataExplorerViewProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [pincodeFilter, setPincodeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<ScrapedProductRecord | null>(null);
  const [sortField, setSortField] = useState<keyof ScrapedProductRecord>('crawl_date');
  const [sortAsc, setSortAsc] = useState(false);

  // Unique pincodes present in records
  const uniquePincodes = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => set.add(r.area_id));
    return Array.from(set).sort();
  }, [records]);

  // Filtered & sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        // Search filter
        const q = searchTerm.toLowerCase();
        const matchesSearch = 
          r.product_id.toLowerCase().includes(q) ||
          r.area_id.toLowerCase().includes(q) ||
          (r.seller_name && r.seller_name.toLowerCase().includes(q)) ||
          (r.product_weight && r.product_weight.toLowerCase().includes(q)) ||
          (r.bestseller_rank && r.bestseller_rank.toLowerCase().includes(q));

        // Availability filter
        let matchesAvail = true;
        if (availabilityFilter === 'available') matchesAvail = r.availability === 1;
        if (availabilityFilter === 'unavailable') matchesAvail = r.availability === 0;

        // Pincode filter
        let matchesPin = true;
        if (pincodeFilter !== 'all') matchesPin = r.area_id === pincodeFilter;

        return matchesSearch && matchesAvail && matchesPin;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (valA < valB) return sortAsc ? -1 : 1;
        return sortAsc ? 1 : -1;
      });
  }, [records, searchTerm, availabilityFilter, pincodeFilter, sortField, sortAsc]);

  // Summary Metrics
  const totalCount = records.length;
  const inStockCount = records.filter(r => r.availability === 1).length;
  const inStockPercentage = totalCount > 0 ? Math.round((inStockCount / totalCount) * 100) : 0;
  
  const prices = records.filter(r => r.price !== null).map(r => r.price as number);
  const avgPrice = prices.length > 0 ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : '0';
  
  const primeCount = records.filter(r => r.prime_delivery_date !== null && r.availability === 1).length;
  const primePercentage = inStockCount > 0 ? Math.round((primeCount / inStockCount) * 100) : 0;

  const handleSort = (field: keyof ScrapedProductRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-5">
      {/* Analytics KPI bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Total Scraped Rows</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Matrix product-pincode pairs</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Serviceable (In Stock)</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 mt-1">
            {inStockPercentage}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{inStockCount} / {totalCount} combinations</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-xs font-medium text-slate-500">Average Price</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-600 mt-1">
            ₹{avgPrice}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across available SKUs</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="text-xs font-medium text-slate-500">F-Assured / Prime Coverage</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 mt-1">
            {primePercentage}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{primeCount} fast delivery items</div>
        </div>
      </div>

      {/* Control bar: search, filters, and export */}
      <div className="bg-white p-4 rounded border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by PID, seller, pincode, or weight..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Filter tabs & dropdowns */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Availability segmented buttons */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded">
              <button
                onClick={() => setAvailabilityFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  availabilityFilter === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({records.length})
              </button>
              <button
                onClick={() => setAvailabilityFilter('available')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  availabilityFilter === 'available'
                    ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Stock ({inStockCount})
              </button>
              <button
                onClick={() => setAvailabilityFilter('unavailable')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  availabilityFilter === 'unavailable'
                    ? 'bg-white text-rose-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Out of Stock ({totalCount - inStockCount})
              </button>
            </div>

            {/* Pincode selector */}
            <select
              value={pincodeFilter}
              onChange={(e) => setPincodeFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 font-mono text-xs focus:outline-none"
            >
              <option value="all">All Pincodes</option>
              {uniquePincodes.map(pin => (
                <option key={pin} value={pin}>PIN: {pin}</option>
              ))}
            </select>

            {/* Export buttons */}
            <button
              onClick={() => exportScrapedDataCSV(filteredRecords)}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportScrapedDataJSON(filteredRecords)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-density 20-field Table View */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 sticky top-0 z-10 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 font-mono">#</th>
                <th 
                  onClick={() => handleSort('product_id')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 font-mono"
                >
                  <div className="flex items-center gap-1">
                    <span>product_id</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('area_id')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 font-mono"
                >
                  <div className="flex items-center gap-1">
                    <span>area_id</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-mono">seller_name</th>
                <th 
                  onClick={() => handleSort('price')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 font-mono text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>price</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-mono text-right">promo (%)</th>
                <th 
                  onClick={() => handleSort('availability')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 font-mono text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>avail</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-mono text-center">rating</th>
                <th className="py-2.5 px-3 font-mono">weight</th>
                <th className="py-2.5 px-3 font-mono">delivery_date</th>
                <th className="py-2.5 px-3 font-mono text-center">prime</th>
                <th className="py-2.5 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500 text-xs">
                    No matching product records found. Try adjusting your search or matrix filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => (
                  <tr 
                    key={`${r.product_id}-${r.area_id}-${idx}`}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-2 px-3 text-slate-400 font-mono tabular-nums text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 font-mono font-medium text-blue-600 text-[11px]">
                      {r.product_id}
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-900 text-[11px]">
                      {r.area_id}
                    </td>
                    <td className="py-2 px-3 text-slate-700 truncate max-w-[140px]">
                      {r.seller_name || <span className="text-slate-400 italic">None</span>}
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold text-slate-900 text-right tabular-nums">
                      {r.price !== null ? `₹${r.price.toFixed(2)}` : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-2 px-3 font-mono text-right tabular-nums text-emerald-600 font-medium">
                      {r.promo !== null ? `${r.promo}% off` : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {r.availability === 1 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <Check className="w-3.5 h-3.5" /> 1
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600">
                          <X className="w-3.5 h-3.5" /> 0
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center font-mono tabular-nums font-medium">
                      {r.overall_rating ? (
                        <span className="inline-flex items-center gap-1 text-slate-900">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {r.overall_rating}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">
                      {r.product_weight || '—'}
                    </td>
                    <td className="py-2 px-3 text-slate-600 truncate max-w-[180px] text-[11px]">
                      {r.delivery_date || '—'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {r.prime_delivery_date ? (
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-600" title="F-Assured / Prime Eligible" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="View all 20 fields"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Detailed Inspection Drawer for All 20 Fields */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Inspection (All 20 Extracted Fields)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  PID: {selectedRecord.product_id} · Pincode: {selectedRecord.area_id} · Crawl: {selectedRecord.crawl_date}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">1. platform_id</span>
                <span className="font-semibold text-slate-900">{selectedRecord.platform_id} (Flipkart)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">2. product_id</span>
                <span className="font-semibold font-mono text-blue-600">{selectedRecord.product_id}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">3. area_id</span>
                <span className="font-semibold font-mono text-slate-900">{selectedRecord.area_id}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">4. crawl_date</span>
                <span className="font-semibold text-slate-900">{selectedRecord.crawl_date}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">5. seller_name</span>
                <span className="font-semibold text-slate-900">{selectedRecord.seller_name || 'N/A'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">6. main_seller</span>
                <span className="font-semibold text-slate-900">{selectedRecord.main_seller}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">7. price</span>
                <span className="font-bold text-slate-900 font-mono">
                  {selectedRecord.price !== null ? `₹${selectedRecord.price.toFixed(2)}` : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">8. promo (% discount)</span>
                <span className="font-semibold text-emerald-600 font-mono">
                  {selectedRecord.promo !== null ? `${selectedRecord.promo}%` : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">9. availability</span>
                <span className={`font-semibold ${selectedRecord.availability === 1 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {selectedRecord.availability === 1 ? '1 (Available)' : '0 (Out of stock)'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">10. overall_rating</span>
                <span className="font-semibold text-slate-900 font-mono">{selectedRecord.overall_rating || 'N/A'} ★</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">11. bestseller_rank</span>
                <span className="font-semibold text-slate-900">{selectedRecord.bestseller_rank || 'None'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">12. product_weight</span>
                <span className="font-semibold font-mono text-slate-900">{selectedRecord.product_weight || 'N/A'}</span>
              </div>
            </div>

            {/* Ratings Breakdown Visual Bar (Fields 13, 14, 15, 16, 17, 18) */}
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  13. total_ratings: <span className="font-mono">{selectedRecord.total_ratings.toLocaleString()}</span>
                </span>
                <span className="text-slate-500 text-[11px]">Granular Star Breakdown</span>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-14 font-mono text-slate-600 text-[11px]">5 ★ (14)</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full" 
                      style={{ width: `${selectedRecord.total_ratings > 0 ? (selectedRecord.five_stars_rating / selectedRecord.total_ratings) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-16 font-mono text-right text-slate-700 text-[11px] tabular-nums">
                    {selectedRecord.five_stars_rating.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-14 font-mono text-slate-600 text-[11px]">4 ★ (15)</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full" 
                      style={{ width: `${selectedRecord.total_ratings > 0 ? (selectedRecord.four_stars_rating / selectedRecord.total_ratings) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-16 font-mono text-right text-slate-700 text-[11px] tabular-nums">
                    {selectedRecord.four_stars_rating.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-14 font-mono text-slate-600 text-[11px]">3 ★ (16)</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full" 
                      style={{ width: `${selectedRecord.total_ratings > 0 ? (selectedRecord.three_stars_rating / selectedRecord.total_ratings) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-16 font-mono text-right text-slate-700 text-[11px] tabular-nums">
                    {selectedRecord.three_stars_rating.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-14 font-mono text-slate-600 text-[11px]">2 ★ (17)</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-orange-400 h-full" 
                      style={{ width: `${selectedRecord.total_ratings > 0 ? (selectedRecord.two_stars_rating / selectedRecord.total_ratings) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-16 font-mono text-right text-slate-700 text-[11px] tabular-nums">
                    {selectedRecord.two_stars_rating.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-14 font-mono text-slate-600 text-[11px]">1 ★ (18)</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full" 
                      style={{ width: `${selectedRecord.total_ratings > 0 ? (selectedRecord.one_star_rating / selectedRecord.total_ratings) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-16 font-mono text-right text-slate-700 text-[11px] tabular-nums">
                    {selectedRecord.one_star_rating.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Fields 19 and 20 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">19. delivery_date</span>
                <span className="font-semibold text-slate-800 block mt-0.5">
                  {selectedRecord.delivery_date || 'N/A'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">20. prime_delivery_date</span>
                <span className="font-semibold text-blue-700 block mt-0.5">
                  {selectedRecord.prime_delivery_date || 'N/A (Standard Delivery)'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
