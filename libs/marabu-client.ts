import { MessageSocket } from './net'
import { id } from './object'

const FULLNODE_HOST = 'localhost'
const FULLNODE_PORT = 18018

export async function getObject(type: string, objectid: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const client = getClient()

    client.sendMessage({
      type: 'getobject',
      objectid
    })

    client.on('message', (messageStr: string) => {
      const message = JSON.parse(messageStr)

      if (message.type === 'object' && message.object.type === type) {
        resolve(message.object)
      }
    })
  })
}

export function getClient() {
  const client = MessageSocket.createClient(`${FULLNODE_HOST}:${FULLNODE_PORT}`)

  client.sendMessage({
    type: 'hello',
    agent: 'Marabu Explorer 0.1.0',
    version: '0.8.0'
  })

  return client
}

export async function getChain(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const blocks = {}
    const client = getClient()
    let tip

    client.netSocket.on('error', (e) => {
      reject(e)
    })
    client.sendMessage({
      type: 'getchaintip'
    })
    client.on('message', (messageStr: string) => {
      const message = JSON.parse(messageStr)

      if (message.type === 'chaintip') {
        tip = message.blockid
        console.log(`Tip is: ${tip}`)

        client.sendMessage({
          type: 'getobject',
          objectid: message.blockid
        })
      }
      if (message.type === 'object' && message.object.type === 'block') {
        console.log(`Block `, message.object)
        const objectid = id(message.object)
        blocks[objectid] = message.object

        if (message.object.previd === null) {
          const chain = []
          let block = blocks[tip]

          while (block.previd !== null) {
            chain.push(block)
            console.log(`Looking up: ${block.previd}`)
            block = blocks[block.previd]
          }
          chain.push(block)
          resolve(chain)
        }
        else {
          client.sendMessage({
            type: 'getobject',
            objectid: message.object.previd
          })
        }
      }
    })
  })
}

export async function getTip() {
}
