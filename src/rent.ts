/*
 * Pay rent on-chain, with both your landlord and rent amount shielded.
 */
import { Abi } from "viem";

import { mockContract, prune } from "../lib/util.js";

const ABI = [
  {
    name: "rent",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        type: "saddress",
        name: "landlord",
      },
      {
        type: "suint256",
        name: "amount",
      },
    ],
    outputs: [],
  },
];

const MOCK_LANDLORD = "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC";
const MOCK_AMOUNT = 1000;

(async () => {
  const contract = await mockContract(ABI as Abi);
  const { plaintextTx, shieldedTx } = await contract.dwrite.rent([
    MOCK_LANDLORD,
    MOCK_AMOUNT,
  ]);

  console.log("- [1] Gathering rent details...");
  console.log({ landlord: MOCK_LANDLORD, amount: MOCK_AMOUNT });

  console.log("\n- [2] Constructing transaction...");
  console.log(prune(plaintextTx));

  console.log("\n- [3] Encrypting...");
  console.log(prune(shieldedTx));
})();
