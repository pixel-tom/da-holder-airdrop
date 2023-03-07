/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import FetchTokens from "../components/FetchTokens";
import WalletButton from "../components/nfts/FindAllByOwner";
import HeliusMintlist from "../components/mintlist/HeliusMintlist";

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
      </div>
      <div>
        <WalletButton />
        <HeliusMintlist />
      </div>
    </div>
  );
};

export default tokens;
