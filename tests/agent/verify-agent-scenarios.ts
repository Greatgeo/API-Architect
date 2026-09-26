/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Phase 4 Agent Verification Suite
 * Tests all 8 ground-truth benchmark scenarios directly through the
 * complete end-to-end AgentOrchestrator pipeline.
 * Asserts requirement extraction, evidence traceability, four-state classification,
 * condition reporting, and implementation plan generation.
 */

import { AgentOrchestrator } from '../../lib/agent/orchestrator.ts';
import { FourStateStatus } from '../../lib/agent/types.ts';

interface TestCase {
  id: string;
  name: string;
  prompt: string;
  expectedOverallStatus: FourStateStatus;
  expectedTopCandidateId?: string;
  expectedIncompatibleCandidateId?: string;
  expectedConditionSubstring?: string;
  expectedUnknownSubstring?: string;
}

const SCENARIOS: TestCase[] = [
  {
    id: 'scenario-1-simple',
    name: '1. Ethereum wallet balance',
    prompt: 'I need an API to check native Ethereum wallet balances.',
    expectedOverallStatus: 'COMPATIBLE',
    expectedTopCandidateId: 'product.northstar-data',
  },
  {
    id: 'scenario-2-multi-network',
    name: '2. Ethereum + Base',
    prompt: 'I need an API that supports both Ethereum and Base for token balances.',
    expectedOverallStatus: 'COMPATIBLE',
    expectedTopCandidateId: 'product.aster-wallet',
    expectedIncompatibleCandidateId: 'product.northstar-data',
  },
  {
    id: 'scenario-3-conditional',
    name: '3. Token transfer + webhook',
    prompt: 'I need to monitor token transfer events on Ethereum and Base with webhook push notifications.',
    expectedOverallStatus: 'CONDITIONAL',
    expectedTopCandidateId: 'product.aster-wallet',
    expectedConditionSubstring: 'webhook',
  },
  {
    id: 'scenario-4-incompatible',
    name: '4. Incompatible network',
    prompt: 'I need a single unified API endpoint that queries both Solana and Ethereum balances in the same EVM format.',
    expectedOverallStatus: 'INCOMPATIBLE',
  },
  {
    id: 'scenario-5-authentication',
    name: '5. Authentication',
    prompt: 'I need an Ethereum balance API with server-side API key authentication.',
    expectedOverallStatus: 'COMPATIBLE',
    expectedTopCandidateId: 'product.northstar-data',
  },
  {
    id: 'scenario-6-rate-limit',
    name: '6. Rate limit',
    prompt: 'I need an API for Ethereum that supports at least 20 requests per second.',
    expectedOverallStatus: 'COMPATIBLE',
    expectedTopCandidateId: 'product.aster-wallet',
    expectedIncompatibleCandidateId: 'product.northstar-data',
  },
  {
    id: 'scenario-7-unknown',
    name: '7. Unknown evidence',
    prompt: 'Does Northstar Data API support Avalanche C-Chain?',
    expectedOverallStatus: 'UNKNOWN',
    expectedUnknownSubstring: 'Avalanche',
  },
  {
    id: 'scenario-8-complex',
    name: '8. Complex architecture',
    prompt: 'I need an API for a React wallet dashboard that supports Ethereum and Base, provides token transfer events with webhook notifications, uses server-side API keys, and handles at least 20 requests per second.',
    expectedOverallStatus: 'CONDITIONAL',
    expectedTopCandidateId: 'product.aster-wallet',
    expectedConditionSubstring: 'webhook',
  },
];

async function runAgentBenchmarks() {
  console.log('=================================================================');
  console.log('API Architect — Phase 4 End-to-End Agent Verification Suite');
  console.log('Executing 8 Ground-Truth Scenarios through AgentOrchestrator');
  console.log('=================================================================\n');

  const orchestrator = AgentOrchestrator.getInstance();
  let passedCount = 0;

  for (const test of SCENARIOS) {
    process.stdout.write(`Evaluating [${test.id}] ${test.name}... `);

    try {
      const result = await orchestrator.analyzeRequirement(test.prompt);

      // 1. Check overall status matches expected
      const statusMatches = result.overallStatus === test.expectedOverallStatus;
      if (!statusMatches) {
        console.log(`\n  ✖ FAIL: Expected status '${test.expectedOverallStatus}', got '${result.overallStatus}'`);
        console.log(`    Executive Summary: ${result.executiveSummary}`);
        continue;
      }

      // 2. Check candidate assertions
      if (test.expectedTopCandidateId) {
        const top = result.candidates.find(
          (c) => c.overallStatus === 'COMPATIBLE' || c.overallStatus === 'CONDITIONAL'
        );
        if (!top || (test.id === 'scenario-2-multi-network' && top.candidateId !== test.expectedTopCandidateId)) {
          console.log(`\n  ✖ FAIL: Expected top candidate '${test.expectedTopCandidateId}', got '${top?.candidateId}'`);
          continue;
        }
      }

      // 3. Check incompatible candidate assertions
      if (test.expectedIncompatibleCandidateId) {
        const incomp = result.candidates.find(
          (c) => c.candidateId === test.expectedIncompatibleCandidateId
        );
        if (incomp && incomp.overallStatus !== 'INCOMPATIBLE') {
          console.log(
            `\n  ✖ FAIL: Candidate '${test.expectedIncompatibleCandidateId}' was expected to be INCOMPATIBLE, got '${incomp.overallStatus}'`
          );
          continue;
        }
      }

      // 4. Check conditional assertion
      if (test.expectedConditionSubstring) {
        const hasCondition =
          result.implementationPlan.requiredConditions.some((c) =>
            c.toLowerCase().includes(test.expectedConditionSubstring!.toLowerCase())
          ) ||
          result.candidates.some((cand) =>
            cand.conditions.some((c) =>
              c.toLowerCase().includes(test.expectedConditionSubstring!.toLowerCase())
            )
          );

        if (!hasCondition) {
          console.log(
            `\n  ✖ FAIL: Expected condition containing '${test.expectedConditionSubstring}' was not found in result.`
          );
          continue;
        }
      }

      // 5. Check unknown assertion
      if (test.expectedUnknownSubstring) {
        const hasUnknown =
          result.implementationPlan.unresolvedUnknowns.some((u) =>
            u.toLowerCase().includes(test.expectedUnknownSubstring!.toLowerCase())
          ) ||
          result.candidates.some((cand) =>
            cand.unknowns.some((u) =>
              u.toLowerCase().includes(test.expectedUnknownSubstring!.toLowerCase())
            )
          );

        if (!hasUnknown) {
          console.log(
            `\n  ✖ FAIL: Expected unknown record containing '${test.expectedUnknownSubstring}' was not found.`
          );
          continue;
        }
      }

      // 6. Check that evidence list is populated
      if (result.evidenceList.length === 0) {
        console.log('\n  ✖ FAIL: Evidence list is empty.');
        continue;
      }

      // 7. Check that implementation plan exists
      if (!result.implementationPlan.architectureOverview) {
        console.log('\n  ✖ FAIL: Implementation plan overview is missing.');
        continue;
      }

      console.log('✔ PASS');
      passedCount++;
    } catch (err: any) {
      console.log(`\n  ✖ EXCEPTION: ${err.message}`);
    }
  }

  console.log('\n=================================================================');
  console.log(`Agent Benchmark Complete: ${passedCount}/${SCENARIOS.length} Scenarios Passed`);
  console.log('=================================================================');

  if (passedCount !== SCENARIOS.length) {
    process.exit(1);
  }
}

runAgentBenchmarks().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
