import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const contractABI = [
  "function name() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [balance, setBalance] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await provider.getSigner();
        setWalletAddress(accounts[0]);

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const name = await contract.name();
        const supply = await contract.totalSupply();
        const userBalance = await contract.balanceOf(accounts[0]);

        setTokenName(name);
        setTotalSupply(ethers.formatEther(supply));
        setBalance(ethers.formatEther(userBalance));
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask not detected");
    }
  }

  async function loadTokenData() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const name = await contract.name();
    const supply = await contract.totalSupply();
    const userBalance = await contract.balanceOf(walletAddress);

    setTokenName(name);
    setTotalSupply(ethers.formatEther(supply));
    setBalance(ethers.formatEther(userBalance));
  }

  async function transferTokens() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.transfer(recipient, ethers.parseEther(amount));
    await tx.wait();
    alert(`✅ Sent ${amount} tokens to ${recipient}`);

    // Actualizar balance después de transferir
    const userBalance = await contract.balanceOf(walletAddress);
    setBalance(ethers.formatEther(userBalance));
  }

  useEffect(() => {
    if (walletAddress) {
      loadTokenData();
    }
  }, [walletAddress]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🪙 MyToken Interface</h1>

      {!walletAddress && <button onClick={connectWallet}>Connect Wallet</button>}
      {walletAddress && <p>🔗 Connected: {walletAddress}</p>}

      <p><strong>Token:</strong> {tokenName}</p>
      <p><strong>Total Supply:</strong> {totalSupply} MTK</p>
      <p><strong>Your Balance:</strong> {balance} MTK</p>

      <h2>Transfer Tokens</h2>
      <input type="text" placeholder="Recipient address" value={recipient} onChange={e => setRecipient(e.target.value)} />
      <input type="text" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={transferTokens}>Send Tokens</button>
    </div>
  );
}

export default App;