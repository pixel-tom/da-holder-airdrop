/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import HeliusNFTs from "./HeliusNFTs";

const AirdropTokens = ({
  recipientAddresses,
}: {
  recipientAddresses: string[];
}) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const wallet = useWallet();
  const publicKey = wallet.publicKey?.toBase58();
  const [showHeliusNFTs, setShowHeliusNFTs] = useState(false);
  const [selectedMintAddresses, setSelectedMintAddresses] = useState<string[]>(
    []
  );
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [mintAddresses, setMintAddresses] = useState<string[]>([]);
  const [totalMints, setTotalMints] = useState(mintAddresses.length);

  async function airdropNFTs(
    mintAddress: string,
    recipientAddresses: string[],
    amount: number
  ) {
    // Establish connection to Solana network
    const connection = new Connection("https://api.devnet.solana.com");

    // Wallet that is airdropping & paying fees
    const { publicKey } = useWallet();
    const YOUR_FEE_PAYER_ADDRESS = publicKey?.toString;

    // Convert mint address to public key
    const mintPublicKey = new PublicKey(mintAddress);

    // Retrieve the decimals of the mint
    const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);

    // i have to look into this
    const decimals =
      mintInfo.value!.data instanceof Buffer
        ? undefined
        : mintInfo.value!.data.parsed.info.decimals;

    // Converts recipient addresses to public keys
    const recipientPublicKeys = recipientAddresses.map(
      (address) => new PublicKey(address)
    );

    // Builds instruction to transfer NFTs to recipients
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: mintPublicKey, isSigner: false, isWritable: true },
        ...recipientPublicKeys.map((pubkey) => ({
          pubkey,
          isSigner: false,
          isWritable: true,
        })),
      ],
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      data: Buffer.from(
        Uint8Array.of(
          6,
          ...new Array(decimals).fill(0),
          ...new Array(8).fill(0),
          ...new Array(8).fill(amount)
        )
      ),
    });

    // Build and signs transaction
    const transaction = new Transaction().add(instruction);

    // have to change fee payer address below to whichever address is paying the fees,
    // normally its the signer/sender

    transaction.feePayer = new PublicKey({ YOUR_FEE_PAYER_ADDRESS });
    const signature = await connection.sendTransaction(transaction, []);
    console.log(`Transaction ${signature} submitted.`);
  }

  function handleToggleHeliusNFTs() {
    setShowHeliusNFTs(!showHeliusNFTs);
  }

  const handleSelectMintAddress = (mintAddress: string) => {
    if (!mintAddresses.includes(mintAddress)) {
      setMintAddresses([...mintAddresses, mintAddress]);
    }
  };

  const sendTokens = async () => {
    setLoading(true);
    try {
      if (recipientAddresses.length === 0) {
        throw new Error("Please enter recipient addresses");
      }

      if (selectedMintAddresses.length === 0) {
        throw new Error("Please select NFT mints to airdrop");
      }

      //
      for (let i = 0; i < recipientAddresses.length; i++) {
        const recipientAddress = recipientAddresses[i];
        for (let j = 0; j < selectedMintAddresses.length; j++) {
          const mintAddress = selectedMintAddresses[j];
          await airdropNFTs(mintAddress, [recipientAddress], 1); // airdrop the selected NFT to each recipient
        }
      }

      // clear the selected mint addresses
      setSelectedMintAddresses([]);
    } catch (error) {
      setError(`Error sending tokens: ${(error as Error)?.message}`);
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    await sendTokens();
  };

  const updateSelectedMintAddresses = (mintAddresses: string[]) => {
    setSelectedMintAddresses(mintAddresses);
  };

  return (
    <div className="flex w-full flex-wrap justify-center">
      <div className="w-full">
        <div className="rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0 text-2xl font-bold text-gray-600">
            <button
              className="px-4 py-2  flex items-center"
              onClick={handleToggleHeliusNFTs}
            >
              {showHeliusNFTs ? (
                <>
                  Hide Wallet NFTs
                  <svg
                    className="w-4 h-4 ml-3 transform rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0a1 1 0 01.832.445l8 11a1 1 0 01-.164 1.4 1 1 0 01-1.236-.164L10 3.414 2.568 12.68a1 1 0 01-1.4.164 1 1 0 01-.164-1.4l8-11A1 1 0 0110 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              ) : (
                <>
                  Show Wallet NFTs
                  <svg
                    className="w-4 h-4 ml-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0a1 1 0 01.832.445l8 11a1 1 0 01-.164 1.4 1 1 0 01-1.236-.164L10 3.414 2.568 12.68a1 1 0 01-1.4.164 1 1 0 01-.164-1.4l8-11A1 1 0 0110 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-lg text-gray-400 font-bold">
              Recipient Addresses ({recipientAddresses.length})
            </div>
            <div className="mr-4 text-lg text-gray-400 font-bold">
              NFTs Selected ({selectedMintAddresses.length})
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="ml-4 px-4 py-2 text-xl animate-bounce bg-gradient-to-tr from-blue-400 to-green-300 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:animate-none disabled:hover:cursor-not-allowed disabled:hover:from-blue-400 disabled:hover:to-green-300"
              disabled={
                loading ||
                recipientAddresses.length === 0 ||
                selectedMintAddresses.length === 0
              }
            >
              {loading ? "Sending tokens..." : "Airdrop NFTs"}
            </button>
          </div>
        </div>
  
        {showHeliusNFTs && (
          <div className={`max-w-720 mt-4 ${showHeliusNFTs ? 'show' : ''}`}>
            <HeliusNFTs
              publicKey={publicKey}
              setSelectedToken={setSelectedTokens}
              selectedTokens={selectedTokens}
              setSelectedMintAddress={handleSelectMintAddress}
              setSelectedMintAddresses={setMintAddresses}
              updateSelectedMintAddresses={updateSelectedMintAddresses}
            />
          </div>
        )}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default AirdropTokens;
