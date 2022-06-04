import Layout from '../components/layout'
import Chain from '../components/chain'
import { getChain } from '../libs/marabu-client'

export default function Home({ chainInfo, error }) {
  return (
    <Layout>
      <div className="description">
        {
          error? `Error accessing Marabu full node: ${error}`:
          <Chain chain={chainInfo.chain} height={chainInfo.chainHeight} />
        }
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  let chainInfo = null, error = null

  try {
    chainInfo = await getChain()
  }
  catch (e: any) {
    error = e.message
  }

  return { props: { chainInfo, error } }
}
