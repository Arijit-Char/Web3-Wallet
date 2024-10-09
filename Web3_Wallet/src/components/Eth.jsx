import React, { useState } from "react";
import { mnemonicToSeedSync  } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export default function Eth({mnemonic}) {
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div>
      <button 
      onClick={()=>{
        if(mnemonic===""){
            return alert("Please generate a mnemonic first");
        }
        const seed =  mnemonicToSeedSync(mnemonic);
        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        setCurrentIndex(currentIndex + 1);
        setPrivateKeys([...privateKeys, privateKey]);
        setPublicKeys([...publicKeys, wallet.address]);
      }}
      > Add Wallet</button>
       {publicKeys.map((p,index) => (
        <div key={index}>{p}</div>
      ))}
      {privateKeys.map((p,index) => (
        <div key={index}>{p}</div>
      ))}
    </div>
  );
}
