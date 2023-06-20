import { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { Invoice, InvoiceData } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import invoiceSchema from "../schema/invoiceSchema";
import Loading from "./loading/Loading";
import ArrowLeft from "../assets/icon-arrow-left";
import Calendar from "../assets/icon-calendar";
import ArrowDown from "../assets/icon-arrow-down";
import Delete from "../assets/icon-delete";
import transformDate from "../controller/dateTransform";
import editInvoice from "../requests/editInvoice";

function EditInvoice(props: {
  data: InvoiceData;
  invoices: InvoiceData[];
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceData[]>>;
}) {
  const [selectedDate, _setSelectedDate] = useState<string>(
    props.data.createdAt
  );
  const Term = `${
    props.data.paymentTerms === 1
      ? "Net 1 Day"
      : props.data.paymentTerms === 7
      ? "Net 7 Day"
      : props.data.paymentTerms === 14
      ? "Net 14 Day"
      : "Net 30 Day"
  }`;
  const [term, setTerm] = useState<string | null>(Term);
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
    getValues,
    formState: { errors },
  } = useForm<Invoice>({
    resolver: yupResolver(invoiceSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  useEffect(() => {
    setValue("createdAt", props.data.createdAt);
    setValue("description", props.data.description);
    setValue("paymentTerms", props.data.paymentTerms);
    setValue("clientName", props.data.clientName);
    setValue("clientEmail", props.data.clientEmail);
    setValue("status", props.data.status);
    setValue("senderAddress", props.data.senderAddress);
    setValue("clientAddress", props.data.clientAddress);
    setValue("items", [...props.data.items]);
    setValue("total", props.data.total);
    for (let index = 0; index < props.data.items.length; index++) {
        const element = props.data.items[index];
        append(element );
    }

  }, []);


  

  setTimeout(()=>{
    console.log(fields)
  },3000)

  console.log(props.data)

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

  const onSubmit: SubmitHandler<Invoice> = (data) => {
    const newDate = new Date(props.data.createdAt);
    newDate.setDate(newDate.getDate() + data.paymentTerms);

    const formattedDateDue = newDate.toLocaleDateString("en-GB");
    setValue("paymentDue", formattedDateDue);

    const updatedFields = data.items.map((item) => {
      return {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      };
    });
    data.items = updatedFields;

    props.setData((prevState) => {
      return {
        ...prevState,
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
      };
    });
    const updatedInvoices = [...props.invoices];
    const index = updatedInvoices.findIndex(
      (invoice) => invoice.id === props.data.id
    );
    if (index !== -1) {
      updatedInvoices[index].createdAt = data.createdAt;
      updatedInvoices[index].paymentDue = data.paymentDue;
      updatedInvoices[index].description = data.description;
      updatedInvoices[index].paymentTerms = data.paymentTerms;
      updatedInvoices[index].clientName = data.clientName;
      updatedInvoices[index].clientEmail = data.clientEmail;
      updatedInvoices[index].status = data.status;
      updatedInvoices[index].senderAddress = data.senderAddress;
      updatedInvoices[index].clientAddress = data.clientAddress;
      updatedInvoices[index].items = data.items;
      updatedInvoices[index].total = data.total;
      props.setInvoices(updatedInvoices);
    }

    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + data.paymentTerms);

      const formattedDateDue = newDate.toLocaleDateString("en-GB");

      setValue("paymentDue", formattedDateDue);
    }

    editInvoice({
      id: props.data.id,
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
      props.setIsEdit(false);
    }, 2000);
  };
  const submit = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <div className="mt-[70px] w-full bg-[#FFFFFF] pt-6 dark:bg-[#141625]">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-300 bg-gray-800 bg-opacity-50">
          <Loading />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mt-4  pl-6  z-0"
      >
        <div
          className="flex items-center gap-2 mb-8"
          onClick={() => props.setIsEdit(false)}
        >
          <ArrowLeft />
          <p className="spartan font-bold text-[15px] dark:text-white">
            Go Back
          </p>
        </div>
        <h1 className="spartan font-bold text-[32px] dark:text-white">
          Edit <span className="text-[#888EB0]">#</span>
          {`${props.data.id}`}
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
              className={`w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white ${
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
                className={`w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white ${
                  errors && errors.clientAddress?.country
                    ? "border-[red]"
                    : "border-[#DFE3FA] dark:border-[#252945]"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="relative mt-10 z-1">
          <label
            htmlFor="dateInput"
            className="spartan font-medium text-[17px] text-[#7E88C3]"
          >
            Invoice Date
          </label>
          <p
            id="dateInput"
            className={`w-[93%] pl-5 text-[#0C0E16] pt-3 spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none dark:bg-[#252945] dark:text-white ${
              errors && errors.createdAt
                ? "border-[red]"
                : " dark:border-[#252945]"
            } `}
          >
            {transformDate(props.data.createdAt)}
          </p>
          <div className="absolute right-9 top-10">
            <Calendar />
          </div>
        </div>
        <div className="mt-10 relative z-0">
          <label
            htmlFor="Terms"
            className="spartan font-medium text-[17px] text-[#7E88C3] mb-2"
          >
            Payment Terms
          </label>
          <div
            onClick={clickTerm}
            id="Terms"
            className={`w-[93%] pl-5 text-[#0C0E16] rounded spartan font-bold text-[15px] h-12 border-[1px] flex items-center justify-between pr-5  dark:bg-[#252945] dark:text-white ${
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
                    className={`w-[93%] pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none  dark:bg-[#252945] dark:text-white ${
                      errors && errors.items?.[index]?.name
                        ? "border-[red]"
                        : "border-[#DFE3FA] dark:border-[#252945]"
                    }`}
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
                      className={`pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none  dark:bg-[#252945] dark:text-white ${
                        errors && errors.items?.[index]?.quantity
                          ? "border-[red]"
                          : "border-[#DFE3FA] dark:border-[#252945]"
                      } `}
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
                      className={`pl-5 text-[#0C0E16] spartan font-bold text-[15px] h-12 border-[1px] rounded outline-none  dark:bg-[#252945] dark:text-white ${
                        errors && errors.items?.[index]?.price
                          ? "border-[red]"
                          : "border-[#DFE3FA] dark:border-[#252945]"
                      }`}
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
                      className=" text-[#0C0E16] spartan font-bold text-[15px] h-12  rounded outline-none  dark:bg-[#141625] dark:text-[#888EB0] "
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
          <div className="flex justify-start w-full">
            <button
              onClick={addItem}
              type="button"
              className="spartan text-[15px] text-[#7E88C3] font-bold  mt-[65px] w-[93%] h-12 dark:bg-[#252945] rounded-3xl"
            >
              + Add New Item
            </button>
          </div>
        </div>
      </form>
      <div className="w-full">
        <div className="w-full h-[64px] bg-gradient-to-b from-gradient-1 via-gradient-2  mt-10 "></div>
        <div className="w-full flex items-center justify-end gap-4 pt-[21px] pl-6 pr-6 pb-[22px] bg-white dark:bg-[#1E2139] ">
          <button
            onClick={() => props.setIsEdit(false)}
            className="spartan font-bold text-[15px] bg-[#373B53] text-[#888EB0] rounded-3xl w-[117px] h-12  dark:bg-[#373B53] dark:text-[#DFE3FA]"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="spartan font-bold text-[15px] bg-[#7C5DFA] text-white rounded-3xl w-[112px] h-12 "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditInvoice;
