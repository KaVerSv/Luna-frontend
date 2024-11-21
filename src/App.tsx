import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Shop from "./pages/Shop.tsx";
import BookPage from './pages/BookPage.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import CheckEmailPage from './pages/CheckEmailPage.tsx';
import ForogotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';

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
        </Routes>
    </Router>
);
}

export default App
