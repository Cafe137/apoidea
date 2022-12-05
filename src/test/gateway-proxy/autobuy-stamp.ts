import assert from 'assert'
import { System } from 'cafe-utility'
import { GatewayProxy } from '../../gateway-proxy'
import { Server } from '../../server'

export async function GatewayProxyAutobuyStamp(server: Server) {
    await server.deleteStamps()
    assert((await server.getStamps()).length === 0)

    const gatewayProxy = new GatewayProxy('autobuy')
    await gatewayProxy.start()

    assert(
        (await System.waitFor(
            async () => {
                const stamps = await server.getStamps()
                return stamps.length === 1
            },
            1_000,
            15
        )) === true
    )

    await gatewayProxy.close()
}
