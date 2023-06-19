import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import ArrowLeft from "../../assets/icon-arrow-left";
import { Invoice, InvoiceData } from "../../types";
import invoiceSchema from "../../schema/invoiceSchema";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "../../assets/icon-calendar";
import ArrowDown from "../../assets/icon-arrow-down";
import Delete from "../../assets/icon-delete";
import ReactDatePicker from "react-datepicker";
import { yupResolver } from "@hookform/resolvers/yup";
import sendNewInvoice from "../../requests/sendNewInvoice";
import generateID from "./newInvoiceFunctions";
import Loading from "../loading/Loading";

function NewInvoice(props: {
  setIsNewInvoice: React.Dispatch<React.SetStateAction<boolean>>;
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceData[]>>;
  invoices: InvoiceData[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [term, setTerm] = useState<string | null>("Select Payment Terms");
  const [showTerm, setShowterm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickTerm = () => {
    setShowterm(!showTerm);
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Invoice>({
    resolver: yupResolver(invoiceSchema),
  });
  // console.log(errors)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const addItem = () => {
    append({ name: "", quantity: 0, price: 0, total: 0 });
  };

  let count = 0;
  const watchItems = useWatch({ control, name: "items" });
  const updateTotal = (index: number) => {
    if (watchItems && index >= 0 && index < watchItems.length) {
      const { quantity, price } = watchItems[index];
      const totalPrice = quantity * price;
      count = count + totalPrice;
      setValue("total", count);
      return totalPrice.toFixed(2);
    }
    return 0;
  };
  const removeItem = (index: number) => {
    const removeTotal = updateTotal(index);
    const parsedTotal =
      typeof removeTotal === "string" ? parseInt(removeTotal) : 0;
    count = count - parsedTotal * 2;

    setValue("total", count);
    remove(index);
  };

  const handleTermClick = (event: React.MouseEvent<HTMLParagraphElement>) => {
    const clickedTerm = event.currentTarget.textContent;
    const id = parseInt(event.currentTarget.id);
    setTerm(clickedTerm);
    setShowterm(false);

    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + id);

      const formattedDateDue = newDate.toLocaleDateString("en-GB");

      setValue("paymentDue", formattedDateDue);
      setValue("paymentTerms", id);
    } else {
      console.log("selectedDate is null");
    }
  };

  const onSubmit: SubmitHandler<Invoice> = (data) => {
    console.log(data);
    const updatedFields = data.items.map((item) => {
      return {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      };
    });
    data.items = updatedFields;
    const ID = generateID();
    sendNewInvoice({
      id: ID,
      createdAt: data.createdAt,
      paymentDue: data.paymentDue,
      description: data.description,
      paymentTerms: data.paymentTerms,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      status: data.status,
      senderAddress: data.senderAddress,
      clientAddress: data.clientAddress,
      items: data.items,
      total: data.total,
    });
    props.setInvoices([...props.invoices, {
      id: ID,
      createdAt: data.createdAt,
      paymentDue: data.paymentDue,
      description: data.description,
      paymentTerms: data.paymentTerms,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      status: data.status,
      senderAddress: data.senderAddress,
      clientAddress: data.clientAddress,
      items: data.items,
      total: data.total,
    }]);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      props.setIsNewInvoice(false);
    }, 5000);
  };
  const submit = () => {
    setValue("status", "pending");
    handleSubmit(onSubmit)();
  };
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    if (date) {
      const newDate = new Date(date);
      const formattedDate = newDate.toLocaleDateString("en-GB");
      setValue("createdAt", formattedDate);
    }
  };

  return (
    <div className="mt-[70px] w-full bg-[#FFFFFF] pt-6 ">
      {isLoading && (
        <div className=" fixed inset-0 flex items-center justify-center z-300 bg-gray-800 bg-opacity-50">
          <Loading />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4  pl-6 ">
        <div
          className="flex items-center gap-2 mb-8"
          onClick={() => {
            props.setIsNewInvoice(false);
          }}
        >
          <ArrowLeft />
          <p className="spartan font-bold text-[15px]">Go Back</p>
        </div>
        <h1 className="spartan font-bold text-[32px]">New Invoice</h1>
        <p className="spartan font-bold text-[15px] text-[#7C5DFA] mb-6">
          Bill From
        </p>
        <label
          htmlFor="senderstreet"
          className="spartan font-medium text-[17px] text-[#7E88C3]"
        >
          Street Address
        </label>
        <input
          type="text"
          {...register("senderAddress.street", { required: true })}
          className="w-[93%] h-12 border-[1px] rounded outline-none pl-5 text-[#0C0E16] spartan font-bold text-[15px]"
        />
        <div className="flex flex-col mt-6 w-full">
          <div className="flex w-full">
            <div className="flex flex-col w-full">
              <label
                htmlFor="city"
                className="spartan font-medium text-[17px] text-[#7E88C3]"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                {...register("senderAddress.city", { required: true })}
                className="w-[85%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
              />
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="PostCode"
                className="spartan font-medium text-[17px] text-[#7E88C3]"
              >
                Post Code
              </label>
              <input
                type="text"
                id="PostCode"
                {...register("senderAddress.postCode", { required: true })}
                className="w-[85%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col mt-6">
            <label
              htmlFor="Country"
              className="spartan font-medium text-[17px] text-[#7E88C3]"
            >
              Country
            </label>
            <input
              type="text"
              id="Country"
              {...register("senderAddress.country", { required: true })}
              className="w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
            />
          </div>
        </div>

        <p className="spartan font-bold text-[15px] text-[#7C5DFA] mb-6 mt-10">
          Bill To
        </p>
        <div className="w-full">
          <label
            htmlFor="ClientsName"
            className="spartan font-medium text-[17px] text-[#7E88C3]"
          >
            Client's Name
          </label>
          <input
            type="text"
            id="ClientsName"
            {...register("clientName", { required: true })}
            className="w-[93%] h-12 mb-6 border-[1px] rounded outline-none pl-5 text-[#0C0E16] spartan font-bold text-[15px]"
          />

          <label
            htmlFor="ClientsEmail"
            className="spartan font-medium text-[17px] text-[#7E88C3]"
          >
            Client's Email
          </label>
          <input
            type="email"
            id="ClientsEmail"
            {...register("clientEmail", { required: true })}
            className="w-[93%] h-12 mb-6 border-[1px] rounded outline-none pl-5 text-[#0C0E16] spartan font-bold text-[15px]"
          />

          <label
            htmlFor="StreetAddress"
            className="spartan font-medium text-[17px] text-[#7E88C3]"
          >
            Street Address
          </label>
          <input
            type="text"
            id="StreetAddress"
            {...register("clientAddress.street", { required: true })}
            className="w-[93%] h-12 mb-6 border-[1px] rounded outline-none pl-5 text-[#0C0E16] spartan font-bold text-[15px]"
          />
          <div className="flex flex-col">
            <div className="flex">
              <div className="flex flex-col w-full">
                <label
                  htmlFor="city"
                  className="spartan font-medium text-[17px] text-[#7E88C3]"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  {...register("clientAddress.city", { required: true })}
                  className="w-[85%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
                />
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="PostCode"
                  className="spartan font-medium text-[17px] text-[#7E88C3]"
                >
                  Post Code
                </label>
                <input
                  type="text"
                  id="PostCode"
                  {...register("clientAddress.postCode", { required: true })}
                  className="w-[85%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col mt-6">
              <label
                htmlFor="Country"
                className="spartan font-medium text-[17px] text-[#7E88C3]"
              >
                Country
              </label>
              <input
                type="text"
                id="Country"
                {...register("clientAddress.country", { required: true })}
                className="w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
              />
            </div>
          </div>
        </div>
        <div className="relative mt-10">
          <label
            htmlFor="dateInput"
            className="spartan font-medium text-[17px] text-[#7E88C3]"
          >
            Invoice Date
          </label>
          <ReactDatePicker
            id="dateInput"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
            className="w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] z-0 rounded outline-none "
          />
          <div className="absolute right-9 top-10">
            <Calendar />
          </div>
        </div>
        <div className="mt-10 relative">
          <label
            htmlFor="Terms"
            className="spartan font-medium text-[17px] text-[#7E88C3] mb-2"
          >
            Payment Terms
          </label>
          <div
            onClick={clickTerm}
            id="Terms"
            className="w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] flex items-center justify-between pr-5"
          >
            <p>{term}</p>
            <ArrowDown />
          </div>
          <div
            className={`${
              !showTerm ? "hidden" : ""
            } absolute  w-[93%] bg-white shadow-term mt-6`}
          >
            <p
              onClick={handleTermClick}
              id="1"
              className={`border-b-[#DFE3FA] border-b-[1px] w-full pl-6 pb-4 pt-4 spartan font-bold text-[15px] ${
                term === "Net 1 Day" ? "text-[#7C5DFA]" : "text-[#0C0E16]"
              } `}
            >
              Net 1 Day
            </p>
            <p
              onClick={handleTermClick}
              id="7"
              className={`border-b-[#DFE3FA] border-b-[1px] w-full pl-6 pb-4 pt-4 spartan font-bold text-[15px] ${
                term === "Net 7 Day" ? "text-[#7C5DFA]" : "text-[#0C0E16]"
              } `}
            >
              Net 7 Days
            </p>
            <p
              onClick={handleTermClick}
              id="14"
              className={`border-b-[#DFE3FA] border-b-[1px] w-full pl-6 pb-4 pt-4 spartan font-bold text-[15px] ${
                term === "Net 14 Day" ? "text-[#7C5DFA]" : "text-[#0C0E16]"
              } `}
            >
              Net 14 Day
            </p>
            <p
              onClick={handleTermClick}
              id="30"
              className={`border-b-[#DFE3FA] border-b-[1px] w-full pl-6 pb-4 pt-4 spartan font-bold text-[15px] ${
                term === "Net 30 Day" ? "text-[#7C5DFA]" : "text-[#0C0E16]"
              } `}
            >
              Net 30 Day
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <label
            htmlFor="Description"
            className="spartan font-medium text-[17px] text-[#7E88C3]"
          >
            Project Description
          </label>
          <input
            type="text"
            id="Description"
            {...register("description", { required: true })}
            className="w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
          />
        </div>

        <p className=" spartan font-bold text-[29px] text-[#777F98] mt-[66px] mb-5">
          Item List
        </p>
        <div className="flex flex-col ">
          <div className="flex flex-col items-center">
            {fields.map((item, index) => (
              <div key={item.id} className="flex flex-col w-full mb-11 ">
                <div className="flex flex-col">
                  <label
                    htmlFor={`itemName${index}`}
                    className="spartan font-medium text-[17px] text-[#7E88C3]"
                  >
                    Item Name
                  </label>
                  <input
                    key={item.id}
                    type="text"
                    id={`itemName${index}`}
                    {...register(`items.${index}.name`, { required: true })}
                    className="w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <div className="flex flex-col w-[20%] mr-4">
                    <label
                      htmlFor={`Qty${index}`}
                      className="spartan font-medium text-[17px] text-[#7E88C3]"
                    >
                      Qty.
                    </label>
                    <input
                      key={item.id}
                      type="number"
                      id={`Qty${index}`}
                      {...register(`items.${index}.quantity` as const, {
                        valueAsNumber: true,
                        required: true,
                      })}
                      className="pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
                    />
                  </div>
                  <div className="flex flex-col w-[30%] ">
                    <label
                      htmlFor={`Price${index}`}
                      className="spartan font-medium text-[17px] text-[#7E88C3]"
                    >
                      Price
                    </label>
                    <input
                      key={item.id}
                      type="number"
                      id={`Price${index}`}
                      {...register(`items.${index}.price` as const, {
                        valueAsNumber: true,
                        required: true,
                      })}
                      className="pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none"
                    />
                  </div>
                  <div className="flex flex-col w-[30%] ml-4 ">
                    <label
                      htmlFor={`Total${index}`}
                      className="spartan font-medium text-[17px] text-[#7E88C3]"
                    >
                      Total
                    </label>
                    <input
                      type="number"
                      id={`Total${index}`}
                      value={updateTotal(index)}
                      readOnly
                      className=" text-[#0C0E16] spartan font-bold text-[15px] h-12  rounded outline-none"
                    />
                  </div>
                  <div
                    onClick={() => removeItem(index)}
                    className="flex items-center pt-7"
                  >
                    <Delete />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={addItem}
              type="button"
              className="spartan text-[15px] text-[#7E88C3] font-bold  mt-[65px]"
            >
              + Add New Item
            </button>
          </div>
        </div>
      </form>
      <div>
        <div className="w-full h-[64px] bg-gradient-to-b from-gradient-1 via-gradient-2  mt-10 "></div>
        <div className="w-full flex items-center justify-around pt-[21px] pl-6 pr-6 pb-[22px] bg-white ">
          <button className="spartan font-bold text-[15px] bg-[#F9FAFE] text-[#7E88C3] rounded-3xl w-[84px] h-12">
            Discard
          </button>
          <button className="spartan font-bold text-[15px] bg-[#373B53] text-[#888EB0] rounded-3xl w-[117px] h-12">
            Save as Draft
          </button>
          <button
            onClick={submit}
            className="spartan font-bold text-[15px] bg-[#7C5DFA] text-white rounded-3xl w-[112px] h-12"
          >
            Save & Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewInvoice;
