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
  screenWidth: number;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [term, setTerm] = useState<string | null>("Select Payment Terms");
  const [showTerm, setShowterm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    setValue("paymentTerms", id);
  };

  const onSubmit: SubmitHandler<Invoice> = async (data) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + data.paymentTerms);

      const formattedDateDue = newDate.toLocaleDateString("en-GB");

      setValue("paymentDue", formattedDateDue);
    }
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
    const statusCOde = await sendNewInvoice({
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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      if (statusCOde === 201) {
        props.setInvoices([
          ...props.invoices,
          {
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
          },
        ]);
        props.setIsNewInvoice(false);
      }
    }, 5000);
  };
  const submit = () => {
    setValue("status", "pending");
    handleSubmit(onSubmit)();
  };
  const submitDraft = () => {
    setValue("status", "draft");
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
  const [isHovered, setIsHovered] = useState<boolean[]>(Array(fields.length).fill(false));
  function handleMouseEnter(index: number) {
    setIsHovered((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  }

  function handleMouseLeave(index: number) {
    setIsHovered((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  }
  return (
    <div className="mt-[70px] xl:w-[616px] xl:mt-0  xl:ml-[88px]  md:w-[80%] w-full bg-[#FFFFFF] pt-6 dark:bg-[#141625] overflow-auto h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50">
          <Loading />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mt-4  pl-6 md:pl-14  z-0 "
      >
        <div
          className={`flex items-center gap-2 mb-8 ${
            props.screenWidth >= 768 ? "hidden" : ""
          }`}
          onClick={() => {
            props.setIsNewInvoice(false);
          }}
        >
          <ArrowLeft />
          <p className="spartan font-bold text-[15px] dark:text-white">
            Go Back
          </p>
        </div>
        <h1 className="spartan font-bold text-[32px] dark:text-white">
          New Invoice
        </h1>
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
          className={`w-[93%] h-12 border-[1px]  rounded outline-none pl-5 text-[#0C0E16] spartan font-bold text-[15px] dark:bg-[#252945] dark:text-white ${
            errors && errors.senderAddress?.street
              ? "border-[red]"
              : "border-[#DFE3FA] dark:border-[#252945]"
          }`}
        />
        <div className="flex flex-col md:mr-0 md:flex-row md:items-center md:w-[93%] md:justify-between mt-6">
          <div className="flex w-full md:w-[80%]">
            <div className="flex flex-col w-full ">
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
                className={`w-[85%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white  ${
                  errors && errors.senderAddress?.city
                    ? "border-[red]"
                    : "border-[#DFE3FA]  dark:border-[#252945]"
                }`}
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
                className={`w-[85%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white ${
                  errors && errors.senderAddress?.postCode
                    ? "border-[red]"
                    : "border-[#DFE3FA] dark:border-[#252945]"
                }`}
              />
            </div>
          </div>
          <div className="flex flex-col mt-6 md:mt-0">
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
              className={`w-[93%] md:w-full pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white ${
                errors && errors.senderAddress?.country
                  ? "border-[red]"
                  : "border-[#DFE3FA] dark:border-[#252945]"
              }`}
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
            className={`w-[93%] h-12 mb-6 border-[1px] rounded outline-none pl-5 text-[#0C0E16] spartan font-bold text-[15px]  dark:bg-[#252945] dark:text-white ${
              errors && errors.clientName
                ? "border-[red]"
                : "border-[#DFE3FA]  dark:border-[#252945]"
            }`}
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
            className={`w-[93%] h-12 mb-6 border-[1px] rounded outline-none pl-5 text-[#0C0E16] spartan font-bold text-[15px]  dark:bg-[#252945] dark:text-white ${
              errors && errors.clientEmail
                ? "border-[red]"
                : "border-[#DFE3FA] dark:border-[#252945]"
            }`}
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
            className={`w-[93%] h-12 mb-6 border-[1px] rounded outline-none pl-5 text-[#0C0E16] spartan font-bold text-[15px] dark:bg-[#252945] dark:text-white ${
              errors && errors.clientAddress
                ? "border-[red]"
                : "border-[#DFE3FA] dark:border-[#252945]"
            }`}
          />
          <div className="flex flex-col md:mr-0 md:flex-row md:items-center md:w-[93%] md:justify-between">
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
                  className={`w-[85%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white ${
                    errors && errors.clientAddress?.city
                      ? "border-[red]"
                      : "border-[#DFE3FA] dark:border-[#252945]"
                  }`}
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
                  className={`w-[85%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white ${
                    errors && errors.clientAddress?.postCode
                      ? "border-[red]"
                      : "border-[#DFE3FA] dark:border-[#252945]"
                  }`}
                />
              </div>
            </div>
            <div className="flex flex-col mt-6 md:mt-0">
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
                className={`w-[93%] md:w-full pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white ${
                  errors && errors.clientAddress?.country
                    ? "border-[red]"
                    : "border-[#DFE3FA] dark:border-[#252945]"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-[93%] md:justify-between md:gap-3">
          <div className="relative mt-10 z-1 md:w-[50%]">
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
              className={`w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white ${
                errors && errors.createdAt
                  ? "border-[red]"
                  : " dark:border-[#252945]"
              } ${isOpen ? " border-[#7C5DFA] " : "border-[#DFE3FA] "}`}
              onCalendarOpen={() => setIsOpen(true)}
              onCalendarClose={() => setIsOpen(false)}
            />
            <div className="absolute right-[10%] top-10">
              <Calendar />
            </div>
          </div>
          <div className="mt-10 relative z-0 md:w-[50%]">
            <label
              htmlFor="Terms"
              className="spartan font-medium text-[17px] text-[#7E88C3] mb-2"
            >
              Payment Terms
            </label>
            <div
              onClick={clickTerm}
              id="Terms"
              className={`w-[93%] md:w-[100%] pl-5 text-[#0C0E16] rounded spartan font-bold text-[15px] h-12 border-[1px] flex items-center justify-between pr-5  dark:bg-[#252945] dark:text-white ${
                errors && errors.paymentTerms
                  ? "border-[red]"
                  : `${
                      showTerm
                        ? "border-[#7C5DFA] dark:border-[#252945]"
                        : "border-[#DFE3FA] dark:border-[#252945]"
                    }`
              }`}
            >
              <p>{term}</p>
              <ArrowDown />
            </div>
            <div
              className={`${
                !showTerm ? "hidden" : ""
              } absolute  w-[93%] bg-white rounded-lg shadow-term mt-6 dark:bg-[#252945]`}
            >
              <p
                onClick={handleTermClick}
                id="1"
                className={`border-b-[#DFE3FA] border-b-[1px] w-full pl-6 pb-4 pt-4 spartan font-bold text-[15px] dark:border-b-[#1E2139] ${
                  term === "Net 1 Day"
                    ? "text-[#7C5DFA]"
                    : "text-[#0C0E16]  dark:text-white"
                } `}
              >
                Net 1 Day
              </p>
              <p
                onClick={handleTermClick}
                id="7"
                className={`border-b-[#DFE3FA] border-b-[1px] w-full pl-6 pb-4 pt-4 spartan font-bold text-[15px] dark:border-b-[#1E2139] ${
                  term === "Net 7 Day"
                    ? "text-[#7C5DFA]"
                    : "text-[#0C0E16] dark:text-white"
                } `}
              >
                Net 7 Days
              </p>
              <p
                onClick={handleTermClick}
                id="14"
                className={`border-b-[#DFE3FA] border-b-[1px] w-full pl-6 pb-4 pt-4 spartan font-bold text-[15px] dark:border-b-[#1E2139] ${
                  term === "Net 14 Day"
                    ? "text-[#7C5DFA]"
                    : "text-[#0C0E16] dark:text-white"
                } `}
              >
                Net 14 Day
              </p>
              <p
                onClick={handleTermClick}
                id="30"
                className={`border-b-[#DFE3FA] dark:border-b-[#1E2139] border-b-[1px] w-full pl-6 pb-4 pt-4 spartan font-bold text-[15px] ${
                  term === "Net 30 Day"
                    ? "text-[#7C5DFA]"
                    : "text-[#0C0E16] dark:text-white "
                } `}
              >
                Net 30 Day
              </p>
            </div>
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
            className={`w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none  dark:bg-[#252945] dark:text-white ${
              errors && errors.description
                ? "border-[red]"
                : "border-[#DFE3FA] dark:border-[#252945]"
            } `}
          />
        </div>

        <p className=" spartan font-bold text-[29px] text-[#777F98] mt-[66px] mb-5">
          Item List
        </p>
        {errors.items && (
          <p className="spartan text-red-700">
            "At least one item is required"
          </p>
        )}
        <div className="flex flex-col md:w-full">
          <div className="flex flex-col items-center md:w-full">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center  w-full  mb-11 md:mb-5 "
              >
                <div className="flex flex-col md:w-[214px]  md:mr-4">
                  <label
                    htmlFor={`itemName${index}`}
                    className={`spartan font-medium text-[17px] text-[#7E88C3] ${
                      index > 0 ? "md:hidden" : ""
                    }`}
                  >
                    Item Name
                  </label>
                  <input
                    key={item.id}
                    type="text"
                    id={`itemName${index}`}
                    {...register(`items.${index}.name`, { required: true })}
                    className={`w-[93%] md:w-full pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none  dark:bg-[#252945] dark:text-white ${
                      errors && errors.items?.[index]?.name
                        ? "border-[red]"
                        : "border-[#DFE3FA] dark:border-[#252945]"
                    }`}
                  />
                </div>
                <div className="flex items-center    mt-6 md:mt-0  ">
                  <div className="flex flex-col w-[20%] md:w-[46px] mr-4">
                    <label
                      htmlFor={`Qty${index}`}
                      className={`spartan font-medium text-[17px] text-[#7E88C3] ${
                        index > 0 ? "md:hidden" : ""
                      }`}
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
                      className={`pl-5 md:pl-0 md:text-center text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none  dark:bg-[#252945] dark:text-white ${
                        errors && errors.items?.[index]?.quantity
                          ? "border-[red]"
                          : "border-[#DFE3FA] dark:border-[#252945]"
                      } `}
                    />
                  </div>
                  <div className="flex flex-col w-[30%] md:w-[100px] md:mr-4 ">
                    <label
                      htmlFor={`Price${index}`}
                      className={`spartan font-medium text-[17px] text-[#7E88C3] ${
                        index > 0 ? "md:hidden" : ""
                      }`}
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
                      className={`pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none  dark:bg-[#252945] dark:text-white ${
                        errors && errors.items?.[index]?.price
                          ? "border-[red]"
                          : "border-[#DFE3FA] dark:border-[#252945]"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col w-[30%] md:w-[60px] ml-4 md:mr-6 ">
                    <label
                      htmlFor={`Total${index}`}
                      className={`spartan font-medium text-[17px] text-[#7E88C3] ${
                        index > 0 ? "md:hidden" : ""
                      }`}
                    >
                      Total
                    </label>
                    <input
                      type="number"
                      id={`Total${index}`}
                      value={updateTotal(index)}
                      readOnly
                      className=" text-[#0C0E16] spartan font-bold text-[15px] h-12  rounded outline-none  dark:bg-[#141625] dark:text-[#888EB0] "
                    />
                  </div>
                  <div
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    onClick={() => removeItem(index)}
                    className={`"flex items-center pt-7 cursor-pointer  ${
                      index > 0 ? "md:pt-0" : ""
                    }`}
                  >
                    <Delete isHovered={isHovered[index]} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-start w-full">
            <button
              onClick={addItem}
              type="button"
              className="spartan text-[15px] text-[#7E88C3] font-bold  mt-[65px]  md:mt-2 w-[93%] h-12 dark:bg-[#252945] rounded-3xl"
            >
              + Add New Item
            </button>
          </div>
        </div>
      </form>
      <div className="w-full">
        <div className="w-full h-[64px] bg-gradient-to-b from-gradient-1 via-gradient-2  mt-10 "></div>
        <div className="w-full  flex items-center justify-around md:justify-between md:pl-14 md:pr-12 pt-[21px] pl-6 pr-6 pb-[22px] bg-white dark:bg-[#1E2139] ">
          <button
            onClick={() => {
              props.setIsNewInvoice(false);
            }}
            className="spartan font-bold text-[15px] bg-[#F9FAFE] text-[#7E88C3] rounded-3xl w-[84px] h-12 dark:bg-[#252945]"
          >
            Discard
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={submitDraft}
              className="spartan font-bold text-[15px] bg-[#373B53] text-[#888EB0] rounded-3xl w-[117px] h-12  dark:bg-[#373B53] dark:text-[#DFE3FA]"
            >
              Save as Draft
            </button>
            <button
              onClick={submit}
              className="spartan font-bold text-[15px] bg-[#7C5DFA] text-white rounded-3xl w-[112px] h-12 "
            >
              Save & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewInvoice;
