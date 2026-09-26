/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, ExternalLink, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onOpenDocs?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [showHealthModal, setShowHealthModal] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Health check failed');
      })
      .then((data) => {
        if (data.status === 'ok') {
          setHealthStatus('healthy');
        } else {
          setHealthStatus('error');
        }
      })
      .catch(() => {
        setHealthStatus('error');
      });
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white hover:text-sky-400 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-sky-400"></span>
            API Architect
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#requirement-console"
              className="hover:text-white transition-colors"
            >
              Console
            </a>
            <a
              href="#pipeline-architecture"
              className="hover:text-white transition-colors"
            >
              Architecture
            </a>
            <a
              href="#domain-models"
              className="hover:text-white transition-colors"
            >
              Domain Models
            </a>
            <a
              href="#roadmap"
              className="hover:text-white transition-colors"
            >
              10-Phase Roadmap
            </a>
            <a
              href="/studio"
              className="text-sky-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1"
            >
              <span>Sanity Studio</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-300 font-mono">v3</span>
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHealthModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 rounded-md hover:border-slate-700 transition-colors cursor-pointer"
              title="Inspect system health check endpoint"
              type="button"
            >
              <Activity className="h-3.5 w-3.5 text-sky-400" />
              <span>/api/health</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  healthStatus === 'healthy'
                    ? 'bg-emerald-400'
                    : healthStatus === 'checking'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
            </button>

            <a
              href="https://www.sanity.io"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
            >
              <span>Sanity Challenge 2026</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Health Inspection Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">System Health Verification</h3>
              </div>
              <button
                onClick={() => setShowHealthModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60 font-mono text-xs">
                <span className="text-slate-400">Endpoint:</span>
                <span className="text-sky-300">GET /api/health</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60 font-mono text-xs">
                <span className="text-slate-400">Payload:</span>
                <span className="text-emerald-400">{`{ "status": "ok" }`}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60 text-xs">
                <span className="text-slate-400">Current Phase:</span>
                <span className="text-slate-200">Phase 1: Architecture & Foundation</span>
              </div>
              <div className="flex justify-between items-center py-1 text-xs">
                <span className="text-slate-400">Credential Leak Prevention:</span>
                <span className="text-emerald-400">Enforced (Zero Secrets in Response)</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHealthModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
