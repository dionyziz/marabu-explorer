import Link from "next/link";

export default function BlockLink({ blockid, short = false }) {
  let text: string = blockid

  if (short) {
    text = text.substring(0, 16) + '...'
  }

  return (
    <Link href={`/block/${blockid}`}>
      <code>
        <a>
          {text}
        </a>
      </code>
    </Link>
  )
}
