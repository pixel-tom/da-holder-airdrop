import React, { useEffect } from "react";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  PublicKey,
  Connection,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";

const AirdropTest = ({
  recipientAddresses,
}: {
  recipientAddresses: string[];
}) => {
  const connection = new Connection("https://api.devnet.solana.com");
  const { publicKey, signTransaction } = useWallet();
  const mintKeys = [
    new PublicKey("2gVwm5j1Dy6u88tmJumVpVmdEa9vGzWGCiqThazHCaj6"),
    new PublicKey("Dbr6ZzHhiG9yA4nQP1oe4qyzbXF8utVDf9veG1WoDCDD"),
  ];

  let testMintKey = new PublicKey(
    "tczSo8dpqjmo331gmLsWbGAgCRJZnmK4u6QJ4agzJqU"
  );

  let testHolders = [
    "EJ9vJt8pr4RKptxCxb1TrdbFjFzbTdkx3hpqvs3a2NDL",
    "7LqBQnMxcyZyzNwgA75cBm6TA7TsALbSKJpVZtGiyhEG",
  ];

  // when not testing return value back to <recipientAddresses> below
  let holders = testHolders;

  const handleAirdrop = async () => {
    if (!publicKey || !signTransaction) {
      return;
    }

    const shuffledMintKeys = mintKeys.sort(() => Math.random() - 0.5);

    const tx = new Transaction();

    for (let i = 0; i < holders.length && i < shuffledMintKeys.length; i++) {
      const holder = holders[i];
      const mintKey = shuffledMintKeys[i];
      const destPublicKey = new PublicKey(holder);
      const destTokenAccount = await getAssociatedTokenAddress(
        mintKey,
        destPublicKey
      );
      const receiverAccount = await connection.getAccountInfo(destTokenAccount);

      console.log(
        `sending ${mintKey.toBase58()} to ${destPublicKey.toBase58()}`
      );

      const fromTokenAccount = await getAssociatedTokenAddress(
        mintKey,
        publicKey
      );
      const fromPublicKey = publicKey;

      if (receiverAccount === null) {
        tx.add(
          createAssociatedTokenAccountInstruction(
            fromPublicKey,
            destTokenAccount,
            destPublicKey,
            mintKey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }

      tx.add(
        createTransferInstruction(
          fromTokenAccount,
          destTokenAccount,
          fromPublicKey,
          1
        )
      );
    }

    // the const below is to figure out how many NFTs are being sent so we can calculate the txn fee we want to implement

    // 3000000 lamports = .003 SOL
    const txnFee = holders.length * 3000000;

    // Also have to create a treasury to store accumulated fees

    const treasury = new PublicKey(
      "8uToe5ptfG8VcQjAbr3FFkPmtRysiUv8ABcbpxyDnfYt"
    );

    // Add a transfer instruction to the transaction
    tx.add(
      // The transfer instruction transfers .003 SOL from the sender to the treasury
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: treasury,
        lamports: txnFee, // 1 SOL = 1 billion lamports
      })
    );

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = publicKey;

    try {
      const signed = await signTransaction(tx);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature, "confirmed");

      toast.success("Transaction successful");
    } catch (e: any) {
      toast.error(e.message);
    }
  }; // end of owners for loop

  return (
    <div>
      <button onClick={handleAirdrop}>Run Airdrop</button>
      <div>AirdropTest</div>
      <p>{recipientAddresses.length}</p>
    </div>
  );
};

export default AirdropTest;
