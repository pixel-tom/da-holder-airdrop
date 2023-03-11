/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { Connection } from "@solana/web3.js";
import axios from "axios";
import { TokenMetadata } from "./types/types";

interface NftsByOwnerProps {
  onUpdateSelectedNfts: (selectedNfts: string[]) => void;
}

export const NftsByOwner = ({ onUpdateSelectedNfts }: NftsByOwnerProps) => {
  const connection = new Connection(
    "https://rpc-devnet.helius.xyz/?api-key=e6b85a35-8829-4016-ac2f-90755018d1b6"
  );
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<any>();
  const [mintArray, setMintArray] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<TokenMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNfts, setSelectedNfts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    if (publicKey) {
      getParsedNftAccountsByOwner({
        publicAddress: publicKey.toBase58(),
        connection,
      }).then(result => {
        setNfts(result);
      });
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
      mintAccounts: mintAccounts.map((mint) => mint.split(",")[0]), // extract first creator address
      includeOffChain: true,
    });

    // Create an array of promises to load all images
    const imagePromises = data.map((token: TokenMetadata) => {
      const offChainMetadata = token.offChainMetadata?.metadata;
      const image = offChainMetadata?.image;
      const symbol = offChainMetadata?.symbol;
      if (image) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = image;
        }).then(() => {
          return { ...token, symbol };
        });
      } else {
        return Promise.resolve({ ...token, symbol });
      }
    });

    // Wait for all image loading promises to resolve
    const metadataWithSymbol = await Promise.all(imagePromises);
    return metadataWithSymbol;
  };

  useEffect(() => {
    if (mintArray?.length) {
      const chunkSize = 100;
      const promises = [];
      for (let i = 0; i < mintArray.length; i += chunkSize) {
        const chunk = mintArray.slice(i, i + chunkSize);
        promises.push(getMetadata(chunk));
      }

      Promise.all(promises).then((results) => {
        const flattenedResults = results.flat();
        setMetadata(flattenedResults);
        setLoading(false);
      });
    }
  }, [mintArray]);

  const handleNftClick = (token: TokenMetadata) => {
    const account = token.account;
    let newSelectedNfts;
    if (selectAll) {
      // If "select all" is active, toggle the selection of the NFT
      const index = selectedNfts.indexOf(account);
      if (index === -1) {
        newSelectedNfts = [...selectedNfts, account];
      } else {
        newSelectedNfts = [...selectedNfts];
        newSelectedNfts.splice(index, 1);
      }
    } else {
      // Otherwise, toggle the selection of the NFT as before
      const index = selectedNfts.indexOf(account);
      if (index === -1) {
        newSelectedNfts = [...selectedNfts, account];
      } else {
        newSelectedNfts = [...selectedNfts];
        newSelectedNfts.splice(index, 1);
      }
    }
    setSelectedNfts(newSelectedNfts);
    onUpdateSelectedNfts(newSelectedNfts); // Pass the updated selectedNfts array to the parent component
  };
  

  const handleSelectAllClick = () => {
    if (selectAll) {
      // If "select all" is active, deselect all NFTs
      setSelectedNfts([]);
      setSelectAll(false);
    } else {
      // Otherwise, select all NFTs
      const allNfts = metadata.flatMap((token) => token.account);
      setSelectedNfts(allNfts);
      setSelectAll(true);
    }
    onUpdateSelectedNfts(selectedNfts); // Pass the updated selectedNfts array to the parent component
  };
  
  const handleSelectAllCreatorClick = (creatorAddress: string) => {
    const tokens = metadata.reduce((acc: TokenMetadata[], token) => {
      const creators =
        token.offChainMetadata?.metadata?.properties?.creators || [];
      const firstCreator = creators[0]?.address || "Unknown";
      if (firstCreator === creatorAddress) {
        acc.push(token);
      }
      return acc;
    }, []);
    const accounts = tokens.map((token) => token.account);
  
    // Check if all NFTs for this creator are already selected
    const allSelected = accounts.every((account) => selectedNfts.includes(account));
  
    let newSelectedNfts;
    if (allSelected) {
      // If all NFTs for this creator are already selected, deselect them
      newSelectedNfts = selectedNfts.filter((account) => !accounts.includes(account));
    } else {
      // Otherwise, select all NFTs for this creator
      newSelectedNfts = [...selectedNfts, ...accounts];
    }
    setSelectedNfts(newSelectedNfts);
    onUpdateSelectedNfts(newSelectedNfts); // Pass the updated selectedNfts array to the parent component
  };
  

  

  return (
    <div>
      
      <div>
        <div>
          <p>{selectedNfts.length}</p>
          <button
            className="px-4 py-2 bg-blue-400 rounded-lg"
            onClick={handleSelectAllClick}
          >
            {selectAll ? "Deselect All" : "Select All"}
          </button>
        </div>
        {loading ? (
          <div>Loading Wallet Assets...</div>
        ) : (
          metadata &&
          Object.entries(
            metadata.reduce(
              (acc: { [creatorAddress: string]: TokenMetadata[] }, token) => {
                const creators =
                  token.offChainMetadata?.metadata?.properties?.creators || [];
                const firstCreator = creators[0]?.address || "Unknown";
                if (firstCreator in acc) {
                  acc[firstCreator].push(token);
                } else {
                  acc[firstCreator] = [token];
                }
                return acc;
              },
              {}
            )
          ).map(([creatorAddress, tokens], index) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <h2>{creatorAddress}</h2>
                <button
                  className="px-4 py-2 bg-blue-400 rounded-lg"
                  onClick={() => handleSelectAllCreatorClick(creatorAddress)}
                >
                  Select All
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {tokens.map((token: TokenMetadata, index: number) => {
                  const offChainMetadata = token.offChainMetadata?.metadata;
                  const image = offChainMetadata?.image;
                  const name = offChainMetadata?.name;
                  const account = token.account;
                  const isSelected = selectedNfts.includes(account);
                  return (
                    <div
                      key={index}
                      className={`bg-gray-100 rounded-xl ${
                        isSelected ? "border-2 border-blue-500" : ""
                      }`}
                      onClick={() => handleNftClick(token)}
                    >
                      {image && (
                        <div>
                          <img
                            src={image}
                            alt={name}
                            className="rounded-lg w-full"
                            onLoad={() => setLoading(false)}
                          />
                        </div>
                      )}
                      {name && (
                        <div>
                          <span className="font-medium">{name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
