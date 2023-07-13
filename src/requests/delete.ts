import axios from "axios";

const deleteInvoice = async (id: string | undefined) => {
  try {
    const response = await axios.delete("https://invoice-app-api-production-0211.up.railway.app/api/deleteInvoice/" + id);
    return response.status;
  } catch (error) {
    console.error(error);
  }
};

export default deleteInvoice;
