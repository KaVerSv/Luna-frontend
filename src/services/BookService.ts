import { BookItem } from "../models/Book";

export class BookService {
    /**
     * Oblicza cenę książki po uwzględnieniu rabatu.
     * @param bookItem Obiekt typu BookItem, zawierający książkę i opcjonalny rabat.
     * @returns Cena po rabacie. Jeśli brak rabatu, zwraca cenę oryginalną.
     */
    static calculateDiscountedPrice(bookItem: BookItem): number {
        const originalPrice = bookItem.book.price;
        const discount = bookItem.discount?.percentage;

        if (discount) {
            return +(originalPrice * (1 - discount / 100)).toFixed(2); // Zaokrąglenie do 2 miejsc po przecinku
        }

        return originalPrice; // Brak rabatu, zwraca oryginalną cenę
    }
}
