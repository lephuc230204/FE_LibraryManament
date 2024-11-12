import React, { useEffect, useState } from 'react';
import '../../assets/css/accountpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import { FaUserPlus } from 'react-icons/fa';
import DeleteButton from '../../components/deletebutton.jsx';
import EditButton from '../../components/editbutton.jsx';
import CreateUserForm from '../../components/createuserform.jsx'; // Import the form component

const AccountPage = () => {
  const [userData, setUserData] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false); // State to control the form visibility

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const token = localStorage.getItem('accessToken');  // Lấy accessToken
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

  // Function to toggle form visibility
  const toggleCreateForm = () => {
    setShowCreateForm(prevState => !prevState); // Toggle the form visibility
  };

  // Function to refresh user list after creating a new user
  const refreshUserList = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch('http://localhost:8083/api/v1/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.data) {
        setUserData(result.data);
      } else {
        setUserData([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
              {/* Toggle visibility of the CreateUserForm on button click */}
              <AddButton label="ADD MEMBER" Icon={FaUserPlus} onClick={toggleCreateForm} />
            </div>
          </div>

          {/* Conditionally render CreateUserForm when showCreateForm is true */}
          {showCreateForm && <CreateUserForm onClose={toggleCreateForm} refreshUsers={refreshUserList} />}

          <table className="account-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th> {/* Thêm cột Email */}
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Ngày sinh</th>
                <th>Trạng thái</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email || "N/A"}</td>  {/* Hiển thị email */}
                  <td>{user.phone || "N/A"}</td>  {/* Hiển thị số điện thoại */}
                  <td>{user.roleName || "N/A"}</td>  {/* Hiển thị vai trò */}
                  <td>{user.createdDate || "N/A"}</td>  {/* Hiển thị ngày tạo */}
                  <td>{user.dob || "N/A"}</td>  {/* Hiển thị ngày sinh */}
                  <td>{user.status || "N/A"}</td>  {/* Hiển thị trạng thái */}
                  <td>
                    <div className="action-buttons">
                      <EditButton label="EDIT" />
                      <DeleteButton label="DELETE" />
                    </div>
                  </td>
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
