import * as Yup from 'yup';

const invoiceSchema = Yup.object().shape({
  createdAt: Yup.date().required('Created at is required'),
  paymentDue: Yup.date().required('Payment due date is required'),
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
      quantity: Yup.number().required('Item quantity is required'),
      price: Yup.number().required('Item price is required'),
      total: Yup.number().required('Item total is required'),
    })
  ),
});

export default invoiceSchema