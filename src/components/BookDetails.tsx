import { useEffect, useState } from 'react';
import axios from 'axios';
import authHeader from '../services/AuthHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '../services/AuthService';
import TagSection from './TagSection';

// Typy danych
interface Tag {
  id: number;
  name: string;
}

interface Discount {
  id: number;
  percentage: number;
  startDate: string;
  endDate: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  publish_date: string;
  description: string;
  price: number;
  image: string;
  likes: number;
  dislikes: number;
  user_score: number;
  num_of_pages: number;
  tags: Tag[];
  languages: string[];
}

interface BookInfo {
  book: Book;
  discount: Discount | null;
}

interface BookDetailsProps {
  bookInfo: BookInfo;
}

const BookDetails: React.FC<BookDetailsProps> = ({ bookInfo }) => {
    const [totalVotes, setTotalVotes] = useState<number>(0);
    const [onWishList, setOnWishList] = useState<boolean>(false);
    const [discountPrice, setDiscountPrice] = useState<string | null>(null);
  
    const fetchWishList = async () => {
      try {
        const response = await axios.get<boolean>(
          `http://localhost:8080/api/v1/user/wishList/${bookInfo.book.id}`,
          { headers: authHeader() }
        );
        setOnWishList(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      const calculatePercentage = () => {
        setTotalVotes(bookInfo.book.likes + bookInfo.book.dislikes);
      };
  
      if (authService.isLogged()) {
        fetchWishList();
      }

      calculatePercentage();
  
      if (bookInfo.discount) {
        const calculatedDiscountPrice =
          bookInfo.book.price -
          (bookInfo.discount.percentage * bookInfo.book.price) / 100;
        setDiscountPrice(calculatedDiscountPrice.toFixed(2));
      }
    }, [bookInfo]);
  
    const getCategory = (userScore: number): string => {
      if (userScore >= 90) return "Overwhelmingly Positive";
      if (userScore >= 80) return "Very Positive";
      if (userScore >= 70) return "Positive";
      if (userScore >= 60) return "Slightly Positive";
      if (userScore >= 40) return "Mixed";
      if (userScore >= 30) return "Mostly Negative";
      return "Negative";
    };
  
    const handleAddToCart = async (e: React.FormEvent) => {
      e.preventDefault();
      authService.ensureAuthenticated();

      try {
        const response = await axios.post(
          `http://localhost:8080/api/v1/cart/${bookInfo.book.id}`,
          {},
          { headers: authHeader() }
        );
        console.log("Book added to cart:", response.data);
        toast.success("Book added to cart successfully!");
      } catch (error: any) {
        if (error.response?.status === 409) {
          toast.error("Item already in cart");
        } else {
          toast.error("Failed to add book to cart.");
        }
        console.error("Error adding book to cart:", error);
      }
    };
  
    const handleAddToWishList = async (e: React.FormEvent) => {
      e.preventDefault();
      authService.ensureAuthenticated();
  
      try {
        const response = await axios.post(
          `http://localhost:8080/api/v1/user/wishList/${bookInfo.book.id}`,
          {},
          { headers: authHeader() }
        );
        console.log("Book added to WishList:", response.data);
        toast.success("Book added to Wish List successfully!");
      } catch (error: any) {
        if (error.response?.status === 409) {
          toast.error("Book already in Wish List");
        } else {
          toast.error("Failed to add book to Wish List.");
        }
        console.error("Error adding book to Wish List:", error);
      }
      fetchWishList();
    };
  
    const handleRemoveFromWishList = async (e: React.FormEvent) => {
      e.preventDefault();
      authService.ensureAuthenticated();
  
      try {
        const response = await axios.delete(
          'http://localhost:8080/api/v1/user/wishList/${bookInfo.book.id}',
          { headers: authHeader() }
        );
        console.log("Book removed from WishList:", response.data);
        toast.success("Book removed from Wish List!");
      } catch (error: any) {
        if (error.response?.status === 409) {
          toast.error("Book not on Wish List");
        } else {
          toast.error("Failed to remove book from Wish List.");
        }
        console.error("Error removing book from Wish List:", error);
      }
      fetchWishList();
    };
  
    return (
      <div>
        <ToastContainer />
        <div className="flex justify-center items-center">
          <div className="mt-10 bg-[#A3A3A3] bg-opacity-20 w-[750px] rounded-md">
            <div className="flex row-auto">
              <img
                className="rounded-md w-[300px] h-auto mr-5"
                src={bookInfo.book.image}
                alt="Book Cover"
              />
              <div className="text-white mr-5 mt-5">
                <h2 className='text-3xl mb-3'>{bookInfo.book.title}</h2>
                <h2 className="text-xl mb-5">{bookInfo.book.author}</h2>
                <p className="">Published: {bookInfo.book.publish_date}</p>
                <p className="mb-3">User reviews: {getCategory(bookInfo.book.user_score)}</p>
                <p>{bookInfo.book.description}</p>
              </div>
            </div>
            <div className="bg-[#3E3647] h-30 w-auto m-8 mb-1 rounded-md text-white p-4 flex-row">
              <h2 className="text-2xl">Buy {bookInfo.book.title}</h2>
              {bookInfo.discount && (
                <h2 className="text-lg mb-6 text-[#7cb8e4]">
                  Special offer! {bookInfo.discount.name} ends: {bookInfo.discount.endDate}
                </h2>
              )}
              {bookInfo.discount ? (
                <div className="flex w-fit bg-gray-900 rounded-md h-10 items-center ml-auto">
                  <div className="bg-[#6fa720] rounded-md mr-3 p-2">
                    <p>-{bookInfo.discount.percentage}%</p>
                  </div>
                  <div className="flex">
                    <h6 className="text-gray-500 line-through mr-3">{bookInfo.book.price} zł</h6>
                    <p className="mr-3 text-[#86c928]">{discountPrice} zł</p>
                  </div>
                  <form onSubmit={handleAddToCart}>
                    <input className='bg-[#6fa720] rounded-md p-2 cursor-pointer hover:bg-[#99db3b]' type="submit" value="Add to Cart" />
                  </form>
                </div>
              ) : (
                <div className="flex w-fit bg-gray-900 rounded-md h-10 items-center ml-auto">
                  <div className="ml-3 mr-3">
                    <p>{bookInfo.book.price} zł</p>
                  </div>
                  <form onSubmit={handleAddToCart}>
                    <input className='bg-[#6fa720] rounded-md p-2 cursor-pointer hover:bg-[#99db3b]' type="submit" value="Add to Cart" />
                  </form>
                </div>
              )}
            </div>

            {/* wishList */}
            <div className="flex mt-4 ml-8 mr-8 bg-[#3E3647] w-auto rounded-md p-2 items-center text-white">
              <h1 className="text-xl ml-2">
                {onWishList ? "Remove from your Wish List" : "Add to your Wish List"}
              </h1>
              {onWishList ? (
                <form onSubmit={handleRemoveFromWishList} className="ml-auto">
                  <input
                    className="bg-[#6fa720] rounded-md p-2 cursor-pointer hover:bg-[#99db3b]"
                    type="submit"
                    value="Remove from WishList"
                  />
                </form>
              ) : (
                <form onSubmit={handleAddToWishList} className="ml-auto">
                  <input
                    className="bg-[#6fa720] rounded-md p-2 cursor-pointer hover:bg-[#99db3b]"
                    type="submit"
                    value="Add to WishList"
                  />
                </form>
              )}
            </div>

              {/* tags */}
            <div className="mt-4 ml-8 mr-8 ">
              <h1 className=' text-white text-2xl'>Book tags:</h1>
              <TagSection tags={bookInfo.book.tags} />
            </div>
            
          </div>
        </div>
      </div>
    );
  };
  
  export default BookDetails;