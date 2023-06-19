
export type Invoice = {
  createdAt:  string ;
  paymentDue:string;
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
export type InvoiceData = {
    id: string;
    createdAt: string  ;
    paymentDue:string;
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
  
  export interface Item {
    quantity: number;
    price: number;
    total: number;
  }