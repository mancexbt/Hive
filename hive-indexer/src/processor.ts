import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { lookupArchive } from '@subsquid/archive-registry'

export const CONTRACT_ADDRESS = '0x7235CC0A934C37c8218805E3e244BB82905D8d0E'.toLowerCase()

export const processor = new EvmBatchProcessor()
    .setGateway(lookupArchive('base-sepolia'))
    .setRpcEndpoint({
        url: process.env.RPC_URL || 'https://sepolia.base.org',
        rateLimit: 10
    })
    .setFinalityConfirmation(10)
    .setBlockRange({ from: 20500000 }) // Approximate deployment block
    .addLog({
        address: [CONTRACT_ADDRESS],
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
    })
