import React, { useState } from "react";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { walletAdapterIdentity } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";

// Connection to Helius Mainnet RPC and Metaplex API
// const connection = new Connection("https://rpc-devnet.helius.xyz/?api-key=e6b85a35-8829-4016-ac2f-90755018d1b6");
const connection = new Connection(
  "https://rpc.helius.xyz/?api-key=e6b85a35-8829-4016-ac2f-90755018d1b6"
);
const metaplex = new Metaplex(connection);

const WalletButton: React.FC = () => {
  const [response, setResponse] = useState({});

  // Obtains Wallet NFTs by publicKey from wallet
  // Displayed response to easily read so we know which data we need
  const handleClick = async () => {
    const myNfts = await metaplex.nfts().findAllByOwner({
      owner: metaplex.identity().publicKey,
    });
    setResponse(myNfts);
  };

  const wallet = useWallet();
  metaplex.use(walletAdapterIdentity(wallet));

  return (
    <div className="mt-12">
      <button
        className="px-4 py-2 m-2 text-white bg-purple-500 rounded-md"
        onClick={handleClick}
      >
        Metaplex Wallet NFTs Console Log
      </button>
      <div className="p-2 bg-gray-100">
        <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WalletButton;
