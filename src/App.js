import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TrangChu from './pages/trangchu/trangchu.jsx';
import QuanLyNguoiDung from './pages/quanlinguoidung/accountpage.jsx';
import './App.css';
import BookManagement from "./pages/quanlysach/bookmanagement"
import BookExtensionPage from "./pages/quanlygiahansach/bookextensionpage.jsx";
import BookReservationPage from "./pages/quanlydattruoc/BookReservationPage";
import BookBorrowingPage from "./pages/quanlymuonsach/BookBorrowingPage";
function App() {
    return (
        <Router>
            <Routes>
                {/* Trang chủ */}
                <Route path="/" element={<TrangChu/>}/>
                {/* Trang quản lý người dùng */}
                <Route path="/quan-ly-nguoi-dung" element={<QuanLyNguoiDung/>}/>
                {/* trang quản lý sach */}
                <Route path="/quan-ly-sach" element={<BookManagement/>}/> {/* Thêm route cho quản lý sách */}
                {/* Trang qua lý mu sách*/}
                <Route path="/quan-ly-gia-han-sach" element={<BookExtensionPage/>}/> {/* Thêm route cho quản lý sách */}
                {/* Trang qua lý dat truoc sach*/}
                <Route path="/quan-ly-dat-truoc-sach" element={<BookReservationPage/>}/> {/* Thêm route cho quản lý dặt truoc sach */}
                {/* Trang qua lý muon sach*/}
                <Route path="/quan-ly-muon-sach" element={<BookBorrowingPage/>}/> {/* Thêm route cho quản lý sách */}
            </Routes>
        </Router>
    );
}

export default App;
