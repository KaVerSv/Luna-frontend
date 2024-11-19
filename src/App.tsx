import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Shop from "./pages/Shop.tsx";
import BookPage from './pages/BookPage.tsx';

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/BookPage" element={<BookPage/>} />
          <Route path="/login" element={<Shop/>} />
        </Routes>
    </Router>
);
}

export default App
