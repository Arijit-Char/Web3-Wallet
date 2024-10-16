import React, { useState } from "react";
import { generateMnemonic } from "bip39";
import Sol from "./Sol";
import Eth from "./Eth";
import "./Mnemonic.scss";

export default function Mnemonic() {
  const [mnemonic, setMnemonic] = useState("");
  const [mnemonicInd, setMnemonicInd] = useState([]);

  var tmp = "";
  const handleMnemonicWords = () => {
    const mnemonicWords = [];
    for (let i = 0; i < mnemonic.length; i++) {
      if (mnemonic[i] === " ") {
        mnemonicWords.push(tmp);
        tmp = "";
      } else {
        tmp += mnemonic[i];
      }
    }
    setMnemonicInd(mnemonicWords);
  };

  React.useEffect(() => {
    handleMnemonicWords();
  }, [mnemonic]);

  return (
    <div className="mnemonic">
      <div className="header">
        <h1>Web3 Wallet</h1>
      </div>
      <div className="button">
        <button
          disabled={mnemonic !== ""}
          style={{
            backgroundColor: mnemonic !== "" ? "grey" : "blue",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: mnemonic !== "" ? "none" : "pointer",
          }}
          onClick={() => {
            setMnemonic(generateMnemonic());
          }}
        >
          Generate Your Mnemonic
        </button>
      </div>
      <div
        className="mnemonicArea"
        style={{ display: mnemonic !== "" ? "flex" : "none" }}
      >
        <button
          className="close-btn"
          onClick={() => {
            setMnemonic("");
            setMnemonicInd([]);
          }}
        >
          &times;
        </button>
        {mnemonicInd.map((word, index) => {
          return (
            <div key={index} className="mnemonicWord">
              {word}
            </div>
          );
        })}
      </div>
      {
        <div className="wallet">
          <div className="sol">
            <Sol mnemonic={mnemonic} />
          </div>
          <div className="eth">
            <Eth mnemonic={mnemonic} />
          </div>
        </div>
      }
    </div>
  );
}
