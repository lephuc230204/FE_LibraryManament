import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TrangChu from './pages/trangchu/trangchu.jsx';
import QuanLyNguoiDung from './pages/quanlinguoidung/accountpage.jsx';
import './App.css';
import Sidebar from './components/navbar';
import searchbar from "./components/searchbar";
import BookManagement from "./pages/quanlysach/bookmanagement";
function App() {
    return (
        <Router>
            <Routes>
                {/* Trang chủ */}
                <Route path="/" element={<TrangChu/>}/>
                {/* Trang quản lý người dùng */}
                <Route path="/quan-ly-nguoi-dung" element={<QuanLyNguoiDung/>}/>
                {/* Các route khác nếu cần */}
                <Route path="/quan-ly-sach" element={<BookManagement/>}/> {/* Thêm route cho quản lý sách */}
            </Routes>
        </Router>
    );
}

export default App;
