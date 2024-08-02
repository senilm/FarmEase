export interface FormErrors {
  fromDate?: string[];
  toDate?: string[];
  amount?: string[];
  // person?: string[];
  farm?: string[];
}

export interface addFarmErrorI{
  name?: string[]
}

export interface addUserErrorI{
  name?:string[];
  role?: string[]
}
export interface loginFormError {
  person?: string[];
  password?: string[];
}


export interface expenseError {
  amount?: string[];
  note?: string[];
  expDate?: string[];
  farm?: string[];
}

export interface User {
  name: string;
}

export interface FarmT{
  name:string
}
export interface Booking {
  id: string;
  fromDate: Date;
  toDate: Date;
  userId: string;
  amount: number;
  date: Date;
  User: User;
  Farm: FarmT
}

export interface Expense {
  id: string;
  date: Date;
  amount: number;
  note: string;
  Farm: FarmT
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: "Income" | "Expense";
  fromDate: Date; 
  toDate: Date;   
  note?: string;   
  userId?: string; 
  User?: User;     
}

export type optionType = {
  id: string;
  name: string;
  email: string;
};

export type userType = {
  id:string;
  name:string;
  email:string;
  role:string
}
export interface ProtectedRouteProps {
  children: JSX.Element;
}

export const filterDateInitialState = {
  fromFilterDate: "",
  toFilterDate: "",
};


export interface SearchAndSelectI {
  onChange: (value: optionT) => void;
}

export type optionT = {
  name: string;
  id: string;
};
