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
      <NavLink to="/account" activeClassName="active" className="nav-item">
        <i className="fas fa-user icon"></i> Account
      </NavLink>
      <NavLink to="/book" activeClassName="active" className="nav-item">
        <i className="fas fa-book icon"></i> Book
      </NavLink>
      <NavLink to="/extend-book" activeClassName="active" className="nav-item">
        <i className="fas fa-book-open icon"></i> Extend Book
      </NavLink>
      <NavLink to="/reserve-book" activeClassName="active" className="nav-item">
        <i className="fas fa-bookmark icon"></i> Reserve Book
      </NavLink>
      <NavLink to="/borrow-book" activeClassName="active" className="nav-item">
        <i className="fas fa-hand-holding icon"></i> Borrow Book
      </NavLink>
      <NavLink to="/logout" activeClassName="active" className="nav-item">
        <i className="fas fa-sign-out-alt icon"></i> Log out
      </NavLink>
    </div>
  );
};

export default NavBar;
