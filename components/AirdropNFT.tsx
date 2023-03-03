import React from "react";
import {
  Connection,
  PublicKey,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountIdempotentInstruction,
} from "@solana/spl-token";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";

const AirdropNFT = ({
  recipientAddresses,
}: {
  recipientAddresses: string[];
}) => {
  const connection = new Connection("https://api.devnet.solana.com");
  const holders = recipientAddresses;
  const { publicKey, sendTransaction } = useWallet();

  //below is where youll be able to input collection ID (set degods addy for testing below)

  const mintKey = new PublicKey("6XxjKYFbcndh2gDcsUrmZgVEsoDxXMnfsaGY6fpTJzNr");

  const getAta = async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    // this maps holders so we can get ATAs for each wallet

    let transactions = holders.map((holder) => {
      let owner = new PublicKey(holder);
      return new Promise<{ user: string; txId: string }>(
        async (resolve, reject) => {
          if (!publicKey) {
            return;
          }

          let holdersAta = await getAssociatedTokenAddress(mintKey, owner);

          let sendersAta = await getAssociatedTokenAddress(mintKey, publicKey);

          let ix1 = await createAssociatedTokenAccountIdempotentInstruction(
            publicKey,
            holdersAta,
            owner,
            mintKey
          );

          let ix2 = await createAssociatedTokenAccountIdempotentInstruction(
            publicKey,
            sendersAta,
            publicKey,
            mintKey
          );

          try {
            let blockhash = await connection.getLatestBlockhash();

            // Create a new TransactionMessage with version and compile it to legacy

            const messageLegacy = new TransactionMessage({
              payerKey: publicKey,
              recentBlockhash: blockhash.blockhash,
              instructions: [ix1, ix2],
            }).compileToLegacyMessage();

            // Create a new VersionedTransaction which supports legacy and v0

            const transaction = new VersionedTransaction(messageLegacy);
            const txId = await sendTransaction(transaction, connection);
            await connection.confirmTransaction({
              signature: txId,
              blockhash: blockhash.blockhash,
              lastValidBlockHeight: blockhash.lastValidBlockHeight,
            });
            resolve({
              user: holder,
              txId: txId,
            });
          } catch {
            reject(`Error with ${holder}`);
          }
        }
      );
    });
    let results = await Promise.allSettled(transactions);
    let output = JSON.stringify(results);
    console.log(output);
  };
  getAta();

  return <div>AirdropNFT {holders}</div>;
};

export default AirdropNFT;
