"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.functions = exports.events = void 0;
const p = __importStar(require("@subsquid/evm-codec"));
const evm_abi_1 = require("@subsquid/evm-abi");
exports.events = {
    AgentRegistered: (0, evm_abi_1.event)("0xda816ca2fc37b9eecec62ae8263008ec6be1afb38dc28bc9c7c51d7e348da9c2", "AgentRegistered(address,string)", { "agentAddress": (0, evm_abi_1.indexed)(p.address), "name": p.string }),
    BountyCreated: (0, evm_abi_1.event)("0xaa830c985894057f0d100743defcad006f0a1abc40d080c9a23acc9a81106849", "BountyCreated(uint256,address,uint256,string)", { "bountyId": (0, evm_abi_1.indexed)(p.uint256), "client": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256, "codeUri": p.string }),
    BountyFinalized: (0, evm_abi_1.event)("0xb83e349a728a54646364f9a2137d98e9ba63bf182cc5fff571516f66313cd64d", "BountyFinalized(uint256,address,uint256,bool)", { "bountyId": (0, evm_abi_1.indexed)(p.uint256), "agent": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256, "isValid": p.bool }),
    BountyRefunded: (0, evm_abi_1.event)("0xf1ed347f033f54c0d6f1589c933d81b4256cf2f72a785106e3653a565f7433a2", "BountyRefunded(uint256,address,uint256)", { "bountyId": (0, evm_abi_1.indexed)(p.uint256), "client": (0, evm_abi_1.indexed)(p.address), "amount": p.uint256 }),
    OwnershipTransferred: (0, evm_abi_1.event)("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", { "previousOwner": (0, evm_abi_1.indexed)(p.address), "newOwner": (0, evm_abi_1.indexed)(p.address) }),
    WorkSubmitted: (0, evm_abi_1.event)("0xd5d9bc882dc95f198786a74e52a0b87e49a07c80921b74821ba374339e394d30", "WorkSubmitted(uint256,address,string)", { "bountyId": (0, evm_abi_1.indexed)(p.uint256), "agent": (0, evm_abi_1.indexed)(p.address), "reportUri": p.string }),
};
exports.functions = {
    agentList: (0, evm_abi_1.viewFun)("0x2f80c54f", "agentList(uint256)", { "_0": p.uint256 }, p.address),
    agentReputation: (0, evm_abi_1.viewFun)("0x54de6e32", "agentReputation(address)", { "_0": p.address }, p.uint256),
    agents: (0, evm_abi_1.viewFun)("0xfd66091e", "agents(address)", { "_0": p.address }, { "name": p.string, "bio": p.string, "wallet": p.address, "isRegistered": p.bool, "registeredAt": p.uint256 }),
    bounties: (0, evm_abi_1.viewFun)("0xdc2f8744", "bounties(uint256)", { "_0": p.uint256 }, { "client": p.address, "amount": p.uint256, "codeUri": p.string, "isOpen": p.bool, "assignedAgent": p.address, "reportUri": p.string, "createdAt": p.uint256 }),
    bountyCounter: (0, evm_abi_1.viewFun)("0xa0d59787", "bountyCounter()", {}, p.uint256),
    createBounty: (0, evm_abi_1.fun)("0x06868c4b", "createBounty(string)", { "_codeUri": p.string }),
    finalizeBounty: (0, evm_abi_1.fun)("0x1aafcd53", "finalizeBounty(uint256,address,bool,uint256)", { "_bountyId": p.uint256, "_agent": p.address, "_isValid": p.bool, "_scoreToAdd": p.uint256 }),
    getAllAgents: (0, evm_abi_1.viewFun)("0x860e4ac6", "getAllAgents()", {}, p.array(p.struct({ "name": p.string, "bio": p.string, "wallet": p.address, "isRegistered": p.bool, "registeredAt": p.uint256 }))),
    getBounty: (0, evm_abi_1.viewFun)("0xee8c4bbf", "getBounty(uint256)", { "_bountyId": p.uint256 }, p.struct({ "client": p.address, "amount": p.uint256, "codeUri": p.string, "isOpen": p.bool, "assignedAgent": p.address, "reportUri": p.string, "createdAt": p.uint256 })),
    owner: (0, evm_abi_1.viewFun)("0x8da5cb5b", "owner()", {}, p.address),
    refundBounty: (0, evm_abi_1.fun)("0x58b1f29c", "refundBounty(uint256)", { "_bountyId": p.uint256 }),
    registerAgent: (0, evm_abi_1.fun)("0xff17aca4", "registerAgent(string,string)", { "_name": p.string, "_bio": p.string }),
    renounceOwnership: (0, evm_abi_1.fun)("0x715018a6", "renounceOwnership()", {}),
    submitWork: (0, evm_abi_1.fun)("0xda8accf9", "submitWork(uint256,string)", { "_bountyId": p.uint256, "_reportUri": p.string }),
    transferOwnership: (0, evm_abi_1.fun)("0xf2fde38b", "transferOwnership(address)", { "newOwner": p.address }),
};
class Contract extends evm_abi_1.ContractBase {
    agentList(_0) {
        return this.eth_call(exports.functions.agentList, { _0 });
    }
    agentReputation(_0) {
        return this.eth_call(exports.functions.agentReputation, { _0 });
    }
    agents(_0) {
        return this.eth_call(exports.functions.agents, { _0 });
    }
    bounties(_0) {
        return this.eth_call(exports.functions.bounties, { _0 });
    }
    bountyCounter() {
        return this.eth_call(exports.functions.bountyCounter, {});
    }
    getAllAgents() {
        return this.eth_call(exports.functions.getAllAgents, {});
    }
    getBounty(_bountyId) {
        return this.eth_call(exports.functions.getBounty, { _bountyId });
    }
    owner() {
        return this.eth_call(exports.functions.owner, {});
    }
}
exports.Contract = Contract;
