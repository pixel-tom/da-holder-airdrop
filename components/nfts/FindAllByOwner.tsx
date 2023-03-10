/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { Connection } from "@solana/web3.js";
import axios from "axios";
import { TokenMetadata } from "./types/types";

type OnChainMetadata = {
  metadata: {
    decimals: number;
    freezeAuthority: string;
    isInitialized: boolean;
    mintAuthority: string;
    supply: string;
  };
  error: string;
};

type OffChainMetadata = {
  metadata: {
    mint: string;
    uri: string;
    creators: any;
    attributes: {
      traitType: string;
      value: string;
    }[];
    description: string;
    image: string;
    name: string;
    properties: {
      category: string;
      creators: {
        address: string;
        share: number;
      }[];
      files: {
        type: string;
        uri: string;
      }[];
    };
    sellerFeeBasisPoints: number;
    symbol: string;
  };
  uri: string;
  error: string;
};

export const NftsByOwner = () => {
  const connection = new Connection(
    "https://rpc.helius.xyz/?api-key=e6b85a35-8829-4016-ac2f-90755018d1b6"
  );
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<any>();
  const [mintArray, setMintArray] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<TokenMetadata[]>([]);
  const [selectedNfts, setSelectedNfts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (publicKey) {
      fetchNfts();
    }
  }, [publicKey]);

  const fetchNfts = async () => {
    const result = await getParsedNftAccountsByOwner({
      publicAddress: publicKey?.toBase58() ?? "",
      connection,
    });
    setNfts(result);
  };

  useEffect(() => {
    if (nfts?.length) {
      const mintValues = nfts?.map((nft: any) => nft.mint);
      setMintArray(mintValues);
    }
  }, [nfts]);

  const getMetadata = async (mintAccounts: string[]) => {
    const url =
      "https://api.helius.xyz/v0/token-metadata?api-key=e6b85a35-8829-4016-ac2f-90755018d1b6";
    const { data } = await axios.post(url, {
      mintAccounts: mintAccounts,
      includeOffChain: true,
    });
  
    // Create an array of promises to load all images
    const imagePromises = data.map((token: TokenMetadata) => {
      const offChainMetadata = token.offChainMetadata?.metadata;
      const image = offChainMetadata?.image;
      if (image) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = image;
        });
      } else {
        return Promise.resolve();
      }
    });
  
    // Wait for all image promises to resolve before setting the loading state to false
    await Promise.all(imagePromises);
    setMetadata((prevData: TokenMetadata[]) => [...prevData, ...data]);
    setLoading(false);
  };
  

  useEffect(() => {
    if (mintArray?.length) {
      const chunkSize = 100;
      for (let i = 0; i < mintArray.length; i += chunkSize) {
        const chunk = mintArray.slice(i, i + chunkSize);
        getMetadata(chunk);
      }
    }
  }, [mintArray]);

  return (
    <div>
      <div>
        <label>
          <span>Wallet Address: </span>
          <span>{publicKey ? publicKey.toBase58() : "Not connected"}</span>
        </label>
      </div>
      <div>
        {loading ? (
          <div>Loading Wallet Assets...</div>
        ) : (
          metadata && (
            <div className="grid grid-cols-10 gap-1">
              {metadata.map((token: TokenMetadata, index: number) => {
                const offChainMetadata = token.offChainMetadata?.metadata;
                const image = offChainMetadata?.image;
                const mint = offChainMetadata?.mint;
                const name = offChainMetadata?.name;
                return (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg">
                    {image && (
                      <div>
                        <img
                          src={image}
                          alt={name}
                          className="mx-auto"
                          width={200}
                          height={200}
                          onLoad={() => setLoading(false)}
                        />
                      </div>
                    )}
                    {mint && (
                      <div>
                        <span className="font-bold">Mint: </span>
                        <span>{mint}</span>
                      </div>
                    )}
                    {name && (
                      <div>
                        <span className="font-bold">Name: </span>
                        <span>{name}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
  
};
