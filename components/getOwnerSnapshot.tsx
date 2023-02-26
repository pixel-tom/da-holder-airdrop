import React, { useState } from "react";
import CollectionNames from "../components/CollectionNames";

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

  const uniqueHolders = new Set(owners.map((owner) => owner.owner_account));
  const totalHolders = uniqueHolders.size;

  return (
    <div className="bg-gray-200 w-full">
      <div className="mx-auto px-4 py-8">
        <div className="flex flex-wrap">
          <div className="w-full md:w-2/5">
            <CollectionNames />
          </div>
          <div className="w-full md:w-3/5">
            <form onSubmit={handleSubmit} className="">
              <div className="mb-4">
                <label
                  htmlFor="collectionAddress"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Collection ID
                </label>
                <input
                  id="collectionAddress"
                  type="text"
                  value={collectionAddress}
                  onChange={(e) => setCollectionAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Enter collection ID"
                  required
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Loading..." : "Generate Mint and Holder Snapshot"}
              </button>
            </form>
          </div>
        </div>
        {loading && (
          <div className="flex justify-center items-center h-32 mt-8">
            <p className="text-blue-500 font-bold">Generating Snapshot...</p>
          </div>
        )}
        {owners.length > 0 && (
          <div className="flex flex-nowrap mt-8 gap-5">
            <div className="w-full md:w-1/2 bg-white rounded-lg shadow">
              <h2 className="text-lg font-bold px-4 py-2 border-b border-gray-300">
                Collection Mint List
              </h2>
              <div
                className="px-4 py-2 overflow-y-scroll"
                style={{ maxHeight: "400px" }}
              >
                <ul>
                  {owners.map((owner: NftOwner, index: number) => (
                    <li key={`wallet-${index}`} className="text-gray-700 mb-1">
                      {owner.wallet_address}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-full md:w-1/2 bg-white rounded-lg shadow">
              <div className="flex">
                <h2 className="text-lg font-bold px-4 py-2 border-b border-gray-300">
                  Holder Wallets
                </h2>
                <h2 className="text-lg ml-auto mr-2 text-blue-400 my-auto text-right font-bold px-1">
                  Total Holders: {totalHolders}
                </h2>
              </div>
              <div
                className="px-4 py-2 overflow-y-scroll"
                style={{ maxHeight: "400px" }}
              >
                <ul>
                  {owners.map((owner: NftOwner, index: number) => (
                    <li key={`owner-${index}`} className="text-gray-700 mb-1">
                      {owner.owner_account}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolderList;
