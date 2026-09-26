/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Code2, Database, Shield, Layers, FileJson } from 'lucide-react';

const DOMAIN_TABS = [
  {
    id: 'api-product',
    label: 'ApiProduct',
    file: 'lib/types/domain.ts',
    desc: 'Top-level API Product entity cataloging capabilities, endpoints, and networks.',
    snippet: `export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  status: 'generally_available' | 'beta' | 'deprecated';
  endpointIds: string[];
  supportedNetworkIds: string[];
  capabilityIds: string[];
  documentationUrl?: string;
}`,
  },
  {
    id: 'network',
    label: 'Network',
    file: 'lib/types/domain.ts',
    desc: 'Target chains, environments, RPC transport protocols, and block latency.',
    snippet: `export interface Network {
  id: string;
  name: string;
  slug: string;
  chainId?: number;
  environmentType: 'mainnet' | 'testnet' | 'l2' | 'sidechain' | 'cloud' | 'hybrid';
  status: 'active' | 'deprecated' | 'preview';
  supportedRpcProtocols: ('http' | 'ws' | 'grpc')[];
  blockTimeMs?: number;
  description?: string;
}`,
  },
  {
    id: 'capability',
    label: 'Capability',
    file: 'lib/types/domain.ts',
    desc: 'Atomic technical abilities (e.g. token monitoring, webhooks, gas estimation).',
    snippet: `export interface Capability {
  id: string;
  name: string;
  slug: string;
  category:
    | 'token_monitoring'
    | 'event_indexing'
    | 'webhook_delivery'
    | 'gas_estimation'
    | 'transaction_simulation'
    | 'data_streaming'
    | 'historical_archive';
  description: string;
  supportedNetworkIds: string[];
  requiresAuthentication: boolean;
  rateLimitTps?: number;
}`,
  },
  {
    id: 'compatibility-rule',
    label: 'CompatibilityRule',
    file: 'lib/types/domain.ts',
    desc: 'Explicit multi-variable constraints preventing hallucinated combinations.',
    snippet: `export type CompatibilityStatus =
  | 'compatible'
  | 'conditional'
  | 'incompatible'
  | 'unknown';

export interface CompatibilityRule {
  id: string;
  ruleCode: string;
  title: string;
  status: CompatibilityStatus;
  conditions: string[];
  explanation: string;
  requiredCapabilities: string[];
  restrictedNetworks?: string[];
}`,
  },
  {
    id: 'analysis-result',
    label: 'AnalysisResult',
    file: 'lib/types/analysis.ts',
    desc: 'Verified implementation blueprint with grounded Sanity evidence citations.',
    snippet: `export interface AnalysisResult {
  id: string;
  requirement: DeveloperRequirement;
  timestamp: string;
  summary: string;
  overallStatus: CompatibilityStatus;
  primarySolution?: CandidateSolution;
  alternativeSolutions: CandidateSolution[];
  identifiedConstraints: RequirementConstraint[];
  evidenceList: Evidence[];
  actionableSteps: {
    stepNumber: number;
    title: string;
    description: string;
    codeSnippet?: string;
  }[];
  unsupportedElements: string[];
  conditionalWarnings: string[];
}`,
  },
];

export const DomainModelViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState(DOMAIN_TABS[0].id);
  const currentTab = DOMAIN_TABS.find((t) => t.id === activeTab) || DOMAIN_TABS[0];

  return (
    <section id="domain-models" className="py-12 border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-mono text-sky-400 mb-2">Domain Foundation</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Core Domain & Reasoning Types
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Strict TypeScript contracts established in Phase 1 that map directly to future Sanity schemas in Phase 2.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          {/* Tabs bar */}
          <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/70 p-1.5 scrollbar-thin">
            {DOMAIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-sky-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Header Info */}
          <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-300">{currentTab.desc}</span>
            <span className="font-mono text-slate-400">{currentTab.file}</span>
          </div>

          {/* Code Viewer */}
          <div className="p-5 bg-slate-950/90 font-mono text-xs text-sky-300 leading-relaxed overflow-x-auto">
            <pre className="text-slate-200">
              <code>{currentTab.snippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
