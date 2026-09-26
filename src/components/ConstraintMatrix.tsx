/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Constraint Matrix UI Component
 * Primary reasoning visualization displaying multi-variable compatibility evaluations.
 * Maps extracted requirements against candidates across the 4-state epistemic model:
 * COMPATIBLE, CONDITIONAL, INCOMPATIBLE, and UNKNOWN.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { ConstraintEvaluation, FourStateStatus } from '../../lib/agent/types.ts';

interface ConstraintMatrixProps {
  evaluations: ConstraintEvaluation[];
  selectedCandidateId?: string;
  onSelectCandidate?: (candidateId: string) => void;
}

export const ConstraintMatrix: React.FC<ConstraintMatrixProps> = ({
  evaluations,
  selectedCandidateId,
  onSelectCandidate,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Unique candidates present in matrix
  const candidateNames = Array.from(
    new Map(evaluations.map((e) => [e.candidateId, e.candidateName])).entries()
  );

  const filteredEvaluations = evaluations.filter((item) => {
    if (selectedCandidateId && item.candidateId !== selectedCandidateId) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: FourStateStatus) => {
    switch (status) {
      case 'COMPATIBLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Compatible</span>
          </span>
        );
      case 'CONDITIONAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-800/80">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Conditional</span>
          </span>
        );
      case 'INCOMPATIBLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-800/80">
            <XCircle className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
            <span>Incompatible</span>
          </span>
        );
      case 'UNKNOWN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-950/70 text-purple-300 border border-purple-800/80">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
            <span>Unknown</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/40">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Deterministic Constraint Matrix</span>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              {filteredEvaluations.length} evaluation{filteredEvaluations.length === 1 ? '' : 's'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Grounded verification across candidate APIs. Distinguishes Compatible, Conditional, Incompatible, and Unknown states.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {candidateNames.length > 1 && onSelectCandidate && (
            <select
              aria-label="Filter by Candidate API"
              value={selectedCandidateId || 'all'}
              onChange={(e) => onSelectCandidate(e.target.value === 'all' ? '' : e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-sky-500 outline-none"
            >
              <option value="all">All Candidates ({candidateNames.length})</option>
              {candidateNames.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          )}

          <div className="inline-flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <Filter className="w-3 h-3 text-slate-400 ml-2 mr-1" aria-hidden="true" />
            {(['all', 'COMPATIBLE', 'CONDITIONAL', 'INCOMPATIBLE', 'UNKNOWN'] as const).map(
              (filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setStatusFilter(filterKey)}
                  className={`px-2 py-1 rounded capitalize transition-colors ${
                    statusFilter === filterKey
                      ? 'bg-slate-900 text-sky-400 font-medium shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filterKey.toLowerCase()}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-medium">
              <th className="py-3 px-4 w-1/4">Requirement</th>
              <th className="py-3 px-4 w-1/5">Candidate API</th>
              <th className="py-3 px-4 w-32">Status</th>
              <th className="py-3 px-4">Grounded Evidence & Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredEvaluations.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  No evaluations match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredEvaluations.map((evalItem) => (
                <tr
                  key={evalItem.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-medium text-slate-200 align-top">
                    {evalItem.requirementLabel}
                  </td>
                  <td className="py-3 px-4 text-slate-300 align-top font-medium">
                    {evalItem.candidateName}
                  </td>
                  <td className="py-3 px-4 align-top whitespace-nowrap">
                    {getStatusBadge(evalItem.status)}
                  </td>
                  <td className="py-3 px-4 text-slate-300 leading-relaxed align-top">
                    <div>{evalItem.evidenceSnippet}</div>
                    {evalItem.condition && (
                      <div className="mt-1 text-xs text-amber-300 font-mono flex items-start gap-1">
                        <span className="font-semibold text-amber-400">Prerequisite:</span>
                        <span>{evalItem.condition}</span>
                      </div>
                    )}
                    {evalItem.conflictReason && (
                      <div className="mt-1 text-xs text-rose-300 font-mono flex items-start gap-1">
                        <span className="font-semibold text-rose-400">Limitation:</span>
                        <span>{evalItem.conflictReason}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
