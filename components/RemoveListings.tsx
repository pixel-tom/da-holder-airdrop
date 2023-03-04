import React, { useState } from 'react';
import axios from 'axios';

const url = `https://api.helius.xyz/v1/nfts?api-key=e6b85a35-8829-4016-ac2f-90755018d1b6`;

const RemoveListings = ({ mintList, onListUpdated }: { mintList: string[], onListUpdated: (updatedList: string[]) => void }) => {
  const [response, setResponse] = useState('');
  const totalItems = mintList.length; // get total items in the list

  const handleClick = async () => {
    try {
      const updatedMints: string[] = [];
      const numRequests = Math.ceil(mintList.length / 1000);
      for (let i = 0; i < numRequests; i++) {
        const startIdx = i * 1000;
        const endIdx = startIdx + 1000;
        const mints = mintList.slice(startIdx, endIdx);
        const { data } = await axios.post(url, { mints });
        const filteredData = data.filter(
          (item: { burned: any; activeListings: string | any[] }) =>
            !item.burned && item.activeListings.length === 0
        );
        const updatedMintsBatch = filteredData.map(
          (item: { mint: any }) => item.mint
        );
        updatedMints.push(...updatedMintsBatch);
      }
      onListUpdated(updatedMints); // update the list in HeliusMintlist.tsx
      setResponse(JSON.stringify(updatedMints, null, 2)); // set response to the updated mints list
      console.log(updatedMints); // log the updated mints list
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    }
  };
  
  

  return (
    <div className='flex flex-row justify-between'>
      <div className='mb-5'>  
      <h2 className='h-full my-auto font-medium'>Total Items: {totalItems}</h2> {/* add header with total items */}
      </div>
      <div> 
      <button className='px-4 py-2 rounded-lg bg-red-300' onClick={handleClick}>Remove Listed NFTs</button>
      </div>
    </div>
  );
};

export default RemoveListings;
