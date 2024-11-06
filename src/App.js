import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TrangChu from './pages/trangchu/trangchu.jsx'; // Đảm bảo đường dẫn chính xác

function App() {
    return (
        <Router>
            <Routes>
                {/* Đặt TrangChu làm trang mặc định */}
                <Route path="/" element={<TrangChu />} />
                {/* Các route khác nếu cần */}
            </Routes>
        </Router>
    );
}

export default App;
