import React from "react";
import "./App.css";
import Mnemonic from "./components/Mnemonic";

function App() {
  return (
    <>
      <div className="App">
        <h1>Web3 Wallet</h1>
        <Mnemonic/>
      </div>
    </>
  );
}

export default App;
