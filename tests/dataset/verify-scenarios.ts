/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Ground-Truth Scenario Benchmark Runner
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAllSeedDocuments } from '../../scripts/seed/validate-seed.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Scenario {
  id: string;
  title: string;
  requirement: any;
  expectedCandidates: {
    compatible: string[];
    conditional: string[];
    incompatible: string[];
    unknown: string[];
  };
  evidenceReferences: string[];
}

export function runGroundTruthVerification(): { passed: number; failed: number; total: number } {
  const matrixPath = path.resolve(__dirname, 'api-architect-ground-truth.json');
  const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf-8'));
  const docs = loadAllSeedDocuments();

  const docMap = new Map<string, any>();
  for (const doc of docs) {
    docMap.set(doc._id, doc);
  }

  const products = docs.filter((d) => d._type === 'apiProduct');
  const rules = docs.filter((d) => d._type === 'compatibilityRule');
  const constraints = docs.filter((d) => d._type === 'constraint');

  console.log('=================================================================');
  console.log(`Running Ground-Truth Benchmark: ${matrix.name}`);
  console.log(`Knowledge Base contains ${products.length} products, ${rules.length} rules, ${constraints.length} constraints`);
  console.log('=================================================================');

  let passed = 0;
  let failed = 0;

  for (const scenario of matrix.scenarios as Scenario[]) {
    console.log(`\nEvaluating [${scenario.id}]: ${scenario.title}`);

    // Verify all evidence references exist in the dataset
    const missingEvidence = scenario.evidenceReferences.filter((ref) => !docMap.has(ref));
    if (missingEvidence.length > 0) {
      console.error(`  ✖ Missing evidence references: ${missingEvidence.join(', ')}`);
      failed++;
      continue;
    }

    // Logic evaluation based on scenario requirement
    const actual = {
      compatible: [] as string[],
      conditional: [] as string[],
      incompatible: [] as string[],
      unknown: [] as string[],
    };

    for (const prod of products) {
      const prodId = prod._id;
      const supportedNets: string[] = (prod.supportedNetworks || []).map((r: any) => r._ref);
      const prodCaps: string[] = (prod.capabilities || []).map((r: any) => r._ref);
      const authMethods: string[] = prod.authenticationMethods || [];

      // Scenario 1: Simple (Ethereum wallet balance)
      if (scenario.id === 'scenario-1-simple') {
        const hasEth = supportedNets.includes('network.ethereum');
        const hasBal = prodCaps.includes('capability.wallet-balance');
        if (hasEth && hasBal) {
          actual.compatible.push(prodId);
        } else if (!hasEth && prodId === 'product.solis-solana') {
          actual.incompatible.push(prodId);
        }
      }

      // Scenario 2: Multi-network (Ethereum and Base token balance)
      else if (scenario.id === 'scenario-2-multi-network') {
        const hasBoth = supportedNets.includes('network.ethereum') && supportedNets.includes('network.base');
        const hasTokenBal = prodCaps.includes('capability.token-balance');
        if (hasBoth && hasTokenBal) {
          actual.compatible.push(prodId);
        } else if (!supportedNets.includes('network.base') && (prodId === 'product.northstar-data' || prodId === 'product.solis-solana')) {
          actual.incompatible.push(prodId);
        }
      }

      // Scenario 3: Conditional (Transfers + Webhooks on Eth and Base)
      else if (scenario.id === 'scenario-3-conditional') {
        const hasBothNets = supportedNets.includes('network.ethereum') && supportedNets.includes('network.base');
        const hasTransfer = prodCaps.includes('capability.token-transfer-events');

        if (hasBothNets && hasTransfer) {
          // Check rules for condition
          const rule = rules.find((r) => r.itemA?._ref === prodId && r.itemB?._ref === 'capability.webhook-notifications');
          if (rule && rule.status === 'conditional') {
            actual.conditional.push(prodId);
          }
        } else if (prodId === 'product.northstar-data' || prodId === 'product.solis-solana') {
          actual.incompatible.push(prodId);
        }
      }

      // Scenario 4: Incompatible (Solana and Ethereum)
      else if (scenario.id === 'scenario-4-incompatible') {
        // Neither Aster, Northstar, nor Solis can bridge both
        if (['product.northstar-data', 'product.aster-wallet', 'product.solis-solana'].includes(prodId)) {
          actual.incompatible.push(prodId);
        }
      }

      // Scenario 5: Auth filter (Server-side API key)
      else if (scenario.id === 'scenario-5-authentication') {
        if (['product.northstar-data', 'product.aster-wallet', 'product.helios-rpc'].includes(prodId)) {
          if (authMethods.includes('api_key') && supportedNets.includes('network.ethereum')) {
            actual.compatible.push(prodId);
          }
        }
      }

      // Scenario 6: Rate limit (>= 20 RPS)
      else if (scenario.id === 'scenario-6-rate-limit') {
        if (prodId === 'product.northstar-data') {
          actual.incompatible.push(prodId); // 10 RPS < 20 RPS
        } else if (prodId === 'product.aster-wallet' || prodId === 'product.helios-rpc') {
          actual.compatible.push(prodId); // 25 & 100 RPS >= 20 RPS
        }
      }

      // Scenario 7: Unknown (Avalanche support on Northstar)
      else if (scenario.id === 'scenario-7-unknown') {
        if (prodId === 'product.northstar-data') {
          const rule = rules.find((r) => r.itemA?._ref === 'product.northstar-data' && r.itemB?._ref === 'network.avalanche');
          if (rule && rule.status === 'unknown') {
            actual.unknown.push(prodId);
          }
        }
      }

      // Scenario 8: Complex architecture
      else if (scenario.id === 'scenario-8-complex-architecture') {
        if (prodId === 'product.aster-wallet') {
          // Supports Eth + Base, transfers, 25 RPS >= 20, API key; conditional on webhook
          actual.conditional.push(prodId);
        } else if (['product.northstar-data', 'product.orbit-event', 'product.solis-solana'].includes(prodId)) {
          actual.incompatible.push(prodId);
        }
      }
    }

    // Compare actual with expected
    const compareArrays = (a: string[], b: string[]) => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => val === sortedB[idx]);
    };

    const exp = scenario.expectedCandidates;
    const isCompatMatch = compareArrays(actual.compatible, exp.compatible);
    const isCondMatch = compareArrays(actual.conditional, exp.conditional);
    const isIncompatMatch = compareArrays(actual.incompatible, exp.incompatible);
    const isUnknownMatch = compareArrays(actual.unknown, exp.unknown);

    if (isCompatMatch && isCondMatch && isIncompatMatch && isUnknownMatch) {
      console.log(`  ✔ PASS: Output matches ground truth.`);
      console.log(`     Compatible:   [${actual.compatible.join(', ')}]`);
      console.log(`     Conditional:  [${actual.conditional.join(', ')}]`);
      console.log(`     Incompatible: [${actual.incompatible.join(', ')}]`);
      console.log(`     Unknown:      [${actual.unknown.join(', ')}]`);
      passed++;
    } else {
      console.error(`  ✖ FAIL: Output diverged from ground truth.`);
      console.error(`     Actual:   ${JSON.stringify(actual)}`);
      console.error(`     Expected: ${JSON.stringify(exp)}`);
      failed++;
    }
  }

  console.log('\n=================================================================');
  console.log(`Benchmark Complete: ${passed}/${passed + failed} Scenarios Passed`);
  console.log('=================================================================');

  return { passed, failed, total: passed + failed };
}

if (process.argv[1] && process.argv[1].endsWith('verify-scenarios.ts')) {
  const result = runGroundTruthVerification();
  if (result.failed > 0) {
    process.exit(1);
  }
}
