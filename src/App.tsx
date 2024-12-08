import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Shop from "./pages/Shop.tsx";
import BookPage from './pages/BookPage.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import CheckEmailPage from './pages/CheckEmailPage.tsx';
import ForogotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';
import Cart from './pages/Cart.tsx';
import Library from './pages/Library.tsx';
import SearchResults from './pages/SearchResults.tsx';
import CheckOrder from './pages/CheckOrder.tsx';
import OrderHistory from './pages/OrderHistory.tsx';
import CreateDiscount from './pages/CreateDiscount.tsx';


function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/BookPage" element={<BookPage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/checkEmail" element={<CheckEmailPage/>} />
          <Route path="/forgotPassword" element={<ForogotPasswordPage/>} />
          <Route path="/resetPassword" element={<ResetPasswordPage/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/library" element={<Library/>} />
          <Route path="/search" element={<SearchResults/>} />
          <Route path="/confirm" element={<CheckOrder/>} />
          <Route path="/orderHistory" element={<OrderHistory />} />
          <Route path="/createDiscount" element={<CreateDiscount />} />
        </Routes>
    </Router>
);
}

export default App
