import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Shop from "./pages/Shop.tsx";

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Shop />} />
        </Routes>
    </Router>
);
}

export default App
