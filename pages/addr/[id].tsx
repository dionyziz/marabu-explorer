import { getAllTxIds, getAllTxs } from "../../libs/marabu-client";
import { TransactionType } from "../../libs/transaction";
import Layout from "../../components/layout";
import Amount from "../../components/amount";
import TxLink from "../../components/txlink";



export default function Address({ addr, incomingAmount, txs }) {
  return (
    <Layout>
      <h5 className='title is-5'>Address {addr}</h5>

      <div>
        <strong>Total amount received</strong>: <Amount amount={incomingAmount} />
      </div>

      <div>
        <strong>{txs.length} transaction outputs</strong>:{` `}
        <ol>
            {
              txs.map((tx) => (
                <li>
                  <TxLink txid={tx.txid} />, {tx.index}
                </li>
              ))
            }
          </ol>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const all_txids: string[] = await getAllTxIds()
  const all_txs: TransactionType[] = await getAllTxs()
  const addr = context.params.id
  let incomingAmount = 0
  let txs = []

  all_txs.forEach((tx: TransactionType, i: number) => {
    tx.outputs.forEach((output, index: number) => {
      if (output.pubkey === addr) {
        incomingAmount += output.value
        txs.push({
          txid: all_txids[i],
          index,
        })
      }
    })
  })

  return { props: { addr, incomingAmount, txs } }
}
