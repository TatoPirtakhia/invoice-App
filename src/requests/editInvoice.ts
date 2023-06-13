import axios from "axios";
import {  InvoiceData } from "../types";

const editInvoice = async (data:InvoiceData) => {
  try {
     const response = await axios.post("https://invoice-app-rsqt.onrender.com/api/EditInvoice",data);
     return response.data;
  
  } catch (error) {
    console.log(error)
  }
};

export default editInvoice;
