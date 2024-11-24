import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { BookItem } from "../models/Book";
import Background from "../components/Background";
import TopBar from "../components/TopBar";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get("query") || ""; // Pobieramy initial query z URL

    // Dodajemy stan do query
    const [query, setQuery] = useState(initialQuery);
    
    // Stan dla wyników wyszukiwania i parametrów zaawansowanego wyszukiwania
    const [results, setResults] = useState<BookItem[]>([]);
    const [pageNum, setPageNum] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [bottomPriceRange, setBottomPriceRange] = useState<number | null>(null);
    const [topPriceRange, setTopPriceRange] = useState<number | null>(null);
    const [sortOption, setSortOption] = useState<string | null>(null);
    const [specialOffersOnly, setSpecialOffersOnly] = useState<boolean | null>(null);
    const [languages, setLanguages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const endpoint = `http://localhost:8080/api/books/searchAdv?keyword=${query}&pageNum=${pageNum}&pageSize=${pageSize}` +
                    (bottomPriceRange ? `&bottomPriceRange=${bottomPriceRange}` : "") +
                    (topPriceRange ? `&topPriceRange=${topPriceRange}` : "") +
                    (sortOption ? `&sortOption=${sortOption}` : "") +
                    (specialOffersOnly !== null ? `&specialOffersOnly=${specialOffersOnly}` : "") +
                    (languages.length ? `&languages=${languages.join(",")}` : "") +
                    (tags.length ? `&tags=${tags.join(",")}` : "");

                // Typowanie odpowiedzi z axios
                const response = await axios.get<BookItem[]>(endpoint); // Zmiana typu odpowiedzi na BookItem[]
                setResults(Array.isArray(response.data) ? response.data : [response.data]);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchResults();
    }, [query, pageNum, pageSize, bottomPriceRange, topPriceRange, sortOption, specialOffersOnly, languages, tags]);

    // Funkcja do zmiany parametrów wyszukiwania
    const handleSearch = () => {
        setPageNum(0); // Resetowanie strony na pierwszą po wyszukaniu
    };

    return (
        <Background>
            <TopBar />
            <div className="p-8 text-white flex">

                {/* Wyniki wyszukiwania po lewej stronie */}
                <div className="flex-1 mr-8">
                    <h1 className="text-2xl text-white mb-4">Advanced Search Results</h1>

                    {/* Wyświetlanie wyników wyszukiwania */}
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

                    {/* Pagacja */}
                    <div className="mt-4">
                        <button
                            onClick={() => setPageNum(pageNum - 1)}
                            disabled={pageNum === 0}
                            className="p-2 bg-gray-500 text-white rounded"
                        >
                            Previous
                        </button>
                        <span className="mx-2">{pageNum + 1}</span>
                        <button
                            onClick={() => setPageNum(pageNum + 1)}
                            className="p-2 bg-gray-500 text-white rounded"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Formularz wyszukiwania po prawej stronie */}
                <div className="w-1/4 p-4 bg-gray-800 rounded shadow-md">
                    <h2 className="text-lg text-white mb-4">Search Options</h2>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)} // Użycie setQuery
                            className="bg-gray-700 p-2 border rounded border-gray-900"
                        />
                        <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white rounded">
                            Search
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="mr-2">Price Range:</label>
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={bottomPriceRange || ""}
                            onChange={(e) => setBottomPriceRange(Number(e.target.value))}
                            className="p-2 border rounded border-gray-900 bg-gray-700"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={topPriceRange || ""}
                            onChange={(e) => setTopPriceRange(Number(e.target.value))}
                            className="ml-2 p-2 border border-gray-900 rounded bg-gray-700"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mr-2">Sort By:</label>
                        <select
                            value={sortOption || ""}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="p-2 border rounded border-gray-900 bg-gray-700"
                        >
                            <option value="">Select Sort Option</option>
                            <option value="priceAsc">Price (Low to High)</option>
                            <option value="priceDesc">Price (High to Low)</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="mr-2">Special Offers Only:</label>
                        <input
                            type="checkbox"
                            checked={specialOffersOnly || false}
                            onChange={(e) => setSpecialOffersOnly(e.target.checked)}
                            className="mr-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mr-2">Languages:</label>
                        <input
                            type="text"
                            placeholder="Languages (comma separated)"
                            value={languages.join(",")}
                            onChange={(e) => setLanguages(e.target.value.split(",").map(lang => lang.trim()))}
                            className="p-2 border rounded border-gray-900 bg-gray-700"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mr-2">Tags:</label>
                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={tags.join(",")}
                            onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()))}
                            className="p-2 border rounded border-gray-900 bg-gray-700"
                        />
                    </div>
                </div>
            </div>
        </Background>
    );
};

export default SearchResults;
