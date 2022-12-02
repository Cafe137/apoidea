import assert from 'assert'
import { chromium } from 'playwright'
import { Server } from '../../server'

export async function BeeDashboardGiftCardFund(server: Server) {
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

    // Perform Gift card fund
    await page.click('text=Account')
    await page.click('text=Top up wallet')
    await page.click('text=Use a gift code')
    await page.fill('input >> nth=0', '36b7efd913ca4cf880b8eeac5093fa27b0825906c600685b6abdd6566e6cfe8f')
    await page.click('text=Proceed')
    await page.waitForSelector('text=13.9529')
    await page.click('text=Send all funds to your node')
    await page.waitForSelector('text=Successfully funded node')

    await context.close()
    await browser.close()
}
