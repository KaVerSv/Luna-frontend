import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from "axios";
import authService from "../services/AuthService";
import authHeader from "../services/AuthHeader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TopBar = () => {
    const [admin, setAdmin] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [wishListMess, setWishListMess] = useState<{ id: string; title: string }[]>([]);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const [loading, setLoading] = useState(true);
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
                setWishListMess(wishListRes.data);
    
                for (const book of wishListRes.data) {
                    if (!localStorage.getItem(`notified_${book.id}`)) {
                        toast.info(`${book.title} Książka z twojej Listy życzeń jest na promocji!`);
                        localStorage.setItem(`notified_${book.id}`, 'true');
                    }
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    // Jeśli użytkownik nie jest zalogowany, ustaw stan domyślny
                    setUsername(null);
                    setAdmin(false);
                    setWishListMess([]);
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
            <div className="bg-gray-900 flex items-center justify-center h-40">
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

    return (
        <div className="bg-gray-900">
            <ToastContainer />
            <div className="flex items-center justify-between px-8 py-4">
                <div className="flex items-center space-x-4">
                    <img src="/luna_logo_circle.png" alt="Logo" className="h-16" />
                    <div className="text-white text-4xl">LUNA</div>
                </div>

                <nav className="flex items-center space-x-4">
                    <a href="shop" className="text-gray-300 hover:text-white text-xl">
                        Shop
                    </a>
                    <a href="library" className="text-gray-300 hover:text-white text-xl">
                        Library
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
                            Log in
                        </a>
                    )}
                    {admin && (
                        <a href="Discounts" className="text-gray-300 hover:text-white text-xl">
                            Discounts
                        </a>
                    )}
                    <a href="cart" className="flex items-center text-gray-300 hover:text-white text-xl">
                        <span>Cart</span>
                        <img src="/icons/cart-shopping-white.svg" alt="Cart" className="h-6 ml-2" />
                    </a>
                </nav>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="search"
                        className="bg-gray-700 text-gray-300 placeholder-gray-500 rounded px-4 py-2 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
