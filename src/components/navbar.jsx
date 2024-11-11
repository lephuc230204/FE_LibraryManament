import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';  // Sử dụng useNavigate thay vì useHistory
import AuthService from '../services/AuthService';
import '../assets/css/navbar.css';
import logo from '../assets/images/logo.png';

const NavBar = () => {
  const navigate = useNavigate(); 

  // Hàm logout
  const handleLogout = async () => {
    try {
      await AuthService.logout(); // Gọi service logout

      // Xóa token và chuyển hướng sau khi logout thành công
      localStorage.removeItem('accessToken');
      navigate('/'); // Chuyển hướng về LOGIN sau khi logout
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <div className="nav-bar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <NavLink
        to="/quan-ly-nguoi-dung"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        <i className="fas fa-user icon"></i> Users
      </NavLink>
      <NavLink
        to="/quan-ly-sach"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        <i className="fas fa-book icon"></i> Books
      </NavLink>
      <NavLink
        to="/quan-ly-gia-han-sach"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        <i className="fas fa-book-open icon"></i> Extend Books
      </NavLink>
      <NavLink
        to="/quan-ly-dat-truoc-sach"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        <i className="fas fa-bookmark icon"></i> Reserve Books
      </NavLink>
      <NavLink
        to="/quan-ly-muon-sach"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        <i className="fas fa-hand-holding icon"></i> Borrow Books
      </NavLink>
      <NavLink
        to="#"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
        onClick={handleLogout} // Gọi hàm handleLogout khi nhấn Logout
      >
        <i className="fas fa-sign-out-alt icon"></i> Log out
      </NavLink>
    </div>
  );
};

export default NavBar;
