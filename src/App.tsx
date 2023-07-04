import { useEffect, useState } from "react";
import { InvoiceData } from "./types";
import getAllInvoice from "./requests/grtAllinvoices";
import Logo from "./assets/logo";
import Moon from "./assets/moon";
import Sun from "./assets/sun";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import InvoiceInfo from "./pages/InvoiceInfo";
import Avatar from './assets/image-avatar.jpg' 
function App() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [dark, setDark] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
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
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.classList.remove("dark");
      document.body.style.backgroundColor = "#F8F8FB";
    }
  }, [dark]);

  const Switch = () => {
    setDark(!dark);
  };

  return (
    <div className="min-h-[100vh] bg-[#F8F8FB] dark:bg-[#141625] flex flex-col items-center relative">
      <nav className="w-full h-[72px] bg-navColor dark:bg-[#1E2139] overflow-hidden flex items-center justify-between fixed xl:absolute xl:left-0 z-50 xl:w-[103px] xl:h-full xl:flex-col xl:rounded-tr-[20px] xl:rounded-br-[20px]">
        <div className="flex items-end  w-[72px] h-full xl:h-[103px] xl:w-full bg-[#7C5DFA] rounded-tr-[20px] rounded-br-[20px] ">
          <div className="custom-style bg-[#9277FF] h-[35px] w-[72px] xl:w-full xl:h-[50%] relative ">
            <div className="absolute top-[-13px] left-6 xl:left-10">
              <Logo />
            </div>
          </div>
        </div>
        <div className="flex items-center xl:flex-col xl:w-full">
          <div className={`p-6 ${dark ? "hidden" : ""}`} onClick={Switch}>
            <Moon />
          </div>
          <div className={`p-6 ${dark ? "" : "hidden"}`} onClick={Switch}>
            <Sun />
          </div>
          <div className="pl-6 pr-6 pt-5 pb-5 xl:pl-8 xl:w-[103px] border-l-[1px] border-l-[#494E6E] xl:border-t-[#494E6E]  xl:border-l-[0px] xl:border-t-[1px]  ">
            <img
              src={Avatar}
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
          element={<Home screenWidth={screenWidth} invoices={invoices} setInvoices={setInvoices} dark={dark} />}
        />
        <Route
          path="/InvoiceInfo/:id"
          element={<InvoiceInfo screenWidth={screenWidth} invoices={invoices} setInvoices={setInvoices}/>}
        />
      </Routes>
    </div>
  );
}

export default App;
