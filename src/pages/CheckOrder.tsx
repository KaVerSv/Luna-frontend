import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Background from '../components/Background';
import TopBar from '../components/TopBar';
import { Order } from '../models/Order'; // Model danych zamówienia
import authHeader from '../services/AuthHeader';

const CheckOrder: React.FC = () => {
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search); 
  const id = queryParams.get('id');  // Odczytujemy parametr 'id'


  useEffect(() => {
    if (id && !order) {
      const fetchOrder = async () => {
        try {
          const response = await axios.get<Order>('http://localhost:8080/orders/confirm', {
            params: { id: id },
            headers: authHeader(),
          });
          setOrder(response.data);
        } catch (err) {
          setError('Failed to fetch order details. Please try again later.');
          console.error(err);
        }
      };

      fetchOrder();
    }
    
    if (order?.paid === false && order?.payUOrderId && !paymentStatus) {
      const verifyPayment = async () => {
        try {
          const response = await axios.post('http://localhost:8080/orders/confirm', 
            { transactionId: order.payUOrderId }, 
            { headers: authHeader() }
          );
          setPaymentStatus(response.data.message || 'Payment verified successfully');
        } catch (err) {
          setError('Failed to verify payment. Please try again later.');
          console.error('Payment verification error:', err);
        }
      };

      verifyPayment();
    }
    
  }, [id, order, paymentStatus]);

  return (
    <Background>
      <TopBar />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-[#302939] p-8 rounded-md shadow-md text-center text-white">
          <h1 className="text-2xl font-bold">Order Details</h1>
          {error && <p className="mt-4 text-red-500">{error}</p>}
          {!order && !error && <p className="mt-4">Loading...</p>}
          {order && (
            <div className="mt-6">
              <p className="text-lg">Order ID: <span className="font-bold">{order.id}</span></p>
              <p className="text-lg">Order Date: <span className="font-bold">{new Date(order.orderDate).toLocaleDateString()}</span></p>
              <p className="text-lg">Payment Status: <span className="font-bold">{order.paid ? 'Paid' : 'Unpaid'}</span></p>
              <h2 className="text-xl font-bold mt-4">Order Items</h2>
              <ul className="mt-2">
                {order.orderItems.map((item) => (
                  <li key={item.id} className="text-lg border-t border-gray-500 mt-2 pt-2 flex items-start gap-4">
                    <img
                      src={item.bookDto.image}
                      alt={item.bookDto.title}
                      className="rounded-md shadow-md w-32 h-auto object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.bookDto.title}</p>
                      <p>Author: {item.bookDto.author}</p>
                      <p>Price at Purchase: {item.priceAtPurchase.toFixed(2)} $</p>
                      <p>Discount: {item.discountDto ? item.discountDto.percentage.toFixed(2) + ' %' : 'No discount'}</p>
                      <p>Publish Date: {new Date(item.bookDto.publish_date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Background>
  );
};

export default CheckOrder;