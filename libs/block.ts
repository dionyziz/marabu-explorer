import { TransactionType } from './transaction'

export type BlockType = {
  note?: string,
  miner?: string,
  txids: TransactionType[],
  created: number,
  previd: string | null
}
