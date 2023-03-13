import React from "react";
import {
  Connection,
  Keypair,
  Signer,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Drop, dropList } from "../../utils/dropList";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletConnectionError } from "@solana/wallet-adapter-base";

const connection = new Connection("https://api.devnet.solana.com");
const { publicKey, signTransaction } = useWallet();
const NUM_DROPS_PER_TX = 10;
const TX_INTERVAL = 1000;

const airdropSol = () => {
  // setting up our transactions.

  function generateTransactions(
    batchSize: number,
    dropList: Drop[],
    fromWallet: PublicKey
  ): Transaction[] {
    let result: Transaction[] = [];
    let txInstructions: TransactionInstruction[] = dropList.map((drop) => {
      return SystemProgram.transfer({
        fromPubkey: fromWallet,
        toPubkey: new PublicKey(drop.walletAddress),
        lamports: drop.numLamports,
      });
    });

    //Now you can use the batchSize parameter to chunk our transaction instructions
    //into multiple transactions.
    const numTransactions = Math.ceil(txInstructions.length / batchSize);
    for (let i = 0; i < numTransactions; i++) {
      let bulkTransaction = new Transaction();
      let lowerIndex = i * batchSize;
      let upperIndex = (i + 1) * batchSize;
      for (let j = lowerIndex; j < upperIndex; j++) {
        if (txInstructions[j]) bulkTransaction.add(txInstructions[j]);
      }
      result.push(bulkTransaction);
    }

    return result;
  }

  async function executeTransactions(
    solanaConnection: Connection,
    transactionList: Transaction[],
    signTransaction: any
  ): Promise<PromiseSettledResult<string>[]> {
    let result: PromiseSettledResult<string>[] = [];
    let staggeredTransactions: Promise<string>[] = transactionList.map(
      (transaction, i, allTx) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`Requesting Transaction ${i + 1}/${allTx.length}`);
            solanaConnection
              .getLatestBlockhash()
              .then(
                (recentHash) =>
                  (transaction.recentBlockhash = recentHash.blockhash)
              )
              .then(async () => {
                const signed = await signTransaction(transaction);
                const signature = await connection.sendRawTransaction(
                  signed.serialize()
                );
                await connection.confirmTransaction(signature, "confirmed");
              });
            //   .then(resolve);
          }, i * TX_INTERVAL);
        });
      }
    );
    result = await Promise.allSettled(staggeredTransactions);
    return result;
  }

  (async () => {
    if (!publicKey) {
      return WalletConnectionError;
    }
    console.log(`Initiating SOL drop from ${publicKey.toString()}`);
    const transactionList = generateTransactions(
      NUM_DROPS_PER_TX,
      dropList,
      publicKey
    );

    const txResults = await executeTransactions(
      connection,
      transactionList,
      publicKey
    );
    console.log(await txResults);
  })();

  return <div>airdropSol</div>;
};

export default airdropSol;
