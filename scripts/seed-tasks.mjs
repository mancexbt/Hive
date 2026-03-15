/**
 * Seed script: Populates every Hive category with 20 realistic tasks.
 *
 * Usage:
 *   node scripts/seed-tasks.mjs
 *
 * Requires MONGODB_URI env var (reads from .env.local automatically).
 */

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env.local
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const envVars = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    // Strip inline comments (but be careful with URIs containing #)
    // For MONGODB_URI, only strip comments that start with " #" (space then hash)
    const spaceHash = val.indexOf(' #');
    if (spaceHash !== -1) val = val.substring(0, spaceHash).trim();
    envVars[match[1].trim()] = val;
  }
}

const MONGODB_URI = envVars.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

const POSTER_ADDRESS = "0xHivePlatform0000000000000000000000000001";
const POSTER_NAME = "Hive Platform";

const TASK_DATA = {
  Security: [
    { title: "Smart Contract Security Audit for DeFi Protocol", desc: "Conduct a comprehensive security audit of a Solidity-based lending protocol on EVM. Identify vulnerabilities, reentrancy risks, and gas optimization opportunities.", budget: "$2000 USDC" },
    { title: "Penetration Testing for Web3 dApp", desc: "Perform black-box and white-box penetration testing on our decentralized application. Test all API endpoints, smart contract interactions, and wallet connection flows.", budget: "$1500 USDC" },
    { title: "Token Contract Vulnerability Assessment", desc: "Review our ERC-20 token contract for common vulnerabilities including integer overflow, front-running, and access control issues.", budget: "$800 USDC" },
    { title: "Cross-Chain Bridge Security Review", desc: "Audit the security of a cross-chain bridge implementation between Ethereum and Base. Review message passing, validator set management, and fund custody.", budget: "$3000 USDC" },
    { title: "NFT Marketplace Smart Contract Audit", desc: "Security audit for an NFT marketplace with listings, auctions, and royalty enforcement. Focus on escrow logic and payment distribution.", budget: "$1200 USDC" },
    { title: "DeFi Yield Aggregator Security Assessment", desc: "Review the security of a yield aggregator that interacts with multiple DeFi protocols. Assess strategy contracts and fund management.", budget: "$2500 USDC" },
    { title: "DAO Governance Contract Audit", desc: "Audit the governance system including proposal creation, voting mechanisms, time-locks, and execution logic for a DAO framework.", budget: "$1800 USDC" },
    { title: "Staking Contract Security Review", desc: "Review staking and reward distribution contracts for vulnerabilities. Test edge cases around unstaking, reward calculation, and slashing.", budget: "$1000 USDC" },
    { title: "Multi-Sig Wallet Implementation Audit", desc: "Audit a custom multi-signature wallet implementation with time-locked transactions and guardian recovery features.", budget: "$1500 USDC" },
    { title: "Oracle Integration Security Assessment", desc: "Review how price oracles are integrated into a DeFi protocol. Assess manipulation risks, staleness checks, and fallback mechanisms.", budget: "$1200 USDC" },
    { title: "Wallet Security and Key Management Review", desc: "Assess the security of a custodial wallet service including key derivation, storage, encryption, and backup mechanisms.", budget: "$2000 USDC" },
    { title: "API Security Audit for Crypto Exchange", desc: "Conduct a thorough security audit of REST and WebSocket APIs for a cryptocurrency exchange platform.", budget: "$2500 USDC" },
    { title: "Privacy Protocol Security Review", desc: "Audit a zero-knowledge proof-based privacy protocol. Review circuit constraints, trusted setup, and proof verification.", budget: "$3500 USDC" },
    { title: "Automated Market Maker Security Audit", desc: "Review the AMM implementation including concentrated liquidity, fee tiers, and flash loan protection mechanisms.", budget: "$2200 USDC" },
    { title: "Account Abstraction Wallet Audit", desc: "Audit an ERC-4337 account abstraction wallet including bundler interaction, paymaster logic, and session key management.", budget: "$1800 USDC" },
    { title: "Lending Protocol Liquidation Engine Review", desc: "Review the liquidation mechanism of a lending protocol for edge cases, gas efficiency, and MEV protection.", budget: "$1500 USDC" },
    { title: "Upgradeable Proxy Contract Audit", desc: "Audit the proxy pattern implementation including storage collision risks, initialization logic, and upgrade authorization.", budget: "$900 USDC" },
    { title: "Decentralized Insurance Protocol Audit", desc: "Review smart contracts for a decentralized insurance platform including claim assessment, payout logic, and risk pooling.", budget: "$2000 USDC" },
    { title: "Tokenomics and Emission Schedule Review", desc: "Analyze the token emission contracts for correctness, vesting schedules, inflation controls, and governance integration.", budget: "$700 USDC" },
    { title: "Layer 2 Rollup Contract Security Review", desc: "Audit the fraud/validity proof contracts and state commitment logic for an L2 rollup implementation.", budget: "$4000 USDC" },
  ],
  Development: [
    { title: "Build a Telegram Trading Bot", desc: "Develop a Telegram bot that allows users to swap tokens, check prices, set limit orders, and manage their portfolio directly from Telegram.", budget: "$1500 USDC" },
    { title: "Full-Stack NFT Marketplace Development", desc: "Build a complete NFT marketplace with minting, listing, bidding, and secondary sales. Include creator royalties and collection management.", budget: "$5000 USDC" },
    { title: "DeFi Dashboard with Portfolio Tracking", desc: "Create a comprehensive DeFi dashboard that aggregates positions across multiple protocols. Include PnL tracking, yield farming stats, and gas cost analysis.", budget: "$3000 USDC" },
    { title: "Discord Bot for DAO Management", desc: "Build a Discord bot that integrates with on-chain governance. Features: proposal notifications, voting via reactions, treasury balance display.", budget: "$1200 USDC" },
    { title: "Cross-Chain Token Bridge Interface", desc: "Develop the frontend for a cross-chain bridge supporting Ethereum, Base, Arbitrum, and Polygon. Include transaction tracking and fee estimation.", budget: "$2500 USDC" },
    { title: "On-Chain Data Indexer Service", desc: "Build a custom indexer that processes blockchain events in real-time and stores them in a queryable database. Support for EVM chains.", budget: "$2000 USDC" },
    { title: "Crypto Payment Gateway Integration", desc: "Develop a payment gateway module that accepts USDC, ETH, and other tokens. Include invoice generation, webhook notifications, and refund handling.", budget: "$1800 USDC" },
    { title: "Automated Trading Strategy Engine", desc: "Build a modular trading strategy engine that supports backtesting, paper trading, and live execution across DEXs.", budget: "$4000 USDC" },
    { title: "Token Launchpad Smart Contracts", desc: "Develop fair launch smart contracts with features including whitelist, tiered allocation, vesting schedules, and anti-bot measures.", budget: "$3500 USDC" },
    { title: "Wallet Connect Integration for Mobile App", desc: "Integrate WalletConnect v2 into a React Native mobile app. Support multiple wallet providers and deep linking.", budget: "$1000 USDC" },
    { title: "Gas Optimization for Existing Contracts", desc: "Optimize gas consumption of an existing set of Solidity contracts. Target: 30% reduction in average transaction costs.", budget: "$1500 USDC" },
    { title: "Multi-Chain Portfolio API", desc: "Build a REST API that aggregates wallet balances, transaction history, and token prices across 10+ EVM chains.", budget: "$2000 USDC" },
    { title: "Automated Liquidity Management Bot", desc: "Develop a bot that automatically rebalances liquidity positions on Uniswap V3 based on configurable strategies.", budget: "$2500 USDC" },
    { title: "Real-Time Blockchain Event Notification Service", desc: "Build a service that monitors smart contract events and sends notifications via email, Telegram, and webhooks.", budget: "$1200 USDC" },
    { title: "Decentralized Identity Verification Module", desc: "Implement a DID-based identity verification system that integrates with existing KYC providers and issues verifiable credentials.", budget: "$3000 USDC" },
    { title: "DAO Treasury Management Dashboard", desc: "Build a dashboard for DAO treasuries showing asset allocation, spending proposals, historical transactions, and budget forecasts.", budget: "$2000 USDC" },
    { title: "Smart Contract Event Monitor and Alert System", desc: "Create a monitoring system that watches smart contract events and triggers alerts based on configurable conditions.", budget: "$1500 USDC" },
    { title: "DEX Aggregator Backend Service", desc: "Build a backend service that queries multiple DEXs to find the best swap routes, accounting for gas costs and slippage.", budget: "$2500 USDC" },
    { title: "Governance Voting Interface", desc: "Develop a clean, accessible voting interface for on-chain governance with proposal details, discussion threads, and delegation.", budget: "$1800 USDC" },
    { title: "Crypto Tax Calculation Engine", desc: "Build an engine that processes wallet transaction history and calculates capital gains/losses for tax reporting.", budget: "$2000 USDC" },
  ],
  Analysis: [
    { title: "Tokenomics Analysis for New DeFi Protocol", desc: "Analyze the token economics of a new DeFi protocol. Evaluate supply dynamics, demand drivers, value accrual mechanisms, and sustainability.", budget: "$800 USDC" },
    { title: "On-Chain Wallet Clustering Analysis", desc: "Perform wallet clustering analysis to identify connected wallets, whale behavior patterns, and potential wash trading activity.", budget: "$1200 USDC" },
    { title: "DeFi Protocol TVL and Risk Assessment", desc: "Evaluate the Total Value Locked across DeFi protocols, assess risk factors, and create a comparative risk-reward analysis.", budget: "$1000 USDC" },
    { title: "NFT Market Trend Analysis", desc: "Analyze NFT market trends including floor price movements, trading volumes, holder distribution, and emerging collection patterns.", budget: "$600 USDC" },
    { title: "Competitor Analysis for DEX Platform", desc: "Detailed competitive analysis of the top 10 DEX platforms covering features, fees, liquidity, user experience, and market positioning.", budget: "$900 USDC" },
    { title: "Smart Money Tracking and Analysis", desc: "Track and analyze smart money wallets to identify investment patterns, early token acquisitions, and profitable trading strategies.", budget: "$1500 USDC" },
    { title: "Gas Fee Pattern Analysis", desc: "Analyze historical gas fee patterns across Ethereum L1 and L2s. Identify optimal transaction timing and cost-saving strategies.", budget: "$500 USDC" },
    { title: "Token Unlock Impact Analysis", desc: "Analyze the historical impact of token unlocks on price action for the top 50 tokens. Create a predictive model for future unlocks.", budget: "$800 USDC" },
    { title: "Cross-Chain Bridge Volume Analysis", desc: "Analyze bridge transaction volumes, fee structures, and user behavior across the top cross-chain bridges.", budget: "$700 USDC" },
    { title: "Whale Wallet Behavior Analysis", desc: "Track and analyze the top 100 whale wallets for a specific token. Identify accumulation/distribution patterns.", budget: "$1000 USDC" },
    { title: "MEV Analysis on Base Network", desc: "Analyze MEV activity on Base network including sandwich attacks, arbitrage, and liquidations. Quantify the impact on regular users.", budget: "$1200 USDC" },
    { title: "Stablecoin Market Share Analysis", desc: "Comprehensive analysis of stablecoin market dynamics including market share shifts, depeg events, and regulatory impact.", budget: "$600 USDC" },
    { title: "Protocol Revenue and Fee Analysis", desc: "Analyze revenue generation and fee structures across the top 20 DeFi protocols. Compare sustainability metrics.", budget: "$800 USDC" },
    { title: "Governance Participation Analysis", desc: "Analyze voting patterns, participation rates, and voter concentration across major DAOs. Identify governance risks.", budget: "$700 USDC" },
    { title: "Airdrop Impact and Retention Analysis", desc: "Study the effectiveness of token airdrops by analyzing recipient behavior, selloff patterns, and long-term retention rates.", budget: "$900 USDC" },
    { title: "Layer 2 Adoption Metrics Analysis", desc: "Track and analyze adoption metrics for Ethereum L2 solutions including user growth, transaction counts, and developer activity.", budget: "$750 USDC" },
    { title: "Token Correlation Analysis", desc: "Analyze price correlations between top 100 tokens to identify diversification opportunities and systemic risks.", budget: "$500 USDC" },
    { title: "Liquidity Pool Performance Analysis", desc: "Analyze impermanent loss, fee generation, and overall returns for liquidity providers across major DEX platforms.", budget: "$800 USDC" },
    { title: "Social Sentiment vs Price Action Analysis", desc: "Correlate social media sentiment data with token price movements to assess predictive value of sentiment indicators.", budget: "$1000 USDC" },
    { title: "Validator Economics Analysis", desc: "Analyze the economics of running validators across PoS networks including costs, rewards, slashing risks, and ROI.", budget: "$900 USDC" },
  ],
  "Token Launch": [
    { title: "Launch a Meme Token on Solana", desc: "Launch a meme token on Solana with initial liquidity, trading enabled, and community distribution. Include tokenomics design.", budget: "$500 USDC" },
    { title: "Fair Launch Token with Anti-Snipe Protection", desc: "Deploy a fair launch token with anti-bot measures, gradual liquidity addition, and verified contract source code.", budget: "$800 USDC" },
    { title: "Community Token Launch with Airdrop", desc: "Launch a community token with an airdrop campaign to early supporters. Include claim page and distribution mechanism.", budget: "$1200 USDC" },
    { title: "Utility Token Launch for Gaming Platform", desc: "Launch a utility token for a blockchain gaming platform with in-game rewards, staking, and marketplace integration.", budget: "$2000 USDC" },
    { title: "Governance Token Launch for DAO", desc: "Deploy a governance token with initial distribution, delegation, and integration with a governance framework.", budget: "$1500 USDC" },
    { title: "Token Launch with Vesting Contracts", desc: "Launch a token with custom vesting schedules for team, advisors, and investors. Include a vesting dashboard.", budget: "$1800 USDC" },
    { title: "Reward Token for DeFi Protocol", desc: "Create and launch a reward token for a DeFi protocol with emission schedule, staking rewards, and liquidity incentives.", budget: "$1000 USDC" },
    { title: "Token Migration from V1 to V2", desc: "Build and execute a token migration from an existing V1 contract to a new V2 with improved features and security.", budget: "$1500 USDC" },
    { title: "Multi-Chain Token Deployment", desc: "Deploy the same token across Ethereum, Base, and Arbitrum with cross-chain bridging support and unified supply.", budget: "$2500 USDC" },
    { title: "Presale Platform with Contribution Tiers", desc: "Build a presale platform with tiered contributions, KYC integration, and automated token distribution post-sale.", budget: "$2000 USDC" },
    { title: "Token Launch Marketing Package", desc: "Create a complete launch marketing package including website, social media assets, tokenomics infographic, and press release.", budget: "$800 USDC" },
    { title: "Liquidity Lock and LP Token Burn", desc: "Set up liquidity locking with verifiable on-chain proof, LP token burning mechanism, and public tracking dashboard.", budget: "$400 USDC" },
    { title: "Token Staking and Farming Contracts", desc: "Develop staking contracts with multiple pools, flexible lock periods, and yield farming features for a newly launched token.", budget: "$1500 USDC" },
    { title: "Launch a Social Fi Token", desc: "Launch a SocialFi token with creator monetization features, content rewards, and social graph-based distribution.", budget: "$1200 USDC" },
    { title: "Deflationary Token with Buy-Back Mechanism", desc: "Create a deflationary token with automated buy-back and burn from transaction fees. Include dashboard for tracking.", budget: "$1000 USDC" },
    { title: "Token Launch on Base Network", desc: "End-to-end token launch on Base network including contract deployment, DEX listing, and initial liquidity provision.", budget: "$600 USDC" },
    { title: "Revenue-Sharing Token Model", desc: "Design and deploy a token with revenue-sharing mechanisms that distribute protocol fees to token stakers.", budget: "$1500 USDC" },
    { title: "Launch Commemorative NFT Collection", desc: "Create and launch a commemorative NFT collection tied to a token launch event with holder benefits and airdrops.", budget: "$800 USDC" },
    { title: "Token Launch Legal Review and Advisory", desc: "Provide legal review for a token launch covering securities classification, regulatory compliance, and jurisdiction analysis.", budget: "$3000 USDC" },
    { title: "Automated Token Launch Pipeline", desc: "Build an automated pipeline for token launches including contract deployment, verification, liquidity addition, and announcement.", budget: "$2000 USDC" },
  ],
  Content: [
    { title: "Write Technical Documentation for DeFi Protocol", desc: "Create comprehensive technical documentation including architecture overview, API reference, integration guides, and code examples.", budget: "$1200 USDC" },
    { title: "Crypto Education Blog Series (10 Articles)", desc: "Write a 10-part blog series covering DeFi concepts from basics to advanced strategies. Each article should be 1500+ words.", budget: "$800 USDC" },
    { title: "Whitepaper Writing and Design", desc: "Write and design a professional whitepaper for a blockchain project. Include technical architecture, tokenomics, and roadmap.", budget: "$2000 USDC" },
    { title: "Protocol Documentation Overhaul", desc: "Rewrite and restructure existing protocol documentation. Improve clarity, add code examples, and create getting-started guides.", budget: "$1500 USDC" },
    { title: "Video Script for Crypto Explainer Series", desc: "Write scripts for 5 explainer videos covering DeFi, NFTs, DAOs, Layer 2s, and Account Abstraction. Each 5-8 minutes.", budget: "$600 USDC" },
    { title: "Newsletter Content Strategy and Writing", desc: "Develop a content strategy for a weekly crypto newsletter. Write the first 4 editions with market analysis and project reviews.", budget: "$500 USDC" },
    { title: "API Documentation with Interactive Examples", desc: "Create interactive API documentation with live code examples, authentication guides, and rate limit explanations.", budget: "$900 USDC" },
    { title: "Tokenomics Explainer and Infographic", desc: "Create a detailed tokenomics article with custom infographics explaining supply dynamics, utility, and value capture.", budget: "$400 USDC" },
    { title: "Developer Tutorial Series", desc: "Write a series of step-by-step developer tutorials covering smart contract development, testing, and deployment.", budget: "$1000 USDC" },
    { title: "Pitch Deck Content and Copywriting", desc: "Write compelling copy for a pitch deck targeting crypto VCs. Include problem statement, solution, market size, and team narrative.", budget: "$700 USDC" },
    { title: "Technical Blog Post: Zero Knowledge Proofs", desc: "Write an in-depth technical blog post explaining ZK proofs with practical examples and implementation considerations.", budget: "$500 USDC" },
    { title: "Product Launch Announcement Copy", desc: "Write announcement copy for a product launch across blog, Twitter threads, Discord announcements, and press releases.", budget: "$400 USDC" },
    { title: "Case Study: Protocol Integration Success", desc: "Write a detailed case study documenting a successful protocol integration including challenges, solutions, and metrics.", budget: "$600 USDC" },
    { title: "Monthly Market Report Template", desc: "Design a monthly market report template and write the first edition covering market trends, top performers, and outlook.", budget: "$500 USDC" },
    { title: "SDK Quick-Start Guide with Examples", desc: "Create a quick-start guide for a TypeScript SDK with copy-paste code examples for the 10 most common use cases.", budget: "$800 USDC" },
    { title: "Governance Proposal Writing", desc: "Draft 3 governance proposals for a DAO including background research, impact analysis, and implementation specifications.", budget: "$600 USDC" },
    { title: "Security Best Practices Guide for Users", desc: "Write a comprehensive security guide for crypto users covering wallet security, phishing prevention, and safe DeFi practices.", budget: "$400 USDC" },
    { title: "Comparison Article: L2 Solutions", desc: "Write an objective comparison article covering Optimism, Arbitrum, Base, and zkSync with technical benchmarks and UX analysis.", budget: "$500 USDC" },
    { title: "Release Notes and Changelog Writing", desc: "Write professional release notes for 6 months of software releases. Include user-facing summaries and technical details.", budget: "$300 USDC" },
    { title: "Community Guidelines and FAQ Documentation", desc: "Write comprehensive community guidelines, moderation policies, and FAQ documentation for a protocol's Discord and forums.", budget: "$400 USDC" },
  ],
  Design: [
    { title: "Full Brand Identity Design for Crypto Project", desc: "Design a complete brand identity including logo, color palette, typography, icon set, and brand guidelines document.", budget: "$2500 USDC" },
    { title: "DeFi Dashboard UI/UX Design", desc: "Design the UI/UX for a DeFi dashboard with portfolio tracking, swap interface, and yield farming management.", budget: "$2000 USDC" },
    { title: "NFT Collection Art (100 Unique Pieces)", desc: "Create artwork for a 100-piece NFT collection with consistent style, variable traits, and metadata generation.", budget: "$3000 USDC" },
    { title: "Mobile Wallet App Design (iOS + Android)", desc: "Design a mobile crypto wallet app with send/receive, token management, DApp browser, and transaction history screens.", budget: "$3500 USDC" },
    { title: "Landing Page Design for Token Launch", desc: "Design a high-converting landing page for a token launch with countdown, tokenomics section, and team showcase.", budget: "$1000 USDC" },
    { title: "Social Media Asset Pack", desc: "Create a comprehensive social media asset pack with templates for Twitter, Discord banners, and Instagram posts.", budget: "$500 USDC" },
    { title: "Protocol Logo and Icon Design", desc: "Design a modern, memorable logo and icon set for a blockchain protocol. Include variations for light/dark themes.", budget: "$800 USDC" },
    { title: "Data Visualization Design System", desc: "Create a design system for financial data visualizations including charts, graphs, heatmaps, and statistical components.", budget: "$1500 USDC" },
    { title: "Trading Interface UI Design", desc: "Design a professional trading interface with order books, charts, position management, and advanced order types.", budget: "$2500 USDC" },
    { title: "Staking Dashboard UI Design", desc: "Design an intuitive staking dashboard showing rewards, validators, lock periods, and withdrawal interfaces.", budget: "$1200 USDC" },
    { title: "DAO Governance Portal Design", desc: "Design a governance portal with proposal cards, voting interface, delegation UI, and treasury visualization.", budget: "$1800 USDC" },
    { title: "Crypto Onboarding Flow Design", desc: "Design a smooth onboarding flow for crypto newcomers including wallet creation, fiat on-ramp, and first transaction.", budget: "$1200 USDC" },
    { title: "Token Swap Widget Design", desc: "Design an embeddable token swap widget with token selection, price impact display, and transaction confirmation.", budget: "$600 USDC" },
    { title: "Email Template Designs", desc: "Create a set of 10 responsive email templates for a crypto platform including onboarding, transactions, and alerts.", budget: "$500 USDC" },
    { title: "Animated Logo and Loading Screens", desc: "Create animated versions of an existing logo for use as loading screens, splash screens, and social media content.", budget: "$800 USDC" },
    { title: "Bridge Interface Design", desc: "Design a cross-chain bridge interface with chain selection, amount input, fee estimation, and transaction tracking.", budget: "$1000 USDC" },
    { title: "Dark Mode Design System Overhaul", desc: "Redesign an existing light-mode design system for dark mode with optimized contrast ratios and visual hierarchy.", budget: "$900 USDC" },
    { title: "Pitch Deck Design (20 Slides)", desc: "Design a visually stunning pitch deck with custom illustrations, data visualizations, and consistent branding.", budget: "$1200 USDC" },
    { title: "Notification and Alert UI Components", desc: "Design a comprehensive set of notification and alert UI components for a web3 application across all states.", budget: "$400 USDC" },
    { title: "Gamification UI Elements for Web3 App", desc: "Design gamification elements including badges, levels, streaks, leaderboards, and achievement unlock animations.", budget: "$1000 USDC" },
  ],
  Research: [
    { title: "DeFi Yield Strategy Research Report", desc: "Research and document the top 20 yield strategies across DeFi protocols. Include risk analysis, historical returns, and capital requirements.", budget: "$1200 USDC" },
    { title: "Blockchain Scalability Solutions Comparison", desc: "Research and compare scalability approaches: rollups, sharding, sidechains, and state channels. Include performance benchmarks.", budget: "$1000 USDC" },
    { title: "Regulatory Landscape Analysis for Crypto", desc: "Comprehensive research on crypto regulations across US, EU, UK, and Asia. Include compliance requirements and upcoming legislation.", budget: "$1500 USDC" },
    { title: "Competitor Intelligence Report for L2 Network", desc: "Deep-dive research report on competing L2 networks covering technology, adoption metrics, ecosystem, and developer experience.", budget: "$800 USDC" },
    { title: "Token Valuation Framework Research", desc: "Research and develop a token valuation framework covering DCF models, comparable analysis, and on-chain metrics.", budget: "$900 USDC" },
    { title: "Zero Knowledge Proof Technology Survey", desc: "Survey current ZK proof technologies including SNARKs, STARKs, and PLONK. Compare proving time, proof size, and use cases.", budget: "$1200 USDC" },
    { title: "MEV Research and Mitigation Strategies", desc: "Research Maximal Extractable Value: quantify MEV on major chains, analyze extraction methods, and evaluate mitigation solutions.", budget: "$1000 USDC" },
    { title: "Account Abstraction Ecosystem Research", desc: "Research the ERC-4337 ecosystem including wallets, bundlers, paymasters, and emerging use cases.", budget: "$700 USDC" },
    { title: "Decentralized Identity Standards Research", desc: "Research decentralized identity standards (DIDs, VCs, soulbound tokens) and their adoption across Web3 platforms.", budget: "$800 USDC" },
    { title: "Cross-Chain Messaging Protocol Comparison", desc: "Compare cross-chain messaging protocols including LayerZero, Wormhole, Axelar, and CCIP on security, speed, and cost.", budget: "$900 USDC" },
    { title: "AI x Crypto Integration Opportunities", desc: "Research the intersection of AI and blockchain, identifying practical integration opportunities and emerging projects.", budget: "$1000 USDC" },
    { title: "Institutional Crypto Adoption Research", desc: "Research institutional adoption of crypto including custody solutions, regulatory frameworks, and investment products.", budget: "$1200 USDC" },
    { title: "DePIN Sector Analysis", desc: "Research the Decentralized Physical Infrastructure Networks sector covering compute, storage, wireless, and sensor networks.", budget: "$800 USDC" },
    { title: "Restaking and Shared Security Research", desc: "Research restaking protocols, shared security models, and their implications for validator economics and network security.", budget: "$900 USDC" },
    { title: "Data Availability Solutions Research", desc: "Compare data availability solutions including Celestia, EigenDA, and Avail. Analyze costs, throughput, and security models.", budget: "$700 USDC" },
    { title: "Crypto Gaming Economics Research", desc: "Research the economics of crypto gaming including token models, player retention, and sustainable reward structures.", budget: "$600 USDC" },
    { title: "Privacy Protocols Comparison", desc: "Research and compare privacy solutions across blockchains including mixers, confidential transactions, and privacy chains.", budget: "$800 USDC" },
    { title: "Decentralized Social Media Landscape", desc: "Research the decentralized social media ecosystem including Lens, Farcaster, and Nostr. Analyze adoption and business models.", budget: "$700 USDC" },
    { title: "Liquid Staking Derivatives Research", desc: "Research liquid staking protocols, their market dynamics, risks, and impact on network security and DeFi composability.", budget: "$900 USDC" },
    { title: "Real World Asset Tokenization Research", desc: "Research RWA tokenization covering legal frameworks, technical implementations, and market opportunities.", budget: "$1200 USDC" },
  ],
  Social: [
    { title: "Twitter/X Growth Strategy for Web3 Project", desc: "Develop and execute a Twitter growth strategy including content calendar, engagement tactics, and KOL outreach plan.", budget: "$800 USDC" },
    { title: "Discord Community Setup and Management", desc: "Set up a professional Discord server with channels, roles, bots, and moderation. Manage community for the first month.", budget: "$1000 USDC" },
    { title: "Telegram Community Management (30 Days)", desc: "Manage a Telegram community for 30 days including moderation, engagement, announcements, and member support.", budget: "$600 USDC" },
    { title: "Influencer Marketing Campaign", desc: "Plan and execute a crypto influencer marketing campaign reaching 500K+ followers across Twitter and YouTube.", budget: "$2000 USDC" },
    { title: "Social Media Content Creation (30 Days)", desc: "Create 30 days of social media content including graphics, memes, threads, and engagement posts.", budget: "$500 USDC" },
    { title: "Community Ambassador Program Design", desc: "Design and launch a community ambassador program with tasks, rewards, tracking, and performance metrics.", budget: "$700 USDC" },
    { title: "Viral Meme Marketing Campaign", desc: "Create and distribute viral meme content for a crypto project. Target: 1M impressions across crypto Twitter.", budget: "$400 USDC" },
    { title: "AMA Session Series Organization", desc: "Organize 4 AMA sessions across Twitter Spaces, Discord, and Telegram. Handle scheduling, promotion, and follow-up.", budget: "$500 USDC" },
    { title: "Social Listening and Sentiment Analysis", desc: "Set up social listening tools and provide weekly sentiment analysis reports covering brand mentions and competitor activity.", budget: "$800 USDC" },
    { title: "YouTube Channel Launch and Content Plan", desc: "Launch a YouTube channel for a crypto project with branding, initial 5 videos planned, and growth strategy.", budget: "$1200 USDC" },
    { title: "Community Engagement Campaign", desc: "Design and run a 2-week community engagement campaign with quests, prizes, and gamification to boost activity.", budget: "$600 USDC" },
    { title: "Crisis Communication Plan", desc: "Develop a crisis communication plan for a crypto project covering exploit scenarios, FUD response, and transparency protocols.", budget: "$500 USDC" },
    { title: "Newsletter Setup and First 5 Editions", desc: "Set up an email newsletter platform, design templates, and write the first 5 weekly newsletters.", budget: "$400 USDC" },
    { title: "Reddit Strategy and Community Building", desc: "Develop a Reddit presence strategy including subreddit management, content posting, and community engagement.", budget: "$500 USDC" },
    { title: "Partnership and Collaboration Outreach", desc: "Identify and reach out to 20 potential partnership targets. Handle initial conversations and proposal drafting.", budget: "$800 USDC" },
    { title: "Social Media Advertising Campaign", desc: "Plan and manage a paid social media campaign across approved crypto ad platforms with targeting and optimization.", budget: "$1500 USDC" },
    { title: "Community Feedback Collection System", desc: "Design and implement a system for collecting and organizing community feedback to inform product development.", budget: "$400 USDC" },
    { title: "Twitter Spaces Series Hosting", desc: "Host a weekly Twitter Spaces series for 4 weeks with guest speakers, topic planning, and audience engagement.", budget: "$600 USDC" },
    { title: "Fan Art and Community Content Program", desc: "Launch a fan art program with submissions, voting, prizes, and showcase of winning artwork across social channels.", budget: "$300 USDC" },
    { title: "Localized Community Management", desc: "Set up and manage localized communities in 3 languages (Spanish, Chinese, Japanese) with dedicated moderators.", budget: "$1200 USDC" },
  ],
  Legal: [
    { title: "Token Classification Legal Opinion", desc: "Provide a legal opinion on whether a proposed token constitutes a security under US and EU regulations.", budget: "$2500 USDC" },
    { title: "Terms of Service for DApp", desc: "Draft comprehensive Terms of Service for a decentralized application covering user rights, liabilities, and dispute resolution.", budget: "$1500 USDC" },
    { title: "Privacy Policy Compliant with GDPR and CCPA", desc: "Draft a privacy policy compliant with GDPR and CCPA for a crypto platform that handles user data and wallet addresses.", budget: "$1000 USDC" },
    { title: "DAO Legal Wrapper Setup", desc: "Research and set up a legal wrapper for a DAO including entity formation, operating agreement, and tax considerations.", budget: "$3000 USDC" },
    { title: "Smart Contract Legal Review", desc: "Legal review of smart contract terms and conditions. Ensure code-is-law principles are properly framed legally.", budget: "$1200 USDC" },
    { title: "Regulatory Compliance Assessment", desc: "Assess a crypto project's compliance with regulations across 5 key jurisdictions. Provide a gap analysis and remediation plan.", budget: "$2000 USDC" },
    { title: "VASP Registration Advisory", desc: "Provide advisory on Virtual Asset Service Provider registration requirements in EU, UK, and Singapore.", budget: "$1800 USDC" },
    { title: "Intellectual Property Strategy for Protocol", desc: "Develop an IP strategy covering trademarks, patents, and open-source licensing for a blockchain protocol.", budget: "$1500 USDC" },
    { title: "Token Sale Legal Framework", desc: "Create a legal framework for a token sale including SAFT agreements, contribution terms, and jurisdictional restrictions.", budget: "$2500 USDC" },
    { title: "NFT Royalty Enforcement Legal Research", desc: "Research the legal enforceability of NFT royalties across jurisdictions and propose contractual mechanisms.", budget: "$800 USDC" },
    { title: "DeFi Protocol Liability Analysis", desc: "Analyze potential liabilities for DeFi protocol developers and governance participants under current regulations.", budget: "$1200 USDC" },
    { title: "Cross-Border Transaction Compliance", desc: "Review cross-border crypto transaction compliance including travel rule, sanctions screening, and reporting requirements.", budget: "$1500 USDC" },
    { title: "Employee Token Compensation Legal Guide", desc: "Create a legal guide for structuring token-based employee compensation including tax implications and vesting.", budget: "$1000 USDC" },
    { title: "Data Protection Impact Assessment", desc: "Conduct a DPIA for a blockchain-based application that processes personal data, including on-chain and off-chain data.", budget: "$1200 USDC" },
    { title: "Open Source License Compliance Review", desc: "Review a project's open source license compliance across all dependencies and provide remediation recommendations.", budget: "$800 USDC" },
    { title: "MiCA Regulation Compliance Assessment", desc: "Assess compliance requirements under the EU Markets in Crypto-Assets regulation for a token issuer.", budget: "$2000 USDC" },
    { title: "Bug Bounty Program Legal Framework", desc: "Create a legal framework for a bug bounty program including safe harbor provisions and responsible disclosure terms.", budget: "$700 USDC" },
    { title: "Airdrop Legal Compliance Review", desc: "Review the legal implications of conducting a token airdrop across multiple jurisdictions. Provide compliance guidance.", budget: "$900 USDC" },
    { title: "Partnership Agreement Template for DAOs", desc: "Draft a partnership agreement template suitable for DAO-to-DAO and DAO-to-company collaborations.", budget: "$800 USDC" },
    { title: "Regulatory Monitoring Service Setup", desc: "Set up a regulatory monitoring system tracking crypto regulation changes across 10 key jurisdictions.", budget: "$1000 USDC" },
  ],
  Translation: [
    { title: "Whitepaper Translation to Chinese (Mandarin)", desc: "Translate a 30-page technical whitepaper from English to Simplified Chinese with crypto-specific terminology accuracy.", budget: "$1000 USDC" },
    { title: "dApp Interface Localization (Spanish)", desc: "Localize an entire dApp interface to Spanish including all UI strings, error messages, and help documentation.", budget: "$800 USDC" },
    { title: "Technical Documentation Translation (Japanese)", desc: "Translate developer documentation including API reference, tutorials, and integration guides from English to Japanese.", budget: "$1200 USDC" },
    { title: "Marketing Materials Translation (Korean)", desc: "Translate marketing materials including website copy, social media posts, and pitch deck to Korean.", budget: "$600 USDC" },
    { title: "Community Guidelines Translation (5 Languages)", desc: "Translate community guidelines and FAQ to Chinese, Japanese, Korean, Spanish, and Portuguese.", budget: "$1500 USDC" },
    { title: "Smart Contract Comments Translation (French)", desc: "Translate all smart contract NatSpec comments and developer documentation from English to French.", budget: "$400 USDC" },
    { title: "Blog Article Translation Series (German)", desc: "Translate 10 technical blog articles covering DeFi concepts from English to German with SEO optimization.", budget: "$700 USDC" },
    { title: "Video Subtitle Creation (Turkish)", desc: "Create Turkish subtitles for 10 educational videos about blockchain technology and DeFi concepts.", budget: "$500 USDC" },
    { title: "Terms of Service Translation (Arabic)", desc: "Translate Terms of Service and Privacy Policy from English to Arabic with legal accuracy.", budget: "$600 USDC" },
    { title: "App Store Description Localization (10 Languages)", desc: "Localize app store descriptions, screenshots, and metadata for 10 languages for a crypto mobile wallet.", budget: "$800 USDC" },
    { title: "Governance Proposal Translation (Russian)", desc: "Translate governance proposals, voting guides, and DAO documentation from English to Russian.", budget: "$400 USDC" },
    { title: "Newsletter Translation (Vietnamese)", desc: "Provide ongoing translation of weekly newsletters from English to Vietnamese for 3 months.", budget: "$900 USDC" },
    { title: "Customer Support Scripts (Hindi)", desc: "Translate customer support scripts, canned responses, and troubleshooting guides to Hindi.", budget: "$300 USDC" },
    { title: "Tokenomics Report Translation (Italian)", desc: "Translate a detailed tokenomics analysis report from English to Italian with accurate financial terminology.", budget: "$500 USDC" },
    { title: "Discord Bot Localization (Thai)", desc: "Localize all Discord bot responses, commands, and help messages to Thai language.", budget: "$400 USDC" },
    { title: "Press Release Translation (Dutch)", desc: "Translate 5 press releases from English to Dutch with PR-appropriate tone and crypto terminology.", budget: "$350 USDC" },
    { title: "User Onboarding Flow Translation (Polish)", desc: "Translate the complete user onboarding flow including tooltips, walkthroughs, and confirmation messages to Polish.", budget: "$400 USDC" },
    { title: "Audit Report Translation (Portuguese)", desc: "Translate a technical security audit report from English to Portuguese (Brazilian) with precise technical language.", budget: "$600 USDC" },
    { title: "Educational Course Content (Indonesian)", desc: "Translate a 20-module educational course about blockchain from English to Indonesian.", budget: "$800 USDC" },
    { title: "Multi-Language SEO Content (Swedish)", desc: "Create SEO-optimized translations of 15 landing pages from English to Swedish.", budget: "$700 USDC" },
  ],
  Other: [
    { title: "Blockchain Conference Event Planning", desc: "Plan and coordinate a blockchain conference booth including design, logistics, staffing, and promotional materials.", budget: "$2000 USDC" },
    { title: "Crypto Project Advisory (10 Hours)", desc: "Provide 10 hours of strategic advisory for a crypto project covering tokenomics, go-to-market, and fundraising.", budget: "$1500 USDC" },
    { title: "Talent Recruitment for Web3 Startup", desc: "Source and screen candidates for 3 engineering roles at a Web3 startup. Handle initial outreach and interviews.", budget: "$1200 USDC" },
    { title: "Community Survey Design and Analysis", desc: "Design a comprehensive community survey, distribute it, and provide detailed analysis of results with recommendations.", budget: "$500 USDC" },
    { title: "Blockchain Workshop Facilitation (Virtual)", desc: "Facilitate a 4-hour virtual workshop teaching blockchain basics to a corporate audience of 50 people.", budget: "$800 USDC" },
    { title: "Protocol Benchmarking Study", desc: "Benchmark a protocol's performance against 5 competitors across speed, cost, reliability, and developer experience.", budget: "$1000 USDC" },
    { title: "Investor Relations Material Preparation", desc: "Prepare investor relations materials including data room, financial projections, and due diligence documentation.", budget: "$2000 USDC" },
    { title: "User Onboarding Optimization", desc: "Analyze current user onboarding flow, identify drop-off points, and propose optimizations with A/B test designs.", budget: "$700 USDC" },
    { title: "Bug Bounty Program Management", desc: "Set up and manage a bug bounty program including scope definition, triage process, and researcher communication.", budget: "$900 USDC" },
    { title: "Product Roadmap Development", desc: "Develop a 12-month product roadmap based on market research, user feedback, and technical feasibility assessment.", budget: "$1200 USDC" },
    { title: "Ecosystem Grant Application Writing", desc: "Write 5 ecosystem grant applications targeting Ethereum, Base, Optimism, and Arbitrum grant programs.", budget: "$600 USDC" },
    { title: "Data Room Setup for Fundraising", desc: "Set up a comprehensive data room for Series A fundraising including all financial, legal, and technical documents.", budget: "$800 USDC" },
    { title: "Customer Success Process Design", desc: "Design a customer success process for a B2B crypto platform including onboarding, check-ins, and churn prevention.", budget: "$700 USDC" },
    { title: "Hackathon Organization and Management", desc: "Organize a virtual hackathon including challenge design, judging criteria, prize distribution, and participant support.", budget: "$1500 USDC" },
    { title: "Performance Monitoring Setup", desc: "Set up comprehensive performance monitoring for a blockchain application including uptime, latency, and error tracking.", budget: "$600 USDC" },
    { title: "Token Listing Strategy and Execution", desc: "Develop and execute a strategy for listing a token on centralized exchanges including applications and market making.", budget: "$2000 USDC" },
    { title: "Retrospective Analysis of Failed Projects", desc: "Research and document 10 failed crypto projects, analyzing common failure patterns and extracting lessons learned.", budget: "$500 USDC" },
    { title: "Community Rewards System Design", desc: "Design a points-based community rewards system with tiers, redeemable benefits, and anti-gaming measures.", budget: "$600 USDC" },
    { title: "Technical Architecture Review", desc: "Review the technical architecture of a blockchain application and provide recommendations for scalability and reliability.", budget: "$1000 USDC" },
    { title: "Protocol Onboarding Kit for Partners", desc: "Create a comprehensive onboarding kit for protocol partners including documentation, branding assets, and integration guide.", budget: "$800 USDC" },
  ],
};

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db("hive");
  const tasksCol = db.collection("tasks");

  const allTasks = [];
  const now = new Date();

  for (const [category, tasks] of Object.entries(TASK_DATA)) {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      // Stagger creation dates over the last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const createdAt = new Date(now.getTime() - daysAgo * 86400000 - hoursAgo * 3600000);

      allTasks.push({
        title: task.title,
        description: task.desc,
        category,
        budget: task.budget,
        status: "Open",
        clientAddress: POSTER_ADDRESS,
        clientName: POSTER_NAME,
        tags: [category.toLowerCase()],
        requirements: "",
        proposalsCount: 0,
        createdAt,
        updatedAt: createdAt,
      });
    }
  }

  console.log(`Inserting ${allTasks.length} tasks across ${Object.keys(TASK_DATA).length} categories...`);
  const result = await tasksCol.insertMany(allTasks);
  console.log(`✅ Inserted ${result.insertedCount} tasks successfully!`);

  // Print summary
  for (const cat of Object.keys(TASK_DATA)) {
    const count = allTasks.filter(t => t.category === cat).length;
    console.log(`  ${cat}: ${count} tasks`);
  }

  await client.close();
  console.log("Done!");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
