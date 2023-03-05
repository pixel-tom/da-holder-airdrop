import React, { useState } from "react";
import axios from "axios";

const url = `https://api.helius.xyz/v1/nfts?api-key=e6b85a35-8829-4016-ac2f-90755018d1b6`;

const RemoveListings = ({
  mintList,
  onListUpdated,
}: {
  mintList: string[];
  onListUpdated: (updatedList: string[]) => void;
}) => {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true); // set isLoading to true
      const updatedMints: string[] = [];
      const numRequests = Math.ceil(mintList.length / 1000);
      for (let i = 0; i < numRequests; i++) {
        const startIdx = i * 1000;
        const endIdx = startIdx + 1000;
        const mints = mintList.slice(startIdx, endIdx);
        const { data } = await axios.post(url, { mints });
        const filteredData = data.filter(
          (item: { burned: any; activeListings: string | any[] }) =>
            !item.burned && item.activeListings.length === 0
        );
        const updatedMintsBatch = filteredData.map(
          (item: { mint: any }) => item.mint
        );
        updatedMints.push(...updatedMintsBatch);
      }
      onListUpdated(updatedMints); // update the list in HeliusMintlist.tsx
      setResponse(JSON.stringify(updatedMints, null, 2)); // set response to the updated mints list
      console.log(updatedMints); // log the updated mints list
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false); // set isLoading back to false
    }
  };

  return (
    <div className="flex flex-row justify-between">
      <div className="mb-5"></div>
      <div className="w-full flex">
        <button
          className="flex justify-center px-4 py-2 w-full text-gray-200 border border-red-400 font-medium rounded-md bg-slate-600 hover:bg-red-400 hover:drop-shadow"
          onClick={handleClick}
          disabled={isLoading} // disable the button while isLoading is true
        >
          <div className="pt-1 pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="py-auto"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
          <div>
            {isLoading ? (
              <i className="fa fa-spinner fa-spin"></i> // render a spinner if isLoading is true
            ) : (
              "Remove Listed NFTs"
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default RemoveListings;
