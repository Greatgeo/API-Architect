/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Requirement Extraction Engine
 * Parses natural language developer prompts into normalized, typed requirement models.
 * Implements deterministic entity and constraint extraction, ambiguity detection,
 * and missing information tracking.
 */

import { ExtractedRequirements, ExtractedRequirementItem } from './types.ts';

// Known network patterns mapped to normalized IDs
const KNOWN_NETWORKS: { pattern: RegExp; id: string; name: string; slug: string; chainId: number }[] = [
  { pattern: /\bethereum\b|\beth\b|\bmainnet\b/i, id: 'network.ethereum', name: 'Ethereum Mainnet', slug: 'ethereum', chainId: 1 },
  { pattern: /\bbase\b|\bbase l2\b|\bbase network\b/i, id: 'network.base', name: 'Base', slug: 'base', chainId: 8453 },
  { pattern: /\bpolygon\b|\bmatic\b/i, id: 'network.polygon', name: 'Polygon PoS', slug: 'polygon', chainId: 137 },
  { pattern: /\barbitrum\b|\barb\b/i, id: 'network.arbitrum', name: 'Arbitrum One', slug: 'arbitrum', chainId: 42161 },
  { pattern: /\boptimism\b|\bop\b/i, id: 'network.optimism', name: 'OP Mainnet', slug: 'optimism', chainId: 10 },
  { pattern: /\bavalanche\b|\bavax\b/i, id: 'network.avalanche', name: 'Avalanche C-Chain', slug: 'avalanche', chainId: 43114 },
  { pattern: /\bbnb\b|\bbsc\b|\bbinance smart chain\b/i, id: 'network.bsc', name: 'BNB Smart Chain', slug: 'bsc', chainId: 56 },
  { pattern: /\bsolana\b|\bsol\b/i, id: 'network.solana', name: 'Solana Mainnet-Beta', slug: 'solana', chainId: 101 },
  { pattern: /\bsepolia\b/i, id: 'network.sepolia', name: 'Sepolia Testnet', slug: 'sepolia', chainId: 11155111 },
];

// Known capabilities mapped to normalized identifiers
const KNOWN_CAPABILITIES: { pattern: RegExp; id: string; name: string; slug: string }[] = [
  {
    pattern: /\btoken transfers?\b|\btransfer events?\b|\berc-?20 transfers?\b|\btoken events?\b/i,
    id: 'capability.token-transfer-events',
    name: 'Token Transfer Events',
    slug: 'token-transfer-events',
  },
  {
    pattern: /\bwallet balances?\b|\bnative balance\b|\beth balance\b|\baccount balance\b/i,
    id: 'capability.wallet-balance',
    name: 'Wallet Native Balance',
    slug: 'wallet-balance',
  },
  {
    pattern: /\btoken balances?\b|\berc-?20 balances?\b|\bspl balances?\b/i,
    id: 'capability.token-balance',
    name: 'Token Balance',
    slug: 'token-balance',
  },
  {
    pattern: /\bwebhooks?\b|\bwebhook notifications?\b|\bpush notifications?\b/i,
    id: 'capability.webhook-notifications',
    name: 'Webhook Notifications',
    slug: 'webhook-notifications',
  },
  {
    pattern: /\btransaction history\b|\bpast transactions\b|\btx history\b/i,
    id: 'capability.transaction-history',
    name: 'Transaction History',
    slug: 'transaction-history',
  },
  {
    pattern: /\bwallet activity\b|\bactivity feed\b|\bactivity dashboard\b/i,
    id: 'capability.wallet-activity',
    name: 'Wallet Activity Feed',
    slug: 'wallet-activity',
  },
  {
    pattern: /\bportfolio\b|\bnet worth\b|\btoken holdings\b/i,
    id: 'capability.portfolio-aggregation',
    name: 'Portfolio Aggregation',
    slug: 'portfolio-aggregation',
  },
  {
    pattern: /\bgas\b|\bgas estimation\b|\bgas price\b|\beip-?1559\b/i,
    id: 'capability.gas-estimation',
    name: 'Gas Estimation & Analytics',
    slug: 'gas-estimation',
  },
  {
    pattern: /\brpc\b|\bjson-?rpc\b|\braw node\b/i,
    id: 'capability.rpc-access',
    name: 'Direct JSON-RPC Access',
    slug: 'rpc-access',
  },
];

