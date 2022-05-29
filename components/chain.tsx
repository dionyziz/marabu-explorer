import { id } from '../libs/object'

export default function Chain({ chain }) {
  return (
    <div>
      The canonical chain has height { chain.length }.<br />

      <table>
        <tr>
          <th>Height</th>
          <th>Hash</th>
          <th>Miner</th>
        </tr>
      {chain.map((block, i) =>
        (
          <tr>
            <td>{chain.length - 1 - i}</td>
            <td>{id(block)}</td>
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
