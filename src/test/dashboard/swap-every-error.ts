import assert from 'assert'
import { chromium } from 'playwright'
import { Server } from '../../server'

export async function BeeDashboardSwapEveryError(server: Server) {
    const browser = await chromium.launch({ headless: false, slowMo: 300 })
    const context = await browser.newContext()
    const page = await context.newPage()

    // Go to Dashboard with dummy API key
    await page.goto('http://localhost:3002?v=1')
    assert((await page.title()) === 'Swarm')

    // Set RPC to fake-bee
    await page.click('text=Settings')
    await page.click('.MuiIconButton-label')
    await page.fill('.MuiInputBase-input', 'http://localhost:1635')
    await page.click('text=Save and restart')

    // Navigate
    await page.click('text=Account')
    await page.click('text=Top up Wallet')
    await page.click('text=Use xDAI')
    await page.waitForSelector('text=13.9529')
    await page.click('text=Proceed')

    // No API key
    await page.evaluate("window.localStorage.removeItem('apiKey')")
    await page.click('text=Swap Now')
    await page.waitForSelector('text=API key is not set, reopen dashboard through Swarm Desktop')

    // Invalid API key
    await page.reload()
    await page.evaluate("window.localStorage.setItem('apiKey', 'invalid')")
    await page.click('text=Swap Now')
    await page.waitForSelector('text=Bad API key, reopen dashboard through Swarm Desktop')

    // Desktop API unreachable
    await page.reload()
    await page.evaluate("window.localStorage.setItem('apiKey', '1')")
    await server.setDesktop(false)
    await page.click('text=Swap Now')
    await page.waitForSelector('text=Unable to reach Desktop API, Swarm Desktop may not be running')

    // RPC not set
    await page.reload()
    await server.setDesktop(true)
    await server.setSwapEndpoint(false)
    await page.click('text=Swap Now')
    await page.waitForSelector('text=Swap endpoint is not configured in Swarm Desktop')

    // RPC unreachable
    await server.setSwapEndpoint('http://localhost:1337')
    await page.reload()
    await page.click('text=Swap Now')
    await page.waitForSelector('text=Swap endpoint not reachable at http://localhost:1337')

    await context.close()
    await browser.close()
}
