import React, { useEffect, useState } from "react";
import { mnemonicToSeedSync } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import axios from "axios";
import "./Mnemonic.scss";

export default function Eth({ mnemonic }) {
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [balances, setBalances] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);

  const fetchBalance = async (address, index) => {
    try {
      const response = await axios.post(
        "https://eth-mainnet.g.alchemy.com/v2/R9GU0hMRumdyZ1wQvpvDBXHBsGWzJM67",
        {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [address, "latest"],
        }
      );

      const balanceWei = response.data.result;
      const balanceEther = parseInt(balanceWei, 16) / 1e18;

      setBalances((prevBalances) => {
        const newBalances = [...prevBalances];
        newBalances[index] = balanceEther;
        return newBalances;
      });
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    if (mnemonic === "") {
      setPublicKeys([]);
      setPrivateKeys([]);
      setBalances([]);
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
          setBalances([...balances, "Loading..."]);
          fetchBalance(wallet.address, publicKeys.length);
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
          <div className="balance">
            Balance: {balances[index] !== "Loading..." ? `${balances[index]} ETH` : "Loading..."}
          </div>
        </div>
      ))}
    </div>
  );
}
