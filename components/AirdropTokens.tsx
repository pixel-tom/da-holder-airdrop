import React, { useState } from "react";
import OwnerList, { OwnerListProps } from "./OwnerList";
import { NftOwner } from "./getOwnerSnapshot";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";

const AirdropTokens = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [owners, setOwners] = useState<string[]>([]);

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
    const decimals = mintInfo.value!.data.parsed.info.decimals;

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
  // just have to replace mintAddress with the address of the NFT mint you want to airdrop,
  // recipientAddresses with an array of recieving addresses, and amount with the number
  // of NFTs to airdrop to each recipient.

  const sendTokens = async () => {};

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    if (owners.length === 0) {
      setError("Please copy or enter owner addresses");
      return;
    }

    await sendTokens();
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Airdrop Tokens</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Sending tokens..." : "Send Tokens to All"}
        </button>
      </div>
    </div>
  );
};

export default AirdropTokens;
