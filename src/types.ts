
export type Invoice = {
  createdAt:  Date ;
  paymentDue:  Date;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: string;
  senderAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  clientAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}
export type InvoiceData = {
    id: string;
    createdAt: Date  ;
    paymentDue:Date;
    description: string;
    paymentTerms: number;
    clientName: string;
    clientEmail: string;
    status: string;
    senderAddress: {
      street: string;
      city: string;
      postCode: string;
      country: string;
    };
    clientAddress: {
      street: string;
      city: string;
      postCode: string;
      country: string;
    };
    items: {
      name: string;
      quantity: number;
      price: number;
      total: number;
    }[];
    total: number;
  }


  export type item ={
    name: string;
    quantity: number;
    price: number;
    total: number;
  }
  