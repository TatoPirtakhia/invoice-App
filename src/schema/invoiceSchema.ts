import * as Yup from 'yup';

const invoiceSchema = Yup.object().shape({
  createdAt: Yup.string().required('Created at is required'),
  description: Yup.string().required('Description is required'),
  paymentTerms: Yup.number().required('Payment terms is required'),
  clientName: Yup.string().required('Client name is required'),
  clientEmail: Yup.string().email('Invalid email').required('Client email is required'),
  status: Yup.string().required('Status is required'),
  senderAddress: Yup.object().shape({
    street: Yup.string().required('Sender address street is required'),
    city: Yup.string().required('Sender address city is required'),
    postCode: Yup.string().required('Sender address post code is required'),
    country: Yup.string().required('Sender address country is required'),
  }),
  clientAddress: Yup.object().shape({
    street: Yup.string().required('Client address street is required'),
    city: Yup.string().required('Client address city is required'),
    postCode: Yup.string().required('Client address post code is required'),
    country: Yup.string().required('Client address country is required'),
  }),
  items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Item name is required'),
      quantity: Yup.number()
        .typeError("Quantity must be a number")
        .required("Quantity is required")
        .positive("Quantity must be a positive number"),
      price: Yup
        .number()
        .typeError("Price must be a number")
        .required("Price is required")
        .positive("Price must be a positive number"),
      total: Yup.number().required('Item total is required'),
    })
  ),

});

export default invoiceSchema