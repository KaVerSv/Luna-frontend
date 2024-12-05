import { OrderItem } from "./OrderItem";

export interface Order {
    id: number;
    orderDate: string;  
    paid: boolean;
    payUOrderId: string | null;  
    orderItems: OrderItem[]; 
  }