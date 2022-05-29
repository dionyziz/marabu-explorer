import { getAllTxs } from "../../libs/marabu-client";
import { TransactionType } from "../../libs/transaction";
import Layout from "../../components/layout";
import Amount from "../../components/amount";

export default function Address({ addr, incomingAmount }) {
  return (
    <Layout>
      <h5 className='title is-5'>Address {addr}</h5>

      <div>
        <strong>Total amount received</strong>: <Amount amount={incomingAmount} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const txs: TransactionType[] = await getAllTxs()
  const addr = context.params.id
  let incomingAmount = 0

  for (const tx of txs) {
    for (const output of tx.outputs) {
      if (output.pubkey === addr) {
        incomingAmount += output.value
      }
    }
  }

  return { props: { addr, incomingAmount } }
}
