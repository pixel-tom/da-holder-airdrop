import React, { useState } from "react";
import OwnersList from "./MintList";

interface NftOwner {
  wallet_address: string;
  owner_account: string;
}

const HolderList = () => {
  const [collectionAddress, setCollectionAddress] = useState<string>("");

  const [owners, setOwners] = useState<NftOwner[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getNFTHolders = async (collectionAddress: string) => {
    const walletAddresses: NftOwner[] = [];

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: "Bearer 151c15b0-d21d-40b2-9786-49678176b715",
      },
      body: JSON.stringify({
        helloMoonCollectionId: collectionAddress,
        limit: 1000,
        page: 1,
      }),
    };

    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const response = await fetch(
        "https://rest-api.hellomoon.io/v0/nft/mints-by-owner",
        options
      );

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
            wallet_address: mint.nftMint,
            owner_account: mint.ownerAccount,
          };
        });
        walletAddresses.push(...pageWalletAddresses);
        page++;

        // Update the page number in the request body
        options.body = JSON.stringify({
          helloMoonCollectionId: collectionAddress,
          limit: 1000,
          page: page,
        });

        // Add a delay of one second between requests
        await new Promise((resolve) => setTimeout(resolve, 250));
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
      const addresses = await getNFTHolders(collectionAddress);

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
          Get the Holder Wallet Addresses for an NFT Collection
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
            {loading ? "Loading..." : "Get Wallet Addresses"}
          </button>
        </form>
        {owners.length > 0 && (
          <div className="flex mt-4">
            <div className="w-1/2 h-64 overflow-y-scroll mr-4">
              <h2 className="text-lg font-bold mb-2">Collection Mint List</h2>
              <ul className="list-disc pl-4">
                {owners.map((owner: NftOwner, index: number) => (
                  <li key={`wallet-${index}`}>{owner.wallet_address}</li>
                ))}
              </ul>
            </div>
            <div className="w-1/2 h-64 overflow-y-scroll">
              <h2 className="text-lg font-bold mb-2">Holder Wallets</h2>
              <ul className="list-disc pl-4">
                {owners.map((owner: NftOwner, index: number) => (
                  <li key={`owner-${index}`}>{owner.owner_account}</li>
                ))}
              </ul>
            </div>
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

export default HolderList;
