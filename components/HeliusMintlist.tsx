import React, { useState, useEffect } from "react";
import { Helius, MintlistResponse } from "helius-sdk";

const HeliusMintlist = () => {
  const [response, setResponse] = useState<MintlistResponse | undefined>(
    undefined
  );
  const [creator, setCreator] = useState("");
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreator(event.target.value);
  };

  const handleButtonClick = async () => {
    setIsLoading(true); // Set loading state to true
    const helius = new Helius("e6b85a35-8829-4016-ac2f-90755018d1b6");
    const mintListResponse = await helius.getMintlist({
      query: {
        firstVerifiedCreators: [creator],
      },
      options: { limit: 10000 },
    });
    setResponse(mintListResponse);
    setIsLoading(false); // Set loading state back to false

    // Create a file and save it to a URL
    const fileContent = JSON.stringify(
      mintListResponse.result.map((item) => item.mint)
    );
    const file = new File([fileContent], "mintlist.json", {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Schedule file deletion after 10 minutes
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

  return (
    <div className="max-w-5xl px-2 pb-4 mx-4">
      <div className="flex flex-col mb-4 text-gray-600">
        <label htmlFor="creator" className="font-bold mb-2">
          Enter CandyMachine ID/First Creator Address:
        </label>
        <div className="flex flex-row h-12">
          <input
            className=" w-3/4 h-auto py-2 px-4 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Creator Address.."
            type="text"
            id="creator"
            value={creator}
            onChange={handleCreatorChange}
          />
          <div className="rounded-xl w-1/4 ml-2 mx-auto wavy-button bg-gradient-to-r p-[3px] from-[#6EE7B7] to-[#3B82F6]">
            <button
              className="w-full h-auto bg-slate-100 px-4 py-2 border  text-slate-800 font-medium rounded-lg hover:bg-blue-100 focus:outline-none"
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Get Collection Mintlist"}
            </button>
          </div>
        </div>
      </div>
      {response ? (
        <div className="h-96 bg-slate-50 p-3 rounded-xl overflow-y-auto mb-4">
          <p className="pb-2 text-lg border-b border-blue-200 font-bold mb-2">
            Total Items: {response.result.length}
          </p>
          <ul>
            {response.result.map((item) => (
              <li key={item.mint} className="py-2">
                {item.mint}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-lg font-bold">Mint List will display here.</p>
      )}
      <a
        href={fileUrl || ""}
        download="mintlist.json"
        className={`${
          fileUrl ? "block" : "hidden"
        } bg-slate-200 text-gray-600 font-medium text-center border border-gray-400 px-4 py-2 rounded-md hover:bg-blue-100 hover:drop-shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        Download Mintlist
      </a>
    </div>
  );
  
};

export default HeliusMintlist;
