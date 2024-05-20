import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import AdderABI from './Adder.json'; // Ensure this path is correct

const Adder = () => {
  const [account, setAccount] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contractAddress = '0xae9d2bC56B77E6eed627C581767D462DD393e6B5'; // Replace with your contract address
          const contractInstance = new web3Instance.eth.Contract(AdderABI.abi, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied account access", error);
        }
      } else {
        console.error("No Ethereum browser extension detected. Install MetaMask!");
      }
    };

    initWeb3();
  }, []);

  const connectWallet = async () => {
    if (web3) {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    }
  };

  const handleAdd = async () => {
    console.log("handleAdd called");
    if (contract && account && a !== '' && b !== '') {
      const valueA = parseInt(a, 10);
      const valueB = parseInt(b, 10);

      if (!isNaN(valueA) && !isNaN(valueB)) {
        console.log("Valid numbers entered: ", valueA, valueB);
        await contract.methods.add(valueA, valueB).send({ from: account })
          .then(async () => {
            let resultFromContract = await contract.methods.result().call();
            console.log("Raw result from contract:", resultFromContract);
            console.log("Type of result:", typeof resultFromContract);

            // Convert bigint to string to remove 'n'
            const resultString = resultFromContract.toString();
            console.log("Converted result:", resultString);

            setResult(resultString);
          })
          .catch((error) => {
            console.error("Error in transaction or fetching result:", error);
          });
      } else {
        console.error("Inputs must be valid numbers.");
      }
    } else {
      console.error("Please enter valid numbers.");
    }
  };

  return (
    <div>
      <h1>Adder DApp</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>
        <input
          type="number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Enter first number"
        />
        <input
          type="number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Enter second number"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      {result !== null && result !== '' && (
        <h2>Result: {result}</h2>
      )}
    </div>
  );
};

export default Adder;
