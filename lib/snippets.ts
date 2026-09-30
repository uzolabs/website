// Quickstart snippets, built from lib/network.ts so chain data lives in one place.
import { contracts, explorerName, mainnet, testnet } from "@/lib/network"

export const viemSnippet = `import { defineChain, createPublicClient, http } from 'viem'

export const botChain = defineChain({
  id: ${mainnet.chainId},
  name: '${mainnet.name}',
  nativeCurrency: { name: '${mainnet.nativeToken}', symbol: '${mainnet.nativeToken}', decimals: 18 },
  rpcUrls: { default: { http: ['${mainnet.rpc}'] } },
  blockExplorers: { default: { name: '${explorerName}', url: '${mainnet.explorer}' } },
  contracts: {
    multicall3: { address: '${contracts.multicall3}' },
  },
})

const client = createPublicClient({ chain: botChain, transport: http() })
console.log(await client.getBlockNumber())
`

export const hardhatSnippet = `import { configVariable, defineConfig } from 'hardhat/config'
import hardhatToolboxViem from '@nomicfoundation/hardhat-toolbox-viem'

export default defineConfig({
  plugins: [hardhatToolboxViem],
  solidity: '0.8.28',
  networks: {
    botTestnet: {
      type: 'http',
      url: '${testnet.rpc}',
      chainId: ${testnet.chainId},
      accounts: [configVariable('BOT_PRIVATE_KEY')],
    },
    botMainnet: {
      type: 'http',
      url: '${mainnet.rpc}',
      chainId: ${mainnet.chainId},
      accounts: [configVariable('BOT_PRIVATE_KEY')],
    },
  },
})
`

export const hardhatDeploy = `npx hardhat keystore set BOT_PRIVATE_KEY
npx hardhat ignition deploy ignition/modules/Counter.ts --network botTestnet`

export const foundrySnippet = `[profile.default]
src = "src"
out = "out"
libs = ["lib"]

[rpc_endpoints]
bot_mainnet = "${mainnet.rpc}"
bot_testnet = "${testnet.rpc}"
`

export const foundryDeploy = `# Import a key once: cast wallet import deployer --interactive
forge create src/Counter.sol:Counter \\
  --rpc-url bot_testnet \\
  --account deployer \\
  --broadcast`
