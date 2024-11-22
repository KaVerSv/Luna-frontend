import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Background from "../components/Background";
import TopBar from "../components/TopBar";
import authHeader from "../services/AuthHeader";
import { useNavigate } from "react-router-dom";
import AuthService from '../services/AuthService';

interface Book {
  id: number;
  title: string;
  author: string;
  publish_date: string;
  description: string;
  image: string;
}

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.ensureAuthenticated();
    fetchBooks();
    if (localStorage.getItem("user") === null) {
      navigate("/login");
    }    
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get<Book[]>('http://localhost:8080/api/v1/library', { headers: authHeader() });
      setBooks(response.data);

      if (response.data.length > 0) {
        setSelectedBook(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleBookClick = (bookId: number) => {
    const selected = books.find(book => book.id === bookId) || null;
    setSelectedBook(selected);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Background>
        <TopBar/>

        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book List */}
            <div className="col-span-1">
              <h2 className="text-xl font-bold mb-4">Your Books</h2>
              <div className="space-y-4">
                {books.map(book => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book.id)}
                    className="p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Details */}
            <div className="col-span-2">
              {selectedBook ? (
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex flex-col md:flex-row">
                    {/* Book Cover */}
                    <div className="md:w-1/3">
                      <img
                        src={selectedBook.image}
                        alt="Book Cover"
                        className="w-full h-auto object-cover rounded-lg shadow"
                      />
                    </div>

                    {/* Book Info */}
                    <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
                      <h1 className="text-2xl font-bold mb-2">{selectedBook.title}</h1>
                      <p className="text-gray-700 mb-2">
                        <strong>Author:</strong> {selectedBook.author}
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong>Publish Date:</strong> {selectedBook.publish_date}
                      </p>
                      <p className="text-gray-700">
                        <strong>Description:</strong> {selectedBook.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-white shadow rounded-lg">
                  <h1 className="text-lg font-semibold text-gray-700">
                    Your Library is empty
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </Background>
    </div>
  );
};

export default Library;
