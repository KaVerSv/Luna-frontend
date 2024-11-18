import React, { useState } from 'react';

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  image: string;
  price: number;
  tags: Tag[];
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

type Tag = {
    id: number;
    name: string;
  };

const RecommendedBooks: React.FC<RecommendedBooksProps> = ({ books }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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
        <button onClick={prevImage} className="flex h-20 w-10 bg-[#302939] cursor-pointer items-center justify-center rounded-md rotate-180 m-3">
          <img src="/icons/arrow-right.svg" alt="Previous" />
        </button>

        <div className="flex flex-row bg-[#A3A3A3] bg-opacity-20 cursor-pointer rounded-md w-[750px]" onClick={goToBookPage}>
          <img
            className="w-[300px] h-[400px] mr-5 rounded-md"
            src={books[currentImageIndex].book.image}
            alt="Book Cover"
          />
          <div className="w-[600px]">
            <h2 id="book-title" className="text-white text-4xl mt-5">{books[currentImageIndex].book.title}</h2>
            <p id="book-author" className="text-white mt-2">{books[currentImageIndex].book.author}</p>


            <div className="flex justify-center items-center">
                {books[currentImageIndex].discount === null ? (
                <div className="bg-[#3E3647] flex items-center p-2 rounded-md cursor-pointer" onClick={goToBookPage}>
                    <p id="book-price" className="price text-white text-[20px] m-2">
                    {books[currentImageIndex].book.price}
                    </p>
                </div>
                ) : (
                <div className="bg-[#3E3647] flex items-center p-2 rounded-md cursor-pointer" onClick={goToBookPage}>
                    <p id="discount-shop-box" className="discount-shop-box text-white bg-[#6fa720] p-2 mr-2 rounded-md">
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

        <button onClick={nextImage} className="flex h-20 w-10 bg-[#302939] cursor-pointer items-center justify-center rounded-md m-3">
          <img src="/icons/arrow-right.svg" alt="Next" />
        </button>
      </div>

      <div className="flex justify-center mt-4 ml-[500px]">
        {books.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentImageIndex ? 'active' : ''} w-[20px] h-[15px] rounded-[5px] bg-[#776E82] mx-2 cursor-pointer`}
            onClick={() => showImage(index)}
          ></div>
        ))}
      </div>

      
    </div>
  );
};

export default RecommendedBooks;
