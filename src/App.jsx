import { useContext } from "react";
import Navbar from "./components/Navbar";
import Error from "./components/Error";
import Footer from "./components/Footer";
import BuyMeACoffe from "./components/buyMeACoffe";
import { Routes, Route } from "react-router-dom";
import { DataContext } from "./context/DataContext";

function App() {
  const { networkId, isSupportMetaMask } =
    useContext(DataContext);

  return (
    <div className="App min-h-screen text-white">
      {isSupportMetaMask ? (
        networkId != undefined ? (
          networkId == 5 ? (
            <div>
              <div>
                <Navbar />
              </div>
              <Routes>
                <Route path="/" element={<BuyMeACoffe />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </div>
          ) : (
            <div className="translate-y-1/2">
              <div className="text-center flex items-center justify-center shadow-xl w-[90%] md:max-w-[450px] h-[200px] bg-[#191b1fc2] mx-auto rounded-xl p-4">
                Sorry, our contract only run on the Goerli Testnet, you have to
                switch your network to continue...

                {/* TODO: AGREGAR BOTON PARA CAMBIAR DE RED */}
              </div>
            </div>
          )
        ) : (
          <div className="translate-y-1/2">
            <div className="text-center flex items-center justify-center shadow-xl w-[90%] md:max-w-[450px] h-[200px] bg-[#191b1fc2] mx-auto rounded-xl p-4">
              Try to refresh the page ^_^
            </div>
          </div>
        )
      ) : (
        <div className="translate-y-1/2">
          <div className="text-center flex items-center justify-center shadow-xl w-[90%] md:max-w-[450px] h-[200px] bg-[#191b1fc2] mx-auto rounded-xl p-4">
            You should consider trying MetaMask!
          </div>
        </div>
      )}

      <div className="bg-shine bg-main fixed top-0 left-0 right-0 bottom-0 z-[-1] h-200"></div>

      <Footer />

    </div>
  );
}

export default App;
