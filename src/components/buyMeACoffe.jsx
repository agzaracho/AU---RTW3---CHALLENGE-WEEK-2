import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import abi from '../utils/BuyMeACoffee.json';
import { ethers } from "ethers";
import styles from '../styles/Home.module.css'


export default function BuyMeACoffe() {
  const { account } = useContext(DataContext);
  const [currentAccount, setCurrentAccount] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [isOwner, setIsOwner] = useState();
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const contractAddress = "0x59f0391E6c499b69B3a87cD1362aa0A694296860";
  const contractABI = abi.abi;

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const onWithdrawAddressChange = (event) => {
    const _withdrawalAddress = event.target.value
    setWithdrawAddress(_withdrawalAddress)
  }

  const getOwner = async () => {
    try {
      const {ethereum} = window;
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      // No need for the Signer here, as we are only reading state from the blockchain
      const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, provider);
      
      // call the owner function from the contract
      const _owner = await buyMeACoffee.getOwner();
      const walletConnect = await signer.getAddress()
      
      if(_owner.toLowerCase() === walletConnect.toLowerCase()){
        setIsOwner(true);
      }

    } catch (err) {
      console.error(err.message);
    }
  };

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log("accounts: ", accounts);

      if (account) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const getWithdrawalAddress = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      // No need for the Signer here, as we are only reading state from the blockchain
      const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, provider);

      const withdrawAddress1 = await buyMeACoffee.getWithdrawalAddress();
      setWithdrawAddress(withdrawAddress1)

      console.log(withdrawAddress)

    } catch (err) {
      console.error(err.message);
    }
  };

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..")
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther("0.001") }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const BuyLargeCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying 1 Large coffee..")
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your large coffee!",
          { value: ethers.utils.parseEther("0.003") }
        );
        ethers.ad
        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setWithdrawalAddress = async (address) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("changing the withdrawal addres to " + withdrawAddress);
        const coffeeTxn = await buyMeACoffee.setWithdrawalAddress(
          withdrawAddress
        );

        await coffeeTxn.wait();

        console.log("new withdrawal address set correctly");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("memos fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;

    getOwner();
    isWalletConnected();
    getMemos();
    getWithdrawalAddress()

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, [account, currentAccount]);

  return (

    <div className="mx-5 md:mx-auto mt-10 mb-24 w-auto md:max-w-[1050px]">

      <div className="bg-[#191b1fc2] mx-auto rounded-xl p-5">

        <h1 className="mt-3 md:mx-auto text-6xl text-center">
          Buy a Coffee to NFTeado#5770!
        </h1>

        {account ? (
          <div className={styles.container}>

            {!account ? (<div
              onClick={() => connectWallet()}
              className="mt-3 bg-[#153d6f70] px-2 py-2 md:py-3 rounded-2xl text-center text-[#5090ea] cursor-pointer hover:bg-[#1f5ba370] transition text-xl"
            >
              Connect Wallet
            </div>) : (
              <div className="mb-4 mt-3">

                {/* NAME / MESSAGE / BTNs */}
                <form className="mt-6 flex flex-col justify-center items-center">
                  {/* Name */}
                  <div className="flex items-center border-b border-teal-500 py-2">
                    <input
                      // "appearance-none bg-transparent border-zinc-400 border-separate w-full border-teal-500 py-2 text-[#ffffff]"
                      className="appearance-none bg-transparent border-separate w-full text-gray-100 mr-3 py-1 px-2 leading-tight hover:border-gray-100 border-transparent border-2 rounded text-center"
                      type="text"
                      placeholder="Name"
                      aria-label="Full name"
                      onChange={onNameChange}
                    />
                  </div>

                  <br />

                  {/* message to NFTeado%5770 */}
                  <div className="flex items-center border-b border-teal-500 py-2 ">
                    <textarea
                      className="appearance-none bg-transparent border-separate w-full text-gray-100 mr-3 py-1 px-2 leading-tight hover:bg-red hover:border-gray-100 border-transparent border-2 rounded text-center"
                      cols="40"
                      rows={2}
                      placeholder=" message to NFTeado#5770"
                      id="message"
                      onChange={onMessageChange}
                      required
                    >
                    </textarea>
                  </div>

                  <br /><br />

                  {/* Btn Send 1 Coffee for 0.001ETH */}
                  <button
                    className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                    type="button"
                    onClick={buyCoffee}>
                    Send 1 Coffe for 0.001 ETH
                  </button>

                  <br />

                  {/* Btn Send 1 Coffee for 0.003ETH */}
                  <button
                    className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                    type="button"
                    onClick={BuyLargeCoffee}>
                    Send 1 Large Coffe for 0.003 ETH
                  </button>
                </form>

                {/* OWNER */}
                <div className="mt-6 flex flex-col justify-center items-center">

                  {isOwner ? (
                    <div className="mt-6 flex flex-col justify-center items-center ">
                      <h1>U'RE THE OWNER. U CAN CHANGE THE WITHDRAWAL ADDRESS</h1>
                      <div className="flex items-center border-b border-teal-500 py-2">
                        <input
                          className="appearance-none bg-transparent border-separate w-full text-gray-100 mr-3 py-1 px-1 leading-tight hover:border-gray-100 border-transparent border-2 rounded text-center"
                          id="address"
                          type="text"
                          placeholder="address"
                          onChange={onWithdrawAddressChange}
                        />
                      </div>

                      <br />
                      <div >
                        <button
                          className="flex-shrink-0 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded"
                          type="button"
                          onClick={setWithdrawalAddress}
                        >
                          CHANGE THE WITHDRAW WALLET
                        </button>
                      </div>
                    </div>) : (
                    // <h1 className="mt-5">U'RE NOT THE OWNER. U CAN'T CHANGE THE WITHDRAWAL ADDRESS</h1>
                    <></>
                  )}
                </div>

              </div>)}

            <div className="mt-2 mb-2 flex items-center border-b border-teal-500 py-2 w-full"></div>
            {account && (<h1 className="mt-5 mb-1 text-center py-2">COFFEES RECEIVED</h1>)}
            <div className="mt-1 mb-5 flex items-center border-b border-teal-500 py-2 w-full"></div>


            {account && (memos.map((memo, idx) => {
              var timestamp = memo.timestamp.toString();
              var dateFormat = new Date(timestamp * 1000)

              return (

                <div className="text-center leading-tight hover:border-gray-100 border-transparent border-2 rounded" key={idx} style={{ "borderRadius": "5px", padding: "5px", margin: "5px" }}>
                  <p style={{ "fontWeight": "bold" }}>{memo.message}</p>

                  <p className="mt-2 mb-2  border-teal-500 w-[auto]">From: {memo.name} at {"Date: " + dateFormat.getDate() +
                    "/" + (dateFormat.getMonth() + 1) +
                    "/" + dateFormat.getFullYear() +
                    " " + dateFormat.getHours() +
                    ":" + dateFormat.getMinutes() +
                    ":" + dateFormat.getSeconds()}</p>
                </div>

              )
            }))}

          </div>
        ) : (
          <div
            onClick={() => connectWallet()}
            className="mt-3 bg-[#153d6f70] px-2 py-2 md:py-3 rounded-2xl text-center text-[#5090ea] cursor-pointer hover:bg-[#1f5ba370] transition text-xl"
          >
            Connect Wallet
          </div>
        )}
      </div>
    </div>
  );
}
