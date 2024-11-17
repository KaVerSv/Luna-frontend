import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TopBar from "./components/TopBar.tsx";

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<TopBar />} />
        </Routes>
    </Router>
);
}

export default App