// Known technologies
const KNOWN_TECHNOLOGIES: { pattern: RegExp; id: string; name: string; slug: string; category: string }[] = [
  { pattern: /\breact\b|\breact\.js\b/i, id: 'tech.react', name: 'React', slug: 'react', category: 'framework' },
  { pattern: /\bnode\b|\bnode\.js\b/i, id: 'tech.nodejs', name: 'Node.js', slug: 'nodejs', category: 'runtime' },
  { pattern: /\bexpress\b|\bexpress\.js\b/i, id: 'tech.express', name: 'Express', slug: 'express', category: 'framework' },
  { pattern: /\btypescript\b|\bts\b/i, id: 'tech.typescript', name: 'TypeScript', slug: 'typescript', category: 'language' },
  { pattern: /\bpython\b/i, id: 'tech.python', name: 'Python', slug: 'python', category: 'language' },
  { pattern: /\bnext\.?js\b/i, id: 'tech.nextjs', name: 'Next.js', slug: 'nextjs', category: 'framework' },
];

// Known product patterns mapped to normalized IDs
const KNOWN_PRODUCTS: { pattern: RegExp; id: string; name: string }[] = [
  { pattern: /\bnorthstar\b|\bnorthstar data\b/i, id: 'product.northstar-data', name: 'Northstar Data API' },
  { pattern: /\baster\b|\baster wallet\b/i, id: 'product.aster-wallet', name: 'Aster Wallet API' },
  { pattern: /\borbit\b|\borbit event\b|\borbit gateway\b/i, id: 'product.orbit-event', name: 'Orbit Event Gateway' },
  { pattern: /\bsolis\b|\bsolis solana\b/i, id: 'product.solis-solana', name: 'Solis Solana API' },
  { pattern: /\bhelios\b|\bhelios rpc\b/i, id: 'product.helios-rpc', name: 'Helios Multi-Chain RPC' },
  { pattern: /\bnexus\b|\bnexus portfolio\b/i, id: 'product.nexus-portfolio', name: 'Nexus Portfolio API' },
  { pattern: /\bquanta\b|\bquanta indexer\b/i, id: 'product.quanta-indexer', name: 'Quanta Chain Indexer' },
  { pattern: /\bstrata\b|\bstrata pay\b|\bstrata settlement\b/i, id: 'product.strata-pay', name: 'Strata Settlement API' },
  { pattern: /\bbeacon\b|\bbeacon identity\b/i, id: 'product.beacon-identity', name: 'Beacon Identity API' },
  { pattern: /\bvanguard\b|\bvanguard gas\b/i, id: 'product.vanguard-gas', name: 'Vanguard Gas & Simulation API' },
  { pattern: /\bzenith\b|\bzenith activity\b/i, id: 'product.zenith-activity', name: 'Zenith Activity Stream' },
];

