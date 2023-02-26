/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import Head from "next/head";
import HoldersList from "../components/getOwnerSnapshot";
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
      <main className="flex flex-1 flex-col items-center justify-center h-screen w-full mx-auto py-8">
        <div className="flex items-center justify-center w-max max-w-7xl mx-auto mb-12">
        </div>
        <div className="flex items-center justify-center mx-auto mb-16">
          <div className="bg-gray-200 rounded-lg shadow-lg px-6 mx-auto py-4">
            <HoldersList />
          </div>
        </div>
      </main>
      <footer className="p-4 bg-gray-800">
        <p className="text-center text-white">
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
