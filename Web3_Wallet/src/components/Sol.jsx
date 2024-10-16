import { mnemonicToSeedSync } from "bip39";
import React, { useEffect, useState } from "react";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import axios from "axios";
import "./Mnemonic.scss";
export default function Sol({ mnemonic }) {
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [balances, setBalances] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  useEffect(() => {
    if (mnemonic === "") {
      setPublicKeys([]);
      setPrivateKeys([]);
    }
  }, [mnemonic]);
  const getBalance = async (publicKey) => {
    try {
      const response = await axios.post(
        "https://solana-mainnet.g.alchemy.com/v2/R9GU0hMRumdyZ1wQvpvDBXHBsGWzJM67",
        {
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [publicKey],
        }
      );
      console.log(response);
      const balanceLamports = response.data.result.value;
      const balanceSol = balanceLamports / 1e9;
      return balanceSol;
    } catch (error) {
      console.error("Error fetching balance", error);
      return null;
    }
  };
  return (
    <div className="wallet-container">
      <button
        className="generate-btn"
        onClick={async () => {
          if (mnemonic === "") {
            return alert("Please generate a mnemonic first");
          }
          const seed = mnemonicToSeedSync(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);
          const publicKey = keypair.publicKey.toBase58();
          const privateKey = bs58.encode(secret);
          const balance = await getBalance(publicKey);
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, publicKey]);
          setPrivateKeys([...privateKeys, privateKey]);
          setBalances([...balances, balance]);
        }}
      >
        Generate Solana Wallet
      </button>

      {publicKeys.map((p, index) => (
        <div key={index} className="wallet-info">
          <div className="public-key">Public Key: {p}</div>
          <div className="private-key">
            Private Key: {showPrivateKeys ? privateKeys[index] : "******"}
            <button onClick={() => setShowPrivateKeys(!showPrivateKeys)}>
              {showPrivateKeys ? "Hide" : "Show"}
            </button>
          </div>
          <div className="balance">
            Balance:{" "}
            {balances[index] !== null ? `${balances[index]} SOL` : "Loading..."}
          </div>
        </div>
      ))}
    </div>
  );
}
