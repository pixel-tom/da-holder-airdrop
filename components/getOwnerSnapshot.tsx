import React, { useState } from "react";
import CollectionNames from "../components/CollectionNames";
import AirdropTokens from "./AirdropTokens";

const HoldersList = ({
  setOwnerAccounts,
  updateRecipientAddresses,
}: {
  setOwnerAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  updateRecipientAddresses: (addresses: string[]) => void;
}) => {
  const [collectionAddress, setCollectionAddress] = useState<string>("");
  const [owners, setOwners] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ownersList, setOwnersList] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [isUpdated, setIsUpdated] = useState(false);

  // Function to send request to HelloMoon API to get Mint List and Owner List from collection id input
  const getNFTHolders = async (collectionAddress: string) => {
    const ownerAccounts: string[] = [];

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
        const pageOwnerAccounts: string[] = data.map(
          (mint: any) => mint.ownerAccount
        );
        ownerAccounts.push(...pageOwnerAccounts);
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

    return ownerAccounts;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setOwners([]);
    setLoading(true);

    try {
      const addresses = await getNFTHolders(collectionAddress);
      setOwners(addresses);
      setOwnersList(addresses);
      setAddresses(addresses); // update the addresses state
    } catch (error) {
      setError("Error retrieving NFT owners");
      console.error(error);
    }

    setLoading(false);
  };

  const handleUpdateAddresses = () => {
    updateRecipientAddresses(ownersList);
    setAddresses(ownersList);
  };

  const handleClearAddresses = () => {
    updateRecipientAddresses([]);
  };

  const uniqueHolders = new Set(owners);
  const totalHolders = uniqueHolders.size;

  return (
    <div className="bg-gray-200 w-max">
      <div className="mx-auto px-4 py-8 w-max">
        <div className="flex flex-row">
          <div className="w-full flex md:w-2/5 mr-24">
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
                {loading ? "Loading..." : "Generate Holder Snapshot"}
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
            <div className="w-full bg-white rounded-lg shadow">
              <div className="flex flex-row">
                <h2 className="text-lg font-bold px-4 py-2 border-b border-gray-300">
                  Holder Wallets
                </h2>
                <h2 className="text-lg ml-auto mr-2 text-blue-400 my-auto text-right font-bold px-1">
                  Unique Holders: {totalHolders} / Total Holders:{" "}
                  {owners.length}
                </h2>
              </div>
              <div className="overflow-y-auto max-w-4xl mx-auto max-h-96">
                {owners.map((owner, index) => (
                  <div
                    key={index}
                    className="w-full md:w-1/2 lg:w-1/3 py-2 px-4 text-gray-700"
                  >
                    {owner}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 w-1/2 text-white py-2 px-4 rounded-lg font-medium"
                  onClick={handleUpdateAddresses}
                >
                  Update Addresses
                </button>
                
                <button
                  className="bg-green-500 w-1/2 text-white py-2 px-4 rounded-lg font-medium"
                  onClick={() => {
                    const uniqueAddresses = ownersList.filter(
                      (address, index) => ownersList.indexOf(address) === index
                    );
                    updateRecipientAddresses(uniqueAddresses);
                    setAddresses(uniqueAddresses);
                  }}
                >
                  Update Unique Addresses
                </button>

                <button
                  onClick={handleClearAddresses}
                  className="bg-red-500 w-1/2 text-white px-4 py-2 rounded-lg"
                >
                  Clear Addresses
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoldersList;
