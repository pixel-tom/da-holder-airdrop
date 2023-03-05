import React from "react";

type MintListProps = {
  mintList: string[];
};

const MintList = ({ mintList }: MintListProps) => {
  return (
    <div className="flex flex-col mb-4 text-gray-200">
      <h1 className="font-medium text-md">Total Items: {mintList.length}</h1>
      <div className="flex flex-col max-h-96 overflow-y-auto">
        {mintList.length > 0 && (
          <div className="bg-slate-600 text-gray-300 rounded-l-xl p-3">
            <ul>
              {mintList.map((mint) => (
                <li key={mint}>{mint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MintList;