export class RequirementExtractor {
  /**
   * Deterministically extracts structured requirements from the user's prompt.
   */
  public static extract(prompt: string): ExtractedRequirements {
    const rawPrompt = prompt.trim();
    let targetProduct: { id: string; name: string } | undefined;
    for (const p of KNOWN_PRODUCTS) {
      if (p.pattern.test(rawPrompt)) {
        targetProduct = { id: p.id, name: p.name };
        break;
      }
    }

    const networks: ExtractedRequirementItem[] = [];
    const capabilities: ExtractedRequirementItem[] = [];
    const technologies: ExtractedRequirementItem[] = [];
    const authentication: {
      method: 'api_key' | 'bearer' | 'oauth' | 'webhook_secret';
      label: string;
      isExplicit: boolean;
    }[] = [];
    const conditions: string[] = [];
    const architectureRequirements: string[] = [];
    const missingInformation: string[] = [];
    const unknownRequirements: string[] = [];
    const ambiguityNotes: string[] = [];
    let isAmbiguous = false;

    // 1. Networks
    for (const net of KNOWN_NETWORKS) {
      if (net.pattern.test(rawPrompt)) {
        networks.push({
          id: net.id,
          name: net.name,
          slug: net.slug,
          isExplicit: true,
          notes: `Chain ID: ${net.chainId}`,
        });
      }
    }

    // 2. Capabilities
    for (const cap of KNOWN_CAPABILITIES) {
      if (cap.pattern.test(rawPrompt)) {
        capabilities.push({
          id: cap.id,
          name: cap.name,
          slug: cap.slug,
          isExplicit: true,
        });
      }
    }

    // Ambiguity Check: "real-time" without explicit transport
    if (/\breal-?time\b|\blive events?\b/i.test(rawPrompt)) {
      const hasWebhook = /\bwebhook\b/i.test(rawPrompt);
      const hasWebsocket = /\bwebsocket|\bws\b/i.test(rawPrompt);
      const hasPolling = /\bpoll\b|\bpolling\b/i.test(rawPrompt);

      if (!hasWebhook && !hasWebsocket && !hasPolling) {
        isAmbiguous = true;
        ambiguityNotes.push(
          "Request mentions 'real-time' delivery without specifying transport (webhooks, websockets, or polling). Evaluating both push and polling options."
        );
        // Add implied webhook capability for inspection
        if (!capabilities.some((c) => c.slug === 'webhook-notifications')) {
          capabilities.push({
            id: 'capability.webhook-notifications',
            name: 'Webhook Notifications',
            slug: 'webhook-notifications',
            isExplicit: false,
            notes: 'Inferred from real-time requirement',
          });
        }
      }
    }

    // Default capability fallback if prompt mentions "balance" generally
    if (capabilities.length === 0 && /\bbalances?\b/i.test(rawPrompt)) {
      capabilities.push({
        id: 'capability.wallet-balance',
        name: 'Wallet Native Balance',
        slug: 'wallet-balance',
        isExplicit: true,
      });
    }

    // 3. Authentication
    if (/\bapi[ -]?keys?\b|\bserver-?side api keys?\b/i.test(rawPrompt)) {
      authentication.push({
        method: 'api_key',
        label: 'Server-Side API Key',
        isExplicit: true,
      });
      architectureRequirements.push('Server-side credential storage (zero browser secrets)');
    } else if (/\bbearer\b|\bjwt\b/i.test(rawPrompt)) {
      authentication.push({
        method: 'bearer',
        label: 'Bearer / JWT Token',
        isExplicit: true,
      });
    } else if (/\boauth\b|\bdelegated\b/i.test(rawPrompt)) {
      authentication.push({
        method: 'oauth',
        label: 'OAuth 2.0 / User Delegation',
        isExplicit: true,
      });
    }

    // 4. Rate Limits: extract e.g. "at least 20 requests per second", ">= 20 RPS", "20 req/sec"
    let minimumRateLimit: number | null = null;
    const rpsMatch = rawPrompt.match(
      /(?:at least|minimum|>=|>|handle|support)?\s*(\d+)\s*(?:requests?\s*per\s*second|req\/s|rps)/i
    );
    if (rpsMatch && rpsMatch[1]) {
      minimumRateLimit = parseInt(rpsMatch[1], 10);
    }

    // 5. Technologies
    for (const tech of KNOWN_TECHNOLOGIES) {
      if (tech.pattern.test(rawPrompt)) {
        technologies.push({
          id: tech.id,
          name: tech.name,
          slug: tech.slug,
          isExplicit: true,
          notes: tech.category,
        });
      }
    }

    // 6. Architecture & Conditions
    if (/\bdashboard\b|\bfrontend\b|\bclient\b/i.test(rawPrompt)) {
      architectureRequirements.push('Client dashboard interface with secure proxy backend');
    }
    if (/\bwebhook\b/i.test(rawPrompt)) {
      conditions.push('Public HTTPS endpoint with valid TLS certificate required for webhook receipt');
      conditions.push('Webhook signature HMAC verification required');
    }

    // 7. Unknown / Unverified requirements check
    // e.g. if the prompt asks for an exotic blockchain like Cardano or Aptos not in dataset
    const unsupportedChains = ['cardano', 'aptos', 'sui', 'near', 'cosmos', 'polkadot', 'tron'];
    for (const chain of unsupportedChains) {
      if (new RegExp(`\\b${chain}\\b`, 'i').test(rawPrompt)) {
        unknownRequirements.push(
          `Network '${chain}' is not present in the controlled Sanity dataset. Evidence cannot be verified.`
        );
      }
    }

    // Missing information detection
    if (networks.length === 0) {
      missingInformation.push('No target blockchain network was specified (e.g. Ethereum, Base).');
    }
    if (capabilities.length === 0) {
      missingInformation.push('No specific data capability or API operation was specified.');
    }

    return {
      rawPrompt,
      targetProduct,
      networks,
      capabilities,
      authentication,
      minimumRateLimit,
      technologies,
      conditions,
      architectureRequirements,
      missingInformation,
      unknownRequirements,
      isAmbiguous,
      ambiguityNotes,
    };
  }
}
