/*
 * Get your salary on-chain, with both your employer and salary shielded.
 */
import { AbiFunction } from "viem";

import { displayPlaintextTx, displayShieldedTx, mockContract } from "../lib/util.js";

const ABI_FUNC = {
  name: "payroll",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [
    {
      type: "saddress",
      name: "employee",
    },
    {
      type: "suint256",
      name: "paycheck",
    },
  ],
  outputs: [],
};

const MOCK_EMPLOYEE = "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC";
const MOCK_PAYCHECK = 2000;

(async () => {
  const contract = await mockContract(ABI_FUNC as AbiFunction);
  const { plaintextTx, shieldedTx } = await contract.dwrite.payroll([
    MOCK_EMPLOYEE,
    MOCK_PAYCHECK,
  ]);

  console.log();
  displayPlaintextTx(plaintextTx, ABI_FUNC as AbiFunction);
  displayShieldedTx(shieldedTx);
})();
