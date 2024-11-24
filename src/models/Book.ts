export interface BookItem {
    book: Book; // Obiekt zdefiniowany jako `Book`
    discount?: Discount; // Opcjonalny obiekt `discount`
}

export interface Book {
    id: number;
    title: string;
    author: string;
    publish_date: string;
    description: string;
    price: number;
    image: string;
    likes: number;
    dislikes: number;
    user_score: number;
    num_of_pages: number;
    tags?: TagDto[];
    languages?: LanguageDto[];
}

export interface Discount {
    id: number;
    percentage: number;
    startDate: string;
    endDate: string;
    name: string;
}

export interface TagDto {
    id: number;
    name: string;
}

export interface LanguageDto {
    id: number;
    name: string;
}
