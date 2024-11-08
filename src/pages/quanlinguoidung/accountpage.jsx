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
        const token = localStorage.getItem('accessToken');  // Lấy accessToken
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

        // Kiểm tra nếu có dữ liệu trong 'data'
        if (result.data) {
          setUserData(result.data); // Set dữ liệu từ trường 'data'
        } else {
          setUserData([]); // Trường hợp không có dữ liệu
        }
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
                <th>ID</th>
                <th>Tên</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Ngày sinh</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.phone || "N/A"}</td>  {/* Hiển thị "N/A" nếu không có số điện thoại */}
                  <td>{user.roleName || "N/A"}</td>  {/* Hiển thị vai trò người dùng */}
                  <td>{user.createdDate || "N/A"}</td>  {/* Hiển thị ngày tạo */}
                  <td>{user.dob || "N/A"}</td>  {/* Hiển thị ngày sinh hoặc "N/A" nếu không có */}
                  <td>{user.status || "N/A"}</td>  {/* Hiển thị trạng thái người dùng */}
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
