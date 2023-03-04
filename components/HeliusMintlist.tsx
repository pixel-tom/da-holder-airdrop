import React, { useState, useEffect } from "react";
import { Helius, MintlistResponse } from "helius-sdk";
import RemoveListings from "./RemoveListings";

const HeliusMintlist = () => {
  const [response, setResponse] = useState<MintlistResponse | undefined>(
    undefined
  );
  const [creator, setCreator] = useState("");
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [mintList, setMintList] = useState<string[]>([]);

  const handleCreatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreator(event.target.value);
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    const helius = new Helius("e6b85a35-8829-4016-ac2f-90755018d1b6");
    const mintListResponse = await helius.getMintlist({
      query: {
        firstVerifiedCreators: [creator],
      },
      options: { limit: 10000 },
    });
    setResponse(mintListResponse);
    setIsLoading(false);
    const fileContent = JSON.stringify(
      mintListResponse.result.map((item) => item.mint)
    );
    const file = new File([fileContent], "mintlist.json", {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setMintList(mintListResponse.result.map((item) => item.mint));

    setTimeout(() => {
      URL.revokeObjectURL(url);
      setFileUrl(undefined);
    }, 10 * 60 * 1000);
  };

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleListUpdate = (updatedList: string[]) => {
    setMintList(updatedList);
  };

  return (
    <div className="max-w-5xl px-2 pb-4 mx-4">
      <div className="flex flex-col mb-4 text-gray-600">
        <label htmlFor="creator" className="font-bold mb-2">
          Enter CandyMachine ID/First Creator Address:
        </label>
        <div className="flex flex-row h-12">
          <input
            className="w-3/5 h-auto py-2 px-4 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Creator Address.."
            type="text"
            id="creator"
            value={creator}
            onChange={handleCreatorChange}
          />
          <div className="flex flex-grow w-12/5 rounded-xl ml-2 mx-auto bg-gradient-to-r p-[3px] from-[#6EE7B7] to-[#3B82F6]">
            <button
              className="w-full h-auto bg-slate-100 px-4 py-2 border  text-slate-800 font-medium rounded-lg hover:bg-blue-100 focus:outline-none flex items-center justify-center"
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-b-0 border-gray-400 rounded-full animate-spin"></div>
                  <span className="ml-3">Loading...</span>
                </div>
              ) : (
                "Generate Mintlist"
              )}
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-gray-400 rounded-full animate-spin"></div>
        </div>
      )}

      <RemoveListings mintList={mintList} onListUpdated={handleListUpdate} />
      <div className="flex flex-col max-h-96 overflow-y-auto">
        {mintList.length > 0 && (
          <div className="bg-white rounded-xl p-3">
            <ul>
              {mintList.map((mint) => (
                <li key={mint}>{mint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <a
        href={fileUrl || ""}
        download="mintlist.json"
        className={`${
          fileUrl ? "block" : "hidden"
        } bg-slate-100 text-gray-600 font-medium text-center border border-gray-400 px-4 py-2 rounded-md hover:bg-blue-100 hover:drop-shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        Download Mintlist
      </a>
    </div>
  );
};

export default HeliusMintlist;
