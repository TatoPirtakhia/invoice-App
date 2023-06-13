import axios from "axios";

const deleteInvoice = async (id: string) => {
  await axios.delete("https://invoice-app-rsqt.onrender.com/api/deleteInvoice/" + id)
    .then((response) => {
      console.log(response);
    });
};

export default deleteInvoice;
