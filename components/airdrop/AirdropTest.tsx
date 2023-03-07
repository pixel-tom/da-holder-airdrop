/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
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
  let mintKey = new PublicKey("tczSo8dpqjmo331gmLsWbGAgCRJZnmK4u6QJ4agzJqU");

  let testMintKey = new PublicKey(
    "tczSo8dpqjmo331gmLsWbGAgCRJZnmK4u6QJ4agzJqU"
  );

  let testHolders = [
    "7LqBQnMxcyZyzNwgA75cBm6TA7TsALbSKJpVZtGiyhEG",
    "EJ9vJt8pr4RKptxCxb1TrdbFjFzbTdkx3hpqvs3a2NDL",
    "8uToe5ptfG8VcQjAbr3FFkPmtRysiUv8ABcbpxyDnfYt",
  ];

  //when not testing return value back to <recipientAddresses> below
  let holders = testHolders;

  const airdrop = async () => {
    const { publicKey, signTransaction } = useWallet();
    const wallet = useWallet();
    if (!wallet) {
      return;
    }

    if (!publicKey) {
      return;
    }
    const tx = new Transaction();

    for (let i = 0; i < holders.length; i++) {
      const fromTokenAccount = await getAssociatedTokenAddress(
        mintKey,
        publicKey
      );
      const fromPublicKey = publicKey;
      const destPublicKey = new PublicKey(holders[i]);
      const destTokenAccount = await getAssociatedTokenAddress(
        mintKey,
        destPublicKey
      );
      const receiverAccount = await connection.getAccountInfo(destTokenAccount);

      console.log(
        `sending ${mintKey.toBase58()} to ${destPublicKey.toBase58()}`
      );

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
      console.log(destTokenAccount.toString());

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = publicKey;

      let signed: Transaction | undefined = undefined;

      try {
        if (!signTransaction) {
          console.log("Error! Possibly undefined signTransaction!");
          return;
        }
        signed = await signTransaction(tx);
      } catch (e: any) {
        toast(e.message);
        return;
      }

      let signature: string | undefined = undefined;

      try {
        signature = await connection.sendRawTransaction(signed.serialize());
        await connection.confirmTransaction(signature, "confirmed");

        toast.success("Transaction successful");
      } catch (e: any) {
        toast.error(e.message);
      }
    }
  }; // end of owners for loop

  airdrop();

  return <div>AirdropTest</div>;
};

export default AirdropTest;
