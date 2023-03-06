import React from "react";
import { useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import FetchTokens from "../components/FetchTokens";
import WalletButton from "../components/nfts/FindAllByOwner";
import HeliusMintlist from "../components/mintlist/HeliusMintlist";
import AirdropSol from "../components/airdrop/AirdropSol";

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
        {/* <AirdropSol recipientAddresses={recipientAddresses} /> */}
      </div>
    </div>
  );
};

export default tokens;
