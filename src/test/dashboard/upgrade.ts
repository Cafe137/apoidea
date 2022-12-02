import assert from 'assert'
import { chromium } from 'playwright'
import { Server } from '../../server'

export async function BeeDashboardUpgrade(server: Server) {
    const browser = await chromium.launch({ headless: false, slowMo: 300 })
    const context = await browser.newContext()
    const page = await context.newPage()

    // Go to Dashboard with dummy API key
    await page.goto('http://localhost:3002?v=1')
    assert((await page.title()) === 'Swarm')

    // Make sure we are in ultra light mode
    await page.waitForSelector('text=ultra-light')
    assert((await page.locator('text=ultra-light').count()) === 1)

    // Set RPC to fake-bee
    await page.click('text=Settings')
    await page.click('.MuiIconButton-label')
    await page.fill('.MuiInputBase-input', 'http://localhost:1635')
    await page.click('text=Save and restart')

    // Set up wallet and upgrade to light mode
    await page.click('text=Info')
    await page.click('text=Setup wallet')
    await page.click('text=Use xDAI')
    await page.waitForSelector('text=13.9529')
    await page.click('text=Proceed')
    await page.click('text=Swap Now and Upgrade')

    // Make sure we are in light mode
    await page.waitForSelector('text=Mode')
    await page.waitForSelector('text=Current wallet balance')
    await page.waitForSelector('text=light')
    assert((await page.locator('text=ultra-light').count()) === 0)

    await context.close()
    await browser.close()
}
