import { useEffect, useState } from 'react';
import axios, { AxiosError } from "axios";
import authService from "../services/AuthService";
import authHeader from "../services/AuthHeader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BookItem} from "../models/Book"
import { BookService } from '../services/BookService';

const TopBar = () => {
    const [admin, setAdmin] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const [loading, setLoading] = useState(true);
    //search
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<BookItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    //auth
    const config = {
        headers: authHeader()
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [usernameRes, adminRes, wishListRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/v1/user/username', config),
                    axios.get('http://localhost:8080/api/v1/user/admin', config),
                    axios.get('http://localhost:8080/api/v1/user/wishList', config),
                ]);
    
                setUsername(usernameRes.data);
                setAdmin(adminRes.data);

                for (const book of wishListRes.data) {
                    if (!localStorage.getItem(`notified_${book.id}`)) {
                        toast.info(`${book.title} Książka z twojej Listy życzeń jest na promocji!`);
                        localStorage.setItem(`notified_${book.id}`, 'true');
                    }
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // Jeśli użytkownik nie jest zalogowany, ustaw stan domyślny
                    setUsername(null);
                    setAdmin(false);
                } else {
                    // Obsługa innych błędów
                    setError(error instanceof Error ? error : new Error('Unexpected error occurred'));
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserData();
    }, []);
    
    const handleLogout = async () => {
        try {
            await authService.logout();
            setUsername(null);
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#1D1A2F] flex items-center justify-center h-40">
                <div className="text-white text-lg">Loading...</div> {/* Loader placeholder */}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 flex items-center justify-center h-40">
                <div className="text-red-500 text-lge">Error: {error.message}</div>
            </div>
        );
    }

    //search
    const fetchSuggestions = async (keyword: string) => {
        if (!keyword) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8080/api/books/search?keyword=${keyword}`);
            setSuggestions(response.data); // Dane są zgodne z odpowiedzią API
            console.log(response.data); // Debugowanie odpowiedzi
        } catch (error) {
            console.error("Error fetching search suggestions:", error);
        }
    };
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setSearchTerm(keyword);
        setShowSuggestions(!!keyword);
        fetchSuggestions(keyword);
    };

    const handleSuggestionClick = (id: number) => {
        window.location.href = `/BookPage?id=${id}`;
    };

    const handleSearch = () => {
        window.location.href = `/search/results?query=${searchTerm}`;
    };


    return (
        <div className="bg-gray-900">
            <ToastContainer />
            <div className="flex items-center justify-between px-8 py-4">
                <div className="flex items-center space-x-4">
                    <img src="/luna_logo_circle.png" alt="Logo" className="h-20" />
                    <div className="text-white text-4xl">LUNA</div>
                </div>

                <nav className="flex items-center space-x-8">
                    <a href="shop" className="text-gray-300 hover:text-white text-xl">
                        SHOP
                    </a>
                    <a href="library" className="text-gray-300 hover:text-white text-xl">
                        LIBRARY
                    </a>
                    {username ? (
                        <div className="relative group">
                            <button className="text-gray-300 hover:text-white text-xl">
                                {username}
                            </button>
                            <div className="hidden group-hover:block absolute bg-gray-800 text-gray-300 text-sm mt-2 px-4 py-2 rounded">
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <a href="login" className="text-gray-300 hover:text-white text-xl">
                            LOG IN
                        </a>
                    )}
                    {admin && (
                        <a href="Discounts" className="text-gray-300 hover:text-white text-xl">
                            ADMIN PANEL
                        </a>
                    )}
                    <a href="cart" className="flex items-center text-gray-300 hover:text-white text-xl">
                        <span>CART</span>
                        <img src="/icons/cart-shopping-white.svg" alt="Cart" className="h-6 ml-2" />
                    </a>
                </nav>
                <div className="relative flex items-center">
                    <img src="/icons/magnifying-glass-solid.svg" alt="Cart" className="h-6 mr-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="bg-gray-700 text-gray-300 placeholder-gray-500 rounded px-4 py-2 focus:outline-none"
                    />
                    <button
                        onClick={handleSearch}
                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Search
                    </button>
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute top-full left-0 w-full bg-gray-800 text-white border border-gray-700 rounded mt-1 z-10">
                            {suggestions.map((item) => (
                                <li
                                    key={item.book.id}
                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                    onClick={() => handleSuggestionClick(item.book.id)}
                                >
                                    {item.book.title} 
                                    <span className="text-white ml-2">
                                        {BookService.calculateDiscountedPrice(item)} zł
                                    </span>
                                    {item.discount && item.discount.percentage && (
                                        <span className="text-green-400"> (-{item.discount.percentage}% off)</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TopBar;
