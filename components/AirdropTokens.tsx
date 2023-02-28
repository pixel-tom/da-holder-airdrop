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
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Airdrop Tokens</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex items-center mb-4">
          <div className="mr-2 text-lg text-gray-700 font-bold">
            Recipient Addresses ({recipientAddresses.length})
          </div>
          <div className="mr-2 text-lg text-gray-700 font-bold">
            NFTs to Airdrop ({selectedMintAddresses.length})
          </div>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={handleToggleHeliusNFTs}
          >
            {showHeliusNFTs ? "Hide NFTs" : "Show NFTs"}
          </button>
        </div>
        {showHeliusNFTs && (
          <div style={{ maxWidth: "720px" }}>
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
        <button
          type="submit"
          onClick={handleSubmit}
          className="p-2 bg-blue-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Sending tokens..." : "Send Tokens"}
        </button>
      </div>
    </div>
  );
};

export default AirdropTokens;
