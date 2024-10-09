import React, { useState } from "react";
import { generateMnemonic } from "bip39";
import Sol from "./Sol";
import Eth from "./Eth";

export default function Mnemonic() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <div>
      <button
        onClick={() => {
          setMnemonic(generateMnemonic());
        }}
      >
        Generate Mnemonic
      </button>
      <input style={{ width: "30rem" }} type="text" value={mnemonic} />
      <Sol mnemonic={mnemonic}/>
      <br /><br />
      <Eth mnemonic={mnemonic}/>
    </div>
  );
}
