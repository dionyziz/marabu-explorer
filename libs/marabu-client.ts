import { MessageSocket } from './net'
import { id } from './object'

const FULLNODE_HOST = 'localhost'
const FULLNODE_PORT = 18018

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

export async function getAllBlocks(): Promise<{tip: string, blocks: blockDict}> {
  return new Promise((resolve, reject) => {
    const blocks: blockDict = {}
    const client = getClient()
    let tip = null

    client.netSocket.on('error', e => reject(e))
    client.sendMessage({
      type: 'getchaintip'
    })
    client.on('message', (messageStr: string) => {
      const message = JSON.parse(messageStr)

      if (message.type === 'chaintip') {
        tip = message.blockid

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
          resolve({
            tip,
            blocks
          })
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

export async function getChain(): Promise<Block[]> {
  const {tip, blocks} = await getAllBlocks()
  const chain = []

  let block = blocks[tip]

  while (block.previd !== null) {
    chain.push(block)
    console.log(`Looking up: ${block.previd}`)
    block = blocks[block.previd]
  }
  chain.push(block)

  return chain
}
