import Link from "next/link";

export default function TxLink({ txid }) {
  return (
    <Link href={`/tx/${txid}`}>
      <code>
        <a>
          {txid}
        </a>
      </code>
    </Link>
  )
}
