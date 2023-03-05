import React, { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  mintList: string[];
}

const NewFunctionality = ({ mintList }: Props) => {
  const [programAccounts, setProgramAccounts] = useState<string[]>([]);
  const [ownerValues, setOwnerValues] = useState<string>("");
  const [shouldRunCode, setShouldRunCode] = useState<boolean>(false);
  const [showData, setShowData] = useState<boolean>(false);

  useEffect(() => {
    const getProgramAccounts = async () => {
      const programAccounts = [];
      for (let mintAddress of mintList) {
        const params = [
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          {
            encoding: "jsonParsed",
            filters: [
              {
                dataSize: 165,
              },
              {
                memcmp: {
                  offset: 0,
                  bytes: mintAddress,
                },
              },
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
      getProgramAccounts();
    }
  }, [mintList, shouldRunCode]);

  useEffect(() => {
    const ownerString = programAccounts.join(", ");
    setOwnerValues(ownerString);
  }, [programAccounts]);

  const handleClick = () => {
    setShouldRunCode(true);
    setProgramAccounts([]);
    setShowData(false);
  };

  useEffect(() => {
    if (programAccounts.length > 0) {
      setShowData(true);
    }
  }, [programAccounts]);

  return (
    <div className="mt-2">
      <div className="mb-4">
        <h1 className="font-bold text-lg text-gray-600">Step 2: Holder Snapshot</h1>
      </div>
      <div className="mb-4">
        <h1 className="font-medium text-md text-gray-600">Find all NFT owners using the Collection Mint List</h1>
        
      </div>
      <div className="flex flex-grow w-12/5 rounded-lg ml-2 mx-auto bg-gradient-to-r p-[3px] from-[#6EE7B7] to-[#3B82F6]">
      <button
        className="w-full px-4 py-2 font-medium text-gray-200 rounded-md bg-slate-600 hover:bg-slate-500 hover:drop-shadow"
        onClick={handleClick}
      >
        Generate Holder Snapshot
      </button>
      </div>
      {showData && (
        <div> 
          <div className="p-3 w-full max-h-96 overflow-y-auto bg-white rounded-l-xl mt-4">
            <ul>
              {programAccounts.map((account) => (
                <li key={account}>{account}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewFunctionality;
