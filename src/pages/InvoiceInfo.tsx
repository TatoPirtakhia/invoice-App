import { useNavigate, useParams } from "react-router-dom";
import { InvoiceData, item } from "../types";
import ArrowLeft from "../assets/icon-arrow-left";
import editInvoice from "../requests/editInvoice";
import { useEffect, useState } from "react";
import ConfirmDelete from "./ConfirmDelete";
import transformDate from "../controller/dateTransform";
import EditInvoice from "./EditIvoice";

function InvoiceInfo(props: {
  screenWidth: number;
  invoices: InvoiceData[];
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceData[]>>;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [data, setData] = useState<InvoiceData>({
    id: "",
    createdAt: "",
    paymentDue: "",
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
      const updatedInvoices = [...props.invoices];
      const index = updatedInvoices.findIndex((invoice) => invoice.id === id);
      if (index !== -1) {
        updatedInvoices[index].status = "paid";
        props.setInvoices(updatedInvoices);
      }
      const updatedData = { ...data, status: "paid" };
      await editInvoice(updatedData);
    }
  };
  const [showDeleteWindow, setShowDeleteWindow] = useState<boolean>(false);
  const deleteinvoice = () => {
    setShowDeleteWindow(!showDeleteWindow);
  };

  return (
    <div className="w-full xl:w-[58.7%] min-h-[100vh] bg-[#F8F8FB] flex flex-col items-center dark:bg-[#141625]">
      {showDeleteWindow && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 dark:bg-[#141625] dark:bg-opacity-80 bg-opacity-50">
          <ConfirmDelete
            id={data.id}
            setShowDeleteWindow={setShowDeleteWindow}
            setInvoices={props.setInvoices}
            invoices={props.invoices}
          />
        </div>
      )}
      {data ? (
        <div className="w-full  bg-[#F8F8FB] flex flex-col items-center dark:bg-[#141625]  ">
          <div className="animate-fade-in absolute z-10 top-0 w-full  left-0 md:bg-[#000000] dark:md:bg-[#000000] dark:md:bg-opacity-40 md:bg-opacity-50">
            {!isEdit ? (
              ""
            ) : (
              <EditInvoice
                data={data}
                invoices={props.invoices}
                setInvoices={props.setInvoices}
                setData={setData}
                setIsEdit={setIsEdit}
                screenWidth={props.screenWidth}
              />
            )}
          </div>
          <div className="w-[86.51%]  xl:pt-[64px] flex flex-col items-start">
            <div
              className="flex items-center gap-2 mb-8"
              onClick={() => {
                navigate("/home");
              }}
            >
              <ArrowLeft />
              <p className="spartan font-bold text-[15px] dark:text-white">
                Go Back
              </p>
            </div>
            <div className="w-full p-6 bg-white mb-4 rounded-[8px] dark:bg-[#1E2139] flex items-center">
              <div className="flex items-center justify-between w-full md:justify-start md:gap-4">
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
                      ? data.status.charAt(0).toUpperCase() +
                        data.status.slice(1)
                      : ""}
                  </p>
                </div>
              </div>
              <div
                className={`w-full bg-white  flex items-center justify-end dark:bg-[#1E2139] gap-2 ${
                  props.screenWidth >= 768 ? "" : "hidden"
                }`}
              >
                <button
                  onClick={() => setIsEdit(true)}
                  className="w-[73px] h-[48px] bg-[#F9FAFE]   rounded-3xl dark:bg-[#252945] dark:text-[#DFE3FA] spartan font-bold"
                >
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
            <div className="w-full flex flex-col items-start bg-white pt-6 pl-6 md:pl-8 xl:pb-12 rounded-[8px] dark:bg-[#1E2139] md:mb-[140px] xl:mb-0">
              <div className="flex flex-col md:flex-row md:justify-between w-full md:pr-8">
                <div className="flex flex-col">
                  <p className="spartan font-bold text-[#0C0E16] text-[16px] dark:text-white">
                    <span className="spartan font-bold text-[#7E88C3] text-[16px]">
                      #
                    </span>
                    {`${data.id}`}
                  </p>
                  <p className="spartan font-medium text-[#7E88C3] text-[18px] mt-[-5px] mb-8 dark:text-[#DFE3FA]">
                    {data.description}
                  </p>
                </div>
                <div className="flex flex-col md:items-end">
                  <p className="spartan font-medium text-[18px] text-[#7E88C3] dark:text-[#DFE3FA]">
                    {data.senderAddress.street}
                  </p>
                  <p className="spartan font-medium text-[18px] text-[#7E88C3] dark:text-[#DFE3FA]">
                    {data.senderAddress.city}
                  </p>
                  <p className="spartan font-medium text-[18px] text-[#7E88C3] dark:text-[#DFE3FA]">
                    {data.senderAddress.postCode}
                  </p>
                  <p className="spartan font-medium text-[18px] text-[#7E88C3] dark:text-[#DFE3FA]">
                    {data.senderAddress.country}
                  </p>
                </div>
              </div>
              <div className="mt-8 xl:mt-5 flex flex-col md:flex-row w-full md:items-start md:gap-[100px] md:mb-[52px]">
                <div className="flex gap-4 md:gap-[100px]">
                  <div className="">
                    <div>
                      <p className="spartan font-medium text-[18px] text-[#7E88C3] dark:text-[#DFE3FA]">
                        Invoice Date
                      </p>
                      <h1 className="spartan text-[20px] font-bold dark:text-white">
                        {data && data.createdAt
                          ? transformDate(data.createdAt)
                          : ""}
                      </h1>
                    </div>
                    <div className="mt-8">
                      <p className="spartan font-medium text-[18px] text-[#7E88C3] dark:text-[#DFE3FA]">
                        Payment Due
                      </p>
                      <h1 className="spartan text-[20px] font-bold  tracking-[-0.3px] dark:text-white">
                        {data && data.paymentDue
                          ? transformDate(data.paymentDue)
                          : ""}
                      </h1>
                    </div>
                  </div>

                  <div>
                    <p className="spartan font-medium text-[18px] text-[#7E88C3] dark:text-[#DFE3FA]">
                      Bill To
                    </p>
                    <h1 className="spartan text-[20px] font-bold  dark:text-white">
                      {data.clientName}
                    </h1>
                    <p className="spartan font-medium text-[18px] tracking-[-0.3px]   text-[#7E88C3] dark:text-[#DFE3FA]">
                      {data.clientAddress.street}
                    </p>
                    <p className="spartan font-medium text-[18px] tracking-[-0.3px] mt-[-7px] text-[#7E88C3] dark:text-[#DFE3FA] ">
                      {data.clientAddress.city}
                    </p>
                    <p className="spartan font-medium text-[18px] tracking-[-0.3px] mt-[-7px] text-[#7E88C3] dark:text-[#DFE3FA]">
                      {data.clientAddress.postCode}
                    </p>
                    <p className="spartan font-medium text-[18px] tracking-[-0.3px] mt-[-7px] text-[#7E88C3] dark:text-[#DFE3FA] ">
                      {data.clientAddress.country}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-9 mb-10 md:mt-0">
                  <p className="spartan font-medium text-[18px] text-[#7E88C3] dark:text-[#DFE3FA]">
                    Sent to
                  </p>
                  <p className="spartan text-[20px] font-bold  tracking-[-0.3px] dark:text-white">
                    {data.clientEmail}
                  </p>
                </div>
              </div>

              <div className="p-6 w-[93%] bg-[#F9FAFE] dark:bg-[#252945]">
                <div
                  className={`${
                    props.screenWidth >= 768 ? "" : "hidden"
                  } flex mb-8  w-full`}
                >
                  <div className="mr-[33%] w-[100px]">
                    <h1
                      className="text-[#7E88C3] dark:text-[#DFE3FA] spartan font-medium"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Item Name
                    </h1>
                  </div>
                  <div className="flex w-full justify-between">
                    <p className="text-[#7E88C3] dark:text-[#DFE3FA] spartan font-medium ">
                      QTY.
                    </p>
                    <p className="text-[#7E88C3] dark:text-[#DFE3FA] spartan font-medium  ">
                      Price
                    </p>
                    <p className="text-[#7E88C3] dark:text-[#DFE3FA] spartan font-medium ">
                      Total
                    </p>
                  </div>
                </div>
                {data.items.map((item: item, index: number) => {
                  return (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex w-full justify-between  items-center  mb-6"
                    >
                      <div className="md:mr-[6%] md:w-[300px] " style={{ whiteSpace: "nowrap" }}>
                        <h1 className="spartan text-[17px] font-bold  tracking-[-0.3px] dark:text-white">
                          {item.name}
                        </h1>
                        <p
                          className={`spartan font-medium text-[17px] text-[#7E88C3] dark:text-[#888EB0] ${
                            props.screenWidth >= 768 ? "hidden" : ""
                          } `}
                        >{`${item.quantity} x £ ${item.price}.00`}</p>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:w-[76%] md:justify-between">
                        <p
                          className={` ${
                            props.screenWidth >= 768 ? "" : "hidden"
                          } spartan font-bold dark:text-[#DFE3FA] text-[17px] w-[35px] text-right `}
                        >
                          {item.quantity}
                        </p>
                        <p
                          style={{ whiteSpace: "nowrap" }}
                          className={ ` ${
                            props.screenWidth >= 768 ? "" : "hidden"
                          } spartan font-bold dark:text-[#DFE3FA] text-[17px] w-[80px] text-right` }
                        >
                          {`£ ${item.price}`}
                        </p>
                        <p className="spartan text-[17px] font-bold  tracking-[-0.3px] dark:text-white">{`£ ${item.total}.00`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-[93%] bg-[#373B53] mb-6 xl:mb-0 p-6 flex items-center justify-between rounded-b-lg dark:bg-[#0C0E16]">
                <p className="spartan font-medium text-white text-[15px]">
                  Grand Total
                </p>
                <p className="spartan font-bold text-[25px] text-white">{`£ ${data.total.toFixed(
                  2
                )}.00`}</p>
              </div>
            </div>
          </div>
          <div
            className={`w-full bg-white mt-[56px] p-6 flex items-center justify-around dark:bg-[#1E2139] ${
              props.screenWidth >= 768 ? "hidden" : ""
            }`}
          >
            <button
              onClick={() => setIsEdit(true)}
              className="w-[73px] h-[48px] bg-[#F9FAFE]   rounded-3xl dark:bg-[#252945] dark:text-[#DFE3FA] spartan font-bold"
            >
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
        <p className="text-black mt-[100px]">Loading...</p>
      )}
    </div>
  );
}

export default InvoiceInfo;
