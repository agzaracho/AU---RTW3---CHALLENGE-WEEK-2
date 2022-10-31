import React, { useState, useEffect, useContext } from "react";
import { RiGithubLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { shortenAddress } from "../utils/shortenAddress";
import au from "../images/au3.png";

let commonCss =
  "font-bold px-2 md:px-4 py-1  cursor-pointer rounded-2xl hover:text-white transition duration-200 flex ";

const NavItem = ({ active, content, handleOnClick }) => {
  return content == "GitHub" ? (
    <a
      className={commonCss + "text-gray-300"}
      href="https://github.com/agzaracho"
      target="_blank"
      rel="noopenner noreferrer"
    >
      {content} <RiGithubLine className="ml-1 mt-1 text-bold" />
    </a>
  ) : (
    <Link to={"/" + (content == "BuyMeACoffe" ? "" : content)}>
      <div
        onClick={handleOnClick}
        className={
          commonCss +
          (active == content
            ? "bg-[#212429] text-white hover:text-gray-400"
            : "text-gray-300")
        }
      >
        {content}
      </div>
    </Link>
  );
};

export default function Navbar() {
  const { requestAccount, account} = useContext(DataContext);
  const [isActive, setIsActive] = useState("BuyMeACoffe");
  const navMenu = ["BuyMeACoffe", "GitHub"];


  useEffect(async () => {
    let url = window.location.href;
    let param = url.substring(url.lastIndexOf("/") + 1);
    param == "" ? setIsActive("BuyMeACoffe") : setIsActive("");
  }, [account]);

  
  return (
    <div className="grid grid-cols-3 p-3" >

      <div className="w-[fit-content] cursor-pointer hover:scale-150 transition duration-400" >
        {/* LOGO */}
        <a href="https://university.alchemy.com/" target="_blank">
          <img className="w-14 ml-3"          
          src={au}
          alt="AlchemyUniversity-logo"
          />
        </a>
        
      </div>

      <div className="fixed bottom-5 left-[50%] translate-x-[-80%] md:static md:translate-x-[%] p-[4px] bg-[#191b1f] flex rounded-full md:w-[fit-content] place-self-center">
        {navMenu.map((item, index) => (
          <NavItem
            key={item + index}
            active={isActive}
            content={item}
            handleOnClick={() => setIsActive(item)}           
          />
          
        ))}
        
      </div>
            
      <div className="flex justify-self-end  md:justify-self-end  items-center justify-center">
        <a
          href="https://goerli.etherscan.io/"
          className="min-w-[170px] hidden 2xl:flex items-center mr-2 px-4 py-2 rounded-2xl bg-[#191b1f] cursor-pointer"
          target="_blank"
          rel="noopenner noreferrer"
        >
          <div className="w-[9px] h-[9px] bg-yellow-500 mr-2 rounded-full"></div>
          Goerli Testnet 
        </a>

        {!account ? (
          <div
            onClick={() => requestAccount()}
            className="bg-[#153d6f70] text-center w-[130px] text-sm md:text-base md:w-auto px-2 md:px-4 py-2 rounded-2xl cursor-pointer outline outline-[1px] outline-[#191b1f] text-[#5090ea] hover:text-[#5da0ff] border-[1px] border-transparent hover:border-[#3d8be970] transition duration-200"
          >
            Connect Wallet
          </div>
        ) : (
          <div className="bg-[#191b1f] flex items-center rounded-2xl p-[1px]">
          
            <a
              target="_blank"
              rel="noopenner noreferrer"
              href={`https://goerli.etherscan.io//address/${account}`}
              className="px-4 py-2 bg-[#191b1f] rounded-2xl  cursor-pointer hover:border-gray-600 border-[1px] border-transparent transition duration-200"
            >           
              {shortenAddress(account)}
            </a>
          </div>
        )}
        
             
      </div>
      
    </div>
  );
}
