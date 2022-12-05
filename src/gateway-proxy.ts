import { System } from 'cafe-utility'

export const GatewayProxyMode = {
    autobuy: '--preset0',
    autotopup: '--preset1',
    autodilute: '--preset2'
} as const

export class GatewayProxy {
    abortController = new AbortController()
    mode: keyof typeof GatewayProxyMode

    constructor(mode: keyof typeof GatewayProxyMode) {
        this.mode = mode
    }

    async start() {
        return new Promise<void>(resolve => {
            System.runProcess(
                'npx',
                ['cafe-tui', 'proxy', '--quick', GatewayProxyMode[this.mode]],
                { env: process.env, signal: this.abortController.signal },
                buffer => {
                    process.stdout.write(buffer.toString())
                    if (buffer.toString().includes('starting gateway-proxy')) {
                        resolve()
                    }
                }
            )
        })
    }

    async close() {
        this.abortController.abort()
    }
}
