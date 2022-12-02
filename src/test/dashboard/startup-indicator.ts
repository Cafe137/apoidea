import assert from 'assert'
import { chromium } from 'playwright'
import { Server } from '../../server'

export async function BeeDashboardStartupIndicator(server: Server) {
    const browser = await chromium.launch({ headless: false, slowMo: 300 })
    const context = await browser.newContext()
    const page = await context.newPage()

    await server.setHealth(false)
    await server.setReadiness(false)

    // Go to Dashboard with dummy API key
    await page.goto('http://localhost:3002?v=1')
    assert((await page.title()) === 'Swarm')

    await page.waitForSelector('text=Your node is not connected')
    await page.waitForSelector('text=You are not connected to Swarm')
    await page.waitForSelector('text=Node Error')

    await server.setHealth(true)

    await page.goto('http://localhost:3002?v=1')
    assert((await page.title()) === 'Swarm')

    await page.waitForSelector('text=Starting Up')
    await page.waitForSelector('text=Your Bee node is currently launching')
    await page.waitForSelector('text=Node Starting')

    await server.setReadiness(true)

    await page.goto('http://localhost:3002?v=1')
    assert((await page.title()) === 'Swarm')

    await page.waitForSelector('text=Your node is connected')
    await page.waitForSelector('text=You are connected to Swarm')
    await page.waitForSelector('text=Node OK')

    await context.close()
    await browser.close()
}
