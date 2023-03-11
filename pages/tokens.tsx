/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import FetchTokens from "../components/FetchTokens";
import { NftsByOwner } from "../components/nfts/FindAllByOwner";
import HeliusMintlist from "../components/mintlist/HeliusMintlist";
import AirdropTest from "../components/airdrop/AirdropTest";

const tokens = () => {
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);

  return (
    <div>
      {" "}
      <h1>
        <Link href="/">Home</Link>
      </h1>
      <div>
        {" "}
        <WalletMultiButton />
      </div>
      <div>
        <FetchTokens />
        <AirdropTest recipientAddresses={[]} />
      </div>
      <div>
        
        <HeliusMintlist />
      </div>
    </div>
  );
};

export default tokens;
