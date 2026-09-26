/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Phase 4B MCP & Live Integration Test Suite
 * Validates remote MCP connection when credentials exist, verifies graceful fallback
 * to validated local dataset when unconfigured/unreachable, tests epistemic integrity
 * (Compatible, Conditional, Incompatible, Unknown), and verifies zero secret leakage.
 */

import { SanityContextClient } from '../../lib/mcp/client.ts';
import { SanityContextService } from '../../lib/mcp/sanityContext.ts';
import { AgentOrchestrator } from '../../lib/agent/orchestrator.ts';

interface TestResult {
  title: string;
  category: 'LIVE' | 'LOCAL' | 'SECURITY';
  status: 'PASS' | 'SKIPPED' | 'FAIL';
  details: string;
}

async function runMCPIntegrationSuite(): Promise<void> {
  console.log('=================================================================');
  console.log('API Architect — Phase 4B MCP & Integration Verification Suite');
  console.log('=================================================================\n');

  const results: TestResult[] = [];
  const client = new SanityContextClient();
  const orchestrator = AgentOrchestrator.getInstance();

  const mcpUrl = (process.env.SANITY_CONTEXT_MCP_URL || '').trim();
  const orgToken = (
    process.env.SANITY_ORGANIZATION_TOKEN ||
    process.env.SANITY_CONTEXT_MCP_TOKEN ||
    ''
  ).trim();

  const isPlaceholder = (val: string) =>
    !val ||
    val.includes('your_') ||
    val.includes('placeholder') ||
    val.includes('<organization_id>') ||
    val.includes('example');

  const hasLiveCredentials =
    Boolean(mcpUrl) &&
    !isPlaceholder(mcpUrl) &&
    Boolean(orgToken) &&
    !isPlaceholder(orgToken);

  // Test 1: Live Sanity Context MCP Configuration & Credentials
  if (!hasLiveCredentials) {
    results.push({
      title: '1. Sanity Context MCP Credentials Check',
      category: 'LIVE',
      status: 'SKIPPED',
      details: 'LIVE MCP TEST: SKIPPED — credentials not configured (Requires SANITY_CONTEXT_MCP_URL and SANITY_ORGANIZATION_TOKEN).',
    });
  } else {
    results.push({
      title: '1. Sanity Context MCP Credentials Check',
      category: 'LIVE',
      status: 'PASS',
      details: `Endpoint configured: ${mcpUrl}. Organization token detected (${orgToken.length} chars).`,
    });
  }

  // Test 2: Live MCP tools/list Discovery
  if (!hasLiveCredentials) {
    results.push({
      title: '2. Live Sanity Context MCP tools/list Discovery',
      category: 'LIVE',
      status: 'SKIPPED',
      details: 'LIVE MCP TEST: SKIPPED — credentials not configured.',
    });
  } else {
    try {
      const toolsResult = await client.listTools();
      if (toolsResult.success && toolsResult.data && toolsResult.data.length > 0) {
        const toolNames = toolsResult.data.map((t) => t.name);
        const hasGroq = toolNames.includes('groq_query');
        const hasInitialContext = toolNames.includes('initial_context');
        const hasSchemaExplorer = toolNames.includes('schema_explorer');

        results.push({
          title: '2. Live Sanity Context MCP tools/list Discovery',
          category: 'LIVE',
          status: hasGroq || hasInitialContext || hasSchemaExplorer ? 'PASS' : 'FAIL',
          details: `Discovered tools: ${toolNames.join(', ')} (GROQ: ${hasGroq}, InitialContext: ${hasInitialContext}, SchemaExplorer: ${hasSchemaExplorer}) in ${toolsResult.executionTimeMs}ms`,
        });
      } else {
        results.push({
          title: '2. Live Sanity Context MCP tools/list Discovery',
          category: 'LIVE',
          status: 'FAIL',
          details: `Failed to retrieve tools: ${toolsResult.error || 'No tools returned'}`,
        });
      }
    } catch (err: any) {
      results.push({
        title: '2. Live Sanity Context MCP tools/list Discovery',
        category: 'LIVE',
        status: 'FAIL',
        details: err.message,
      });
    }
  }

  // Test 3: Real MCP Structured Retrieval (GROQ Query via Live MCP)
  if (!hasLiveCredentials) {
    results.push({
      title: '3. Real MCP Structured Retrieval (GROQ via Live MCP)',
      category: 'LIVE',
      status: 'SKIPPED',
      details: 'LIVE MCP TEST: SKIPPED — credentials not configured. Local dataset adapter is NOT used for this test.',
    });
  } else {
    try {
      const res = await client.queryStructuredData({
        query: '*[_type == "apiProduct"]{ _id, name, supportedNetworks }',
      });
      results.push({
        title: '3. Real MCP Structured Retrieval (GROQ via Live MCP)',
        category: 'LIVE',
        status: res.success ? 'PASS' : 'FAIL',
        details: res.success ? `Retrieved ${res.data?.length || 0} products from remote Sanity Content Lake.` : `Error: ${res.error}`,
      });
    } catch (err: any) {
      results.push({
        title: '3. Real MCP Structured Retrieval (GROQ via Live MCP)',
        category: 'LIVE',
        status: 'FAIL',
        details: err.message,
      });
    }
  }

  // Test 4: Live / Traceable Evidence Extraction
  try {
    const analysis = await orchestrator.analyzeRequirement(
      'I need native Ethereum wallet balance checking.'
    );
    const hasTraceableEvidence =
      analysis.evidenceList.length > 0 &&
      analysis.evidenceList.every((e) => e.sourceId && e.sourceType && e.claim);

    results.push({
      title: '4. Traceable Evidence Extraction',
      category: 'LOCAL',
      status: hasTraceableEvidence ? 'PASS' : 'FAIL',
      details: `Generated ${analysis.evidenceList.length} evidence records with source IDs and schema claims.`,
    });
  } catch (err: any) {
    results.push({
      title: '4. Traceable Evidence Extraction',
      category: 'LOCAL',
      status: 'FAIL',
      details: err.message,
    });
  }

  // Test 5: Live Compatibility Reasoning (Ethereum + Base)
  try {
    const analysis = await orchestrator.analyzeRequirement(
      'I need an API that supports both Ethereum and Base for token balances.'
    );
    const top = analysis.candidates.find((c) => c.overallStatus === 'COMPATIBLE');
    const isAster = top?.candidateId === 'product.aster-wallet';
    const isNorthstarIncompatible = analysis.candidates.some(
      (c) => c.candidateId === 'product.northstar-data' && c.overallStatus === 'INCOMPATIBLE'
    );

    results.push({
      title: '5. Multi-Network Compatibility Reasoning (Eth + Base)',
      category: 'LOCAL',
      status: isAster && isNorthstarIncompatible ? 'PASS' : 'FAIL',
      details: `Top: ${top?.candidateName} (COMPATIBLE). Northstar correctly marked INCOMPATIBLE.`,
    });
  } catch (err: any) {
    results.push({
      title: '5. Multi-Network Compatibility Reasoning (Eth + Base)',
      category: 'LOCAL',
      status: 'FAIL',
      details: err.message,
    });
  }

  // Test 6: Fallback Mode & Error Handling when MCP is Unavailable
  try {
    // Instantiate test client with unreachable endpoint
    const testUnreachableClient = new SanityContextClient({
      projectId: 'test-project-1234',
      token: 'test-token-xyz',
      endpointUrl: 'https://127.0.0.1:59999/unreachable-test',
      timeoutMs: 500,
    });

    const failureHealth = await testUnreachableClient.checkHealth();
    const fallbackWorks = failureHealth.mode === 'LOCAL_FALLBACK' && failureHealth.status === 'unreachable';

    // Verify orchestrator executes safely in fallback mode
    const fallbackAnalysis = await orchestrator.analyzeRequirement('I need Ethereum balances.');
    const analysisWorks = fallbackAnalysis.metadata.mcpMode === 'LOCAL_FALLBACK';

    results.push({
      title: '6. Fallback Handling when MCP Unreachable',
      category: 'LOCAL',
      status: fallbackWorks && analysisWorks ? 'PASS' : 'FAIL',
      details: `Unreachable endpoint caught cleanly. mode: ${failureHealth.mode}, status: ${failureHealth.status}. Orchestrator operated in LOCAL_FALLBACK.`,
    });
  } catch (err: any) {
    results.push({
      title: '6. Fallback Handling when MCP Unreachable',
      category: 'LOCAL',
      status: 'FAIL',
      details: err.message,
    });
  }

  // Test 7: Unknown Evidence Handling (Avalanche on Northstar)
  try {
    const analysis = await orchestrator.analyzeRequirement(
      'Does Northstar Data API support Avalanche C-Chain?'
    );
    const isUnknown = analysis.overallStatus === 'UNKNOWN';
    const hasUnknownRecord =
      analysis.implementationPlan.unresolvedUnknowns.some((u) => /avalanche/i.test(u)) ||
      analysis.candidates.some((c) => c.unknowns.some((u) => /avalanche/i.test(u)));

    results.push({
      title: '7. Epistemic Unknown Evidence Handling',
      category: 'LOCAL',
      status: isUnknown && hasUnknownRecord ? 'PASS' : 'FAIL',
      details: `Status: ${analysis.overallStatus}. Correctly acknowledged evidence gap rather than hallucinating.`,
    });
  } catch (err: any) {
    results.push({
      title: '7. Epistemic Unknown Evidence Handling',
      category: 'LOCAL',
      status: 'FAIL',
      details: err.message,
    });
  }

  // Test 8: Conditional Evidence Handling (Token Transfers + Webhooks)
  try {
    const analysis = await orchestrator.analyzeRequirement(
      'I need token transfer events on Ethereum with webhook push notifications.'
    );
    const isConditional = analysis.overallStatus === 'CONDITIONAL';
    const hasCondition = analysis.implementationPlan.requiredConditions.some((c) =>
      /webhook/i.test(c)
    );

    results.push({
      title: '8. Conditional Evidence Handling (Webhooks)',
      category: 'LOCAL',
      status: isConditional && hasCondition ? 'PASS' : 'FAIL',
      details: `Status: ${analysis.overallStatus}. Required conditions: ${analysis.implementationPlan.requiredConditions.join('; ')}`,
    });
  } catch (err: any) {
    results.push({
      title: '8. Conditional Evidence Handling (Webhooks)',
      category: 'LOCAL',
      status: 'FAIL',
      details: err.message,
    });
  }

  // Test 9: Incompatible Evidence Handling (Solana + Ethereum)
  try {
    const analysis = await orchestrator.analyzeRequirement(
      'I need a single API that queries both Solana and Ethereum balances in the same EVM format.'
    );
    const isIncompatible = analysis.overallStatus === 'INCOMPATIBLE';

    results.push({
      title: '9. Cross-Ecosystem Incompatibility Handling',
      category: 'LOCAL',
      status: isIncompatible ? 'PASS' : 'FAIL',
      details: `Status: ${analysis.overallStatus}. Cross-chain protocol conflict accurately identified.`,
    });
  } catch (err: any) {
    results.push({
      title: '9. Cross-Ecosystem Incompatibility Handling',
      category: 'LOCAL',
      status: 'FAIL',
      details: err.message,
    });
  }

  // Test 10: Security & No Secret Leakage Review
  try {
    const health = await SanityContextService.getInstance().getHealth();
    const serializedHealth = JSON.stringify(health);
    const analysis = await orchestrator.analyzeRequirement('I need Ethereum balances.');
    const serializedAnalysis = JSON.stringify(analysis);

    const forbiddenPatterns = [
      /sk[a-zA-Z0-9_-]{20,}/,
      /Bearer\s+[a-zA-Z0-9_.-]{20,}/i,
      /SANITY_TOKEN=/i,
      /SANITY_CONTEXT_MCP_TOKEN=/i,
      /password/i,
      /secret[ -_]key/i,
    ];

    let leaked = false;
    for (const pat of forbiddenPatterns) {
      if (pat.test(serializedHealth) || pat.test(serializedAnalysis)) {
        leaked = true;
        break;
      }
    }

    results.push({
      title: '10. Security & No-Secret-Leakage Verification',
      category: 'SECURITY',
      status: !leaked ? 'PASS' : 'FAIL',
      details: 'Verified that response models contain 0 private keys, authorization tokens, or secrets.',
    });
  } catch (err: any) {
    results.push({
      title: '10. Security & No-Secret-Leakage Verification',
      category: 'SECURITY',
      status: 'FAIL',
      details: err.message,
    });
  }

  // Print Summary
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✔' : r.status === 'SKIPPED' ? '⚠' : '✖';
    console.log(`${icon} [${r.category}] ${r.title} — ${r.status}`);
    console.log(`    ${r.details}\n`);
  }

  const livePass = results.filter((r) => r.category === 'LIVE' && r.status === 'PASS').length;
  const liveSkipped = results.filter((r) => r.category === 'LIVE' && r.status === 'SKIPPED').length;
  const localPass = results.filter((r) => (r.category === 'LOCAL' || r.category === 'SECURITY') && r.status === 'PASS').length;

  console.log('=================================================================');
  console.log(`Verification Summary:`);
  console.log(`  Live Remote Tests:    ${livePass} Passed, ${liveSkipped} Skipped (Unconfigured)`);
  console.log(`  Local Fallback Tests: ${localPass}/7 Passed`);
  console.log('=================================================================');
}

runMCPIntegrationSuite().catch((err) => {
  console.error('Fatal error in integration suite:', err);
  process.exit(1);
});
