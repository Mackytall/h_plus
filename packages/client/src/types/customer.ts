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
  interface CustomerMenu {
    name: string;
    description: string;
    price: number;
    priceUnit:string;
    image: string;
    }


  export interface CreateCustomer {
    name: string;
    photo?: string;
    description?: string;
    // isPartner: boolean;
    // isActive: boolean;
    // isActiveInApp: boolean;
    // isActiveInHccp: boolean;
    customerTypes: CustomerTypes;
    address: string;
    zipCode: string;
    city: string;
    country: string;
    phone: string;
    mail:string;
    officeHours?: OfficeHours[];
    // detail?: CustomerDetail;
    menu?: CustomerMenu[];
    createdBy: string;
  }
  
  export enum OpeningDays {
    Lundi = 'Lundi',
    Mardi = 'Mardi',
    Mercredi = 'Mercredi',
    Jeudi = 'Jeudi',
    Vendredi = 'Vendredi',
    Samedi = 'Samedi',
    Dimanche = 'Dimanche',
  }