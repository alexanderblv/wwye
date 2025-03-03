import { AbiFunction, AbiParameter, http } from "viem";
import {
    createShieldedWalletClient,
    getShieldedContract,
    seismicDevnet,
} from "seismic-viem";
import { privateKeyToAccount } from "viem/accounts";
import chalk from 'chalk';

import { MOCK_PRIVKEY, MOCK_ADDRESS } from "./constants.js";
import { PlaintextTx, ShieldedTx } from "./types.js";

async function mockContract(abiFunc: AbiFunction) {
    const client = await createShieldedWalletClient({
        chain: seismicDevnet,
        transport: http(),
        account: privateKeyToAccount(MOCK_PRIVKEY),
    });

    const contract = getShieldedContract({
        abi: [abiFunc],
        address: MOCK_ADDRESS,
        client,
    });

    return contract;
}

function parseCalldata(calldata: string, abiFunc: AbiFunction) {
    let params = calldata.slice(10);

    const paramValues: string[] = [];
    while (params.length > 0) {
        paramValues.push('0x' + params.slice(0, 64).replace(/^0+/, ''));
        params = params.slice(64);
    }

    const result: Record<string, string> = {};

    const abiEntry = abiFunc;
    abiEntry.inputs.forEach((input: AbiParameter, i: number) => {
        result[input.name as string] = paramValues[i];
    });

    return result;
}

function displayPlaintextTx(plaintextTx: PlaintextTx, abiFunc: AbiFunction) {
    const parsedData = parseCalldata(plaintextTx.data, abiFunc);

    console.log('- CONSTRUCTING TRANSACTION...');
    console.log('----------------------------------');
    console.log(`to:        ${plaintextTx.to}`);
    Object.entries(parsedData).forEach(([key, value]) => {
        const padding = ' '.repeat(10 - key.length);
        console.log(`${key}:${padding}${chalk.red(value)}`);
    });
    console.log('----------------------------------\n');
}

function displayShieldedTx(shieldedTx: ShieldedTx) {
    console.log('- ENCRYPTING TRANSACTION...');
    console.log('----------------------------------');
    console.log(`to:        ${shieldedTx.to}`);
    console.log(`data:      ${chalk.green(shieldedTx.data)}`);
    console.log('----------------------------------\n');
}

export { displayPlaintextTx, displayShieldedTx, mockContract };
