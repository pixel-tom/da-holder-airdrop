import React, { useState } from "react";
import { Helius, MintlistResponse } from "helius-sdk";

const HeliusMintlist = () => {
  const [response, setResponse] = useState<MintlistResponse | undefined>(
    undefined
  );
  const [creator, setCreator] = useState("");

  const handleCreatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreator(event.target.value);
  };

  const handleButtonClick = async () => {
    const helius = new Helius("e6b85a35-8829-4016-ac2f-90755018d1b6");
    const mintListResponse = await helius.getMintlist({
      query: {
        firstVerifiedCreators: [creator],
      },
      options: { limit: 10000 },
    });
    setResponse(mintListResponse);
  };

  return (
    <div className="ml-6 mt-12">
      <h1>Helius Mintlist</h1>
      <div>
        <label htmlFor="creator">
          Enter CandyMachine ID/First Creator Address:{" "}
        </label>
      </div>
      <input
        className="py-1 px-2 border-2 rounded"
        placeholder="Creator Address.."
        type="text"
        id="creator"
        value={creator}
        onChange={handleCreatorChange}
      />
      <button
        className="px-4 py-2 m-2 text-white bg-purple-500 rounded-md"
        onClick={handleButtonClick}
      >
        Fetch Mintlist
      </button>
      {response ? (
        <div>
          <p>Total Items: {response.result.length}</p>
          {response.result.map((item) => (
            <div key={item.mint}>
              <p>{item.mint}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>
          Mint List will display here.
        </p>
      )}
    </div>
  );
};

export default HeliusMintlist;
