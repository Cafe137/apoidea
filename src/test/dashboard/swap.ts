import assert from 'assert'
import { chromium } from 'playwright'
import { Server } from '../../server'

export async function BeeDashboardSwap(server: Server) {
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

    // Perform swap
    await page.click('text=Account')
    await page.click('text=Top up Wallet')
    await page.click('text=Use xDAI')
    await page.waitForSelector('text=13.9529')
    await page.click('text=Proceed')
    await page.click('text=Swap Now')

    await context.close()
    await browser.close()
}
