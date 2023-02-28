/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
  publicKey: string | null | undefined;
  setSelectedToken: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTokens: string[];
  setSelectedMintAddress: (mintAddress: string) => void;
  setSelectedMintAddresses: (mintAddresses: string[]) => void;
  updateSelectedMintAddresses: (mintAddresses: string[]) => void;
};

type MetadataInfo = {
  decimals: number;
  freezeAuthority: string;
  isInitialized: boolean;
  mintAuthority: string;
  supply: string;
};

type Creator = {
  address: string;
  verified: boolean;
  share: number;
};

type MetadataData = {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Creator[];
};

type Uses = {
  useMethod: string;
  remaining: number;
  total: number;
};

type CollectionDetails = Record<string, unknown> | null;

type Metadata = {
  tokenStandard: string;
  key: string;
  updateAuthority: string;
  mint: string;
  data: MetadataData;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: number;
  uses: Uses;
  collection: string | null;
  collectionDetails: CollectionDetails;
};

type OnChainMetadata = {
  metadata: Metadata;
  error: string;
};

type Attribute = {
  traitType: string;
  value: string;
};

type PropertiesCreator = {
  address: string;
  share: number;
};

type PropertiesFile = {
  type: string;
  uri: string;
};

type Properties = {
  category: string;
  creators: PropertiesCreator[];
  files: PropertiesFile[];
};

type OffChainMetadata = {
  metadata: {
    mint: string;
    uri: string;
    creators: any;
    attributes: Attribute[];
    description: string;
    image: string;
    name: string;
    properties: Properties;
    sellerFeeBasisPoints: number;
    symbol: string;
  };
  uri: string;
  error: string;
};

type TokenMetadata = {
  id: string;
  account: string;
  onChainAccountInfo: {
    accountInfo: {
      key: string;
      isSigner: boolean;
      isWritable: boolean;
      lamports: number;
      data: {
        parsed: {
          info: MetadataInfo;
          type: string;
        };
        program: string;
        space: number;
      };
      owner: string;
      executable: boolean;
      rentEpoch: number;
    };
    error: string;
  };
  onChainMetadata: OnChainMetadata;
  offChainMetadata: OffChainMetadata;
  legacyMetadata: Record<string, unknown> | null;
  selected: boolean;
};

const HeliusNFTs: React.FC<Props> = ({
  publicKey,
  updateSelectedMintAddresses
}) => {
  const [balances, setBalances] = useState<any>(null);
  const [metadata, setMetadata] = useState<TokenMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedMintAddresses, setSelectedMintAddresses] = useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await fetch(
          `https://api.helius.xyz/v0/addresses/${publicKey}/balances?api-key=e6b85a35-8829-4016-ac2f-90755018d1b6`
        );
        const balances = await response.json();
        setBalances(balances);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
  }, [publicKey]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const mintList = balances?.tokens.map((token: any) => token.mint);
        const metadata: TokenMetadata[] = [];

        for (let i = 0; i < mintList.length; i += 100) {
          const { data } = await axios.post(
            "https://api.helius.xyz/v0/token-metadata?api-key=4273dbb3-a1e7-441f-96b6-e7df3a893ca1",
            {
              mintAccounts: mintList.slice(i, i + 100),
              includeOffChain: true,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          metadata.push(...data);
        }

        const filteredMetadata = metadata.filter(
          (token) =>
            token.offChainMetadata &&
            token.offChainMetadata.metadata &&
            token.offChainMetadata.metadata.image
        );

        setMetadata(filteredMetadata);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    if (balances) {
      fetchMetadata();
    }
  }, [balances]);

  const handleSelectToken = (mintAddress: string) => {
    const selectedToken = metadata.find(
      (token) => token.account === mintAddress
    );
    if (selectedTokens.includes(mintAddress)) {
      setSelectedTokens(
        selectedTokens.filter((token) => token !== mintAddress)
      );
      setSelectedMintAddresses((mintAddresses) =>
        mintAddresses.filter(
          (mint) => mint !== selectedToken?.onChainMetadata?.metadata?.mint
        )
      );
    } else {
      setSelectedTokens([...selectedTokens, mintAddress]);
      setSelectedMintAddresses((mintAddresses) => [
        ...mintAddresses,
        selectedToken?.onChainMetadata?.metadata?.mint || "",
      ]);
    }
  };

  const handleUpdateSelectedMintAddresses = () => {
    updateSelectedMintAddresses(selectedMintAddresses);
  };

  return (
    <div className="h-200 mt-2 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-screen-lg mb-4">
        <div className="w-full max-w-screen-lg mb-4 h-96  overflow-y-auto">
          <div className="grid grid-cols-10 gap-2">
            {metadata
              .filter(
                (token: TokenMetadata) =>
                  token.offChainMetadata?.metadata?.image !== null
              )
              .map((token: TokenMetadata) => (
                <div
                  key={token.account}
                  className={`bg-gray-800 rounded-lg shadow-md overflow-hidden ${
                    selectedTokens.includes(token.account)
                      ? "border-4 border-indigo-500"
                      : ""
                  }`}
                  onClick={() => handleSelectToken(token.account)}
                >
                  <img
                    src={
                      token.offChainMetadata?.metadata?.image ||
                      "path-to-placeholder-image.jpg"
                    }
                    alt={
                      token.offChainMetadata &&
                      token.offChainMetadata.metadata &&
                      token.offChainMetadata.metadata.description
                    }
                    className="w-full h-50 object-cover transition duration-500 transform hover:scale-110"
                  />
                </div>
              ))}
          </div>
        </div>

        
        <div className="flex mt-4 justify-between mb-2">
          <p className="font-bold my-auto">
            Selected NFTs: {selectedMintAddresses.length}
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={handleUpdateSelectedMintAddresses}
          >
            Update NFTs to Airdrop
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={() => {
              const filteredMetadata = metadata.filter(
                (token) =>
                  token.offChainMetadata?.metadata?.image !== null &&
                  !selectedTokens.includes(token.account)
              );
              const newSelectedTokens = [
                ...selectedTokens,
                ...filteredMetadata.map((token) => token.account),
              ];
              const newSelectedMintAddresses = [
                ...selectedMintAddresses,
                ...filteredMetadata.map(
                  (token) => token.offChainMetadata?.metadata?.mint || ""
                ),
              ];
              setSelectedTokens(newSelectedTokens);
              setSelectedMintAddresses(newSelectedMintAddresses);
            }}
          >
            Select All
          </button>
          <button
            className="px-2 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-800"
            onClick={() => {
              setSelectedTokens([]);
              setSelectedMintAddresses([]);
            }}
          >
            Clear Selection
          </button>
        </div>
      </div>
      {loading && <p className="text-gray-400">Loading...</p>}
    </div>
  );
};

export default HeliusNFTs;
