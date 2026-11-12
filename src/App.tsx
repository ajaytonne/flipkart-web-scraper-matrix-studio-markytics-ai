/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { MatrixPipelineView } from './components/MatrixPipelineView';
import { DataExplorerView } from './components/DataExplorerView';
import { FailureLogsView } from './components/FailureLogsView';
import { QuickTesterView } from './components/QuickTesterView';
import { CodeInspectorView } from './components/CodeInspectorView';
import { SetupGuideView } from './components/SetupGuideView';
import { 
  INITIAL_SKUS, 
  INITIAL_PINCODES, 
  INITIAL_SCRAPED_DATA, 
  INITIAL_FAILURE_LOGS 
} from './data/initialData';
import { ScrapedProductRecord, FailureRecord, TargetSKU, TargetPincode } from './types/scraper';
import { exportScrapedDataCSV } from './utils/fileExport';

export default function App() {
  const [currentTab, setCurrentTab] = useState('matrix');
  const [skus, setSkus] = useState<TargetSKU[]>(INITIAL_SKUS);
  const [pincodes, setPincodes] = useState<TargetPincode[]>(INITIAL_PINCODES);
  const [records, setRecords] = useState<ScrapedProductRecord[]>(INITIAL_SCRAPED_DATA);
  const [failures, setFailures] = useState<FailureRecord[]>(INITIAL_FAILURE_LOGS);

  // SKU Management
  const handleAddSku = (url: string, category: string = 'General') => {
    let pid = 'UNKNOWN_PID';
    const match = url.match(/[?&]pid=([A-Z0-9]+)/i);
    if (match) pid = match[1];

    const newSku: TargetSKU = {
      id: `sku-${Date.now()}`,
      title: `Flipkart Product SKU (${pid})`,
      url,
      pid,
      category,
      expectedWeight: 'N/A',
      active: true
    };
    setSkus(prev => [newSku, ...prev]);
  };

  const handleRemoveSku = (id: string) => {
    setSkus(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleSku = (id: string) => {
    setSkus(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // Pincode Management
  const handleAddPincode = (pin: string, city: string, state: string, isMetro: boolean) => {
    const newPin: TargetPincode = {
      pincode: pin,
      city,
      state,
      isMetro,
      active: true
    };
    setPincodes(prev => [...prev, newPin]);
  };

  const handleRemovePincode = (pin: string) => {
    setPincodes(prev => prev.filter(p => p.pincode !== pin));
  };

  const handleTogglePincode = (pin: string) => {
    setPincodes(prev => prev.map(p => p.pincode === pin ? { ...p, active: !p.active } : p));
  };

  // Pipeline Completion Handler (with deduplication)
  const handlePipelineComplete = (newRecords: ScrapedProductRecord[], newFailures: FailureRecord[]) => {
    if (newRecords.length > 0) {
      setRecords(prev => {
        // Enforce deduplication by (product_id, area_id, crawl_date)
        const existingKeys = new Set(prev.map(r => `${r.product_id}_${r.area_id}_${r.crawl_date}`));
        const filteredNew = newRecords.filter(r => !existingKeys.has(`${r.product_id}_${r.area_id}_${r.crawl_date}`));
        return [...filteredNew, ...prev];
      });
    }

    if (newFailures.length > 0) {
      setFailures(prev => [...newFailures, ...prev]);
    }
  };

  const handleClearFailures = () => {
    setFailures([]);
  };

  const handleExportCSV = () => {
    exportScrapedDataCSV(records);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        onExportCSV={handleExportCSV} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'matrix' && (
          <MatrixPipelineView
            skus={skus}
            pincodes={pincodes}
            onAddSku={handleAddSku}
            onRemoveSku={handleRemoveSku}
            onToggleSku={handleToggleSku}
            onAddPincode={handleAddPincode}
            onRemovePincode={handleRemovePincode}
            onTogglePincode={handleTogglePincode}
            onPipelineComplete={handlePipelineComplete}
            totalRecordsCount={records.length}
            totalFailuresCount={failures.length}
          />
        )}

        {currentTab === 'data' && (
          <DataExplorerView records={records} />
        )}

        {currentTab === 'failures' && (
          <FailureLogsView 
            failures={failures} 
            onClearFailures={handleClearFailures} 
          />
        )}

        {currentTab === 'testbench' && (
          <QuickTesterView />
        )}

        {currentTab === 'code' && (
          <CodeInspectorView />
        )}

        {currentTab === 'guide' && (
          <SetupGuideView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">FlipMatrix Pipeline</span>
            <span>·</span>
            <span>Selenium WebDriver · BeautifulSoup4 · Pandas 20-Field Architecture</span>
          </div>
          <div>
            <span>Platform ID: 2 (Flipkart) · Area Pincode Dynamic Resolution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
