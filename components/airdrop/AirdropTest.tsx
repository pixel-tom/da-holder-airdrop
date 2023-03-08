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
  let mintKey = new PublicKey("25o1vxRGd9ZdB3Qy7GVWdnDYogRcAhpBx7Ui9iyryD8a");

  let testMintKey = new PublicKey(
    "tczSo8dpqjmo331gmLsWbGAgCRJZnmK4u6QJ4agzJqU"
  );

  let testHolders = ["HkTFX8Vk22ZcMN2G5MK5g4jbnLVZ41f77qTYXtcjYG3X"];

  //when not testing return value back to <recipientAddresses> below
  let holders = testHolders;

  const handleAirdrop = async () => {
    if (!publicKey || !signTransaction) { // added signTransaction since it was not being used
      return;
    }

    for (let i = 0; i < holders.length; i++) { // removed useWallet calls moved to top of function
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

      const tx = new Transaction(); // defined new Transaction
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
        const signed = await signTransaction(tx); // defined signed
        const signature = await connection.sendRawTransaction( // defined signature
          signed.serialize()
        );
        await connection.confirmTransaction(signature, "confirmed");

        toast.success("Transaction successful");
      } catch (e: any) {
        toast.error(e.message);
      }
    }
  };
  // end of owners for loop

  // added a button to run the function
  return (
    <div>
      <button onClick={handleAirdrop}>Run Airdrop</button> 
      <div>AirdropTest</div>
    </div>
  );
};

export default AirdropTest;