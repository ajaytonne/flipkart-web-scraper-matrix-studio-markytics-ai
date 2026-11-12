import React from 'react';
import { Download, Terminal } from 'lucide-react';

interface TopBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onExportCSV: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentTab, onSelectTab, onExportCSV }) => {
  const navItems = [
    { id: 'matrix', label: 'Pipeline Matrix' },
    { id: 'data', label: 'Data Explorer (20 Fields)' },
    { id: 'failures', label: 'Failure Logs' },
    { id: 'testbench', label: 'Test Bench' },
    { id: 'code', label: 'Code Inspector' },
    { id: 'guide', label: 'Setup Guide' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => onSelectTab('matrix')}
            className="flex items-center gap-2.5 text-left text-slate-900 focus:outline-none whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                FlipMatrix Studio
              </span>
              <span className="text-xs text-slate-500 font-normal block leading-tight">
                Flipkart SKU × Pincode Scraper
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`py-1 text-xs uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-4 border-t border-slate-100 text-xs font-medium no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`whitespace-nowrap px-2 py-1 rounded ${
                currentTab === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
