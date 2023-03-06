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
  let mintKey = new PublicKey("put your input");
  let holders = recipientAddresses;

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

    for (var i = 0; i < holders.length; i++) {
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

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = publicKey;

      let signed: Transaction | undefined = undefined;

      try {
        if (!signTransaction) {
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
