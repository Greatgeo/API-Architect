/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">API Architect</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Sanity Challenge 2026</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Path One: Ship an Agent That Queries Real Content</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="#requirement-console"
            className="hover:text-slate-200 transition-colors"
          >
            Console
          </a>
          <a
            href="#pipeline-architecture"
            className="hover:text-slate-200 transition-colors"
          >
            Architecture
          </a>
          <a
            href="#domain-models"
            className="hover:text-slate-200 transition-colors"
          >
            Domain Models
          </a>
          <a
            href="#roadmap"
            className="hover:text-slate-200 transition-colors"
          >
            Roadmap
          </a>
        </div>
      </div>
    </footer>
  );
};
