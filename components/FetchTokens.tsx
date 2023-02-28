/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { WalletAdapter } from "@solana/wallet-adapter-base";
import { useState, useEffect } from "react";

const fetchTokens = () => {
  //   const axios = require("axios");
  //   const api = "4b4253e8-cd33-40e4-b325-4bded4337236";
  //   let publicKey = useWallet().publicKey;

  //   const url = `https://api.helius.xyz/v0/addresses/${publicKey}/balances?api-key=${api}`;
  //   const getBalances = async () => {
  //     const { data } = await axios.get(url);
  //     console.log("balances: ", data);
  //   };

  //   getBalances();

  return <div>fetchTokens</div>;
};

export default fetchTokens;
