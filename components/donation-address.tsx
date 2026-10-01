"use client"

import { QrCode, XIcon } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Dialog } from "radix-ui"
import { CopyButton } from "@/components/copy-button"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type DonationAddressProps = { address: string; token: string; chainId: number; className?: string }

/** The faucet's donation address with copy and scan-to-send actions. */
export function DonationAddress({ address, token, chainId, className }: DonationAddressProps) {
  return (
    <div
      className={cn(
        "@container flex items-center gap-1 rounded-2xl border border-glass-border bg-[#100e0c]/80 py-2 pr-2 pl-4",
        className,
      )}
    >
      {/* Always one line: the full address where it fits, a shortened one where it does not. */}
      <code className="min-w-0 flex-1 font-mono text-sm whitespace-nowrap">
        <span className="hidden @[27rem]:inline">{address}</span>
        <span className="@[27rem]:hidden" aria-hidden="true">
          {address.slice(0, 8)}...{address.slice(-7)}
        </span>
        <span className="sr-only @[27rem]:hidden">{address}</span>
      </code>
      <CopyButton value={address} label="faucet address" />

      <Dialog.Root>
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog.Trigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Show QR code for the faucet address"
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                <QrCode />
              </Button>
            </Dialog.Trigger>
          </TooltipTrigger>
          <TooltipContent>Show QR code</TooltipContent>
        </Tooltip>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-glass-border bg-popover p-6 text-center text-popover-foreground shadow-2xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:p-8">
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" className="absolute top-4 right-4 rounded-full">
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            </Dialog.Close>
            <Dialog.Title className="text-xl font-bold">Scan to donate</Dialog.Title>
            <Dialog.Description className="mt-2 text-muted-foreground">
              Scan with your mobile wallet, switch to BOT Chain testnet, and send any spare {token}.
            </Dialog.Description>
            <div className="mx-auto mt-6 w-fit rounded-2xl bg-white p-4">
              <QRCodeSVG value={address} size={208} marginSize={0} title={`QR code for ${address}`} />
            </div>
            <div className="mt-5 flex items-center gap-1 rounded-2xl border border-glass-border bg-glass py-2 pr-2 pl-4 text-left">
              <code className="min-w-0 flex-1 font-mono text-xs break-all">{address}</code>
              <CopyButton value={address} label="faucet address" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Testnet {token} only (chain {chainId}). Never send mainnet BOT or other tokens here.
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
