import { EvmBatchProcessor } from '@subsquid/evm-processor';
export declare const CONTRACT_ADDRESS: string;
export declare const processor: EvmBatchProcessor<{
    log: {
        transactionHash: true;
        data: true;
        topics: true;
    };
    block: {
        timestamp: true;
    };
}>;
