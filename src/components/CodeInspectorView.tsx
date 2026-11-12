import React, { useState } from 'react';
import { Copy, Download, Check, FileCode, FileText } from 'lucide-react';
import { CODE_FILES } from '../data/initialData';
import { downloadTextFile } from '../utils/fileExport';

export const CodeInspectorView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<keyof typeof CODE_FILES>('scraper.py');
  const [copied, setCopied] = useState(false);

  const files = [
    { name: 'scraper.py', label: 'scraper.py', type: 'python', desc: 'Selenium + bs4 20-field extractor class' },
    { name: 'main.py', label: 'main.py', type: 'python', desc: 'Matrix orchestrator & deduplication engine' },
    { name: 'input_data.py', label: 'input_data.py', type: 'python', desc: 'SKU URLs & Pincodes list' },
    { name: 'requirements.txt', label: 'requirements.txt', type: 'text', desc: 'Pip package dependencies' }
  ];

  const currentCode = CODE_FILES[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCurrent = () => {
    downloadTextFile(selectedFile, currentCode, 'text/plain');
  };

  const handleDownloadAll = () => {
    // Sequentially download each file
    Object.entries(CODE_FILES).forEach(([filename, content]) => {
      downloadTextFile(filename, content, 'text/plain');
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Production Python Codebase Inspector
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Fully modular, production-ready source code written in Python 3 with Selenium, BeautifulSoup4, and Pandas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All Source Files</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-lg">
        {/* Tab Headers */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-2 gap-3">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {files.map((file) => {
              const isActive = selectedFile === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file.name as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownloadCurrent}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {selectedFile}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto max-h-[650px] font-mono text-xs text-slate-200 leading-relaxed">
          <pre className="selection:bg-blue-600/40">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
