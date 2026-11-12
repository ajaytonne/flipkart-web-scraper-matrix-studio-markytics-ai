import React, { useState } from 'react';
import { AlertCircle, Download, Search, Trash2, ExternalLink } from 'lucide-react';
import { FailureRecord } from '../types/scraper';
import { exportFailureLogCSV } from '../utils/fileExport';

interface FailureLogsViewProps {
  failures: FailureRecord[];
  onClearFailures: () => void;
}

export const FailureLogsView: React.FC<FailureLogsViewProps> = ({ failures, onClearFailures }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFailures = failures.filter(f => {
    const q = searchTerm.toLowerCase();
    return (
      f.product_id.toLowerCase().includes(q) ||
      f.pincode.toLowerCase().includes(q) ||
      f.failure_reason.toLowerCase().includes(q) ||
      f.product_url.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Pipeline Failure & Exception Log (failure_log.csv)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Maintains audit records for invalid PIDs, non-serviceable pincode rejections, network timeouts, or missing HTML DOM nodes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportFailureLogCSV(failures)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export failure_log.csv</span>
            </button>
            {failures.length > 0 && (
              <button
                onClick={onClearFailures}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Log</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded border border-slate-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search failures by PID, pincode, or error reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-rose-500 font-mono"
          />
        </div>
      </div>

      {/* Failure Log Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">product_id</th>
                <th className="py-2.5 px-3">pincode</th>
                <th className="py-2.5 px-3">crawl_date</th>
                <th className="py-2.5 px-3">failure_reason</th>
                <th className="py-2.5 px-3">product_url</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredFailures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    No logged exceptions or failures! Pipeline executed cleanly.
                  </td>
                </tr>
              ) : (
                filteredFailures.map((f, idx) => (
                  <tr key={f.id || idx} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 font-mono tabular-nums text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-rose-700 text-[11px]">
                      {f.product_id || <span className="italic text-slate-400">None</span>}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-[11px]">
                      {f.pincode}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {f.crawl_date}
                    </td>
                    <td className="py-2.5 px-3 text-rose-700 font-medium">
                      {f.failure_reason}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[220px] font-mono text-[11px]">
                      <a 
                        href={f.product_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span className="truncate">{f.product_url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
