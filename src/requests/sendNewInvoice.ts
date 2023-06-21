import axios from "axios";
import { InvoiceData } from "../types";

const sendNewInvoice = async (data: InvoiceData) => {
  try {
    const response = await axios.post("https://invoice-app-rsqt.onrender.com/api/NewInvoice", {
      id: data.id,
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

    return response.status;
  } catch (error) {
    console.error(error);
  }
};

export default sendNewInvoice;
