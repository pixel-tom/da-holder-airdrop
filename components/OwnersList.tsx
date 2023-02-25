import React from "react";

interface OwnersListProps {
  owners: NftOwner[];
}

interface NftOwner {
  wallet_address: string;
}

const OwnersList: React.FC<OwnersListProps> = ({ owners }) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">{owners.length} Mint Addresses:</h2>
      <div className="flex flex-col space-y-2">
        {owners.map((owner, i) => (
          <div key={i} >
            <span>{owner.wallet_address}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default OwnersList;
