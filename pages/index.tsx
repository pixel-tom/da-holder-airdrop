/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import HoldersList from "../components/getOwnerSnapshot";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AirdropTokens from "../components/AirdropTokens";
import { useState } from "react";
import Link from "next/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import HeliusMintlist from "../components/HeliusMintlist";

interface Props {
  setOwnerAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  setRecipientAddresses: React.Dispatch<React.SetStateAction<string[]>>;
}

const Home: React.FC<Props> = ({ setOwnerAccounts }) => {
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);

  const updateRecipientAddresses = (addresses: string[]) => {
    setRecipientAddresses(addresses);
  };

  return (
    <div className="flex flex-col min-h-screen">
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
      <main className="flex flex-1 flex-col items-center justify-center h-screen w-full mx-auto py-36 bg-slate-100">
        <div className="flex flex-col items-center justify-center mx-auto mb-16">
          <h1 className="font-medium text-4xl mb-5">Welcome</h1>
          <p className="text-gray-600 w-3/4 text-base">
            Our model uses HelloMoon's advanced data systems to generate a
            current Holder Wallet Snapshot and allows you to send the .
          </p>
        </div>
        <div className="flex items-center justify-center mx-auto mb-16">
          <div className="bg-gradient-to-bl from-blue-200 to-green-50 rounded-lg shadow-xl px-6 py-4">
            <Tabs>
              <TabList className="flex mb-8">
                <Tab className="text-xl font-medium text-gray-700 px-6 py-2 bg-none rounded-t-lg mr-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                  Holder Snapshot
                </Tab>
                <Tab className="text-xl font-medium text-gray-700 px-6 py-2 bg-none rounded-t-lg mr-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                  Collection Mint List
                </Tab>
              </TabList>

              <TabPanel>
                <div className="flex flex-col items-center justify-center mx-auto mb-16">
                  <HoldersList
                    setOwnerAccounts={setOwnerAccounts}
                    updateRecipientAddresses={updateRecipientAddresses}
                  />
                </div>
              </TabPanel>

              <TabPanel>
                <div>
                  <HeliusMintlist />
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className=" fixed bottom-0 w-full p-4 border-t border-gray-300 bg-white">
        <AirdropTokens recipientAddresses={recipientAddresses} />
      </footer>
    </div>
  );
};

export default Home;
