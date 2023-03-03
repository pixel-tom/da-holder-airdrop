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

  // Function to send request to HelloMoon API to get collection names and ids based off user input
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


  // Function to handle copying collection id from the search menu
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

  // Function to handle starting the getCollections function
  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    getCollections();
  };

  return (
    <div className="w-full h-[48px]">
  <div className="flex w-full h-full">
    <form className="flex flex-col mx-auto w-full h-full">
      <label
        htmlFor="collectionName"
        className="text-gray-700 font-medium mb-2"
      >
        Collection Name
      </label>
      <div className="flex w-full h-full">
        <input
          id="collectionName"
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          className="flex-1 py-2 pl-4 pr-10 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-full"
          placeholder="Search for a collection..."
        />
        <button
          type="button"
          onClick={handleSearchClick}
          className="ml-2 px-4 py-2 border border-gray-400 text-gray-600 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex-shrink-0 h-full"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.761 1.122 5.26 2.94 7.069l3.071-3.778z"
              ></path>
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </div>
      <div className="mt-4 w-full h-full">
        <div className="flex w-full h-full">
          <select
            id="collections"
            className="flex-1 py-2 pl-4 pr-10 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-full"
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
            className="ml-2 px-4 w-1/4 py-2 border border-gray-400 text-gray-600 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 h-full"
          >
            Copy ID
          </button>
        </div>
      </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
  
  
};

export default CollectionNames;
