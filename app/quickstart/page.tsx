import Image from "next/image"
import { Arrow, Art, external, href } from "@/components/kit/bits"
import { CodeBlock } from "@/components/kit/code"
import { CopyButton } from "@/components/kit/copy"
import { PageHead } from "@/components/kit/page-head"
import { Tabs } from "@/components/kit/tabs"
import { explorerName, testnet } from "@/lib/network"
import { networkValues, quickstartNetworks, quickstartSteps } from "@/lib/quickstart"
import { faucetHref, pageMetadata, site } from "@/lib/site"
import { foundryDeploy, foundrySnippet, hardhatDeploy, hardhatSnippet, viemSnippet } from "@/lib/snippets"

export const metadata = pageMetadata({
  title: "Quickstart",
  description: `Claim test ${testnet.nativeToken}, add BOT Chain to viem, Hardhat or Foundry, and deploy your first contract to testnet.`,
  path: "/quickstart",
})

const tools = [
  {
    id: "viem",
    label: "viem",
    files: [{ name: "chain.ts", code: viemSnippet, lang: "ts" as const }],
  },
  {
    id: "hardhat",
    label: "Hardhat",
    files: [
      { name: "hardhat.config.ts", code: hardhatSnippet, lang: "ts" as const },
      { name: "terminal", code: hardhatDeploy, lang: "bash" as const },
    ],
  },
  {
    id: "foundry",
    label: "Foundry",
    files: [
      { name: "foundry.toml", code: foundrySnippet, lang: "toml" as const },
      { name: "terminal", code: foundryDeploy, lang: "bash" as const },
    ],
  },
]

export default function QuickstartPage() {
  return (
    <>
      <PageHead
        kicker="Quickstart"
        title={
          <>
            Zero to deployed, <span className="grad">on testnet.</span>
          </>
        }
        lead="Four steps from an empty folder to a contract you can see on the explorer. Every config on this page points at real endpoints."
        art="quickstart"
        actions={
          <>
            <a className="btn btn--primary" href={href(faucetHref)} {...external(faucetHref)}>
              Open the faucet
              <Arrow />
            </a>
            <a className="btn btn--glass" href={site.links.deploy} {...external(site.links.deploy)}>
              Or use Uzo Deploy
            </a>
          </>
        }
        facts={quickstartSteps.map((step, i) => ({
          label: `Step ${i + 1}`,
          value: <a href={`#${step.id}`}>{step.label}</a>,
        }))}
      />

      <section className="section" id="claim" aria-labelledby="claim-h">
        <div className="wrap split split--top">
          <div className="stack">
            <div className="head" style={{ marginBottom: 8 }}>
              <p className="label">Step 1 and 2</p>
              <h2 id="claim-h">
                Get on testnet. <span className="muted">Gas first, then the network.</span>
              </h2>
              <p className="lead">
                Deploying costs gas, even on testnet. Claim a little {testnet.nativeToken} for the wallet you will deploy
                from, then add the network to your wallet and tools.
              </p>
            </div>
            <div className="row">
              <a className="btn btn--primary" href={href(faucetHref)} {...external(faucetHref)}>
                Claim test {testnet.nativeToken}
                <Arrow />
              </a>
            </div>
            <Art name="network" className="qs-art" sizes="320px" />
          </div>
          <div className="stack" id="network">
            {quickstartNetworks.map(({ title, network }) => (
              <div className="net-card glass" key={network.key}>
                <header>
                  <h3>{title}</h3>
                </header>
                <ul className="rows">
                  {networkValues(network).map((row) => (
                    <li key={row.label}>
                      <span className="rows__name muted">{row.label}</span>
                      <span className="rows__value mono">
                        {row.link ? (
                          <a href={row.link} {...external(row.link)}>
                            {row.value}
                          </a>
                        ) : (
                          <span>{row.value}</span>
                        )}
                        {row.copy ? <CopyButton value={row.value} label={`${title} ${row.label}`} /> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="configure" aria-labelledby="configure-h">
        <div className="wrap split split--top">
          <div className="head">
            <p className="label">Step 3</p>
            <h2 id="configure-h">Configure your tool.</h2>
            <p className="lead">
              Pick viem for an app, or Hardhat or Foundry for contracts. Each one ends with the deploy command.
            </p>
          </div>
          <Tabs
            label="Tool"
            tabs={tools.map((tool) => ({
              id: tool.id,
              label: tool.label,
              panel: (
                <div className="stack">
                  {tool.files.map((file) => (
                    <CodeBlock key={file.name} code={file.code} lang={file.lang} filename={file.name} />
                  ))}
                </div>
              ),
            }))}
          />
        </div>
      </section>

      <section className="section" id="verify" aria-labelledby="verify-h">
        <div className="wrap split">
          <div className="stack">
            <div className="head" style={{ marginBottom: 8 }}>
              <p className="label">Step 4</p>
              <h2 id="verify-h">Find it on {explorerName}.</h2>
              <p className="lead">
                Copy the contract address from your deploy output and search for it on the testnet explorer. If it is
                there, you are on the path.
              </p>
            </div>
            <div className="row">
              <a className="btn btn--primary" href={testnet.explorer} {...external(testnet.explorer)}>
                Open {explorerName} testnet
                <Arrow />
              </a>
              <a className="btn btn--glass" href={href("/products#templates")}>
                Try a template next
              </a>
            </div>
            <div className="card glass">
              <h3>No setup? Deploy from your browser.</h3>
              <p>
                Uzo Deploy puts a token, an NFT collection or a tip jar on BOT Chain without a local toolchain, and
                verifies the source for you.
              </p>
              <a className="link" href={site.links.deploy} {...external(site.links.deploy)}>
                Open Uzo Deploy
                <Arrow />
              </a>
            </div>
          </div>
          <div className="shot glass">
            <Image
              src="/img/deploy-token-wide.webp"
              alt="Uzo Deploy with the Token template open: the form on the left and the deploy summary on the right"
              width={1400}
              height={805}
              sizes="(max-width: 860px) 92vw, 600px"
            />
          </div>
        </div>
      </section>
    </>
  )
}
