import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { SOLANA_RPC } from "../utils/constants";
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const url = useMemo(() => SOLANA_RPC, []);
  
  const solflare = useMemo(() => new SolflareWalletAdapter(), []);

  return (
    <ConnectionProvider endpoint={url}>
      <WalletProvider wallets={[solflare]} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
