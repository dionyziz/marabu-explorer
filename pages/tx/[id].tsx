import Layout from '../../components/layout'
import Link from 'next/link'
import { getObject } from '../../libs/marabu-client'
import { id } from '../../libs/object'

export default function Transaction({ transaction }) {
  return (
    <Layout>
      <h2>Transaction {id(transaction)}</h2>

      <ul>
        <li><strong>Transaction ID</strong>: {id(transaction)}</li>
        <li><strong>{transaction.inputs?.length} Inputs</strong>: {
          transaction.height ?
          <strong>None. Coinbase Transaction.</strong>:
          transaction.inputs.map((input, i: number) =>
            <span key={i}>Outpoint (
              <Link href={`/tx/${input.txid}`}>
                <a>${input.txid}</a>
              </Link>,
              ${input.index})</span>
          )
        }</li>
        <li><strong>{transaction.outputs.length} Outputs</strong>:
          <ol>
            {
              transaction.outputs.map((output, i: number) =>
                <li key={i}>Output paying {output.pubkey} the amount of {output.value / 10**12} bu</li>
              )
            }
          </ol>
        </li>
      </ul>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const transaction = await getObject('transaction', context.params.id)

  return { props: { transaction } }
}
