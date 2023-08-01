import React from 'react'
import { FaDiscord } from 'react-icons/fa';
import { DataContext } from "../context/DataContext";
import { useContext } from 'react';

export default function Footer() {

  const { account } = useContext(DataContext);
  return (

    <footer className="text-center bg-gray-900 text-white footer">
      <div className="text-center mt-2 p-4">
       
          <a className="text-lime-400" href="https://github.com/agzaracho"> AGZ | </a> 
          {account ? (<>If you bought me a coffee, ask me for a thank you POAP on Discord. Thank you!</>):(<>Front for dApp develop in the RTW3</>)}
      </div>
    </footer>

  )
}
