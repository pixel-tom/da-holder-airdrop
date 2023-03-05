import React, { useState, useEffect } from "react";
import { Helius, MintlistResponse } from "helius-sdk";
import RemoveListings from "./RemoveListings";
import MintListSnapshot from "./MintListSnapshot";
import CreatorInput from "./CreatorInput";
import MintList from "./MintList";
import DownloadMintlist from "./DownloadMintlist";

const HeliusMintlist = () => {
  const [response, setResponse] = useState<MintlistResponse | undefined>(
    undefined
  );
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [mintList, setMintList] = useState<string[]>([]);
  const [showSnapshot, setShowSnapshot] = useState(false);

  const updateMintList = (mintListResponse: MintlistResponse) => {
    const fileContent = JSON.stringify(
      mintListResponse.result.map((item) => item.mint)
    );
    const file = new File([fileContent], "mintlist.json", {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setMintList(mintListResponse.result.map((item) => item.mint));
  };

  const handleButtonClick = async (creator: string) => {
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
    updateMintList(mintListResponse);
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

  const handleNextClick = () => {
    setShowSnapshot(true);
  };

  return (
    <div className="max-w-5xl px-2 pb-4 mx-4">
      <CreatorInput handleButtonClick={handleButtonClick} isLoading={isLoading} />
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-gray-400 rounded-full animate-spin"></div>
        </div>
      ) : (
        <MintList mintList={mintList} />
      )}
      
      <div className="flex flex-row items-center justify-between mt-3">
        <div className="flex">
          <RemoveListings mintList={mintList} onListUpdated={handleListUpdate} />
          <DownloadMintlist fileUrl={fileUrl} />
        </div>
        
      </div>
      <div className="flex flex-col w-full mt-8">
        <button className="flex ml-auto py-2 px-4 rounded-md text-gray-200 bg-slate-600" onClick={handleNextClick}>
          <p>Next</p>
        </button>
      </div>
      <div className="mt-8">
        {showSnapshot && <MintListSnapshot mintList={mintList} />}
      </div>
    </div>
  );
};

export default HeliusMintlist;
