export enum OpeningDays {
  Lundi = 'Lundi',
  Mardi = 'Mardi',
  Mercredi = 'Mercredi',
  Jeudi = 'Jeudi',
  Vendredi = 'Vendredi',
  Samedi = 'Samedi',
  Dimanche = 'Dimanche',
}

export enum CustomerTypes {
    restaurant = "restaurant",
    butcher = "butcher",
}
type OfficeHours = {
    day: string;
    startHour: string;
    endHour: string;
  };
  
  interface CustomerDetail {
  image: string;
  }
  export interface CustomerMenu {
    //_id: string;
    name: string;
    description: string;
    price: number;
    image: string ;
    }

    export type CreateCustomerMenu = Omit<CustomerMenu, '_id' >  & {
      image: File[];
      [key: string]: any;
    }


  export interface ICustomer {
    _id: string;
    incrementalId: string;
    name: string;
    image?: string;
    description?: string;
    isPartner: boolean;
    isActive: boolean;
    isActiveInApp: boolean;
    isActiveInHccp: boolean;
    customerType: CustomerTypes;
    address: string;
    zipCode: string;
    city: string;
    country: string;
    phone?: string;
    mail?:string;
    officeHours?: OfficeHours[];
    detail?: CustomerDetail;
    menu?: CustomerMenu[];
    menuPriceUnit: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type CreateCustomer = Omit<
  ICustomer,
  '_id' | 'createdAt' | 'updatedAt' | 'incrementalId' | 'isActiveInHccp' | 'isPartner'
  > & {
    image: File[];
    menu?: CreateCustomerMenu[];
    [key: string]: any;
  }

  // export interface CreateCustomer {
  //   name: string;
  //   image?: string;
  //   description?: string;
  //   isActive: boolean;
  //   isActiveInHccp: boolean;
  //   customerType: CustomerTypes;
  //   address: string;
  //   zipCode: string;
  //   city: string;
  //   country: string;
  //   phone?: string;
  //   mail:string;
  //   officeHours?: OfficeHours[];
  //   detail?: CustomerDetail;
  //   menu?: CreateCustomerMenu[];
  //   menuPriceUnit: string;
  //   createdBy: string;

  // }
  
  