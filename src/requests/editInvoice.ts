import axios from "axios";
import {  InvoiceData } from "../types";

const editInvoice = async (data:InvoiceData) => {
  try {
     const response = await axios.put("https://invoice-app-api-production-0211.up.railway.app/api/EditInvoice",data);
     return response.data;
  
  } catch (error) {
    console.log(error)
  }
};

export default editInvoice;
