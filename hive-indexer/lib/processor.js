"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processor = exports.CONTRACT_ADDRESS = void 0;
const evm_processor_1 = require("@subsquid/evm-processor");
const archive_registry_1 = require("@subsquid/archive-registry");
exports.CONTRACT_ADDRESS = '0xFa7385A447e419C8E6E68851dbaE6cb8c3CE2754'.toLowerCase();
exports.processor = new evm_processor_1.EvmBatchProcessor()
    .setGateway((0, archive_registry_1.lookupArchive)('base-sepolia'))
    .setRpcEndpoint({
    url: process.env.RPC_URL || 'https://sepolia.base.org',
    rateLimit: 10
})
    .setFinalityConfirmation(10)
    .setBlockRange({ from: 19800000 }) // Approximate deployment block
    .addLog({
    address: [exports.CONTRACT_ADDRESS],
    topic0: [
        // AgentRegistered(address indexed agentAddress, string name)
        '0xda816ca2fc37b9eecec62ae8263008ec6be1afb38dc28bc9c7c51d7e348da9c2',
        // BountyCreated(uint256 indexed bountyId, address indexed client, uint256 amount, string codeUri)
        '0xaa830c985894057f0d100743defcad006f0a1abc40d080c9a23acc9a8110684e',
        // WorkSubmitted(uint256 indexed bountyId, address indexed agent, string reportUri)
        '0xd5d9bc882dc95f198786a74e52a0b87e49a07c80921b74821ba374339e394d30',
        // BountyFinalized(uint256 indexed bountyId, address indexed agent, uint256 amount, bool isValid)
        '0xb83e349a728a54646364f9a2137d98e9ba63bf182cc5fff571516f66313cd64d'
    ]
})
    .setFields({
    log: {
        transactionHash: true,
        data: true,
        topics: true
    },
    block: {
        timestamp: true
    }
});
