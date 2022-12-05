import assert from 'assert'
import { System } from 'cafe-utility'
import { GatewayProxy } from '../../gateway-proxy'
import { Server } from '../../server'

export async function GatewayProxyAutodiluteStamp(server: Server) {
    await server.deleteStamps()
    assert((await server.getStamps()).length === 0)

    const gatewayProxy = new GatewayProxy('autodilute')
    await gatewayProxy.start()

    assert(
        (await System.waitFor(
            async () => {
                const stamps = await server.getStamps()
                return stamps.length === 1 && stamps[0].depth === 23 && stamps[0].amount === '400000'
            },
            1_000,
            15
        )) === true
    )

    await gatewayProxy.close()
}
