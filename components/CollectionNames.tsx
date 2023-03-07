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
            className="text-gray-200 font-medium mb-2"
          >
            Collection Name
          </label>
          <div className="flex w-full h-full">
            <input
              id="collectionName"
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="flex-1 h-auto py-2 px-4 bg-gray-700 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Search for a collection..."
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="ml-2 px-4 py-2 border border-gray-400 text-gray-300 font-medium rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex-shrink-0 h-full"
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
                "Search"
              )}
            </button>
          </div>
          <div className="mt-4 w-full h-full">
            <div className="flex w-full h-full">
              <select
                id="collections"
                className="flex-1 h-auto py-2 px-4 bg-gray-700 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
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
                className="flex ml-2 px-4 w-1/4 py-2 border border-gray-400 text-gray-300 font-medium rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 h-full"
              >
                <div className="mx-auto">
                  <p>Copy ID</p>
                </div>
                <div className="mr-auto mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-clipboard"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                  </svg>
                </div>
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
