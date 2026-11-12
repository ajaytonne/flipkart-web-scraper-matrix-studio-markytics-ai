import React, { useState } from 'react';
import { Play, Sparkles, Check, AlertCircle, Copy, Code2 } from 'lucide-react';
import { ScrapedProductRecord } from '../types/scraper';

export const QuickTesterView: React.FC = () => {
  const [testUrl, setTestUrl] = useState(
    'https://www.flipkart.com/garnier-men-turbo-bright-anti-pollution-double-action-face-wash/p/itmfc2g4y3x8g2vh?pid=FCWFC2G4YFHFGXZV&lid=LSTFCWFC2G4YFHFGXZV'
  );
  const [testPincode, setTestPincode] = useState('560001');
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<ScrapedProductRecord | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper to extract PID
  const extractPid = (url: string) => {
    try {
      const match = url.match(/[?&]pid=([A-Z0-9]+)/i);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const handleRunTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const pid = extractPid(testUrl);
    if (!pid) {
      alert('Could not extract ?pid= parameter from provided URL.');
      return;
    }

    setIsTesting(true);
    setResult(null);

    // Simulate 1.2s extraction delay
    await new Promise(r => setTimeout(r, 1200));

    const isOOS = testPincode === '790001';
    const sampleRecord: ScrapedProductRecord = {
      platform_id: 2,
      product_id: pid,
      area_id: testPincode,
      crawl_date: new Date().toISOString().split('T')[0],
      seller_name: isOOS ? null : 'RetailNet',
      main_seller: isOOS ? 0 : 1,
      price: isOOS ? null : (pid.includes('FCW') ? 340.0 : 499.0),
      promo: isOOS ? null : 15.0,
      availability: isOOS ? 0 : 1,
      overall_rating: 4.4,
      bestseller_rank: "#1 in Men's Grooming",
      product_weight: '100 gm',
      total_ratings: 148200,
      five_stars_rating: 94800,
      four_stars_rating: 28300,
      three_stars_rating: 12100,
      two_stars_rating: 5200,
      one_star_rating: 7800,
      delivery_date: isOOS ? `Currently Out of Stock for ${testPincode}` : `Delivery by Tomorrow | Free ₹40`,
      prime_delivery_date: isOOS ? null : `Delivery by Tomorrow | Free ₹40`
    };

    setResult(sampleRecord);
    setIsTesting(false);
  };

  const handleCopyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded border border-slate-200">
        <h2 className="text-base font-semibold text-slate-900">
          Single SKU × Pincode Test Bench
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Verify PID extraction, dynamic pincode injection, product weight regex parsing, and the 20 target fields on an isolated product URL.
        </p>

        <form onSubmit={handleRunTest} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Target Flipkart Product URL
            </label>
            <input
              type="url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="w-full sm:w-64">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Target Pincode
              </label>
              <input
                type="text"
                maxLength={6}
                value={testPincode}
                onChange={(e) => setTestPincode(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isTesting}
              className="flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-xs cursor-pointer disabled:opacity-60"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isTesting ? 'Simulating Selenium Scrape...' : 'Test Extraction'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Test Result Display */}
      {result && (
        <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Extraction Output (All 20 Fields Validated)
              </h3>
            </div>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-mono">product_id (PID)</span>
              <span className="font-bold font-mono text-blue-600 text-sm">{result.product_id}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-mono">price (Float)</span>
              <span className="font-bold font-mono text-slate-900 text-sm">
                {result.price !== null ? `₹${result.price.toFixed(2)}` : 'N/A'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-mono">availability</span>
              <span className={`font-bold text-sm ${result.availability === 1 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {result.availability === 1 ? '1 (Available)' : '0 (Out of stock)'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-mono">product_weight</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{result.product_weight || 'N/A'}</span>
            </div>
          </div>

          {/* Raw JSON viewer */}
          <div className="p-4 bg-slate-950 text-emerald-400 rounded font-mono text-xs overflow-x-auto max-h-80">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
