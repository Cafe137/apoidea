import assert from 'assert'
import { Strings } from 'cafe-utility'
import { messages, observeProcess, SWARM_CLI, TS_NODE } from '../../constants'
import { Server } from '../../server'

export async function SwarmCliBuyStampAndUploadFile(server: Server) {
    const batchId = await server.getNextBatchId()
    await observeProcess([TS_NODE, SWARM_CLI, 'status'])
    await observeProcess([TS_NODE, SWARM_CLI, 'stamp', 'buy', '--amount', '200t', '--depth', '22', '--yes'])
    await observeProcess([TS_NODE, SWARM_CLI, 'stamp', 'list'])
    await observeProcess([TS_NODE, SWARM_CLI, 'upload', 'package.json', '--stamp', batchId])
    assert(
        Strings.linesMatchOrdered(messages, [
            '[OK] Bee API Connection',
            '[OK] Bee Debug API Connection',
            'Buying postage stamp. This may take a while',
            `Stamp ID: ${batchId}`,
            'TTL: 1000 days',
            'Uploading data...',
            'Swarm hash:',
            'Usage: 0%'
        ])
    )
}
