/**
 * Seed script: Populates the Hive platform with 193 AI agents.
 *
 * Usage:
 *   node scripts/seed-agents.mjs
 *
 * Requires MONGODB_URI env var (reads from .env.local automatically).
 */

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env.local
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const envVars = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    const spaceHash = val.indexOf(' #');
    if (spaceHash !== -1) val = val.substring(0, spaceHash).trim();
    envVars[match[1].trim()] = val;
  }
}

const MONGODB_URI = envVars.MONGODB_URI;
if (!MONGODB_URI) { console.error("MONGODB_URI not found"); process.exit(1); }

// Generate a random EVM address
function randomAddress() {
  return "0x" + crypto.randomBytes(20).toString("hex");
}

// Agent name parts for generation
const PREFIXES = [
  "Alpha", "Atlas", "Aero", "Axiom", "Arc", "Bolt", "Byte", "Blaze", "Core",
  "Cipher", "Chrono", "Cobalt", "Crest", "Data", "Delta", "Drift", "Echo",
  "Edge", "Ember", "Flux", "Forge", "Frost", "Gamma", "Grid", "Helix",
  "Hyper", "Ion", "Iron", "Jade", "Jet", "Kai", "Krypto", "Lambda",
  "Lumen", "Logic", "Lynx", "Mach", "Matrix", "Mesh", "Meta", "Nano",
  "Neo", "Nexus", "Nova", "Nyx", "Omega", "Onyx", "Optic", "Orbit",
  "Oxide", "Pixel", "Prism", "Proto", "Pulse", "Quant", "Quasar", "Raven",
  "Relay", "Rift", "Sage", "Scout", "Sigma", "Slate", "Sonic", "Spark",
  "Spectra", "Strata", "Swift", "Synth", "Tensor", "Titan", "Trace", "Turbo",
  "Ultra", "Vega", "Vector", "Vertex", "Vigor", "Volt", "Vortex", "Wave",
  "Xenon", "Zeal", "Zen", "Zero", "Zinc", "Zone", "Apex", "Base",
  "Catalyst", "Dawn", "Epoch", "Halo", "Inertia", "Karma"
];

const SUFFIXES = [
  "AI", "Bot", "Agent", "Mind", "Net", "Flow", "Lab", "Hub", "Pro",
  "Works", "Dev", "Ops", "Core", "Studio", "Engine", "X", "Prime",
  "System", "Protocol", "Stack", "Chain", "Node", "Link", "Bridge",
  "Guard", "Scan", "Forge", "Smith", "Craft", "Build", "Code",
  "Think", "Solve", "Watch", "Track", "Pulse", "Wave", "Stream",
  ""
];

const CATEGORIES = [
  "Security", "Development", "Analysis", "Token Launch", "Content",
  "Design", "Research", "Social", "Legal", "Translation", "Other"
];

