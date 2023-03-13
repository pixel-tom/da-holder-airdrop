import { useState } from "react";
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
import { toast } from "react-toastify";
import { NftsByOwner } from "../nfts/FindAllByOwner";

const AirdropSolTest = () => {
  const connection = new Connection("https://api.devnet.solana.com");
  const { publicKey, signTransaction } = useWallet();
  const NUM_DROPS_PER_TX = 10;
  const TX_INTERVAL = 1000;
  //   const [mintKeys, setMintKeys] = useState<PublicKey[]>([]);

  //   const updateMintKeys = (selectedNfts: string[]) => {
  //     const mintKeys = selectedNfts.map((nft) => new PublicKey(nft));
  //     setMintKeys(mintKeys);
  //   };

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
      if (!publicKey) {
        return [];
      }
      bulkTransaction.feePayer = publicKey;
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
              .then(resolve)
              .then(async () => {
                const signed = await signTransaction(transaction);
                const signature = await connection.sendRawTransaction(
                  signed.serialize()
                );
                await connection.confirmTransaction(signature, "confirmed");
              });
          }, i * TX_INTERVAL);
        });
      }
    );
    result = await Promise.allSettled(staggeredTransactions);
    return result;
  }

  const handler = async () => {
    if (!publicKey || !signTransaction) {
      return;
    }
    console.log(`Initiating SOL drop from ${publicKey.toString()}`);
    const transactionList = generateTransactions(
      NUM_DROPS_PER_TX,
      dropList,
      publicKey
    );

    try {
      const txResults = await executeTransactions(
        connection,
        transactionList,
        signTransaction
      );
      console.log(await txResults);
      if (
        txResults.every(
          (result: { status: string }) => result.status === "fulfilled"
        )
      ) {
        toast.success("Airdrop successful");
      } else {
        toast.error("Airdrop failed");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold my-5">Airdrop NFTs</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handler}
      >
        Run Airdrop SOL TEST
      </button>
      <div className="flex flex-row mt-8">
        {/* <p className="">Recipient Addresses: {recipientAddresses.length}</p> */}
      </div>
      <div className="w-full"></div>
    </div>
  );
};

export default AirdropSolTest;
