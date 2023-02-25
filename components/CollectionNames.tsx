import React, { useState } from "react";

interface Collection {
  name: string;
  id: string;
}

const CollectionNames = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [collectionName, setCollectionName] = useState("");

  const getCollections = async () => {
    setLoading(true);
    setError("");

    try {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: "Bearer 151c15b0-d21d-40b2-9786-49678176b715",
        },
        body: JSON.stringify({ collectionName }),
      };

      const response = await fetch(
        "https://rest-api.hellomoon.io/v0/nft/collection/name",
        options
      );

      if (!response.ok) {
        throw new Error(`Error retrieving collections: ${response.status}`);
      }

      const responseData = await response.json();
      const data = responseData.data;
      const collections = data.map((collection: any) => ({
        name: collection.collectionName,
        id: collection.helloMoonCollectionId,
      }));
      setCollections(collections);
    } catch (error) {
      setError("Error retrieving collections");
      console.error(error);
    }

    setLoading(false);
  };

  const handleCopyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedOption =
      e.currentTarget.parentNode?.querySelector("option:checked");
    if (selectedOption) {
      const collectionId = selectedOption.getAttribute("data-collection-id");
      if (collectionId) {
        navigator.clipboard.writeText(collectionId);
      }
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    getCollections();
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select a Collection</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="collectionName" className="mb-2 font-medium">
          Collection name
        </label>
        <div className="flex space-x-4">
          <input
            id="collectionName"
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-60"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get collections"}
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {collections.length > 0 && (
        <div className="mt-4 flex space-x-4">
          <select className="w-60">
            {collections.map((collection) => (
              <option
                key={collection.id}
                value={collection.id}
                data-collection-id={collection.id}
              >
                {collection.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleCopyClick}
            className="p-2 bg-blue-500 text-white rounded-lg w-48"
          >
            Copy Collection ID
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-32">
          <p className="text-blue-500 font-bold">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default CollectionNames;
