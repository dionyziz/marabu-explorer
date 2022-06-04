import { MessageSocket } from './net'
import { id } from './object'

const FULLNODE_HOST = 'localhost'
const FULLNODE_PORT = 18018
const CHAIN_LIMIT = 500

export function getClient() {
  const client = MessageSocket.createClient(`${FULLNODE_HOST}:${FULLNODE_PORT}`)

  client.sendMessage({
    type: 'hello',
    agent: 'Marabu Explorer 0.1.0',
    version: '0.8.0'
  })

  return client
}

export async function getObject(type: string, objectid: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const client = getClient()

    client.sendMessage({
      type: 'getobject',
      objectid
    })
    client.on('error', e => reject(e))
    client.on('message', (messageStr: string) => {
      const message = JSON.parse(messageStr)

      if (message.type === 'object' && message.object.type === type) {
        resolve(message.object)
      }
    })
  })
}

type Block = any
type Transaction = any
type blockDict = {[key: string]: Block}

export async function getAllTxIds(): Promise<string[]> {
  const txs = await getAllTxs()
  return txs.map(id)
}

export async function getAllTxs(): Promise<Transaction[]> {
  const chain = await getChain()
  const allTxIds = []
  const allTxs = []
  let pendingTxCount

  for (const block of chain) {
    for (const txid of block.txids) {
      allTxIds.push(txid)
    }
  }

  pendingTxCount = allTxIds.length

  return await new Promise((resolve, reject) => {
    const client = getClient()

    for (const txid of allTxIds) {
      client.sendMessage({
        type: 'getobject',
        objectid: txid
      })
    }

    client.netSocket.on('error', e => reject(e))
    client.on('message', (messageStr: string) => {
      const message = JSON.parse(messageStr)

      if (message.type === 'object' && message.object.type === 'transaction') {
        allTxs.push(message.object)
        --pendingTxCount
        if (pendingTxCount === 0) {
          resolve(allTxs)
        }
      }
    })
  })
}

export async function getChain(): Promise<Block[]> {
  return new Promise((resolve, reject) => {
    const client = getClient()
    let tip = null
    const chain = []

    client.netSocket.on('error', e => reject(e))
    client.sendMessage({
      type: 'getchaintip'
    })
    client.on('message', (messageStr: string) => {
      const message = JSON.parse(messageStr)

      if (message.type === 'chaintip') {
        if (!tip) {
          tip = message.blockid
          
          client.sendMessage({
            type: 'getobject',
            objectid: message.blockid
          })
        }
      }
      if (message.type === 'object' && message.object.type === 'block') {
        const objectid = id(message.object)

        if ((chain.length ? chain[chain.length - 1].previd : tip) === objectid) {
          chain.push(message.object)
          if (message.object.previd === null) {
            resolve(chain)
          }
          else {
            if (chain.length >= CHAIN_LIMIT) {
              resolve(chain)
              return;
            }
            client.sendMessage({
              type: 'getobject',
              objectid: message.object.previd
            })
          }
        }
      }
    })
  })
}
