/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Requirement Console & Analysis Center
 * Live developer workbench connecting natural-language architectural requirements
 * to server-side Sanity Context MCP retrieval, deterministic constraint evaluation,
 * and verified implementation blueprints.
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Terminal,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Database,
  Code2,
  Layers,
  FileCheck2,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { AgentAnalysisOutput, FourStateStatus } from '../../lib/agent/types.ts';
import { ConstraintMatrix } from './ConstraintMatrix.tsx';
import { EvidencePanel } from './EvidencePanel.tsx';

const BENCHMARK_PRESETS = [
  {
    label: 'Ethereum & Base + Transfers + Webhooks (>=20 RPS)',
    prompt:
      'I need an API for a React wallet dashboard that supports Ethereum and Base, provides token transfer events with webhook notifications, uses server-side API keys, and handles at least 20 requests per second.',
    tags: ['Ethereum', 'Base L2', 'Webhooks', '20 RPS', 'API Key'],
  },
  {
    label: 'Simple Ethereum Native Balance',
    prompt: 'I need an API to check native Ethereum wallet balances with server-side API keys.',
    tags: ['Ethereum', 'Balances', 'API Key'],
  },
  {
    label: 'Cross-Ecosystem Incompatibility (Solana + Ethereum)',
    prompt:
      'I need a single unified API endpoint that queries both Solana and Ethereum balances in the same EVM format.',
    tags: ['Solana', 'Ethereum', 'Incompatibility Test'],
  },
  {
    label: 'Unknown Evidence (Avalanche on Northstar)',
    prompt: 'Does Northstar Data API support Avalanche C-Chain?',
    tags: ['Avalanche', 'Northstar', 'Epistemic Unknown Test'],
  },
];

