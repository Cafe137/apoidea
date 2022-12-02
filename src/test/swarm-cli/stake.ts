import assert from 'assert'
import { Strings } from 'cafe-utility'
import { messages, observeProcess, SWARM_CLI, TS_NODE } from '../../constants'
import { Server } from '../../server'

export async function SwarmCliStake(server: Server) {
    await observeProcess([TS_NODE, SWARM_CLI, 'stake'])
    await observeProcess([TS_NODE, SWARM_CLI, 'stake', '--deposit', '100_000t', '--yes'])
    assert(
        Strings.linesMatchOrdered(messages, ['Staked BZZ: 0.0000', 'PLUR successfully staked!', 'Staked BZZ: 10.0000'])
    )
}
