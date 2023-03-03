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
    <div className="w-full mx-auto">
      <div className="mx-auto px-4 py-8 w-full">
        <div className="flex flex-col gap-32 mx-auto w-full max-w-5xl">
          <div className="w-full flex">
            <CollectionNames />
          </div>
          <div className="w-full">
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
              <div className="rounded-xl mx-auto wavy-button bg-gradient-to-r p-[3px] from-[#6EE7B7] to-[#3B82F6] wavy-div">
                <button
                  type="submit"
                  className="w-full px-4 py-2 relative  bg-slate-100 text-gray-600 rounded-lg shadow-lg font-medium hover:bg-blue-100 focus:outline-none focus: disabled:opacity-50 wavy-button"
                  disabled={loading}
                >
                  <span className="z-10 relative">
                    {loading ? "Loading..." : "Generate Holder Snapshot"}
                  </span>
                  <span className="z-0 absolute top-0 left-0 right-0 bottom-0 overflow-hidden"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
        {loading && (
          <div className="flex justify-center items-center h-32 mt-8">
            <p className="text-blue-500 font-bold">Generating Snapshot...</p>
          </div>
        )}
        {owners.length > 0 && (
          <div className="flex mt-8 gap-5">
            <div className="w-full bg-white rounded-lg shadow">
              <div className="flex flex-row ">
                <h2 className="text-lg font-bold px-4 py-2 border-b border-gray-300">
                  Holder Wallet List
                </h2>
                <h2 className="text-lg ml-auto mr-2 text-blue-400 my-auto text-right font-bold px-1">
                  Unique Holders: {totalHolders} / Total Wallets:{" "}
                  {owners.length}
                </h2>
              </div>
              <div className="overflow-y-auto mx-auto max-h-96">
                {owners.map((owner, index) => (
                  <div
                    key={index}
                    className="w-full md:w-1/2 lg:w-1/3 py-2 px-4 text-gray-700"
                  >
                    {owner}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button
                  className="bg-blue-400 w-1/2 text-white py-2 px-4 rounded-lg font-medium"
                  onClick={handleUpdateAddresses}
                >
                  Update Addresses
                </button>
                <button
                  className="bg-green-400 w-1/2 text-white py-2 px-4 rounded-lg font-medium"
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
                  className="bg-red-400 w-1/2 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4,4 L16,16"></path>
                    <path d="M4,16 L16,4"></path>
                  </svg>
                  <span>Clear Addresses</span>
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
