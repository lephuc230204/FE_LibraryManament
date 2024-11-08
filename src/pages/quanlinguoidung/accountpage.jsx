import React, { useEffect, useState } from 'react';
import '../../assets/css/accountpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import { FaUserPlus } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode

const AccountPage = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken);
            if (decodedToken.role !== 'ROLE_ADMIN') {
              alert('Bạn không có quyền truy cập vào trang này!');
              return;
            }
          } catch (error) {
            console.error('Lỗi khi giải mã token:', error);
            return;
          }
        } else {
          console.error('Không tìm thấy token trong localStorage!');
          return;
        }
  
        console.log("Đang lấy dữ liệu...");
        const response = await fetch('http://localhost:8083/api/v1/admin/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          console.error(`Lỗi trong phản hồi mạng: ${response.status} - ${response.statusText}`);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log("Dữ liệu đã lấy:", result);
  
        // Set userData to result.data if result has the structure { data: [...] }
        setUserData(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };
  
    fetchTableData();
  }, []);
  

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
              <AddButton label="ADD MEMBER" Icon={FaUserPlus} />
            </div>
          </div>
          <table className="account-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>ID</th>
                <th>CardID</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Mật khẩu</th>
                <th>Ngày sinh</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.id}</td>
                  <td>{user.cardID || "N/A"}</td> {/* Check if cardID exists or show "N/A" */}
                  <td>{user.email}</td>
                  <td>{user.phone || "N/A"}</td>  {/* Check if phone exists or show "N/A" */}
                  <td>{user.password || "N/A"}</td>  {/* Display "N/A" if password isn't available */}
                  <td>{user.dob || "N/A"}</td>  {/* Use createdDate if dob is null */}
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
