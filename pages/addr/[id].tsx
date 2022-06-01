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
              txs.map(({txid, index, value}) => (
                <li>
                  (<TxLink txid={txid} />, {index}) worth <Amount amount={value}/>
                </li>
              ))
            }
          </ol>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const allTxIds: string[] = await getAllTxIds()
  const allTxs: TransactionType[] = await getAllTxs()
  const addr = context.params.id
  let incomingAmount = 0
  let txs = []

  allTxs.forEach((tx: TransactionType, i: number) => {
    tx.outputs.forEach((output, index: number) => {
      if (output.pubkey === addr) {
        incomingAmount += output.value
        txs.push({
          txid: allTxIds[i],
          index,
          value: output.value,
        })
      }
    })
  })

  return { props: { addr, incomingAmount, txs } }
}
