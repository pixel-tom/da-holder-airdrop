import React from "react";
import {
  Connection,
  PublicKey,
  VersionedTransaction,
  TransactionMessage,
  Transaction,
  TransactionInstruction,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountIdempotentInstruction,
  transfer,
  createTransferCheckedInstruction,
} from "@solana/spl-token";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import _config from "../../utils/config.json";

interface Drop {
  walletAddress: string;
  numLamports: number;
}

const connection = new Connection("https://api.devnet.solana.com");
const { publicKey, sendTransaction } = useWallet();

const AirdropNFT = ({
  recipientAddresses,
}: {
  recipientAddresses: string[];
}) => {
  const holders = recipientAddresses;
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

          // getting unique holders ATA's
          let ix1 = await createAssociatedTokenAccountIdempotentInstruction(
            publicKey,
            holdersAta,
            owner,
            mintKey
          );

          // getting unique senders ATA
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

  //testing
  const FROM_KEY_PAIR = publicKey;
  const NUM_DROPS_PER_TX = 10;
  const TX_INTERVAL = 1000;

  function generateTransactions(
    batchSize: number,
    dropList: Drop[],
    fromWallet: PublicKey
  ): Transaction[] {
    let result: Transaction[] = [];
    // let ix3: TransactionInstruction[] = dropList.map((drop) => {
    //   return SystemProgram.transfer({
    //     fromPubkey: fromWallet,
    //     toPubkey: new PublicKey(drop.walletAddress),
    //     lamports: drop.numLamports,
    //   });
    // });
    let ix3: TransactionInstruction[] = dropList.map((drop) => {
      if (!publicKey) {
        return;
      }

      return createTransferCheckedInstruction(
        publicKey,
        mintKey,
        holdersAta,
        publicKey,
        1e8,
        8
      );
    });

    const numTransactions = Math.ceil(ix3.length / batchSize);
    for (let i = 0; i < numTransactions; i++) {
      let bulkTransaction = new Transaction();
      let lowerIndex = i * batchSize;
      let upperIndex = (i + 1) * batchSize;
      for (let j = lowerIndex; j < upperIndex; j++) {
        if (ix3[j]) bulkTransaction.add(ix3[j]);
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
    console.log(`Initiating SOL drop from ${publicKey}`);
    if (!publicKey) {
      return;
    }
    const dropList: Drop = {
      walletAddress: holders,
      numLamports: 1,
    };
    const transactionList = generateTransactions(
      NUM_DROPS_PER_TX,
      dropList,
      publicKey
    );
    const txResults = await executeTransactions(
      connection,
      transactionList,
      FROM_KEY_PAIR
    );
    console.log(await txResults);
  })();
};

export default AirdropNFT;
