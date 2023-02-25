import React, { useState } from "react";
import axios from "axios";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const HolderSnapshot = () => {
  const [collectionAddress, setCollectionAddress] = useState<string>("");

  const [owners, setOwners] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getNFTOwners = async (collectionAddress: String) => {
    let page = 1;
    let wallet_addresses: any[] = [];
    const max_pages = 100;

    while (page <= max_pages) {
      const headers = {
        accept: "application/json",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2NzYyNzMzMDQyNzUsImVtYWlsIjoiYm5vcjI3MTBAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiaWF0IjoxNjc2MjczMzA0fQ.4-8Sk87IiKHmVzwGIMkTiRm2vAHjAWODYGyCoGhoYg4",
      };
      const url = `https://pro-api.solscan.io/v1.0/nft/collection/holders/${collectionAddress}?page=${page}`;
      const response = await axios.get(url, { headers });
      const responseData = response.data;

      if (responseData.data.holders.length === 0) {
        break;
      }

      wallet_addresses = wallet_addresses.concat(responseData.data.holders);
      page++;

      // Add a delay of 0.15 seconds between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return wallet_addresses;
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
          Get all current owners of an NFT collection
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
          <div className="mt-4 max-h-[400px] overflow-y-scroll">
            <h2 className="text-lg font-medium mb-2">
              {owners.length} owners found:
            </h2>
            <ul>
              {owners.map((owner, i) => (
                <li key={i}>{owner.wallet_address}</li>
              ))}
            </ul>
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
