/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import Head from "next/head";
import HoldersList from "../components/getOwnerSnapshot";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AirdropTokens from "../components/AirdropTokens";
import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  setOwnerAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  setRecipientAddresses: React.Dispatch<React.SetStateAction<string[]>>;
}

const Home: React.FC<Props> = ({ setOwnerAccounts }) => {
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);
  const wallet = useWallet();
  const publicKey = wallet.publicKey?.toBase58();
  const updateRecipientAddresses = (addresses: string[]) => {
    setRecipientAddresses(addresses);
  };

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
        <h1 className="text-white">
          <Link href="/tokens">Tokens</Link>
        </h1>
        <div>
          <WalletMultiButton />
        </div>
      </nav>
      <main className="flex flex-1 flex-col items-center justify-center h-screen w-full mx-auto py-8">
        {/* ... */}
        <div className="flex items-center justify-center mx-auto mb-16">
          <div className="bg-gray-200 rounded-lg shadow-lg px-6 py-4">
            <HoldersList
              setOwnerAccounts={setOwnerAccounts}
              updateRecipientAddresses={updateRecipientAddresses}
            />
            <AirdropTokens recipientAddresses={recipientAddresses} />
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
