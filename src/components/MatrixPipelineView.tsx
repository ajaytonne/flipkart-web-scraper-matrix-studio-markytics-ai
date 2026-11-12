import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Plus, 
  Trash2, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  MapPin, 
  RefreshCw,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { TargetSKU, TargetPincode, PipelineLog, ScrapedProductRecord, FailureRecord } from '../types/scraper';

interface MatrixPipelineViewProps {
  skus: TargetSKU[];
  pincodes: TargetPincode[];
  onAddSku: (url: string, category?: string) => void;
  onRemoveSku: (id: string) => void;
  onToggleSku: (id: string) => void;
  onAddPincode: (pin: string, city: string, state: string, isMetro: boolean) => void;
  onRemovePincode: (pin: string) => void;
  onTogglePincode: (pin: string) => void;
  onPipelineComplete: (newRecords: ScrapedProductRecord[], newFailures: FailureRecord[]) => void;
  totalRecordsCount: number;
  totalFailuresCount: number;
}

export const MatrixPipelineView: React.FC<MatrixPipelineViewProps> = ({
  skus,
  pincodes,
  onAddSku,
  onRemoveSku,
  onToggleSku,
  onAddPincode,
  onRemovePincode,
  onTogglePincode,
  onPipelineComplete,
  totalRecordsCount,
  totalFailuresCount
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSku, setCurrentSku] = useState<TargetSKU | null>(null);
  const [currentPin, setCurrentPin] = useState<TargetPincode | null>(null);
  const [logs, setLogs] = useState<PipelineLog[]>([
    {
      id: 'log-init-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      message: 'FlipkartScraper initialized with Chrome Headless and anti-detection flags.'
    },
    {
      id: 'log-init-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      message: 'Deduplication index loaded. Ready for matrix execution.'
    }
  ]);

  // Form states
  const [newSkuUrl, setNewSkuUrl] = useState('');
  const [newSkuCategory, setNewSkuCategory] = useState('Personal Care');
  const [showAddSku, setShowAddSku] = useState(false);

  const [newPinCode, setNewPinCode] = useState('');
  const [newPinCity, setNewPinCity] = useState('');
  const [newPinState, setNewPinState] = useState('');
  const [newPinMetro, setNewPinMetro] = useState(false);
  const [showAddPin, setShowAddPin] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<boolean>(false);

  const activeSkus = skus.filter(s => s.active);
  const activePincodes = pincodes.filter(p => p.active);
  const totalCombinations = activeSkus.length * activePincodes.length;

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (level: PipelineLog['level'], message: string, pid?: string, pincode?: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
        pid,
        pincode
      }
    ]);
  };

  const handleStartPipeline = async () => {
    if (activeSkus.length === 0 || activePincodes.length === 0) {
      alert('Please activate at least 1 SKU and 1 Pincode to run the matrix crawler.');
      return;
    }

    setIsRunning(true);
    abortControllerRef.current = false;
    setProgress(0);
    setCurrentStep(0);

    addLog('INFO', `================ STARTING MATRIX CRAWLER ================`);
    addLog('INFO', `Matrix Dimensions: ${activeSkus.length} SKUs × ${activePincodes.length} Pincodes = ${totalCombinations} executions`);

    const crawledBatch: ScrapedProductRecord[] = [];
    const failureBatch: FailureRecord[] = [];
    const today = new Date().toISOString().split('T')[0];

    let step = 0;

    for (let i = 0; i < activeSkus.length; i++) {
      if (abortControllerRef.current) break;
      const sku = activeSkus[i];
      setCurrentSku(sku);

      addLog('INFO', `Navigating to SKU: ${sku.pid} (${sku.title.substring(0, 45)}...)`, sku.pid);

      for (let j = 0; j < activePincodes.length; j++) {
        if (abortControllerRef.current) break;
        const pin = activePincodes[j];
        setCurrentPin(pin);
        step++;
        setCurrentStep(step);
        setProgress(Math.round((step / totalCombinations) * 100));

        addLog('INFO', `[${step}/${totalCombinations}] Injecting Pincode ${pin.pincode} (${pin.city}) into #pincodeInputId...`, sku.pid, pin.pincode);

        // Simulation delay mimicking Selenium page load & DOM mutation wait
        await new Promise(r => setTimeout(r, 700));

        // Test non-serviceable case simulation for test pincode 790001 or 194101
        if (pin.pincode === '790001') {
          addLog('WARN', `Pincode ${pin.pincode} flagged as non-serviceable / out of stock by Flipkart. Availability = 0.`, sku.pid, pin.pincode);
          const outOfStockRecord: ScrapedProductRecord = {
            platform_id: 2,
            product_id: sku.pid,
            area_id: pin.pincode,
            crawl_date: today,
            seller_name: null,
            main_seller: 0,
            price: null,
            promo: null,
            availability: 0,
            overall_rating: 4.3,
            bestseller_rank: null,
            product_weight: sku.expectedWeight,
            total_ratings: 54000,
            five_stars_rating: 32000,
            four_stars_rating: 11000,
            three_stars_rating: 5000,
            two_stars_rating: 2000,
            one_star_rating: 4000,
            delivery_date: `Currently Out of Stock for ${pin.pincode}`,
            prime_delivery_date: null
          };
          crawledBatch.push(outOfStockRecord);
        } else if (pin.pincode === '194101') {
          // Failure condition
          addLog('ERROR', `Network failure or delivery rejection for Pincode ${pin.pincode}`, sku.pid, pin.pincode);
          failureBatch.push({
            id: `fail-${Date.now()}-${step}`,
            product_url: sku.url,
            product_id: sku.pid,
            pincode: pin.pincode,
            crawl_date: today,
            failure_reason: `Pincode ${pin.pincode} delivery service rejected by carrier`
          });
        } else {
          // Successful scrape
          const simulatedPrice = sku.category.includes('Tech') ? 57999.0 : sku.category.includes('Grooming') ? 340.0 : 249.0;
          const simulatedPromo = sku.category.includes('Tech') ? 12.0 : 15.0;
          const record: ScrapedProductRecord = {
            platform_id: 2,
            product_id: sku.pid,
            area_id: pin.pincode,
            crawl_date: today,
            seller_name: pin.isMetro ? 'RetailNet' : 'OmniTechRetail',
            main_seller: 1,
            price: simulatedPrice,
            promo: simulatedPromo,
            availability: 1,
            overall_rating: 4.4,
            bestseller_rank: sku.category.includes('Grooming') ? "#1 in Men's Care" : null,
            product_weight: sku.expectedWeight,
            total_ratings: 124500,
            five_stars_rating: 78000,
            four_stars_rating: 25000,
            three_stars_rating: 11000,
            two_stars_rating: 4500,
            one_star_rating: 6000,
            delivery_date: pin.isMetro ? 'Delivery by Tomorrow | Free' : 'Delivery in 3 Days | Free ₹40',
            prime_delivery_date: pin.isMetro ? 'Delivery by Tomorrow | Free' : 'Delivery in 3 Days | Free ₹40'
          };
          crawledBatch.push(record);
          addLog('SUCCESS', `Extracted 20 fields for PID ${sku.pid} @ ${pin.pincode}: ₹${record.price} [Avail: 1]`, sku.pid, pin.pincode);
        }
      }
    }

    setIsRunning(false);
    setCurrentSku(null);
    setCurrentPin(null);
    addLog('INFO', `================ MATRIX CRAWL FINISHED ================`);
    addLog('SUCCESS', `Successfully saved ${crawledBatch.length} records to output/scraped_data.csv`);
    if (failureBatch.length > 0) {
      addLog('WARN', `Logged ${failureBatch.length} failed iterations to output/failure_log.csv`);
    }

    onPipelineComplete(crawledBatch, failureBatch);
  };

  const handleStopPipeline = () => {
    abortControllerRef.current = true;
    setIsRunning(false);
    addLog('WARN', 'Pipeline run terminated by user.');
  };

  const handleCreateSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkuUrl.trim()) return;
    onAddSku(newSkuUrl.trim(), newSkuCategory);
    setNewSkuUrl('');
    setShowAddSku(false);
    addLog('INFO', `Added new target SKU URL to matrix queue.`);
  };

  const handleCreatePincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinCode.trim() || newPinCode.length !== 6) {
      alert('Please enter a valid 6-digit Indian Pincode');
      return;
    }
    onAddPincode(newPinCode.trim(), newPinCity.trim() || 'Custom City', newPinState.trim() || 'India', newPinMetro);
    setNewPinCode('');
    setNewPinCity('');
    setNewPinState('');
    setNewPinMetro(false);
    setShowAddPin(false);
    addLog('INFO', `Added new target Pincode ${newPinCode} to matrix queue.`);
  };

  return (
    <div className="space-y-6">
      {/* Metric KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Target SKUs</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {activeSkus.length} <span className="text-xs font-normal text-slate-400">/ {skus.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pincodes</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {activePincodes.length} <span className="text-xs font-normal text-slate-400">/ {pincodes.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Matrix Size</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {totalCombinations} <span className="text-xs font-normal text-slate-400">runs</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scraped Rows</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 mt-1">
            {totalRecordsCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Failures</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-700 mt-1">
            {totalFailuresCount}
          </div>
        </div>
      </div>

      {/* Execution Controller Banner */}
      <div className="bg-white p-5 rounded border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Matrix Crawl Orchestrator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automates the Selenium browser to visit each SKU, inject pincodes via DOM, and parse the 20 required fields with BeautifulSoup.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isRunning ? (
              <button
                onClick={handleStartPipeline}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Matrix Crawler ({totalCombinations} Combos)</span>
              </button>
            ) : (
              <button
                onClick={handleStopPipeline}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-rose-600 rounded hover:bg-rose-700 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Execution</span>
              </button>
            )}
          </div>
        </div>

        {/* Live progress indicators when running */}
        {isRunning && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Processing Step: <span className="font-mono">{currentStep} / {totalCombinations}</span>
                {currentSku && <span className="text-slate-500 ml-2">PID: {currentSku.pid}</span>}
                {currentPin && <span className="text-slate-500 ml-2">Pincode: {currentPin.pincode} ({currentPin.city})</span>}
              </span>
              <span className="font-mono font-semibold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Matrix Configuration: SKUs and Pincodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SKUs List */}
        <div className="bg-white rounded border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                1. Target SKU URLs ({skus.length})
              </h3>
              <p className="text-xs text-slate-500">
                Flipkart product pages with 'pid' query parameter.
              </p>
            </div>
            <button
              onClick={() => setShowAddSku(!showAddSku)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add SKU</span>
            </button>
          </div>

          {showAddSku && (
            <form onSubmit={handleCreateSku} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Flipkart Product URL (must contain '?pid=...')
                </label>
                <input
                  type="url"
                  placeholder="https://www.flipkart.com/.../p/itm...?pid=FCWFC2G4YFHFGXZV"
                  value={newSkuUrl}
                  onChange={(e) => setNewSkuUrl(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Category / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grooming, Skincare, Tech"
                  value={newSkuCategory}
                  onChange={(e) => setNewSkuCategory(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddSku(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
                >
                  Add to Matrix
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {skus.map((sku) => (
              <div
                key={sku.id}
                className={`p-3 rounded border text-xs transition-colors flex items-start justify-between gap-3 ${
                  sku.active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sku.active}
                      onChange={() => onToggleSku(sku.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-900 truncate">
                      {sku.title}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-slate-500 text-[11px] font-mono">
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      PID: {sku.pid}
                    </span>
                    <span>·</span>
                    <span>{sku.expectedWeight}</span>
                    <span>·</span>
                    <span className="text-slate-400 truncate max-w-[200px]">{sku.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveSku(sku.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  title="Remove SKU"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pincodes List */}
        <div className="bg-white rounded border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                2. Target Pincodes ({pincodes.length})
              </h3>
              <p className="text-xs text-slate-500">
                Indian postal codes for checking local availability & delivery date.
              </p>
            </div>
            <button
              onClick={() => setShowAddPin(!showAddPin)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pincode</span>
            </button>
          </div>

          {showAddPin && (
            <form onSubmit={handleCreatePincode} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    6-Digit Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 560001"
                    value={newPinCode}
                    onChange={(e) => setNewPinCode(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    City Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={newPinCity}
                    onChange={(e) => setNewPinCity(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 items-center">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Karnataka"
                    value={newPinState}
                    onChange={(e) => setNewPinState(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="metroCheck"
                    checked={newPinMetro}
                    onChange={(e) => setNewPinMetro(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="metroCheck" className="text-xs text-slate-700 cursor-pointer">
                    Tier 1 Metro (Prime/F-Assured)
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddPin(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded cursor-pointer"
                >
                  Add Pincode
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
            {pincodes.map((pin) => (
              <div
                key={pin.pincode}
                className={`p-2.5 rounded border text-xs transition-colors flex items-center justify-between gap-2 ${
                  pin.active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    checked={pin.active}
                    onChange={() => onTogglePincode(pin.pincode)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-slate-900">
                      {pin.pincode}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {pin.city}, {pin.state}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {pin.isMetro ? (
                    <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      Metro
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      Tier 2/3
                    </span>
                  )}
                  <button
                    onClick={() => onRemovePincode(pin.pincode)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    title="Remove Pincode"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Streaming Terminal Console */}
      <div className="bg-slate-900 text-slate-200 rounded border border-slate-800 p-4 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-100">
              Live Matrix Pipeline Execution Log
            </span>
            <span className="text-slate-500">
              (main.py & scraper.py output stream)
            </span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-slate-400 hover:text-slate-200 text-[11px] underline cursor-pointer"
          >
            Clear Log
          </button>
        </div>

        <div className="space-y-1.5 max-h-64 overflow-y-auto leading-relaxed pr-2">
          {logs.map((log) => {
            let color = 'text-slate-300';
            if (log.level === 'SUCCESS') color = 'text-emerald-400';
            if (log.level === 'WARN') color = 'text-amber-400';
            if (log.level === 'ERROR') color = 'text-rose-400';

            return (
              <div key={log.id} className="flex items-start gap-2 text-[11px]">
                <span className="text-slate-500 shrink-0 tabular-nums">
                  {log.timestamp}
                </span>
                <span className={`font-semibold shrink-0 ${
                  log.level === 'INFO' ? 'text-blue-400' :
                  log.level === 'SUCCESS' ? 'text-emerald-400' :
                  log.level === 'WARN' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  [{log.level}]
                </span>
                <span className={color}>
                  {log.message}
                </span>
              </div>
            );
          })}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};
