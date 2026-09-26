/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Traceable Evidence Panel
 * Allows developers to inspect the exact Sanity Content Lake and Knowledge Base
 * records backing every conclusion and implementation recommendation.
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  BookOpen,
  Boxes,
  Network,
  Cpu,
  ShieldAlert,
  Code,
} from 'lucide-react';
import { EvidenceItem, EvidenceSourceType } from '../../lib/agent/types.ts';

interface EvidencePanelProps {
  evidenceList: EvidenceItem[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidenceList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredEvidence = evidenceList.filter((item) => {
    if (selectedType !== 'all' && item.sourceType !== selectedType) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.sourceTitle.toLowerCase().includes(term) ||
      item.claim.toLowerCase().includes(term) ||
      item.sourceId.toLowerCase().includes(term)
    );
  });

  const getSourceIcon = (type: EvidenceSourceType) => {
    switch (type) {
      case 'apiProduct':
        return <Boxes className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />;
      case 'apiEndpoint':
        return <Cpu className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />;
      case 'network':
        return <Network className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />;
      case 'compatibilityRule':
        return <FileText className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />;
      case 'constraint':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />;
      case 'knowledgeDocument':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />;
      case 'codeExample':
        return <Code className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header & Search */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Traceable Sanity Evidence</span>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              {filteredEvidence.length} source{filteredEvidence.length === 1 ? '' : 's'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Every statement, constraint, and endpoint recommendation is grounded in verifiable content lake documents.
          </p>
        </div>

        {/* Search Input & Type Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:ring-1 focus:ring-sky-500 outline-none w-44 sm:w-56"
            />
          </div>

          <select
            aria-label="Filter evidence by source type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-sky-500 outline-none"
          >
            <option value="all">All Sources</option>
            <option value="apiProduct">API Products</option>
            <option value="apiEndpoint">Endpoints</option>
            <option value="compatibilityRule">Compatibility Rules</option>
            <option value="constraint">Constraints</option>
            <option value="knowledgeDocument">Knowledge Base</option>
            <option value="codeExample">Code Examples</option>
          </select>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto">
        {filteredEvidence.length === 0 ? (
          <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
            No evidence records matched your search query.
          </div>
        ) : (
          filteredEvidence.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
                    {getSourceIcon(item.sourceType)}
                    <span className="font-semibold text-slate-200 truncate max-w-[220px]">
                      {item.sourceTitle}
                    </span>
                  </div>
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.sourceType}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-2">
                  {item.claim}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-2xs text-slate-400 font-mono">
                <span className="truncate max-w-[200px]" title={item.sourceId}>
                  ID: {item.sourceId}
                </span>
                {item.reference && (
                  <span className="text-sky-400 hover:underline flex items-center gap-0.5">
                    <span>{item.field || 'Reference'}</span>
                    <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
