import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Background from "../components/Background";
import authHeader from '../services/AuthHeader';
import { useNavigate } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
}

interface Discount {
  percentage: number;
  name: string;
}

interface OrderItem {
  id: number;
  bookDto: Book;
  discountDto: Discount | null;
  priceAtPurchase: number;
}

interface Order {
  id: number;
  orderDate: string;
  paid: boolean;
  payUOrderId: string;
  orderItems: OrderItem[];
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    if (localStorage.getItem("user") === null) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>('http://localhost:8080/orders', { headers: authHeader() });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  return (
    <Background>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Order History</h1>
        
        {orders.length === 0 ? (
          <p className="text-center text-lg text-gray-500">You have no orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-700">Order ID: {order.payUOrderId}</p>
                <p className={`text-lg ${order.paid ? 'text-green-500' : 'text-red-500'}`}>
                  {order.paid ? 'Paid' : 'Not Paid'}
                </p>
              </div>
              <p className="text-gray-600 mb-4">{new Date(order.orderDate).toLocaleDateString()}</p>
              
              <div>
                {order.orderItems.map((item) => {
                  const { bookDto, discountDto, priceAtPurchase } = item;
                  const discountedPrice = discountDto ? priceAtPurchase * (1 - discountDto.percentage / 100) : priceAtPurchase;
                  return (
                    <div key={item.id} className="flex justify-between items-center py-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <img src={bookDto.image} alt={bookDto.title} className="w-16 h-24 object-cover rounded-md" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">{bookDto.title}</p>
                          <p className="text-gray-500">{bookDto.author}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {discountDto && (
                          <p className="text-green-600 text-sm">
                            Discount: {discountDto.percentage}% off
                          </p>
                        )}
                        <p className="text-gray-700 font-semibold">
                          Price: {discountedPrice.toFixed(2)} zł
                        </p>
                        {discountDto && (
                          <p className="text-gray-500 line-through">
                            {priceAtPurchase.toFixed(2)} zł
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </Background>
  );
};

export default OrderHistory;
