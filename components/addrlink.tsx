import Link from "next/link";

export default function AddrLink({ addr, short = false }) {
  let text: string = addr

  if (short) {
    text = text.substring(0, 16) + '...'
  }

  return (
    <Link href={`/addr/${addr}`}>
      <code>
        <a>
          {text}
        </a>
      </code>
    </Link>
  )
}
