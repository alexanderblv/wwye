type BaseTx = {
    to: string;
    gas?: bigint;
    gasPrice?: bigint;
    nonce?: number;
    value?: bigint;
    data: string;
}

type PlaintextTx = BaseTx

type ShieldedTx = BaseTx & {
    encryptionPubkey: string;
}

export { BaseTx, PlaintextTx, ShieldedTx };
