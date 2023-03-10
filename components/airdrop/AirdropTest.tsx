import React, { useEffect } from "react";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferInstruction,
} from "@solana/spl-token";
import { PublicKey, Connection, Transaction } from "@solana/web3.js";
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
    new PublicKey("4XDirEKVBVAFvTCMXjoiH4sURDzLyvxYs2tL9jkNdHEL"),
    new PublicKey("AMW5AYYKbbpcnweH4e2SJARiWrGCeMKdPsJieUeC3Mco"),
  ];

  let testMintKey = new PublicKey(
    "tczSo8dpqjmo331gmLsWbGAgCRJZnmK4u6QJ4agzJqU"
  );

  let testHolders = [
    "HkTFX8Vk22ZcMN2G5MK5g4jbnLVZ41f77qTYXtcjYG3X",
    "DWWbMxqKXc5Ban4maY2SokzvcQUTZp4UWM2GPWF1fb9E",
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