export const RequirementConsole: React.FC = () => {
  const [requirementText, setRequirementText] = useState(
    'I need an API for a React wallet dashboard that supports Ethereum and Base, provides token transfer events with webhook notifications, uses server-side API keys, and handles at least 20 requests per second.'
  );
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AgentAnalysisOutput | null>(null);
  const [mcpHealth, setMcpHealth] = useState<any>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [selectedCandidateFilter, setSelectedCandidateFilter] = useState<string>('');

  // Fetch MCP status on mount
  useEffect(() => {
    fetch('/api/mcp/health')
      .then((res) => res.json())
      .then((data) => setMcpHealth(data))
      .catch((err) => console.warn('MCP health check failed', err));
  }, []);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!requirementText.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    // Staged progression animation
    setProgressStep('Extracting structured requirements & detecting constraints...');
    const stepTimer1 = setTimeout(() => {
      setProgressStep('Querying Sanity Content Lake & Knowledge Base via MCP...');
    }, 300);

    const stepTimer2 = setTimeout(() => {
      setProgressStep('Evaluating multi-variable compatibility & rate limits...');
    }, 700);

    const stepTimer3 = setTimeout(() => {
      setProgressStep('Assembling evidence-backed implementation plan...');
    }, 1100);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: requirementText }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Analysis failed with HTTP ${response.status}`);
      }

      const json = await response.json();
      setAnalysisResult(json.result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setLoading(false);
      setProgressStep('');
    }
  };

  const handleSelectPreset = (prompt: string) => {
    setRequirementText(prompt);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const getOverallStatusBadge = (status: FourStateStatus) => {
    switch (status) {
      case 'COMPATIBLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Fully Compatible</span>
          </span>
        );
      case 'CONDITIONAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/90 text-amber-300 border border-amber-700">
            <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>Conditional Support</span>
          </span>
        );
      case 'INCOMPATIBLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/90 text-rose-300 border border-rose-700">
            <XCircle className="w-4 h-4 text-rose-400" aria-hidden="true" />
            <span>Incompatible Constraints</span>
          </span>
        );
      case 'UNKNOWN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/90 text-purple-300 border border-purple-700">
            <HelpCircle className="w-4 h-4 text-purple-400" aria-hidden="true" />
            <span>Insufficient Evidence (Unknown)</span>
          </span>
        );
    }
  };

  return (
    <section id="requirement-console" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Main Headline & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 mb-3 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/80">
            <span>Sanity Challenge 2026</span>
            <span aria-hidden="true">·</span>
            <span>Path One: Ship an Agent That Queries Real Content</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            API Architect
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed text-balance">
            Turn a developer requirement into a verified API implementation plan.
          </p>

          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
            Grounded in structured content and multi-variable compatibility rules from Sanity Content Lake — eliminating hallucinated endpoints, unsupported parameters, and broken integrations.
          </p>

          {/* MCP Health & Data Source Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <Database className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span>Data Source:</span>
              <span className="text-sky-400 font-medium">
                {mcpHealth?.mode === 'LIVE_MCP'
                  ? 'LIVE_MCP (Sanity Context)'
                  : 'LOCAL_FALLBACK (Controlled Sanity Dataset)'}
              </span>
            </div>
          </div>
        </div>

        {/* Input Console Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl overflow-hidden mb-10">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/60 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="h-4 w-4 text-sky-400" aria-hidden="true" />
              <span className="font-mono text-slate-300">developer-prompt.input</span>
            </div>
            <div className="flex items-center gap-2 text-2xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Grounded Agent Engine Ready</span>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="p-5 sm:p-6 space-y-4">
            <div>
              <label htmlFor="prompt-input" className="block text-xs font-medium text-slate-300 mb-2">
                What are you trying to build?
              </label>
              <textarea
                id="prompt-input"
                rows={4}
                value={requirementText}
                onChange={(e) => setRequirementText(e.target.value)}
                placeholder="Describe your blockchain API requirements, networks, capabilities, authentication, and throughput constraints..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-sans leading-relaxed"
              />
            </div>

            {/* Presets */}
            <div>
              <div className="text-xs font-medium text-slate-400 mb-2">
                Try benchmark ground-truth scenarios:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BENCHMARK_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.prompt)}
                    className="text-left p-2.5 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800 hover:border-slate-700 transition-colors text-xs text-slate-300 group"
                  >
                    <div className="font-medium text-sky-400 group-hover:text-sky-300 flex items-center justify-between mb-1">
                      <span>{preset.label}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preset.tags.map((t, ti) => (
                        <span
                          key={ti}
                          className="px-1.5 py-0.5 rounded bg-slate-900 text-2xs text-slate-400 border border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button & Progress Indicator */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Zero Hallucinations: No evidence → no confident claim</span>
              </div>

              <button
                type="submit"
                disabled={loading || !requirementText.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium px-6 py-2.5 text-sm transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Analyzing Constraints...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-slate-950" />
                    <span>Analyze Requirement</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Loading State Banner */}
          {loading && (
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-3 text-xs text-sky-400">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="font-mono">{progressStep}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 border-t border-rose-900/60 bg-rose-950/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Live Analysis Output */}
        {analysisResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Executive Summary Card */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Verification Result</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {analysisResult.analysisId}
                  </span>
                </div>
                {getOverallStatusBadge(analysisResult.overallStatus)}
              </div>

              <h2 className="text-xl font-bold text-white mb-2">
                Executive Architectural Assessment
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-sans mb-4">
                {analysisResult.executiveSummary}
              </p>

              {/* Requirement Summary Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">Extracted Requirements:</span>
                {analysisResult.requirement.networks.map((n) => (
                  <span
                    key={n.id}
                    className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono text-2xs"
                  >
                    Network: {n.name}
                  </span>
                ))}
                {analysisResult.requirement.capabilities.map((c) => (
                  <span
                    key={c.id}
                    className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-2xs"
                  >
                    Cap: {c.name}
                  </span>
                ))}
                {analysisResult.requirement.authentication.map((a) => (
                  <span
                    key={a.method}
                    className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono text-2xs"
                  >
                    Auth: {a.label}
                  </span>
                ))}
                {analysisResult.requirement.minimumRateLimit && (
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-2xs">
                    Min RPS: &gt;={analysisResult.requirement.minimumRateLimit}
                  </span>
                )}
              </div>
            </div>

            {/* Candidate Solution Cards */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" />
                <span>Candidate Solutions Comparison</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.candidates.map((cand) => (
                  <div
                    key={cand.candidateId}
                    className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${
                      cand.overallStatus === 'COMPATIBLE'
                        ? 'bg-slate-900 border-emerald-800/80 shadow-emerald-950/20'
                        : cand.overallStatus === 'CONDITIONAL'
                        ? 'bg-slate-900 border-amber-800/80 shadow-amber-950/20'
                        : cand.overallStatus === 'UNKNOWN'
                        ? 'bg-slate-900 border-purple-800/80 shadow-purple-950/20'
                        : 'bg-slate-950/80 border-slate-800/80 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="text-base font-semibold text-white">
                            {cand.candidateName}
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">
                            {cand.provider}
                          </span>
                        </div>
                        {getOverallStatusBadge(cand.overallStatus)}
                      </div>

                      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                        {cand.justification}
                      </p>

                      <div className="space-y-1.5 text-2xs font-mono text-slate-400">
                        <div>
                          <span className="text-slate-500">Documented Throughput:</span>{' '}
                          <span className="text-slate-200">{cand.throughputRps} RPS</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Supported Networks:</span>{' '}
                          <span className="text-slate-200">{cand.supportedNetworks.length}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Auth Methods:</span>{' '}
                          <span className="text-slate-200">{cand.authMethods.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {cand.conditions.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-amber-300">
                        <span className="font-semibold text-amber-400">Prerequisites:</span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          {cand.conditions.map((cond, ci) => (
                            <li key={ci} className="text-2xs font-mono">
                              {cond}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* The Constraint Matrix UI */}
            <ConstraintMatrix
              evaluations={analysisResult.constraintMatrix}
              selectedCandidateId={selectedCandidateFilter}
              onSelectCandidate={setSelectedCandidateFilter}
            />

            {/* Verified Implementation Plan */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-sky-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Verified Implementation Plan
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Grounded Blueprint</span>
              </div>

              {/* Implementation Steps Sequence */}
              <div>
                <h4 className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider mb-3">
                  Step-by-Step Execution Sequence
                </h4>
                <div className="space-y-3">
                  {analysisResult.implementationPlan.implementationSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-800 text-xs font-mono flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">{step.title}</div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Endpoints Contract */}
              {analysisResult.implementationPlan.recommendedEndpoints.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider mb-3">
                    Recommended Endpoint Contracts
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Method</th>
                          <th className="py-2.5 px-3">Path</th>
                          <th className="py-2.5 px-3">Rate Limit</th>
                          <th className="py-2.5 px-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-2xs">
                        {analysisResult.implementationPlan.recommendedEndpoints.map((ep) => (
                          <tr key={ep.id} className="hover:bg-slate-800/30">
                            <td className="py-2 px-3 text-sky-400 font-bold">{ep.method}</td>
                            <td className="py-2 px-3 text-slate-200">{ep.path}</td>
                            <td className="py-2 px-3 text-slate-400">{ep.rateLimit || 'Standard'}</td>
                            <td className="py-2 px-3 text-slate-300 font-sans">{ep.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Verified Code Examples */}
              {analysisResult.implementationPlan.codeSnippets.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-medium text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" />
                    <span>Verified Code Examples (Grounded in Dataset)</span>
                  </h4>
                  <div className="space-y-4">
                    {analysisResult.implementationPlan.codeSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="rounded-lg bg-slate-950 border border-slate-800 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 text-xs">
                          <span className="font-mono text-slate-300">{snippet.title}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(snippet.id, snippet.code)}
                            className="inline-flex items-center gap-1 text-2xs text-slate-400 hover:text-white transition-colors"
                          >
                            {copiedCodeId === snippet.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risks & Limitations */}
              {analysisResult.implementationPlan.risksAndLimitations.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-medium text-rose-400 uppercase tracking-wider mb-2">
                    Operational Constraints & Edge Cases
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {analysisResult.implementationPlan.risksAndLimitations.map((risk, ri) => (
                      <div
                        key={ri}
                        className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-300"
                      >
                        <div className="font-semibold text-rose-200">{risk.title}</div>
                        <div className="text-2xs text-rose-300/80 mt-1">{risk.mitigation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unresolved Unknowns */}
              {analysisResult.implementationPlan.unresolvedUnknowns.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-medium text-purple-400 uppercase tracking-wider mb-2">
                    Unresolved Questions & Knowledge Gaps
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-purple-300 font-sans">
                    {analysisResult.implementationPlan.unresolvedUnknowns.map((unk, ui) => (
                      <li key={ui}>{unk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Traceable Evidence Panel */}
            <EvidencePanel evidenceList={analysisResult.evidenceList} />
          </div>
        )}
      </div>
    </section>
  );
};
