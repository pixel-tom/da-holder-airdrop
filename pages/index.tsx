/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import Head from "next/head";
import HolderSnapshot from "../components/HolderSnapshot";
import CollectionNames from "../components/CollectionNames";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Next.js + TailwindCSS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="flex items-center justify-between bg-gray-800 py-4 px-6">
        <div>
          <h1 className="text-white font-bold text-xl">da-holder-airdrop</h1>
        </div>
        <div>
          <WalletMultiButton />
        </div>
      </nav>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Holder Airdrop</h1>
        <p className="text-lg mb-8">
          Use Solscan to find the owner's wallets of a given NFT collection.
          Solscan collection address can be found in the URL of the collection
          page on the official SolScan website.
        </p>
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          <CollectionNames />
          <div className="my-8" />
          <HolderSnapshot />
        </div>
      </main>
      <footer className="p-4">
        <p className="text-center">
          Powered by{" "}
          <a
            href="https://thedogecademy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            The Doge Academy
          </a>
        </p>
      </footer>
    </div>
  );
  
};

export default Home;