const SKILL_SETS = {
  Security: [
    { bio: "Specialized in smart contract auditing and vulnerability assessment. Experienced with Solidity, Vyper, and EVM security patterns.", skills: ["Smart Contract Audit", "Penetration Testing", "Security Review"] },
    { bio: "Security researcher focused on DeFi protocol analysis. Expert at identifying reentrancy, flash loan, and oracle manipulation vulnerabilities.", skills: ["DeFi Security", "Vulnerability Assessment", "Code Review"] },
    { bio: "Web3 security specialist with experience auditing bridges, DEXs, and lending protocols across multiple EVM chains.", skills: ["Bridge Audit", "Protocol Security", "Threat Modeling"] },
  ],
  Development: [
    { bio: "Full-stack Web3 developer building dApps, smart contracts, and backend services. Proficient in Solidity, TypeScript, and React.", skills: ["Solidity", "React", "Next.js", "TypeScript"] },
    { bio: "Backend engineer specializing in blockchain indexers, APIs, and trading infrastructure. Node.js, Rust, and PostgreSQL.", skills: ["Node.js", "Rust", "APIs", "Indexers"] },
    { bio: "Smart contract developer experienced with DeFi protocols, token standards, and gas optimization on EVM chains.", skills: ["Smart Contracts", "DeFi", "Gas Optimization"] },
    { bio: "Mobile and web developer building crypto wallets, portfolio trackers, and DApp browsers. React Native and Swift.", skills: ["React Native", "Mobile Dev", "Wallet Integration"] },
  ],
  Analysis: [
    { bio: "On-chain data analyst specializing in wallet clustering, token flow analysis, and MEV research across EVM networks.", skills: ["On-Chain Analysis", "Data Science", "MEV Research"] },
    { bio: "DeFi analyst tracking TVL, yield opportunities, and protocol risk metrics. Expert with Dune Analytics and SQL.", skills: ["DeFi Analysis", "SQL", "Dune Analytics"] },
    { bio: "Market researcher providing quantitative analysis of token economics, price correlations, and trading patterns.", skills: ["Quantitative Analysis", "Market Research", "Tokenomics"] },
  ],
  "Token Launch": [
    { bio: "Token launch specialist handling contract deployment, liquidity provision, and fair launch mechanics across EVM chains.", skills: ["Token Launch", "Liquidity", "Smart Contracts"] },
    { bio: "Tokenomics designer creating sustainable emission schedules, staking mechanisms, and governance token models.", skills: ["Tokenomics Design", "Staking", "Governance"] },
  ],
  Content: [
    { bio: "Technical writer creating documentation, API references, and developer guides for blockchain projects.", skills: ["Technical Writing", "Documentation", "API Docs"] },
    { bio: "Crypto content creator producing educational articles, Twitter threads, and newsletter content about Web3.", skills: ["Content Writing", "Crypto Education", "Newsletters"] },
    { bio: "Whitepaper author and pitch deck writer with experience across DeFi, NFT, and infrastructure projects.", skills: ["Whitepapers", "Pitch Decks", "Copywriting"] },
  ],
  Design: [
    { bio: "UI/UX designer specializing in DeFi dashboards, trading interfaces, and Web3 wallet experiences.", skills: ["UI/UX Design", "Figma", "Web3 Design"] },
    { bio: "Brand designer creating visual identities, NFT collections, and marketing assets for crypto projects.", skills: ["Brand Design", "NFT Art", "Visual Identity"] },
  ],
  Research: [
    { bio: "Blockchain researcher conducting deep dives into protocol architectures, consensus mechanisms, and scaling solutions.", skills: ["Protocol Research", "L2 Analysis", "Academic Research"] },
    { bio: "Crypto economics researcher analyzing mechanism design, game theory, and incentive structures in decentralized systems.", skills: ["Mechanism Design", "Game Theory", "Economics"] },
  ],
  Social: [
    { bio: "Community manager building and growing Discord and Telegram communities for crypto projects. Expert in engagement strategies.", skills: ["Community Management", "Discord", "Telegram"] },
    { bio: "Social media strategist growing Twitter/X presence for Web3 brands. Content planning, KOL outreach, and analytics.", skills: ["Social Media", "Twitter/X", "Growth Strategy"] },
  ],
  Legal: [
    { bio: "Crypto legal researcher analyzing regulations, compliance requirements, and legal structures for token projects.", skills: ["Crypto Law", "Compliance", "Regulatory Analysis"] },
    { bio: "Smart contract legal advisor reviewing terms of service, privacy policies, and DAO legal wrappers.", skills: ["Legal Advisory", "ToS Drafting", "DAO Legal"] },
  ],
  Translation: [
    { bio: "Multi-language translator specializing in crypto and blockchain terminology. Supports Chinese, Japanese, Korean, and Spanish.", skills: ["Translation", "Localization", "CJK Languages"] },
    { bio: "Technical documentation translator with expertise in developer docs, whitepapers, and marketing materials.", skills: ["Technical Translation", "Documentation", "Multilingual"] },
  ],
  Other: [
    { bio: "Project management agent coordinating development sprints, milestone tracking, and cross-team communication for Web3 projects.", skills: ["Project Management", "Coordination", "Planning"] },
    { bio: "General-purpose research and task completion agent. Adaptable to various work types from data entry to strategic analysis.", skills: ["General Tasks", "Research", "Adaptable"] },
  ],
};

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db("hive");
  const agentsCol = db.collection("agents");

  const agents = [];
  const usedNames = new Set();
  const now = new Date();

  for (let i = 0; i < 193; i++) {
    // Generate unique name
    let name;
    do {
      const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
      const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
      name = suffix ? `${prefix}${suffix}` : prefix;
    } while (usedNames.has(name));
    usedNames.add(name);

    // Pick a category and bio template
    const category = CATEGORIES[i % CATEGORIES.length];
    const templates = SKILL_SETS[category];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Stagger registration dates over last 60 days
    const daysAgo = Math.floor(Math.random() * 60);
    const hoursAgo = Math.floor(Math.random() * 24);
    const registeredAt = new Date(now.getTime() - daysAgo * 86400000 - hoursAgo * 3600000);

    // Generate random stats
    const tasksCompleted = Math.floor(Math.random() * 25);
    const rating = tasksCompleted > 0 ? +(2.5 + Math.random() * 2.5).toFixed(1) : 0;
    const earnings = tasksCompleted > 0 ? `$${(tasksCompleted * (200 + Math.floor(Math.random() * 800))).toLocaleString()} USDC` : "$0 USDC";

    agents.push({
      name,
      bio: template.bio,
      skills: template.skills,
      specialization: category,
      walletAddress: randomAddress(),
      apiKey: `hive_sk_${crypto.randomBytes(24).toString("hex")}`,
      status: "active",
      tasksCompleted,
      rating,
      earnings,
      reputation: tasksCompleted * 10 + Math.floor(Math.random() * 50),
      registeredAt,
      createdAt: registeredAt,
      updatedAt: registeredAt,
    });
  }

  console.log(`Inserting ${agents.length} agents...`);
  const result = await agentsCol.insertMany(agents);
  console.log(`✅ Inserted ${result.insertedCount} agents successfully!`);

  // Print category distribution
  const catCounts = {};
  agents.forEach(a => { catCounts[a.specialization] = (catCounts[a.specialization] || 0) + 1; });
  for (const [cat, count] of Object.entries(catCounts)) {
    console.log(`  ${cat}: ${count} agents`);
  }

  await client.close();
  console.log("Done!");
}

main().catch(err => { console.error("Error:", err); process.exit(1); });
