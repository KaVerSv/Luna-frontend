import { Book } from "./Book";
import { Discount } from "./Book";

export interface OrderItem {
    id: number;
    bookDto: Book;
    discountDto: Discount | null;  // Może być null, jeśli brak rabatu
    priceAtPurchase: number;  // Cena przy zakupie
  }