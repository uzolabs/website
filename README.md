# Uzo Labs website

The marketing site for [Uzo Labs](https://uzolabs.xyz), the developer path for BOT Chain.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and shadcn/ui. Every page is static except the testnet faucet endpoint.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

- `app/`: routes (`/`, `/products`, `/quickstart`, `/roadmap`, `/faucet`) and the faucet API at `app/api/faucet`
- `components/`: sections, UI primitives and the Uli motifs in `components/uli/`
- `lib/network.ts`: all BOT Chain network data. Components read from here and never hard-code chain values.
- `lib/products.ts`, `lib/roadmap.ts`, `lib/snippets.ts`: page content and code samples

## Testnet faucet

The faucet is off until `FAUCET_PRIVATE_KEY` is set. See `.env.example`. Use a dedicated wallet that only holds testnet tBOT, never a mainnet key.

## License

The website code is released under the [MIT License](LICENSE).

The Uzo name, logo and Uli artwork are not covered by this license. They stay reserved to Uzo Labs, and forks must replace them with their own branding. This covers the wordmark, `app/icon.svg`, `app/opengraph-image.tsx`, and the motifs in `components/uli/` and `lib/uli.ts`.

Fonts in `public/fonts/` and `assets/og/` belong to their authors and keep their own licenses.

## Contact

uzolabsxyz@gmail.com

Uzo Labs is an independent project and is not affiliated with or endorsed by BOT Chain.
