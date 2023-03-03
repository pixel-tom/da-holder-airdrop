/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import HoldersList from "../components/getOwnerSnapshot";
import AirdropTokens from "../components/AirdropTokens";
import { useState } from "react";
import Link from "next/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import HeliusMintlist from "../components/HeliusMintlist";
import AirdropNFT from "../components/AirdropNFT";

interface Props {
  setOwnerAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  setRecipientAddresses: React.Dispatch<React.SetStateAction<string[]>>;
}

const Home: React.FC<Props> = ({ setOwnerAccounts }) => {
  const { connected } = useWallet();
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);

  const updateRecipientAddresses = (addresses: string[]) => {
    setRecipientAddresses(addresses);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-auto">
      <Head>
        <title>Next.js + TailwindCSS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="fixed top-0 w-full drop-shadow-md flex items-center justify-between bg-white py-4 px-6">
        <div>
          <h1 className="text-gray-600 font-bold text-xl">da-holder-airdrop</h1>
        </div>
        <h1 className="text-gray-600">
          <Link href="/tokens">Tokens</Link>
        </h1>
        <div>
          <WalletMultiButton />
        </div>
      </nav>
      <main className="pt-36 pb-52 flex flex-1 flex-col items-center justify-center h-screen w-screen mx-auto bg-slate-100">
        {!connected && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="font-medium text-4xl mb-5 text-gray-500 text-center">
              Please Connect Wallet
            </h1>
          </div>
        )}
        {connected && (
          <>
            <div className="flex flex-col items-center justify-center mx-auto"></div>
            <div className="flex items-center justify-center mx-auto w-3/4">
              <div className="bg-gradient-to-bl from-blue-200 to-green-50 rounded-lg shadow-xl px-4 py-4 w-full">
                <Tabs>
                  <TabList className="grid grid-cols-3 gap-2 bg-slate-50 bg-opacity-30 rounded-t-lg mb-8 overflow-hidden w-full">
                    <Tab className="flex items-center justify-center text-lg font-medium text-gray-600 py-4 transition duration-300 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300">
                      <span className="mx-2">Holder Snapshot</span>
                      <div className="w-3 h-3 rounded-full ml-1 animate-pulse bg-green-300 hidden md:block"></div>
                    </Tab>
                    <Tab className="flex items-center justify-center text-lg font-medium text-gray-600 py-4 transition duration-300 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300">
                      <span className="mx-2">Collection Mint List</span>
                      <div className="w-3 h-3 rounded-full ml-1 animate-pulse bg-green-300 hidden md:block"></div>
                    </Tab>
                    <Tab className="disabled:stroke-none flex items-center justify-center text-lg font-medium text-gray-600 py-4 transition duration-300 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300">
                      <span className="mx-2">Rarity Mint List</span>
                      <div className="w-3 h-3 rounded-full ml-1 bg-red-400 hidden md:block"></div>
                    </Tab>
                  </TabList>

                  <TabPanel>
                    <div className="flex flex-col items-center justify-center mx-auto">
                      <p className="text-gray-600 w-4/5 text-base">
                        Use HelloMoon's advanced data systems to generate a
                        current Holder.
                      </p>
                      <HoldersList
                        setOwnerAccounts={setOwnerAccounts}
                        updateRecipientAddresses={updateRecipientAddresses}
                      />
                      <AirdropNFT recipientAddresses={recipientAddresses} />
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="mx-auto w-full">
                      <HeliusMintlist />
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div></div>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </main>
      <footer className=" fixed bottom-0 w-full p-4 border-t border-gray-300 bg-white">
        <AirdropTokens recipientAddresses={recipientAddresses} />
      </footer>
    </div>
  );
};

export default Home;
