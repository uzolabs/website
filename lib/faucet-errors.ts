// Shared between the faucet API and the claim form, so it must stay free of server imports.

export type FaucetErrorCode =
  | "disabled"
  | "invalid_address"
  | "self_address"
  | "contract_address"
  | "cooldown"
  | "has_balance"
  | "faucet_empty"
  | "network_error"
  | "send_failed"
  | "offline"

type ErrorCopy = { title: string; hint: string; donate?: boolean; official?: boolean }

export const faucetErrors: Record<FaucetErrorCode, ErrorCopy> = {
  disabled: {
    title: "The faucet is not on yet",
    hint: "Use the official BOT Chain faucet for now.",
    official: true,
  },
  invalid_address: {
    title: "Wrong wallet address",
    hint: "Paste a full EVM address: 0x followed by 40 letters and numbers. Copy it straight from your wallet to avoid typos.",
  },
  self_address: {
    title: "That is the faucet itself",
    hint: "Paste the address of the wallet you will deploy from.",
  },
  contract_address: {
    title: "That is a contract, not a wallet",
    hint: "Send to an account you hold the key for, like your MetaMask or Rabby address.",
  },
  cooldown: {
    title: "Cooldown still running",
    hint: "Each wallet and connection can claim once per cooldown. Come back later, or try the official faucet.",
    official: true,
  },
  has_balance: {
    title: "You already have enough",
    hint: "This wallet holds enough to deploy and test. The faucet skips it so there is more for people starting from zero.",
  },
  faucet_empty: {
    title: "The faucet is running dry",
    hint: "There is not enough left to send and cover gas. If you have spare test tokens, a donation refills it for everyone.",
    donate: true,
    official: true,
  },
  network_error: {
    title: "Testnet is not responding",
    hint: "The faucet could not reach the BOT Chain testnet RPC. Nothing was sent. Try again in a minute.",
  },
  send_failed: {
    title: "The transaction failed",
    hint: "Nothing was sent and your cooldown did not start. Try again in a minute.",
  },
  offline: {
    title: "Could not reach the faucet",
    hint: "Check your connection and try again.",
  },
}

export function isFaucetErrorCode(value: unknown): value is FaucetErrorCode {
  return typeof value === "string" && value in faucetErrors
}
