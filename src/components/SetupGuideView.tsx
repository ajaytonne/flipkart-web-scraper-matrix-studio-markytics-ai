import React, { useState } from 'react';
import { Terminal, Check, Copy, Server, Shield, Layers, HelpCircle } from 'lucide-react';

export const SetupGuideView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded border border-slate-200">
        <h2 className="text-base font-semibold text-slate-900">
          Step-by-Step Setup & Execution Guide
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Detailed production installation guide for local workstations (macOS, Windows, Linux) and cloud deployment (AWS EC2, Docker, Cron).
        </p>
      </div>

      {/* Step 1 to 4 Cards */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-white p-5 rounded border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono">
              1
            </span>
            <h3 className="text-sm font-semibold text-slate-900">
              Create and Activate a Python Virtual Environment
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Isolates packages from your system Python. Requires Python 3.9 or higher.
          </p>

          <div className="bg-slate-900 rounded p-3 text-xs font-mono text-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-500"># macOS / Linux</span>
              <br />
              python3 -m venv venv && source venv/bin/activate
              <br />
              <br />
              <span className="text-slate-500"># Windows (cmd.exe or PowerShell)</span>
              <br />
              python -m venv venv && venv\Scripts\activate
            </div>
            <button
              onClick={() => copyCommand("python3 -m venv venv && source venv/bin/activate", 1)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            >
              {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-5 rounded border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono">
              2
            </span>
            <h3 className="text-sm font-semibold text-slate-900">
              Install Required Dependencies
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Installs Selenium, WebDriver Manager, BeautifulSoup4, and Pandas. Chrome drivers are automatically installed at runtime.
          </p>

          <div className="bg-slate-900 rounded p-3 text-xs font-mono text-slate-200 flex items-center justify-between">
            <code>pip install -r requirements.txt</code>
            <button
              onClick={() => copyCommand("pip install -r requirements.txt", 2)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            >
              {copiedIndex === 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-5 rounded border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono">
              3
            </span>
            <h3 className="text-sm font-semibold text-slate-900">
              Configure SKU URLs & Pincodes in <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">input_data.py</code>
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Add any number of product URLs and 6-digit Pincodes. The pipeline automatically calculates the Cartesian matrix product:
          </p>

          <div className="bg-slate-900 rounded p-3 text-xs font-mono text-slate-200">
            <pre>
{`SKU_URLS = [
    "https://www.flipkart.com/example/p/itm...?pid=FCWFC2G4YFHFGXZV",
    "https://www.flipkart.com/example/p/itm...?pid=MOIE7S28Z4ZGBH9M"
]

PINCODES = [
    "560001",  # Bengaluru
    "110001",  # New Delhi
    "400001"   # Mumbai
]`}
            </pre>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-5 rounded border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono">
              4
            </span>
            <h3 className="text-sm font-semibold text-slate-900">
              Execute the Matrix Scraper Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Launches headless Chrome, iterates through the SKU × Pincode combinations, saves checkpoints every 5 items, and logs errors into failure_log.csv:
          </p>

          <div className="bg-slate-900 rounded p-3 text-xs font-mono text-slate-200 flex items-center justify-between">
            <code>python main.py</code>
            <button
              onClick={() => copyCommand("python main.py", 4)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            >
              {copiedIndex === 4 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Production Deployment Architecture & Best Practices */}
      <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600" />
          <span>Production Cloud Deployment (Ubuntu / AWS EC2)</span>
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          When running headless on an Ubuntu 22.04 LTS server, ensure Google Chrome and the necessary virtual framebuffer dependencies are installed:
        </p>

        <div className="bg-slate-900 rounded p-3 text-xs font-mono text-slate-200">
          <pre>
{`# 1. Install Chrome on headless Ubuntu
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb

# 2. Setup Daily Cron Matrix Run (e.g. at 2:00 AM UTC)
crontab -e
0 2 * * * cd /opt/flipkart_scraper && /opt/flipkart_scraper/venv/bin/python main.py >> /var/log/flipkart_cron.log 2>&1`}
          </pre>
        </div>
      </div>

      {/* Anti-Bot & Out-of-stock Resilience */}
      <div className="bg-white p-5 rounded border border-slate-200 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Resilience, Deduplication, & Out-of-Stock Protections</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Deduplication</span>
            Composite key of <code className="text-blue-700 font-mono">(product_id, area_id, crawl_date)</code> prevents re-crawling identical items within the same calendar date.
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Out-of-Stock Handling</span>
            Captures availability as <code className="text-rose-700 font-mono">0</code> without throwing null pointer exceptions or corrupting numerical pricing columns.
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Stealth Fingerprinting</span>
            Configures <code className="text-slate-800 font-mono">--disable-blink-features=AutomationControlled</code> and authentic desktop User-Agents to prevent bot challenge screens.
          </div>
        </div>
      </div>
    </div>
  );
};
