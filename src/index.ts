import { Server } from './server'
import { BeeDashboardBuyStampAndUploadFile } from './test/dashboard/buy-stamp-and-upload-file'
import { BeeDashboardGiftCardFund } from './test/dashboard/gift-card-fund'
import { BeeDashboardStartupIndicator } from './test/dashboard/startup-indicator'
import { BeeDashboardSwap } from './test/dashboard/swap'
import { BeeDashboardSwapEveryError } from './test/dashboard/swap-every-error'
import { BeeDashboardUpgrade } from './test/dashboard/upgrade'
import { SwarmCliBuyStampAndUploadFile } from './test/swarm-cli/buy-stamp-and-upload-file'
import { SwarmCliStake } from './test/swarm-cli/stake'
import { SwarmCliViewBalance } from './test/swarm-cli/view-balance'

async function main() {
    // [ Swarm-CLI ]
    await withLightNode(SwarmCliStake)
    await withLightNode(SwarmCliViewBalance)
    await withLightNode(SwarmCliBuyStampAndUploadFile)
    // [ Bee Dashboard ]
    await withLightNode(BeeDashboardGiftCardFund)
    await withLightNode(BeeDashboardStartupIndicator)
    await withLightNode(BeeDashboardSwapEveryError)
    await withLightNode(BeeDashboardSwap)
    await withLightNode(BeeDashboardBuyStampAndUploadFile)
    await withUltraLightNode(BeeDashboardUpgrade)
}

async function withLightNode(fn: (server: Server) => Promise<void>) {
    return withServer(fn, false)
}

async function withUltraLightNode(fn: (server: Server) => Promise<void>) {
    return withServer(fn, true)
}

async function withServer(fn: (server: Server) => Promise<void>, ultraLight: boolean) {
    const server = new Server(ultraLight)
    await server.start()
    try {
        await fn(server)
    } finally {
        await server.close()
    }
}

main()
