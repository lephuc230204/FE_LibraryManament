import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/accountpage.css';

import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import { FaUserPlus } from 'react-icons/fa';

const AccountPage = () => {
  const [userData, setUserData] = useState([]); // Dữ liệu người dùng
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage
        
        if (!token) {
          throw new Error('No token found');
        }
      
        const response = await axios.get('http://localhost:8083/api/v1/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`, // Thêm token vào header
            'Content-Type': 'application/json',
          },
        });
      
        setUserData(response.data.data);  // Cập nhật dữ liệu
      } catch (error) {
        setError(error.message || 'Error fetching data'); // Xử lý lỗi
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
    
    fetchTableData();
  }, []);

  // Nếu đang loading, hiển thị loader
  if (loading) {
    return (
      <div className="account-page">
        <div className="account-page-container">
          <NavBar />
          <div className="main-content">
            <p>Loading...</p> {/* Hiển thị loading */}
          </div>
        </div>
      </div>
    );
  }

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="account-page">
        <div className="account-page-container">
          <NavBar />
          <div className="main-content">
            <p className="error-message">{`Error: ${error}`}</p> {/* Hiển thị thông báo lỗi */}
          </div>
        </div>
      </div>
    );
  }

  // Nếu không có dữ liệu
  if (userData.length === 0) {
    return (
      <div className="account-page">
        <div className="account-page-container">
          <NavBar />
          <div className="main-content">
            <p>No user data available</p> {/* Thông báo nếu không có dữ liệu người dùng */}
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị bảng nếu có dữ liệu
  return (
    <div className="account-page">
      <div className="account-page-container">
        <NavBar />
        <div className="main-content">
          <div className="top-bar">
            <div className="top-row">
              <SearchBar />
              <SortBy />
            </div>
            <div className="add-button">
              <AddButton label="Add member" Icon={FaUserPlus} />
            </div>
          </div>
          <table className="account-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr key={index}>
                  <td>{user.username || 'N/A'}</td>
                  <td>{user.id || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{user.roleName || 'N/A'}</td>
                  <td>{user.createdDate ? new Date(user.createdDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
