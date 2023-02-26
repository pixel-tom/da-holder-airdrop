import React from "react";
import { NftOwner } from "./getOwnerSnapshot";

export interface OwnerListProps {
  owners: NftOwner[];
}

export const OwnerList: React.FC<OwnerListProps> = ({ owners }) => {
  console.log(owners);

  if (owners.length === 0) {
    return <p>No owner addresses found</p>;
  }

  const ownerAddresses = owners.map((owner) => {
    if (!owner.owner_account) {
      console.log("Invalid owner object:", owner);
      return "";
    }
    return owner.owner_account;
  });

  return (
    <div>
      <ul>
        {ownerAddresses.map((owner, index) => (
          <li key={`owner-${index}`}>{owner}</li>
        ))}
      </ul>
    </div>
  );
};

export default OwnerList;
