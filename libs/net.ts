import * as net from 'net'
import { EventEmitter } from 'events'

export class MessageSocket extends EventEmitter {
  buffer: string = '' // defragmentation buffer
  netSocket: net.Socket
  peerAddr: string

  static createClient(peerAddr: string) {
    const [host, portStr] = peerAddr.split(':')
    const port = +portStr
    if (port < 0 || port > 65535) {
      throw new Error('Invalid port')
    }
    const netSocket = new net.Socket()
    const socket = new MessageSocket(netSocket, peerAddr)

    netSocket.connect(port, host)

    return socket
  }
  constructor(netSocket: net.Socket, peerAddr: string) {
    super()

    this.peerAddr = peerAddr
    this.netSocket = netSocket
    this.netSocket.on('data', (data: string) => {
      this.buffer += data
      const messages = this.buffer.split('\n')

      if (messages.length > 1) {
        for (const message of messages.slice(0, -1)) {
          this.emit('message', message)
        }
        this.buffer = messages[messages.length - 1]
      }
    })
  }
  sendMessage(message: string) {
    this.netSocket.write(`${message}\n`)
  }
  end() {
    this.netSocket.end()
  }
}
