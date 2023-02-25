import React, { useState } from "react";
import axios from "axios";
import OwnersList from "./OwnersList";

interface NftOwner {
  wallet_address: string;
}



const HolderSnapshot = () => {
  const [collectionAddress, setCollectionAddress] = useState<string>("");
  const [owners, setOwners] = useState<NftOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getNFTOwners = async (collectionAddress: string) => {
    const walletAddresses: NftOwner[] = [];
  
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer 151c15b0-d21d-40b2-9786-49678176b715'
      },
      body: JSON.stringify({
        helloMoonCollectionId: collectionAddress,
        limit: 1000,
        page: 1
      })
    };
  
    let page = 1;
    let hasMoreData = true;
  
    while (hasMoreData) {
      const response = await fetch('https://rest-api.hellomoon.io/v0/nft/collection/mints', options);
  
      if (!response.ok) {
        throw new Error(`Error retrieving NFT owners: ${response.status}`);
      }
  
      const responseData = await response.json();
      const data = responseData.data;
  
      if (data.length === 0) {
        hasMoreData = false;
      } else {
        const pageWalletAddresses: NftOwner[] = data.map((mint: any) => {
          return {
            wallet_address: mint.nftMint
          };
        });
        walletAddresses.push(...pageWalletAddresses);
        page++;
  
        // Update the page number in the request body
        options.body = JSON.stringify({
          helloMoonCollectionId: collectionAddress,
          limit: 1000,
          page: page
        });
  
        // Add a delay of one second between requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  
    return walletAddresses;
  };
  
  
  
  
  

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setOwners([]);
    setLoading(true);

    try {
      const addresses = await getNFTOwners(collectionAddress);

      setOwners(addresses);
    } catch (error) {
      setError("Error retrieving NFT owners");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Get the Mint List for an NFT Collection
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="collectionAddress" className="mb-2 font-medium">
            Collection address
          </label>
          <input
            id="collectionAddress"
            type="text"
            value={collectionAddress}
            onChange={(e) => setCollectionAddress(e.target.value)}
            className="p-2 mb-4 border border-gray-300 rounded-lg"
          />
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get owners"}
          </button>
        </form>
        {owners.length > 0 && (
          <div className="mt-4 max-h-[200px] overflow-y-scroll">
            
            <OwnersList owners={owners} />
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-32">
            <p className="text-blue-500 font-bold">Generating Snapshot...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolderSnapshot;
