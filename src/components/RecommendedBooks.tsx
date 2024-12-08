import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  image: string;
  price: number;
  tags: Tag[];
};

type Tag = {
  id: number;
  name: string;
};

type Discount = {
  percentage: number;
} | null;

type BookWithDiscount = {
  book: Book;
  discount: Discount;
};

type RecommendedBooksProps = {
  books: BookWithDiscount[];
};

const RecommendedBooks: React.FC<RecommendedBooksProps> = ({ books }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const navigate = useNavigate();

  const showImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? books.length - 1 : prevIndex - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === books.length - 1 ? 0 : prevIndex + 1));
  };

  const goToBookPage = () => {
    const currentBookId = books[currentImageIndex].book.id;
    window.location.href = `BookPage?id=${currentBookId}`;
  };

  const calculateDiscountedPrice = (price: number, discountPercentage: number): string => {
    return (price * (1 - discountPercentage / 100)).toFixed(2);
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-20">
        <button
          onClick={prevImage}
          className="flex h-20 w-10 bg-[#302939] cursor-pointer items-center justify-center rounded-md rotate-180 m-3"
        >
          <img src="/icons/arrow-right.svg" alt="Previous" />
        </button>

        <div
          className="flex flex-row bg-[#A3A3A3] bg-opacity-20 cursor-pointer rounded-md w-[750px]"
          onClick={goToBookPage}
        >
          <img
            className="w-[300px] h-[400px] mr-5 rounded-md object-cover"
            src={books[currentImageIndex].book.image}
            alt="Book Cover"
          />
          <div className="w-[600px]">
            <h2 id="book-title" className="text-white text-3xl mt-5 p-1">
              {books[currentImageIndex].book.title}
            </h2>
            <p id="book-author" className="text-white mt-2 p-1">
              {books[currentImageIndex].book.author}
            </p>

            {/* tag section */}
            <div id="book-tags" className="mt-8 h-60">
              {books[currentImageIndex].book.tags.map((tag) => (
                <span key={tag.id} className="bg-[#302939] m-1 rounded-md p-2 text-white">
                  {tag.name}
                </span>
              ))}
            </div>

            {/* price */}
            <div className="relative justify-center items-center">
              {books[currentImageIndex].discount === null ? (
                <div
                  className="bg-[#3E3647] absolute bottom-1 right-5 items-center flex p-2 rounded-md cursor-pointer"
                  onClick={goToBookPage}
                >
                  <p id="book-price" className="price text-white text-[20px] m-2">
                    {books[currentImageIndex].book.price}
                  </p>
                </div>
              ) : (
                <div
                  className="bg-[#3E3647] absolute bottom-1 right-5 flex items-center p-2 rounded-md cursor-pointer"
                  onClick={goToBookPage}
                >
                  <p
                    id="discount-shop-box"
                    className="discount-shop-box text-white bg-[#6fa720] p-2 mr-2 rounded-md"
                  >
                    -{books[currentImageIndex].discount.percentage}%
                  </p>
                  <p id="old-price" className="old-price text-gray-500 line-through">
                    {books[currentImageIndex].book.price}
                  </p>
                  <p id="book-price" className="price text-white text-[20px] m-2">
                    {calculateDiscountedPrice(
                      books[currentImageIndex].book.price,
                      books[currentImageIndex].discount.percentage
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={nextImage}
          className="flex h-20 w-10 bg-[#302939] cursor-pointer items-center justify-center rounded-md m-3"
        >
          <img src="/icons/arrow-right.svg" alt="Next" />
        </button>
      </div>

      <div className="flex justify-center mt-4 ml-[500px]">
        {books.map((_, index) => (
          <div
            key={index}
            className={`w-[20px] h-[15px] rounded-[5px] mx-2 cursor-pointer ${
              index === currentImageIndex ? 'bg-[#2b1852]' : 'bg-[#9278b9]'
            }`}
            onClick={() => showImage(index)}
          ></div>
        ))}
      </div>

      {/* Explore button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate('/search')}
          className="bg-[#2b1852] text-white py-2 px-6 rounded-md hover:bg-[#3e1b73]"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default RecommendedBooks;
