import assert from 'assert'
import { chromium } from 'playwright'
import { Server } from '../../server'

export async function BeeDashboardBuyStampAndUploadFile(server: Server) {
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

    // Buy a new stamp and assert its batch ID
    const expectedBatchId = await server.getNextBatchId()
    await page.click('text=Files')
    await page.click('text=Account')
    await page.click('text=Stamps')
    await page.click('text=Buy New Postage Stamp')
    await page.fill('input >> nth=0', '22')
    await page.fill('input >> nth=1', '30000000')
    await page.click('text=Buy New Stamp')
    await page.waitForSelector(`text=${expectedBatchId.slice(0, 8)}`)
    assert((await page.locator(`text=${expectedBatchId.slice(0, 8)}`).count()) === 1)

    // Upload a file
    await page.click('text=Files')
    const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('text=Add File')])
    await fileChooser.setFiles('package.json')
    await page.click('button', { hasText: 'Add Postage Stamp' } as any)
    await page.click('text=Please select a postage stamp...')
    await page.click(`text=${expectedBatchId.slice(0, 8)}`)
    await page.click('text=Proceed With Selected Stamp')
    await page.click('text=Upload To Your Node')

    await context.close()
    await browser.close()
}
