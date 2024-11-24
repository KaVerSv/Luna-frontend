import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { BookItem } from "../models/Book"; // Zaktualizowana ścieżka i importowanie nowego typu BookItem

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const bookId = searchParams.get("bookId");

    // Określenie typu stanu dla wyników jako BookItem[]
    const [results, setResults] = useState<BookItem[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const endpoint = bookId
                    ? `http://localhost:8080/api/books/${bookId}`
                    : `http://localhost:8080/api/books/search?keyword=${query}`;
                
                // Typowanie odpowiedzi z axios
                const response = await axios.get<BookItem[]>(endpoint); // Zmiana typu odpowiedzi na BookItem[]
                setResults(Array.isArray(response.data) ? response.data : [response.data]);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };
        fetchResults();
    }, [query, bookId]);

    return (
        <div className="p-8">
            <h1 className="text-2xl text-gray-900 mb-4">Search Results</h1>
            {results.length === 0 ? (
                <p>No results found</p>
            ) : (
                <ul>
                    {results.map((item) => (
                        <li key={item.book.id} className="mb-2">
                            <div className="p-4 border rounded shadow">
                                <h2 className="text-xl">{item.book.title}</h2>
                                <p>Author: {item.book.author}</p>
                                <p>Price: ${item.book.price.toFixed(2)}</p>
                                {item.discount && (
                                    <p className="text-green-500">Discount: {item.discount.percentage}%</p>
                                )}
                                {item.book.tags && item.book.tags.length > 0 && (
                                    <p>Tags: {item.book.tags.map((tag) => tag.name).join(", ")}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
