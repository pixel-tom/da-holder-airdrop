import React, { useState, useEffect } from "react";
import axios from "axios";
import AirdropTest from "../airdrop/AirdropTest";

interface Props {
  mintList: string[];
  recipientAddresses: string[];
  updateRecipientAddresses: (newAddresses: string[]) => void;
}

interface MintListSnapshotProps {
  programAccounts: Array<any>; // replace `any` with the type of your program accounts
}

const NewFunctionality = ({ mintList, recipientAddresses, updateRecipientAddresses }: Props) => {
  const [programAccounts, setProgramAccounts] = useState<string[]>([]);
  const [uniqueHolders, setUniqueHolders] = useState<string[]>([]);
  const [ownerValues, setOwnerValues] = useState<string>("");
  const [shouldRunCode, setShouldRunCode] = useState<boolean>(false);
  const [showData, setShowData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getProgramAccounts = async () => {
      const programAccounts = [];
      for (let mintAddress of mintList) {
        const params = [
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          {
            encoding: "jsonParsed",
            filters: [
              { dataSize: 165 },
              { memcmp: { offset: 0, bytes: mintAddress } },
            ],
          },
        ];
        const response = await axios.post(
          "https://rpc.helius.xyz/?api-key=e6b85a35-8829-4016-ac2f-90755018d1b6",
          {
            jsonrpc: "2.0",
            id: 1,
            method: "getProgramAccounts",
            params: params,
          }
        );
        if (response.data.result.length > 0) {
          const firstOwner =
            response.data.result[0].account.data.parsed.info.owner;
          programAccounts.push(firstOwner);
        }
      }
      setProgramAccounts(programAccounts);
    };

    if (shouldRunCode && mintList.length > 0) {
      setIsLoading(true);
      getProgramAccounts().then(() => setIsLoading(false));
    }
  }, [mintList, shouldRunCode]);

  useEffect(() => {
    const ownerString = programAccounts.join(", ");
    setOwnerValues(ownerString);
  }, [programAccounts]);

  useEffect(() => {
    const uniqueHolders = Array.from(new Set(programAccounts));
    setUniqueHolders(uniqueHolders);
  }, [programAccounts]);

  const handleClick = () => {
    setShouldRunCode(true);
    setProgramAccounts([]);
    setShowData(false);
  };

  const handleSendData = () => {
    updateRecipientAddresses(programAccounts);
    console.log("All Holders Data sent: ", programAccounts);
  };
  
  

  const handleGetUniqueHolders = () => {
    const uniqueHolders = Array.from(new Set(programAccounts));
    updateRecipientAddresses(uniqueHolders);
  };
  

  useEffect(() => {
    if (programAccounts.length > 0) {
      setShowData(true);
    }
  }, [programAccounts]);

  return (
    <div className="mt-2">
      <div className="mb-4">
        <h1 className="font-bold text-lg text-gray-200">
          Step 2: Holder Snapshot
        </h1>
      </div>
      <div className="mb-4">
        <h1 className="font-medium text-md text-gray-200">
          Find all NFT owners using the Collection Mint List
        </h1>
      </div>
      <div className="flex flex-grow w-12/5 rounded-lg ml-2 mx-auto bg-gradient-to-r p-[3px] from-[#6EE7B7] to-[#3B82F6]">
        <button
          className="w-full px-4 py-2 font-medium text-gray-200 rounded-md bg-slate-600 hover:bg-slate-500 hover:drop-shadow"
          onClick={handleClick}
        >
          Generate Holder Snapshot
        </button>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="flex flex-col mx-auto">
            <p className="font-bold text-lg pt-5 text-gray-200">
              Generating Holder Snapshot...
            </p>
            <p className="font-bold text-lg pt-3 mx-auto text-gray-400">
              This may take a few minutes.
            </p>
          </div>
        </div>
      ) : showData ? (
        <div>
          <div className="mb-4">
            <h2 className="font-bold text-md text-gray-200">
              {programAccounts.length} holders ({uniqueHolders.length} unique)
            </h2>
          </div>
          <div className="flex flex-row justify-center mt-4 space-x-4">
            <div className="p-3 w-1/2 max-h-96 overflow-y-auto bg-gray-600 text-gray-200 rounded-l-xl">
              <h3 className="font-bold text-md text-gray-200">All Holders</h3>
              <ul>
                {programAccounts.map((holder) => (
                  <li key={holder}>{holder}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 w-1/2 max-h-96 overflow-y-auto bg-gray-600 text-gray-200 rounded-r-xl">
              <h3 className="font-bold text-md text-gray-200">Unique Holders</h3>
              <ul>
                {uniqueHolders.map((holder) => (
                  <li key={holder}>{holder}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              className="w-full px-4 py-2 font-medium text-gray-200 rounded-md bg-slate-600 hover:bg-slate-500 hover:drop-shadow"
              onClick={handleSendData}
            >
              Send Data
            </button>
            <button
              className="w-full px-4 py-2 font-medium text-gray-200 rounded-md bg-slate-600 hover:bg-slate-500 hover:drop-shadow ml-2"
              onClick={handleGetUniqueHolders}
            >
              Get Unique Holders
            </button>
          </div>
        </div>
      ) : null}
      <AirdropTest recipientAddresses={recipientAddresses} />
    </div>
  );
  
};

export default NewFunctionality;
