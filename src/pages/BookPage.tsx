import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import Background from "../components/Background";
import BookDetails from "../components/BookDetails";

type Tag = {
  id: number;
  name: string;
};

type Discount = {
  id: number;
  percentage: number;
  startDate: string;
  endDate: string;
  name: string;
};

type BookInfo = {
  book: {
    id: string;
    title: string;
    author: string;
    description: string;
    image: string;
    price: number;
    likes: number;
    dislikes: number;
    user_score: number;
    num_of_pages: number;
    tags: Tag[];
    languages: string[];
    publish_date: string;
  };
  discount: Discount | null;
};

const BookPage: React.FC = () => {
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bookId = searchParams.get("id");

  useEffect(() => {
    const fetchBookPart = async () => {
      try {
        const response = await axios.get<BookInfo>(
          `http://localhost:8080/api/books/${bookId}`
        );
        setBookInfo(response.data);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookPart();
    } else {
      setLoading(false);
    }
  }, [bookId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shop">
      <Background>
        <TopBar />
        {bookInfo && <BookDetails bookInfo={bookInfo} />}
      </Background>
    </div>
  );
};

export default BookPage;
