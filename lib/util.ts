import { Abi, ContractConstructorArgs, http } from "viem";
import {
    createShieldedWalletClient,
    getShieldedContract,
    seismicDevnet,
} from "seismic-viem";
import { privateKeyToAccount } from "viem/accounts";

import { MOCK_PRIVKEY, MOCK_ADDRESS } from "./constants.js";

type BaseTx = {
    to: string;
    gas?: number;
    gasPrice?: number;
    nonce: number;
    value?: bigint;
    data: string;
};

type PlaintextTx = BaseTx;
type EncryptedTx = BaseTx & {
    encryptionPubkey: string;
};
type PrunedTx = Pick<BaseTx, 'to' | 'nonce' | 'data'>;

function prune(tx: PlaintextTx | EncryptedTx): PrunedTx {
    return {
        to: tx.to,
        nonce: tx.nonce,
        data: tx.data,
    };
}

async function mockContract(abi: Abi): Promise<Contract> {
    const client = await createShieldedWalletClient({
        chain: seismicDevnet,
        transport: http(),
        account: privateKeyToAccount(MOCK_PRIVKEY),
    });

    const contract = getShieldedContract({
        abi,
        address: MOCK_ADDRESS,
        client,
    });

    return contract;
}

export { mockContract, prune };
