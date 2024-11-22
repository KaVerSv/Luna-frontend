import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Background from "../components/Background";
import authHeader from '../services/AuthHeader';
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  price: number;
}

const Cart: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
    if (localStorage.getItem("user") === null) {
      navigate("/login");
    }

    const fetchUsername = async () => {
      try {
        await axios.get('http://localhost:8080/api/v1/user/username', { headers: authHeader() });
      } catch (error) {
        navigate("/login");
      }
    };
    fetchUsername();
  }, [navigate]);

  const fetchCartData = async () => {
    try {
      const response = await axios.get<Book[]>('http://localhost:8080/api/v1/cart', { headers: authHeader() });
      setBooks(response.data);

      const resp = await axios.get<number>('http://localhost:8080/api/v1/cart/price', { headers: authHeader() });
      setTotalPrice(resp.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const handleDelete = async (bookId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/cart/${bookId}`, { headers: authHeader() });
      await fetchCartData();
    } catch (error) {
      console.error('Error deleting book from cart:', error);
    }
  };

  const handleBuy = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/cart/buy', {}, { headers: authHeader() });
      await fetchCartData();
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  };

  if (loading) {
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  }

  return (
    <Background>
      <TopBar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-center mb-6">YOUR SHOPPING CART</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book.id}
                className="flex justify-between items-center border-b border-gray-200 py-4"
              >
                <a
                  href={`http://localhost:/BookPage?id=${book.id}`}
                  className="text-lg font-medium text-blue-600 hover:underline"
                >
                  {book.title}
                </a>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-700">Price: {book.price} zł</p>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          )}
          {books.length > 0 && (
            <div className="mt-6">
              <p className="text-right text-lg font-semibold">
                Total: {totalPrice.toFixed(2)} zł
              </p>
              <div className="text-right mt-4">
                <button
                  onClick={handleBuy}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Buy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Background>
  );
};

export default Cart;
