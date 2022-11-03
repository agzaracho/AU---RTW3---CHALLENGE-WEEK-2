import React from 'react'
import { FaDiscord } from 'react-icons/fa';
import { DataContext } from "../context/DataContext";
import { useContext } from 'react';

export default function Footer() {

  const { account } = useContext(DataContext);
  return (

    <footer className="text-center bg-gray-900 text-white footer">
      <div className="text-center mt-2 p-4">
       
          <a className="text-lime-400" href="https://university.alchemy.com/"> Alchemy University | </a> 
          {account ? (<>If you bought me a coffee. Ask me for a thank you poap on Discord. Thank you!</>):(<>© 2022 - Front for the smart contract develop in the RTW3 - Week 2 </>)}
      </div>
    </footer>

  )
}
