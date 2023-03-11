import React, { useState, useEffect } from "react";
import { Helius, MintlistResponse } from "helius-sdk";
import RemoveListings from "./RemoveListings";
import MintListSnapshot from "./MintListSnapshot";
import CreatorInput from "./CreatorInput";
import MintList from "./MintList";
import DownloadMintlist from "./DownloadMintlist";
import AirdropTest from "../airdrop/AirdropTest";
import { NftsByOwner } from "../nfts/FindAllByOwner";

const HeliusMintlist = () => {
  const [response, setResponse] = useState<MintlistResponse | undefined>(
    undefined
  );
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [mintList, setMintList] = useState<string[]>([]);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [isGenerateClicked, setIsGenerateClicked] = useState(false);
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);

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
    setIsGenerateClicked(true);
  };

  const handleListUpdate = (updatedList: string[]) => {
    setMintList(updatedList);
  };

  const handleNextClick = () => {
    setShowSnapshot(true);
  };

  const handlePreviousClick = () => {
    setShowSnapshot(false);
  };

  const updateRecipientAddresses = (newAddresses: string[]) => {
    setRecipientAddresses(newAddresses);
  };

  return (
    <div className="max-w-5xl px-2 pb-4 mx-4">
      {!showSnapshot ? (
        <>
          <CreatorInput
            handleButtonClick={handleButtonClick}
            isLoading={isLoading}
          />
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="flex flex-col mx-auto">
                <p className="font-bold text-lg text-gray-200">
                  Generating Mint List...
                </p>
              </div>
            </div>
          ) : (
            <>
              {isGenerateClicked && (
                <>
                  <MintList mintList={mintList} />
                  <div className="flex flex-row items-center justify-between mt-3">
                    <div className="w-full">
                      <RemoveListings
                        mintList={mintList}
                        onListUpdated={handleListUpdate}
                      />
                    </div>
                    <div className="w-3/5 ml-2">
                      <DownloadMintlist fileUrl={fileUrl} />
                    </div>
                  </div>
                </>
              )}
              <div className="flex flex-col w-full mt-8">
                <button
                  className="flex ml-auto py-2 px-4 rounded-md text-gray-200 bg-slate-600"
                  onClick={handleNextClick}
                >
                  <p>Next</p>
                  <div className="my-auto pl-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <MintListSnapshot
            mintList={mintList}
            recipientAddresses={recipientAddresses}
            updateRecipientAddresses={updateRecipientAddresses}
          />
          <div className="flex flex-row w-full mt-8">
            <button
              className="flex mr-auto py-2 px-4 rounded-md text-gray-200 bg-slate-600"
              onClick={handlePreviousClick}
            >
              <p>Previous</p>
            </button>
          </div>
          <AirdropTest recipientAddresses={recipientAddresses} />
          
        </>
      )}
    </div>
  );
};

export default HeliusMintlist;
