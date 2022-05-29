import { id } from '../libs/object'
import Link from 'next/link'

export default function Chain({ chain }) {
  return (
    <div>
      <div>The canonical chain has height <strong>{ chain.length - 1 }</strong>.</div>

      <table>
        <tr>
          <th>Height</th>
          <th>Hash</th>
          <th>Miner</th>
        </tr>
      {chain.map((block, i) =>
        (
          <tr key={i}>
            <td>{chain.length - 1 - i}</td>
            <td>
              <Link href={`/block/${id(block)}`}>
                <a>{id(block)}</a>
              </Link>
            </td>
            <td>{block.miner}</td>
          </tr>
        )
      )}
      </table>

      <style jsx>{`
        table {
          text-align: left
        }
      `}</style>
    </div>
  )
}
