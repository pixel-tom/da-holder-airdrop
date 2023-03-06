import React from "react";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { useWallet } from "@solana/wallet-adapter-react";

interface Drop {
  walletAddress: string;
  numLamports: number;
}

const AirdropSol = ({
  recipientAddresses,
}: {
  recipientAddresses: string[];
}) => {
  const connection = new Connection("https://api.devnet.solana.com");
  const holders = recipientAddresses;
  const { publicKey, sendTransaction } = useWallet();

  const FROM_KEY_PAIR = publicKey;
  const NUM_DROPS_PER_TX = 10;
  const TX_INTERVAL = 1000;

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
        lamports: 1,
      });
    });

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
    payer: Keypair
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
              .then(() =>
                sendAndConfirmTransaction(solanaConnection, transaction, [
                  payer,
                ])
              )
              .then(resolve);
          }, i * TX_INTERVAL);
        });
      }
    );
    result = await Promise.allSettled(staggeredTransactions);
    return result;
  }

  (async () => {
    if (!FROM_KEY_PAIR) {
      return;
    }
    console.log(`Initiating SOL drop from ${FROM_KEY_PAIR?.toString()}`);
    const dropList: Drop[] = {
      walletAddress: holders,
      numLamports: 1,
    };

    const transactionList = generateTransactions(
      NUM_DROPS_PER_TX,
      dropList,
      FROM_KEY_PAIR
    );
    const txResults = await executeTransactions(
      connection,
      transactionList,
      FROM_KEY_PAIR
    );
    console.log(await txResults);
  })();

  return <div>AirdropSol</div>;
};

export default AirdropSol;
