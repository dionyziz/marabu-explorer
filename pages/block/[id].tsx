import Layout from '../../components/layout'
import Link from 'next/link'
import { getObject } from '../../libs/marabu-client'
import { id } from '../../libs/object'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import TxLink from '../../components/txlink'
import BlockLink from '../../components/blocklink'
import { BlockType } from '../../libs/block'

dayjs.extend(relativeTime)

export default function Block({ block }) {
  const newDate = new Date()
  newDate.setTime(block.created*1000)
  const dateString = newDate.toUTCString()

  return (
    <Layout>
      <h5 className='title is-5'>Block {id(block)}</h5>

      <ul>
        <li><strong>Block ID</strong>: {id(block)}</li>
        <li><strong>Target</strong>: {block.T}</li>
        <li><strong>Miner</strong>: {block.miner}</li>
        <li><strong>Created</strong>: {dayjs.unix(block.created).fromNow()} ({dateString}) at UNIX timestamp {block.created} </li>
        <li><strong>Note</strong>: {block.note}</li>
        <li><strong>Parent block</strong>:{` `}
          {
            block.previd === null?
            <strong>None. Genesis block.</strong>:
            <BlockLink blockid={block.previd} />
          }
        </li>
        <li>
          <strong>{block.txids.length} transactions</strong>:{` `}
          {block.txids.map((txid: string) =>
            (<TxLink txid={txid} />))
          }
        </li>
      </ul>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const block: BlockType = await getObject('block', context.params.id)

  return { props: { block } }
}
