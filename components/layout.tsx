import Head from 'next/head'
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="container">
      <Head>
        <title>Marabu Explorer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <section className="section">
        <div className="container">
          <h1 className="title">
            <Link href='/'>
              🪶 Marabu Explorer
            </Link>
          </h1>
          {children}
        </div>
      </section>

      <style jsx>{`
        header {
          text-align: center
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}
      </style>

      <style jsx global>
      {`
        @import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          min-height: 100%;
        }
        html, body {
          background-color: #fafafa;
        }
        div.container {
          background-color: white;
        }

        * {
          box-sizing: border-box;
        }

        table td, table th {
          padding-right: 1em
        }
        table td code a:hover {
          text-decoration: underline
        }
        ul {
          margin: 0;
          padding: 0;
        }
        ol {
          margin-left: 2em;
        }
      `}
      </style>
    </div>
  )
}
