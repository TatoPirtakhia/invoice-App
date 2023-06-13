import axios from "axios";

const getAllInvoice = async () => {
  try {
    const response = await axios.get("https://invoice-app-rsqt.onrender.com/api/getInvoices");
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

export default getAllInvoice;
