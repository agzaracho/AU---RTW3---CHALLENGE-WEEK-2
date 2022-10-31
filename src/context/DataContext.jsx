import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [account, setAccount] = useState();
  const [networkId, setNetworkId] = useState();
  const [isSupportMetaMask, setIsSupportMetaMask] = useState(false);
  let provider;
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = undefined;
  }

  const requestAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };
  
  const loadWeb3 = async () => {
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      setIsSupportMetaMask(true);
    } else {
      setIsSupportMetaMask(false);
    }
  };
  const handleStartUp = async () => {
    if (typeof window.ethereum != undefined) {
      const acc = await provider.listAccounts();
      if (acc) {
        setAccount(acc[0]);
      }
            setNetworkId(window.ethereum.networkVersion);
      window.ethereum.on("chainChanged", function (networkId) {
        // Time to reload your interface with the new networkId
        setNetworkId(networkId);
      });
      window.ethereum.on("accountsChanged", async function (acc) {
        if (acc) {
          // changed account
          setAccount(acc[0]);
        } else {
          // disconnect
          setAccount([]);
        }
      });
    }
  };
  useEffect(async () => {
    await handleStartUp();
    await loadWeb3();
      }, [account]);
  
  return (
    <DataContext.Provider
      value={{
        requestAccount,
        account,
        provider,
        networkId,
        isSupportMetaMask,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
