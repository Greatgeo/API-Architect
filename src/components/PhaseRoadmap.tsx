/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const PHASES = [
  {
    phase: 'Phase 1',
    name: 'Architecture & Project Foundation',
    status: 'completed',
    deliverables: [
      'Core domain models & strict TypeScript types',
      'End-to-end architecture & security boundary spec',
      'Planned Sanity content schema blueprint',
      'Operational GET /api/health endpoint',
      'Professional developer UI console with honest notice',
    ],
  },
  {
    phase: 'Phase 2',
    name: 'Sanity Studio & Schema',
    status: 'completed',
    deliverables: [
      'Initialized Sanity Studio v3 (sanity 6.16.0)',
      'Defined 9 document schemas (apiProduct, apiEndpoint, network, capability, etc.)',
      'Configured 9 reusable objects (limitation, parameter, rateLimit, conflict, etc.)',
      'Verified relational references and validated schemas with 0 errors',
      'Compiled Studio bundle served under /studio route',
    ],
  },
  {
    phase: 'Phase 3',
    name: 'Demo Knowledge Base & Seed Data',
    status: 'completed',
    deliverables: [
      '159 structured records across 10 distinct document types',
      '11 controlled demo API products, 31 endpoints, 10 networks, 18 capabilities',
      '22 multi-variable compatibility rules & 18 operational constraints',
      '16 substantial architectural guides & 12 verified code examples',
      '100% verified graph integrity (557 references) & 8/8 ground-truth benchmarks passed',
    ],
  },
  {
    phase: 'Phase 4',
    name: 'Sanity Context MCP & Grounded Agent',
    status: 'completed',
    deliverables: [
      'Server-side Sanity Context MCP client abstraction & health check',
      'Dual-mode retrieval: live MCP + validated local dataset adapter',
      'Deterministic 4-state constraint evaluation (Compatible/Conditional/Incompatible/Unknown)',
      'Traceable evidence collection linking conclusions to Sanity documents',
      'Interactive Constraint Matrix UI & Verified Implementation Planner',
      '8/8 ground-truth benchmark scenarios passed in end-to-end agent runner',
    ],
  },
  {
    phase: 'Phase 5',
    name: 'Full Reasoning Polishing & Demo Package',
    status: 'upcoming',
    deliverables: [
      'Autonomous objective decomposition',
      'Constraint checking & conflict resolution engine',
      'Anti-hallucination grounded citation generator',
    ],
  },
  {
    phase: 'Phase 6',
    name: 'Frontend & Evidence Visualizer',
    status: 'upcoming',
    deliverables: [
      'Real-time streaming agent steps UI',
      'Interactive evidence drawer with Sanity document links',
      'Actionable step-by-step code generator',
    ],
  },
  {
    phase: 'Phase 7',
    name: 'Integration & End-to-End Wiring',
    status: 'upcoming',
    deliverables: [
      'Full-stack client-to-agent pipeline orchestration',
      'Persistent caching and rate-limiting safeguards',
    ],
  },
  {
    phase: 'Phase 8',
    name: 'Testing & Grounded Verification',
    status: 'upcoming',
    deliverables: [
      'Automated compatibility test suite',
      'Hallucination-resistance benchmarks',
    ],
  },
  {
    phase: 'Phase 9',
    name: 'Production Deployment',
    status: 'upcoming',
    deliverables: [
      'Cloud containerization & CDN caching',
      'Production Sanity Content Lake synchronization',
    ],
  },
  {
    phase: 'Phase 10',
    name: 'Competition Submission',
    status: 'upcoming',
    deliverables: [
      'Sanity Challenge 2026 demo video & evaluation package',
      'Open-source repository publication',
    ],
  },
];

export const PhaseRoadmap: React.FC = () => {
  return (
    <section id="roadmap" className="py-12 border-t border-slate-800/80 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-mono text-sky-400 mb-2">Development Plan</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            10-Phase Project Roadmap
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Structured development sequence for the Sanity Challenge 2026 (Path One).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PHASES.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isCurrentNext = idx === 4;

            return (
              <div
                key={item.phase}
                className={`p-5 rounded-lg border flex flex-col justify-between transition-colors ${
                  isCompleted
                    ? 'bg-slate-900 border-sky-800/60'
                    : isCurrentNext
                    ? 'bg-slate-900/90 border-slate-700'
                    : 'bg-slate-950 border-slate-800/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {item.phase}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : isCurrentNext ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Next Phase</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Circle className="h-3 w-3" />
                        <span>Scheduled</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white mb-3">
                    {item.name}
                  </h3>

                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {item.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-slate-400">›</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                  {isCompleted
                    ? 'Accepted & Verified'
                    : isCurrentNext
                    ? 'Ready to Begin'
                    : 'Pending Prerequisites'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
