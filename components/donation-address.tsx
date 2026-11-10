"use client"

import { QRCodeSVG } from "qrcode.react"
import { CopyButton } from "@/components/kit/copy"

type DonationAddressProps = { address: string; token: string; chainId: number; qr?: boolean }

/** The faucet's donation address with a copy button and, where there is room, a QR code to scan. */
export function DonationAddress({ address, token, chainId, qr = false }: DonationAddressProps) {
  return (
    <div className={qr ? "donate__body" : "stack-4"}>
      {qr ? (
        <div className="qr">
          <QRCodeSVG value={address} size={136} marginSize={0} title={`QR code for the faucet address ${address}`} />
        </div>
      ) : null}
      <div className="stack-2">
        <p className="address">
          <code>{address}</code>
          <CopyButton value={address} label="faucet address" />
        </p>
        <p className="muted">
          Testnet {token} only (chain {chainId}). Never send mainnet BOT or other tokens here.
        </p>
      </div>
    </div>
  )
}
