import { Arrays, System } from 'cafe-utility'

export const TS_NODE = 'ts-node'
export const SWARM_CLI = '/Users/aron/Code/swarm-cli/src/index.ts'
export const messages: string[] = []

export function observeProcess(command: string[]) {
    return System.runProcess(command[0], command.slice(1), { env: process.env }, observeMessage, observeMessage)
}

function observeMessage(message: Buffer) {
    Arrays.pushAll(
        messages,
        message
            .toString()
            .split('\n')
            .filter(x => x)
    )
    process.stdout.write(message.toString())
}
