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

  let typingTimer: NodeJS.Timeout;

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

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    getCollections();
  };

  return (
    <div className="">
      <div className="container w-full">
        <form className="flex flex-col max-w-sm mx-auto">
          <label htmlFor="collectionName" className="text-gray-700 font-medium mb-2">
            Collection Name
          </label>
          <div className="relative">
            <input
              id="collectionName"
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="py-2 pl-4 pr-10 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for a collection..."
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="absolute top-0 right-0 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
          {collections.length > 0 && (
            <div className="mt-4">
              
              <div className="relative">
                <select
                  id="collections"
                  className="py-2 pl-4 pr-10 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
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
                  type="button"
                  onClick={handleCopyClick}
                  className="absolute top-0 right-0 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Copy ID
                </button>
              </div>
            </div>
          )}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {loading && (
            <div className="flex justify-center items-center h-32">
              <p className="text-blue-500 font-bold">Loading...</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
  
};

export default CollectionNames;
