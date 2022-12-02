import assert from 'assert'
import { Strings } from 'cafe-utility'
import { messages, observeProcess, SWARM_CLI, TS_NODE } from '../../constants'
import { Server } from '../../server'

export async function SwarmCliViewBalance(server: Server) {
    await observeProcess([TS_NODE, SWARM_CLI, 'balance'])
    assert(
        Strings.linesMatchOrdered(messages, [
            'Node wallet',
            'BZZ: 100.0000',
            'DAI: 1.0000',
            'Chequebook (BZZ)',
            'Total: 9.8818',
            'Available: 9.8818'
        ])
    )
}
