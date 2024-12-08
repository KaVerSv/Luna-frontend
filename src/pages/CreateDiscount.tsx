import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BookItem } from '../models/Book';
import TopBar from '../components/TopBar';
import Background from '../components/Background';

const CreateDiscount = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<BookItem[]>([]);
  const [discount, setDiscount] = useState({
    percentage: '',
    startDate: '',
    endDate: '',
    name: '',
  });

  const searchBooks = (keyword: string) => {
    if (!keyword.trim()) return;

    fetch(`http://localhost:8080/search?keyword=${keyword}`)
      .then(response => response.json())
      .then((data: BookItem[]) => setBooks(data))
      .catch(err => console.error('Error searching books', err));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchKeyword(value);
    searchBooks(value);
  };

  const handleBookSelection = (book: BookItem) => {
    setSelectedBooks(prev => {
      if (!prev.some(selectedBook => selectedBook.book.id === book.book.id)) {
        return [...prev, book];
      }
      return prev;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiscount(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const discountData = {
      ...discount,
      books: selectedBooks.map(book => book.book.id),
    };

    fetch('http://localhost:8080/discounts/createForBooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discountData),
    })
      .then(response => response.json())
      .then(() => {
        toast.success('Discount created successfully!');
        setDiscount({ percentage: '', startDate: '', endDate: '', name: '' });
        setSelectedBooks([]);
        setBooks([]);
      })
      .catch((error) => {
        toast.error('Failed to create discount!');
        console.error('Error:', error);
      });
  };

  return (
    <Background>
      <TopBar />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
        <h1 className="text-3xl font-semibold text-center text-[#302939] mb-6">Create Discount</h1>

        {/* Search Box */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title"
            value={searchKeyword}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#302939]"
          />
          {books.length > 0 && (
            <ul className="mt-4">
              {books.map((bookItem) => (
                <li key={bookItem.book.id} className="mb-2">
                  <button
                    onClick={() => handleBookSelection(bookItem)}
                    className="w-full text-left px-4 py-2 bg-[#302939] text-white rounded-md hover:bg-[#4b3e57]"
                  >
                    {bookItem.book.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Discount Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#302939] font-medium">Discount Percentage:</label>
            <input
              type="number"
              name="percentage"
              value={discount.percentage}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#302939]"
            />
          </div>
          <div>
            <label className="block text-[#302939] font-medium">Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={discount.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#302939]"
            />
          </div>
          <div>
            <label className="block text-[#302939] font-medium">End Date:</label>
            <input
              type="date"
              name="endDate"
              value={discount.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#302939]"
            />
          </div>
          <div>
            <label className="block text-[#302939] font-medium">Discount Name:</label>
            <input
              type="text"
              name="name"
              value={discount.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#302939]"
            />
          </div>

          {/* Selected Books */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#302939]">Selected Books:</h2>
            {selectedBooks.length > 0 ? (
              <ul className="mt-2">
                {selectedBooks.map((bookItem) => (
                  <li key={bookItem.book.id} className="text-[#302939]">{bookItem.book.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No books selected</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#302939] text-white rounded-md hover:bg-[#4b3e57] transition duration-300"
          >
            Create Discount
          </button>
        </form>
      </div>
    </Background>
  );
};

export default CreateDiscount;
