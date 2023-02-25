/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from 'next'
import Head from 'next/head'
import HolderSnapshot from '/components/HolderSnapshot'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Next.js + TailwindCSS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-8 sm:px-12 md:px-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Holder Airdrop</h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8">Use Solscan to find the Owner's wallets of a given NFT Collection. Solscan Collection Address can be found in the URL of the Collection Page on the Official SolScan Website.</p>
        <HolderSnapshot />
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://replit.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' The Doge Academy'}

        </a>
      </footer>
    </div>
  )
}

export default Home
