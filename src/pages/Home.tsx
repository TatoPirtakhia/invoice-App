import ArrowDown from "../assets/icon-arrow-down";
import Plus from "../assets/icon-plus";
import { InvoiceData } from "../types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewInvoice from "./NewInvoice/NewInvoice";
import transformDate from "../controller/dateTransform";
import Empty from "../assets/illustration-empty";

interface CheckedItems {
  [key: string]: boolean;
}

function Home(props: {
  screenWidth: number
  invoices: InvoiceData[];
  dark: boolean;
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceData[]>>;
}) {
  const [isNewInvoice, setIsNewInvoice] = useState<boolean>(false);

  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [invoicesData, setInvoicesData] = useState<InvoiceData[]>([]);
  const [hidden, setHidden] = useState<boolean>(true);
  
 

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxId = event.target.id;
    const isChecked = event.target.checked;

    setCheckedItems((prevState) => ({
      ...prevState,
      [checkboxId]: isChecked,
    }));
  };

  const navigate = useNavigate();

  const clickInvoice = (event: React.MouseEvent<HTMLInputElement>) => {
    navigate(`/InvoiceInfo/${event.currentTarget.id}`);
  };

  useEffect(() => {
    const checkedIds = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([checkboxId]) => checkboxId);
    if (checkedIds.length === 0) {
      setInvoicesData(props.invoices);
    } else {
      const newData = props.invoices.filter((data: InvoiceData) => {
        return checkedIds.includes(data.status);
      });
      setInvoicesData(newData);
    }
  }, [checkedItems, props.invoices]);

  return (
    <div className="pt-[106px] xl:pt-[70px] w-[86.51%] xl:w-[50.7%] dark:bg-[#141625] bg-[#F8F8FB] pb-[100px]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <p className="spartan font-bold text-[25px]  text-[#0C0E16] dark:text-white ">
            Invoices
          </p>
          <p className="spartan font-medium text-[15px] text-[#888EB0] mt-[-8px] dark:text-[#DFE3FA]">{`${
            invoicesData.length !== 0
              ? `${invoicesData.length} invoices`
              : "No invoices"
          } `}</p>
        </div>
        <div className="flex items-center gap-5">
          <div
            onClick={() => {
              setHidden(!hidden);
            }}
            className="flex items-center gap-3 relative"
          >
            <h2 className="spartan font-medium fonr-[12x] dark:text-white">
             {` Filter ${props.screenWidth>=768? "by status":'' }`}
            </h2>
            <ArrowDown />
            <div
              className={`flex ${
                hidden ? "hidden" : ""
              } flex-col p-6 items-start absolute w-[192px]  bg-white top-7 left-[-70px] rounded-[8px]  dark:bg-[#252945] shadow-filter dark:shadow-darkFilter  `}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-[#7C5DFA]"
                  id="paid"
                  name="paid"
                  checked={checkedItems.paid || false}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="paid"
                  className="spartan font-bold ml-4 text-[20px] dark:text-white"
                >
                  Paid
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pending"
                  className="w-5 h-5"
                  style={{ color: "#7C5DFA" }}
                  name="pending"
                  checked={checkedItems.pending || false}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="pending"
                  className="spartan font-bold ml-4 text-[20px] dark:text-white"
                >
                  Pending
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="draft"
                  className="w-5 h-5 "
                  style={{ color: "#7C5DFA" }}
                  name="draft"
                  checked={checkedItems.draft || false}
                  onChange={handleCheckboxChange}
                />
                <label
                  htmlFor="draft"
                  className="spartan font-bold ml-4 text-[20px] dark:text-white"
                >
                  Draft
                </label>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setIsNewInvoice(!isNewInvoice);
            }}
            className="w-[90px] md:w-[150px] h-[44px] md:h-12 bg-[#7C5DFA]  rounded-[24px] flex items-center pl-[6px] gap-2 md:gap-4"
          >
            <div className="w-8 h-8 bg-white rounded-[50%] flex items-center justify-center">
              <Plus />
            </div>
            <p className="spartan font-bold text-[15px] text-white">{`New ${props.screenWidth>=768? "Invoice":'' }`}</p>
          </div>
        </div>
      </div>
      <div className="absolute z-10 top-0 w-full left-0 md:bg-[#000000] dark:md:bg-[#000000] dark:md:bg-opacity-40 md:bg-opacity-50">
        {!isNewInvoice ? (
          ""
        ) : (
          <NewInvoice
            setIsNewInvoice={setIsNewInvoice}
            screenWidth={props.screenWidth}
            setInvoices={props.setInvoices}
            invoices={props.invoices}
          />
        )}
      </div>
      {invoicesData.length === 0 ? (
        <div className="w-full flex flex-col items-center pt-[100px]">
          <Empty />
          <p className="mt-10 text-[#0C0E16] spartan text-[22px] font-bold dark:text-white">
            There is nothing here
          </p>
          <p className="w-[70%] text-center spartan text-[#888EB0] dark:text-[#DFE3FA] font-medium text-[15px] mt-4">
            Create an invoice by clicking the
            <span className="font-bold">New</span> button and get started
          </p>
        </div>
      ) : (
        invoicesData.map((data: InvoiceData) => {
          return (
            <div
              className="w-full flex  items-start justify-between md:items-center bg-white rounded-[8px] shadow-custom mb-4 p-6 dark:bg-[#1E2139] z-0"
              id={data.id}
              onClick={clickInvoice}
              key={data.id}
            >
              <div className="flex flex-col items-start md:flex-row md:items-center ">
                <p className="spartan font-bold text-[#0C0E16] text-[16px] dark:text-white md:mr-[27px]">
                  <span className="spartan font-bold text-[#7E88C3] text-[16px]">
                    #
                  </span>
                  {`${data.id}`}
                </p>
                <div className="mt-6 flex flex-col items-start md:flex-row md:mt-0 md:justify-between md:gap-[37px] ">
                <p className="spartan font-medium tetx-[12px] text-[#7E88C3] dark:text-[#DFE3FA] w-[85px] ">
                  {data.paymentDue ? transformDate(data.paymentDue) : ""}
                </p>
                <p className={`${props.screenWidth>=768? 'hidden':''} spartan font-bold text-[18px] dark:text-[#DFE3FA]`}>{`£ ${data.total}`}</p>
                <div className="flex justify-start">
                <p className={` ${props.screenWidth>=768? '':'hidden'} spartan font-medium text-[#858BB2] text-[16px] dark:text-[#FFFFFF] mb-6 md:mb-0`}>
                  {data.clientName}
                </p>
                </div>
                </div>
              </div>
              <div className="flex items-start flex-col justify-between md:flex-row md:items-center md:gap-10">
                <p className={` ${props.screenWidth>=768? 'hidden':''} spartan font-medium text-[#858BB2] text-[16px] dark:text-[#FFFFFF] mb-6 md:mb-0`}>
                  {data.clientName}
                </p>
                <p className={`${props.screenWidth>=768? '':'hidden'} spartan font-bold text-[18px] dark:text-[#DFE3FA]`}>{`£ ${data.total}`}</p>
                <div
                  className={`${
                    data.status === "paid"
                      ? "bg-[#33D69F] bg-opacity-5  "
                      : data.status === "pending"
                      ? "bg-[#FF8F00] bg-opacity-5   "
                      : "bg-[#373B53] bg-opacity-5 dark:bg-opacity-5 dark:bg-[#DFE3FA]"
                  } w-[104px]  h-10 flex items-center justify-center gap-2  rounded-md`}
                >
                  <div
                    className={`w-2 h-2 rounded-[50%]   ${
                      data.status === "paid"
                        ? "bg-[#33D69F] "
                        : data.status === "pending"
                        ? "bg-[#FF8F00] "
                        : "bg-[#373B53] dark:bg-[#DFE3FA]"
                    } `}
                  ></div>
                  <p
                    className={`spartan font-bold text-[15px]  ${
                      data.status === "paid"
                        ? "text-[#33D69F]"
                        : data.status === "pending"
                        ? "text-[#FF8F00]"
                        : "text-[#373B53] dark:text-[#DFE3FA] "
                    }`}
                  >
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Home;
