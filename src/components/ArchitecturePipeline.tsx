/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MessageSquare,
  Server,
  Cpu,
  Layers,
  Database,
  CheckCircle,
  FileCode2,
  Lock,
} from 'lucide-react';

export const ArchitecturePipeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Developer Prompt',
      role: 'Client Interface',
      icon: MessageSquare,
      desc: 'Natural language technical requirements submitted via responsive developer console.',
      layer: 'Public Client',
    },
    {
      num: '02',
      title: 'Server Gateway',
      role: 'Security & Sanitization',
      icon: Server,
      desc: 'Express API orchestrator. Protects secrets and tokens behind the trusted boundary.',
      layer: 'Trusted Server',
    },
    {
      num: '03',
      title: 'AI Reasoning Layer',
      role: 'Objective Decomposition',
      icon: Cpu,
      desc: 'Extracts networks, capabilities, and delivery channels into structured query parameters.',
      layer: 'Grounded Agent',
    },
    {
      num: '04',
      title: 'Sanity Context MCP',
      role: 'Model Context Protocol',
      icon: Layers,
      desc: 'Translates requirements into semantic & graph queries directly against Sanity schemas.',
      layer: 'Protocol Bridge',
    },
    {
      num: '05',
      title: 'Sanity Content Lake',
      role: 'Structured Truth Source',
      icon: Database,
      desc: 'Verified endpoints, network constraints, compatibility rules, and code patterns.',
      layer: 'Content Lake',
    },
    {
      num: '06',
      title: 'Verified Plan',
      role: 'Evidence-Backed Output',
      icon: FileCode2,
      desc: 'Delivers actionable code, step-by-step instructions, and exact Sanity document citations.',
      layer: 'Developer Output',
    },
  ];

  return (
    <section id="pipeline-architecture" className="py-12 border-t border-slate-800/80 bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-mono text-sky-400 mb-2">System Architecture</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            End-to-End Grounded Verification Pipeline
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            How API Architect queries real content through Sanity Context MCP to produce verified plans without hallucination.
          </p>
        </div>

        {/* Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-sky-400">
                      Step {step.num}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {step.layer}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1.5 rounded-md bg-slate-800 text-sky-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Role:</span>
                  <span className="text-slate-300">{step.role}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Boundary Assurance */}
        <div className="mt-6 p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-white">Strict Security Boundary:</strong> Sanity organization tokens, MCP credentials, and AI keys remain server-side in Express runtime. Zero secrets are exposed to the browser.
            </span>
          </div>
          <a
            href="https://github.com"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'domain-models';
            }}
            className="text-sky-400 hover:text-sky-300 font-medium whitespace-nowrap"
          >
            Review Domain Types ↓
          </a>
        </div>
      </div>
    </section>
  );
};
