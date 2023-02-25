import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  return (
    <div>
      {" "}
      <WalletMultiButton />
    </div>
  );
};

export default Header;
