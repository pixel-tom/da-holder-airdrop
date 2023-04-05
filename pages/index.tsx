/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import HoldersList from "../components/getOwnerSnapshot";
import { useState } from "react";
import Link from "next/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import HeliusMintlist from "../components/mintlist/HeliusMintlist";
// import AirdropNFT from "../components/airdrop/AirdropNFT";
import AirdropTest from "../components/airdrop/AirdropTest";

interface Props {
  setOwnerAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  setRecipientAddresses: React.Dispatch<React.SetStateAction<string[]>>;
}

const Home: React.FC<Props> = ({ setOwnerAccounts }) => {
  const { connected } = useWallet();
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);

  const updateRecipientAddresses = (newAddresses: string[]) => {
    updateRecipientAddresses(newAddresses);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-auto">
      <Head>
        <title>Next.js + TailwindCSS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="fixed z-10 top-0 w-full drop-shadow-md flex items-center justify-between bg-slate-900 py-4 px-6">
        <div>
          <h1 className="text-gray-600 font-bold text-xl">da-holder-airdrop</h1>
        </div>
        
        <div>
          <WalletMultiButton />
        </div>
      </nav>
      <main className="pt-36 pb-52 flex flex-1 flex-col items-center justify-center h-screen w-full mx-auto bg-slate-800">
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
            <div className="flex items-center justify-center mx-auto xs:w-full sm:w-5/6 md:w-3/4 lg:w-3/5 xl:w-  2xl:w-1/2">
              <div className="bg-gradient-to-bl from-slate-600 to-slate-800 rounded-lg shadow-2xl px-4 py-4 w-full">
                <Tabs>
                  <TabList className="flex mb-8">
                    <Tab
                      className="flex justify-center bg-gray-800 w-full text-gray-300 py-4 px-4 hover:text-gray-200 hover:bg-gray-700 focus:text-gray-200 focus:bg-gray-700 "
                      selectedClassName="bg-gray-900 text-gray-200 font-semibold"
                    >
                      Collection Mint List
                      <div className="w-3 h-3 rounded-full my-auto ml-2 animate-pulse bg-green-400 hidden md:block"></div>
                    </Tab>
                    <Tab
                      className="flex justify-center bg-gray-800 w-full text-gray-300 py-4 px-4 rounded-r-lg hover:text-gray-200 hover:bg-gray-700 focus:text-gray-200 focus:bg-gray-700  cursor-not-allowed"
                      selectedClassName="bg-gray-900 text-gray-200 font-semibold border-t-2 border-r-2 border-l-2 border-gray-500"
                      disabled
                    >
                      Rarity Mint List
                      <div className="w-3 h-3 rounded-full my-auto ml-2 bg-red-500 hidden md:block"></div>
                    </Tab>
                  </TabList>

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
      <footer className=" fixed bottom-0 w-full px-4 py-2 border-t border-gray-300 bg-slate-800"></footer>
    </div>
  );
};

export default Home;