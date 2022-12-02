import { System } from 'cafe-utility'
import fetch from 'node-fetch'

export class Server {
    ultraLight: boolean

    constructor(ultraLight = false) {
        this.ultraLight = ultraLight
    }

    async start() {
        const flags = this.ultraLight ? ['--ultra-light'] : []
        return new Promise<void>(resolve => {
            System.runProcess(
                'npx',
                ['cafe-tui', 'fake-bee', '--instant-stamp', '--instant-usable', ...flags],
                { env: process.env },
                buffer => {
                    process.stdout.write(buffer.toString())
                    if (buffer.toString().includes('Up and running')) {
                        resolve()
                    }
                }
            )
        })
    }

    async getNextBatchId() {
        return await (await fetch('http://localhost:1633/meta/nextStamp')).text()
    }

    async close() {
        await fetch('http://localhost:1633/meta/server', { method: 'DELETE' }).catch(() => {})
    }

    async setDesktop(value: boolean) {
        await System.runProcess('npx', [
            'cafe-tui',
            'fake-bee-controller',
            'toggles.getDesktopConfiguration',
            String(value)
        ])
    }

    async setSwapEndpoint(value: string | boolean) {
        await System.runProcess('npx', [
            'cafe-tui',
            'fake-bee-controller',
            'desktopConfiguration.swap-endpoint',
            String(value)
        ])
    }

    async setHealth(value: boolean) {
        await System.runProcess('npx', ['cafe-tui', 'fake-bee-controller', 'toggles.health', String(value)])
    }

    async setReadiness(value: boolean) {
        await System.runProcess('npx', ['cafe-tui', 'fake-bee-controller', 'toggles.readiness', String(value)])
    }
}
