import { getAddress, isAddress, parseEther } from "viem"
import { cooldownHours, faucetAmount, faucetEnabled, publicClient, sendTestnetTokens } from "@/lib/faucet"
import { testnet } from "@/lib/network"

// Best effort only: this lives in one function instance's memory, so it resets on cold
// starts and is not shared across instances. Swap for a shared store before a wide launch.
const lastClaim = new Map<string, number>()

function fail(status: number, error: string) {
  return Response.json({ error }, { status })
}

export async function POST(request: Request) {
  if (!faucetEnabled) return fail(503, "The Uzo faucet is not switched on yet.")

  let address: unknown
  try {
    ;({ address } = await request.json())
  } catch {
    return fail(400, "Send a JSON body with an address.")
  }
  if (typeof address !== "string" || !isAddress(address.trim())) {
    return fail(400, "That does not look like a valid wallet address.")
  }
  const to = getAddress(address.trim())

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const now = Date.now()
  const windowMs = cooldownHours * 60 * 60 * 1000
  for (const key of [`addr:${to}`, `ip:${ip}`]) {
    const last = lastClaim.get(key)
    if (last && now - last < windowMs) {
      const hours = Math.ceil((windowMs - (now - last)) / 3_600_000)
      return fail(429, `You claimed recently. Try again in about ${hours} hour${hours === 1 ? "" : "s"}.`)
    }
  }

  const amount = parseEther(faucetAmount)
  const balance = await publicClient.getBalance({ address: to })
  if (balance >= amount) {
    return fail(429, `This wallet already holds at least ${faucetAmount} ${testnet.nativeToken}.`)
  }

  try {
    const hash = await sendTestnetTokens(to)
    lastClaim.set(`addr:${to}`, now)
    lastClaim.set(`ip:${ip}`, now)
    return Response.json({ hash, url: `${testnet.explorer}/tx/${hash}` })
  } catch (error) {
    console.error("faucet send failed", error)
    return fail(502, "The faucet could not send right now. It may be empty. Try again later.")
  }
}
