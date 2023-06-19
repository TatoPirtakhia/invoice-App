import { useNavigate } from "react-router-dom"
import deleteInvoice from "../requests/delete"
import { InvoiceData } from "../types"

function ConfirmDelete(props:{
    id: string
    setShowDeleteWindow: React.Dispatch<React.SetStateAction<boolean>>
    setInvoices: React.Dispatch<React.SetStateAction<InvoiceData[]>>
    invoices: InvoiceData[]
}) {
    const navigate = useNavigate()
    const cancel = () =>{
        props.setShowDeleteWindow(false)
    }
    const deleteinvoice = async () =>{
        await deleteInvoice(props.id)
        const updatedObjects = [...props.invoices];
        const index = updatedObjects.findIndex(obj => obj.id === props.id);
        if (index !== -1) {
          updatedObjects.splice(index, 1);
          props.setInvoices(updatedObjects)
        }

        props.setShowDeleteWindow(false)
        navigate("/home");
      }

  return (
    <div className="w-[87%] bg-white shadow-delete p-8 flex flex-col rounded-lg">
      <h1 className="spartan text-[20px] text-[#0C0E16] font-bold">Confirm Deletion</h1>
      <p className="spartan font-medium text-[15px] text-[#888EB0] ">{`Are you sure you want to delete invoice ${props.id}? This action cannot be undone.`}</p>
      <div className="flex justify-end gap-4 mt-6">
        <button onClick={cancel} className="">Cancel</button>
        <button onClick={deleteinvoice} className="w-[89px] h-[48px]  bg-[#EC5757]  rounded-3xl spartan text-white font-bold">
              Delete
            </button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
