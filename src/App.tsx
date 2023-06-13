import { useEffect, useState } from "react";
import { InvoiceData } from "./types";
import getAllInvoice from "./requests/grtAllinvoices";
import Logo from "./assets/logo";
import Moon from "./assets/moon";
import Sun from "./assets/sun";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import InvoiceInfo from "./pages/InvoiceInfo";

function App() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [dark, setDark] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllInvoice();
      setInvoices(data);
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (dark && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  const Switch = () => {
    setDark(!dark);
  };

  return (
    <div className="min-h-[100vh] bg-[#F8F8FB] dark:bg-[#141625] flex flex-col items-center">
      <nav className="w-full h-[72px] bg-navColor flex items-center justify-between fixed z-50">
        <div className="flex items-end  w-[72px] h-full bg-[#7C5DFA] rounded-tr-[20px] rounded-br-[20px] ">
          <div className="custom-style bg-[#9277FF] h-[35px] w-[72px] relative ">
            <div className="absolute top-[-13px] left-6">
              <Logo />
            </div>
          </div>
        </div>
        <div className="flex items-center ">
          <div className={`p-6 ${dark ? "hidden" : ""}`} onClick={Switch}>
            <Moon />
          </div>
          <div className={`p-6 ${dark ? "" : "hidden"}`} onClick={Switch}>
            <Sun />
          </div>
          <div className="pl-6 pr-6 pt-5 pb-5  border-l-[1px] border-l-[#494E6E]">
            <img
              src="./src/image-avatar.jpg"
              className="h-[32px] w-[32px] rounded-[50%]    "
              alt="avatar"
            />
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/home"
          element={<Home invoices={invoices} dark={dark} />}
        />
        <Route
          path="/InvoiceInfo/:id"
          element={<InvoiceInfo invoices={invoices} />}
        />
      </Routes>
    </div>
  );
}

export default App;
