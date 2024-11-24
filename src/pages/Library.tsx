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

  const handleDownload = async () => {
    if (!selectedBook) return;

    try {
      // Zakładamy, że serwer ma endpoint do pobierania książek
      const response = await axios.get(`http://localhost:8080/api/v1/library/download/${selectedBook.id}`, {
        headers: authHeader(),
        responseType: 'blob', // Oczekujemy odpowiedzi w postaci binarnej
      });

      // Tworzenie linku do pobrania pliku
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedBook.title}.pdf`); // Ustaw nazwę pliku
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link); // Usunięcie linku po pobraniu
    } catch (error) {
      console.error('Error downloading the book:', error);
    }
  };

  return (
    <div className="bg-gray-600 min-h-screen">
      <Background>
        <TopBar/>

        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book List */}
            <div className="col-span-1">
              <h2 className="text-xl font-bold mb-4 text-white">Your Books</h2>
              <div className="space-y-4">
                {books.map(book => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book.id)}
                    className="p-4 border bg-gray-700 border-gray-900 shadow rounded-lg cursor-pointer hover:bg-gray-600"
                  >
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Details */}
            <div className="col-span-2">
              {selectedBook ? (
                <div className="bg-gray-500 shadow rounded-lg p-6">
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
                      <h1 className="text-white text-2xl font-bold mb-2">{selectedBook.title}</h1>
                      <p className="text-gray-50 mb-2">
                        <strong>Author:</strong> {selectedBook.author}
                      </p>
                      <p className="text-gray-50 mb-2">
                        <strong>Publish Date:</strong> {selectedBook.publish_date}
                      </p>
                      <p className="text-gray-50">
                        <strong>Description:</strong> {selectedBook.description}
                      </p>

                      {/* Download Button */}
                      <button
                        onClick={handleDownload}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                      >
                        Download Book
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-white shadow rounded-lg">
                  <h1 className="text-lg font-semibold text-gray-50">
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
