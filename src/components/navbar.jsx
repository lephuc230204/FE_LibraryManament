import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/css/navbar.css';
import logo from '../assets/images/logo.png'; // Đường dẫn đến hình ảnh logo của bạn

const NavBar = () => {
  return (
    <div className="nav-bar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <NavLink
        to="/user-management"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')} // Dùng ternary operator để gán class
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
        to="/extend-book-management"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        <i className="fas fa-book-open icon"></i> Extend Books
      </NavLink>
      <NavLink
        to="/reserve-book-management"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        <i className="fas fa-bookmark icon"></i> Reserve Books
      </NavLink>
      <NavLink
        to="/borrow-book-management"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        <i className="fas fa-hand-holding icon"></i> Borrow Books
      </NavLink>
      <NavLink
        to="/logout"
        className={({ isActive }) => (isActive ? 'active nav-item' : 'nav-item')}
      >
        <i className="fas fa-sign-out-alt icon"></i> Log out
      </NavLink>
    </div>
  );
};

export default NavBar;
