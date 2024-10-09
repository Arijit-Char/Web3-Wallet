import React, { useEffect, useState } from "react";
import { mnemonicToSeedSync } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import "./Mnemonic.scss";

export default function Eth({ mnemonic }) {
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  useEffect(() => {
    if (mnemonic === "") {
      setPublicKeys([]);
      setPrivateKeys([]);
    }
  }, [mnemonic]);
  return (
    <div className="wallet-container">
      <button
        className="generate-btn"
        onClick={() => {
          if (mnemonic === "") {
            return alert("Please generate a mnemonic first");
          }
          const seed = mnemonicToSeedSync(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const privateKey = child.privateKey;
          const wallet = new Wallet(privateKey);
          setCurrentIndex(currentIndex + 1);
          setPrivateKeys([...privateKeys, privateKey]);
          setPublicKeys([...publicKeys, wallet.address]);
        }}
      >
        Generate Ethereum Wallet
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
        </div>
      ))}
    </div>
  );
}
