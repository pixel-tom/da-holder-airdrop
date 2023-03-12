import React, { useEffect, useState } from "react";
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
  RpcResponseAndContext,
  SignatureResult,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { NftsByOwner } from "../nfts/FindAllByOwner";

const AirdropTest = ({
  recipientAddresses,
}: {
  recipientAddresses: string[];
}) => {
  const connection = new Connection("https://api.devnet.solana.com");
  const { publicKey, signTransaction } = useWallet();
  const [mintKeys, setMintKeys] = useState<PublicKey[]>([]);

  const updateMintKeys = (selectedNfts: string[]) => {
    const mintKeys = selectedNfts.map((nft) => new PublicKey(nft));
    setMintKeys(mintKeys);
  };

  // const mintKeys = [
  //   new PublicKey("2gVwm5j1Dy6u88tmJumVpVmdEa9vGzWGCiqThazHCaj6"),
  //   new PublicKey("Dbr6ZzHhiG9yA4nQP1oe4qyzbXF8utVDf9veG1WoDCDD"),
  // ];

  let testMintKey = new PublicKey(
    "tczSo8dpqjmo331gmLsWbGAgCRJZnmK4u6QJ4agzJqU"
  );

  let testHolders = [
    "EJ9vJt8pr4RKptxCxb1TrdbFjFzbTdkx3hpqvs3a2NDL",
    "7LqBQnMxcyZyzNwgA75cBm6TA7TsALbSKJpVZtGiyhEG",
    "C7LqZMecK7GzTPVFeDyzWKbshDBkBjbNWWfvUatEZMq5",
    "DJ1Gj18EsiFwp1xZDTg45MMjWTM5ShVi5oS4KXU9dKHa",
    "CgDhA9sVtQFuFc5eKp3YjdxfWNYpymBdGGzeobfczG2d",
    "BWW3YpVymiyxyVuQoJLjtNisYer2EJefsuKb648g2u8f",
    "9LHVXpgKQKvApb5v4VJZMBYaTJ3AbzRFTgRH8nmjjzJq",
    "C9Q3tw8sSwTEPLCpRMtGgbUPM72TPTNzmJu7Kvy6Acxb",
  ];

  // when not testing return value back to <recipientAddresses> below
  let holders = testHolders;

  const handleAirdrop = async () => {
    if (!publicKey || !signTransaction) {
      return;
    }

    const shuffledMintKeys = mintKeys.sort(() => Math.random() - 0.5);

    const batchSize = 6; // number of transfers to include in each transaction
    const numTransactions = Math.ceil(holders.length / batchSize);
    const txList = [];

    for (let i = 0; i < numTransactions; i++) {
      const tx = new Transaction();

      for (let j = 0; j < batchSize; j++) {
        const index = i * batchSize + j;
        if (index >= holders.length || index >= shuffledMintKeys.length) {
          break;
        }
        const holder = holders[index];
        const mintKey = shuffledMintKeys[index];
        const destPublicKey = new PublicKey(holder);
        const destTokenAccount = await getAssociatedTokenAddress(
          mintKey,
          destPublicKey
        );
        const receiverAccount = await connection.getAccountInfo(
          destTokenAccount
        );

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

      txList.push(tx);
    }

    try {
      // send and confirm each transaction in the list
      const txResults = await executeTransactions(
        connection,
        txList,
        signTransaction
      );

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

  // end of owners for loop

  async function executeTransactions(
    connection: Connection,
    transactionList: Transaction[],
    signTransaction: any
  ): Promise<PromiseSettledResult<string>[]> {
    let result: PromiseSettledResult<string>[] = [];

    for (let i = 0; i < transactionList.length; i++) {
      const transaction = transactionList[i];

      try {
        console.log(
          `Requesting Transaction ${i + 1}/${transactionList.length}`
        );
        const signed = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signed.serialize()
        );
        await connection.confirmTransaction(signature, "confirmed");
        result.push({ status: "fulfilled", value: signature });
      } catch (error) {
        console.error(`Transaction ${i + 1} failed: ${error}`);
      }

      // add a delay of 1 second between each transaction
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return result;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold my-5">Airdrop NFTs</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAirdrop}
      >
        Run Airdrop
      </button>
      <div className="flex flex-row mt-8">
        <p className="">Recipient Addresses: {recipientAddresses.length}</p>
        <p className="pl-10">NFTs to Airdrop: {mintKeys.length}</p>
        <button className="pl-10" onClick={() => console.log(mintKeys)}>
          Log Mint Keys
        </button>
      </div>
      <div className="w-full">
        <NftsByOwner
          onUpdateSelectedNfts={updateMintKeys}
          mintKeys={mintKeys}
        />
      </div>
    </div>
  );
};

export default AirdropTest;
