import { mnemonicToSeedSync } from "bip39";
import React, { useState } from "react";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
export default function Sol({ mnemonic }) {
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div>
      <button
        onClick={() => {
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
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, publicKey]);
          setPrivateKeys([...privateKeys, privateKey]);
        }}
      >
        Add Wallet
      </button>
      {publicKeys.map((p, index) => (
        <div key={index}>{p}</div>
      ))}
      {privateKeys.map((p, index) => (
        <div key={index}>{p}</div>
      ))}
    </div>
  );
}
