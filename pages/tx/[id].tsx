import Layout from '../../components/layout'
import { getObject, getChain } from '../../libs/marabu-client'
import { id } from '../../libs/object'
import BlockLink from '../../components/blocklink'
import TxLink from '../../components/txlink'
import pluralize from 'pluralize'
import AddrLink from '../../components/addrlink'
import Amount from '../../components/amount'

export default function Transaction({ transaction, chain }) {
  const txid = id(transaction)
  let block
  let height = chain.length
  let confirmations = 0

  for (const chainBlock of chain) {
    --height
    ++confirmations
    for (const blockTxid of chainBlock.txids) {
      if (txid === blockTxid) {
        block = chainBlock
        break
      }
    }
    if (block !== undefined) {
      break
    }
  }

  return (
    <Layout>
      <h5 className='title is-5'>Transaction {id(transaction)}</h5>

      <ul>
        <li><strong>Transaction ID</strong>: {id(transaction)}</li>
        <li><strong>{transaction.inputs?.length} Inputs</strong>: {
          transaction.height ?
          <strong>None. Coinbase Transaction.</strong>:
          transaction.inputs.map((input, i: number) =>
            <span key={i}>Outpoint (
              <TxLink txid={input.txid}/>,
              ${input.index})</span>
          )
        }</li>
        <li><strong>{pluralize('Output', transaction.outputs.length, true)}</strong>:
          <ol>
            {
              transaction.outputs.map((output, i: number) =>
                <li key={i}>Output paying <AddrLink addr={output.pubkey} /> the amount of <Amount amount={output.value} /> bu</li>
              )
            }
          </ol>
        </li>
        <li><strong>Block</strong>: {
          block === undefined?
          <>Unconfirmed</>:
          <>Confirmed in <BlockLink blockid={id(block)} /></>
        }</li>
        <li><strong>Confirmations</strong>: {
          block === undefined?
          <>None</>:
          confirmations
        }</li>
      </ul>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const transaction = await getObject('transaction', context.params.id)
  const chain = await getChain()

  return { props: { transaction, chain } }
}
