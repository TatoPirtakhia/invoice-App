import { useNavigate, useParams } from "react-router-dom";
import { InvoiceData, item } from "../types";
import ArrowLeft from "../assets/icon-arrow-left";
import editInvoice from "../requests/editInvoice";
import { useEffect, useState } from "react";
import ConfirmDelete from "./ConfirmDelete";
import transformDate from "../controller/dateTransform";

function InvoiceInfo(props: { invoices: InvoiceData[] }) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<InvoiceData>({
    id: "",
    createdAt: new Date() ,
    paymentDue: new Date(),
    description: "",
    paymentTerms: 0,
    clientName: "",
    clientEmail: "",
    status: "",
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [],
    total: 0,
  });
  useEffect(() => {
    const foundData = props.invoices.find((invoice) => invoice.id === id);
    if (foundData) {
      setData(foundData);
    }
  }, [id, props.invoices]);

  const markAsPaid = async () => {
    if (data) {
      setData((prevState) => {
        return { ...prevState, status: "paid" };
      });

      const updatedData = { ...data, status: "paid" };
      await editInvoice(updatedData);
    }
  };
  const [showDeleteWindow, setShowDeleteWindow] = useState<boolean>(false);
  const deleteinvoice = () => {
    setShowDeleteWindow(!showDeleteWindow);
  };

  return (
    <div className="w-full bg-[#F8F8FB] flex flex-col items-center">
      {showDeleteWindow && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <ConfirmDelete
            id={data.id}
            setShowDeleteWindow={setShowDeleteWindow}
          />
        </div>
      )}
      {data ? (
        <div className="w-full bg-[#F8F8FB] flex flex-col items-center">
          <div className="w-[86.51%] pt-[100px] flex flex-col items-start">
            <div
              className="flex items-center gap-2 mb-8"
              onClick={() => {
                navigate("/home");
              }}
            >
              <ArrowLeft />
              <p className="spartan font-bold text-[15px]">Go Back</p>
            </div>
            <div className="flex items-center justify-between w-full p-6 bg-white mb-4 rounded-[8px]">
              <p className="spartan font-medium text-[#858BB2]  text-[17px] ">
                Status
              </p>
              <div
                className={`${
                  data.status === "paid"
                    ? "bg-[#33D69F] bg-opacity-5"
                    : data.status === "pending"
                    ? "bg-[#FF8F00] bg-opacity-5 "
                    : "bg-[#373B53] bg-opacity-5 dark:bg-opacity-5 dark:bg-[#DFE3FA]"
                } w-[104px]  h-10 flex items-center justify-center gap-2`}
              >
                <div
                  className={`w-2 h-2 rounded-[50%] ${
                    data.status === "paid"
                      ? "bg-[#33D69F] "
                      : data.status === "pending"
                      ? "bg-[#FF8F00] "
                      : "bg-[#373B53] dark:bg-[#DFE3FA]"
                  } `}
                ></div>
                <p
                  className={`spartan font-bold text-[15px] ${
                    data.status === "paid"
                      ? "text-[#33D69F]"
                      : data.status === "pending"
                      ? "text-[#FF8F00]"
                      : "text-[#373B53] dark:text-[#DFE3FA]"
                  }`}
                >
                  {data
                    ? data.status.charAt(0).toUpperCase() + data.status.slice(1)
                    : ""}
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col items-start bg-white pt-6 pl-6 rounded-[8px]">
              <p className="spartan font-bold text-[#0C0E16] text-[16px] dark:text-white">
                <span className="spartan font-bold text-[#7E88C3] text-[16px]">
                  #
                </span>
                {`${data.id}`}
              </p>
              <p className="spartan font-medium text-[#7E88C3] text-[18px] mt-[-5px] mb-8">
                {data.description}
              </p>

              <p className="spartan font-medium text-[18px] text-[#7E88C3] ">
                {data.senderAddress.street}
              </p>
              <p className="spartan font-medium text-[18px] text-[#7E88C3] ">
                {data.senderAddress.city}
              </p>
              <p className="spartan font-medium text-[18px] text-[#7E88C3] ">
                {data.senderAddress.postCode}
              </p>
              <p className="spartan font-medium text-[18px] text-[#7E88C3] ">
                {data.senderAddress.country}
              </p>
              <div className="mt-8 flex w-full gap-4">
                <div className="">
                  <div>
                    <p className="spartan font-medium text-[18px] text-[#7E88C3]">
                      Invoice Date
                    </p>
                    <h1 className="spartan text-[20px] font-bold ">
                      {data && data.createdAt
                        ? transformDate(data.createdAt)
                        : ""}
                    </h1>
                  </div>
                  <div className="mt-8">
                    <p className="spartan font-medium text-[18px] text-[#7E88C3]">
                      Payment Due
                    </p>
                    <h1 className="spartan text-[20px] font-bold  tracking-[-0.3px]">
                      {data && data.paymentDue
                        ? transformDate(data.paymentDue)
                        : ""}
                    </h1>
                  </div>
                </div>
                <div>
                  <p className="spartan font-medium text-[18px] text-[#7E88C3]">
                    Bill To
                  </p>
                  <h1 className="spartan text-[20px] font-bold  ">
                    {data.clientName}
                  </h1>
                  <p className="spartan font-medium text-[18px] tracking-[-0.3px]   text-[#7E88C3] ">
                    {data.clientAddress.street}
                  </p>
                  <p className="spartan font-medium text-[18px] tracking-[-0.3px] mt-[-7px] text-[#7E88C3] ">
                    {data.clientAddress.city}
                  </p>
                  <p className="spartan font-medium text-[18px] tracking-[-0.3px] mt-[-7px] text-[#7E88C3] ">
                    {data.clientAddress.postCode}
                  </p>
                  <p className="spartan font-medium text-[18px] tracking-[-0.3px] mt-[-7px] text-[#7E88C3] ">
                    {data.clientAddress.country}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-9 mb-10">
                <p className="spartan font-medium text-[18px] text-[#7E88C3]">
                  Sent to
                </p>
                <p className="spartan text-[20px] font-bold  tracking-[-0.3px]">
                  {data.clientEmail}
                </p>
              </div>
              <div className="p-6 w-[93%] bg-[#F9FAFE]">
                {data.items.map((item: item) => {
                  return (
                    <div
                      key={item.name}
                      className="flex w-full justify-between items-center mb-6"
                    >
                      <div className="flex flex-col">
                        <h1 className="spartan text-[17px] font-bold  tracking-[-0.3px]">
                          {item.name}
                        </h1>
                        <p className="spartan font-medium text-[17px] text-[#7E88C3]">{`${item.quantity} x £ ${item.price}.00`}</p>
                      </div>
                      <p className="spartan text-[17px] font-bold  tracking-[-0.3px]">{`£ ${item.total}.00`}</p>
                    </div>
                  );
                })}
              </div>
              <div className="w-[93%] bg-[#373B53] mb-6 p-6 flex items-center justify-between rounded-b-lg">
                <p className="spartan font-medium text-white text-[15px]">
                  Grand Total
                </p>
                <p className="spartan font-bold text-[25px] text-white">{`£ ${data.total}.00`}</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-white mt-[56px] p-6 flex items-center justify-around">
            <button className="w-[73px] h-[48px] bg-[#F9FAFE]   rounded-3xl">
              Edit
            </button>
            <button
              onClick={deleteinvoice}
              className="w-[89px] h-[48px]  bg-[#EC5757]  rounded-3xl spartan text-white font-bold"
            >
              Delete
            </button>
            <button
              onClick={markAsPaid}
              disabled={data.status === "paid"}
              className={`w-[150px] h-[48px] rounded-3xl spartan text-white font-bold ${
                data.status === "paid"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#7C5DFA]"
              }`}
            >
              Mark as Paid
            </button>
          </div>
        </div>
      ) : (
        <p className="text-black mt-[100px]">Loading...</p> // Fallback UI when data is undefined
      )}
    </div>
  );
}

export default InvoiceInfo;
