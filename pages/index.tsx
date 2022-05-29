import Layout from '../components/layout'
import Chain from '../components/chain'
import { getChain } from '../libs/marabu-client'

export default function Home({ chain, error }) {
  return (
    <Layout>
      <p className="description">
        {
          error? `Error accessing Marabu full node: ${error}`:
          <Chain chain={chain} />
        }
      </p>
    </Layout>
  )
}

export async function getServerSideProps() {
  let chain = null, error = null

  try {
    chain = await getChain()
  }
  catch (e: any) {
    error = e.message
  }

  return { props: { chain, error } }
}
