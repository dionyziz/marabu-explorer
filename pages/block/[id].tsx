import Layout from '../../components/layout'
import Link from 'next/link'
import { getBlock } from '../../libs/marabu-client'
import { id } from '../../libs/object'

export default function Block({ block }) {
  return (
    <Layout>
      <h2>Block {id(block)}</h2>

      <ul>
        <li><strong>Block ID</strong>: {id(block)}</li>
        <li><strong>Target</strong>: {block.T}</li>
        <li><strong>Miner</strong>: {block.miner}</li>
        <li><strong>Created</strong>: {block.created}</li>
        <li><strong>Note</strong>: {block.note}</li>
        <li><strong>Parent block</strong>:{` `}
          <Link href={`/block/${block.previd}`}>
            <a>{block.previd}</a>
          </Link>
        </li>
        <li><strong>{block.txids.length} transactions</strong>: {block.txids}</li>
      </ul>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const block = await getBlock(context.params.id)

  return { props: { block } }
}
