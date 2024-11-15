import React, { useEffect, useState } from 'react';
import '../../assets/css/accountpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import { FaUserPlus } from 'react-icons/fa';
import DeleteButton from '../../components/deletebutton.jsx';
import EditButton from '../../components/editbutton.jsx';
import RestoreButton from '../../components/restorebutton.jsx';
import CreateUserForm from '../../components/createuserform.jsx';
import EditUserForm from '../../components/edituserform.jsx';
import { deleteUser } from '../../services/UserService';
import { restoreUser } from '../../services/user/restoreUser.jsx';



const AccountPage = () => {
  const [userData, setUserData] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // trang hiện tại
  const [size, setSize] = useState(13); // kích thước trang
  const [totalPages, setTotalPages] = useState(1); // tổng số trang

  const fetchUsers = async (page, size) => {
    const token = localStorage.getItem('accessToken');
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8083/api/v1/admin/users?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUserData(result.data.content || []);
        setTotalPages(result.data.totalPages || 1); // cập nhật tổng số trang
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, size);
  }, [page, size]);

  const toggleCreateForm = () => {
    setShowCreateForm(prevState => !prevState);
  };

  const toggleEditForm = (userId) => {
    setSelectedUserId(userId);
    setShowEditForm(true);
  };

  const refreshUserList = () => {
    fetchUsers(page, size);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      refreshUserList();
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
    }
  };
  const handleRestore = async (userId) => {
    try {
      await restoreUser(userId);
      refreshUserList();
    } catch (error) {
      console.error('Lỗi khi khôi phục người dùng:', error);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const generatePageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
    return pages;
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
              <AddButton label="ADD MEMBER" Icon={FaUserPlus} onClick={toggleCreateForm} />
            </div>
          </div>

          {showCreateForm && <CreateUserForm onClose={toggleCreateForm} refreshUsers={refreshUserList} />}
          {showEditForm && <EditUserForm userId={selectedUserId} onClose={() => setShowEditForm(false)} refreshUsers={refreshUserList} />}

          <table className="account-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Ngày sinh</th>
                <th>Trạng thái</th>
                <th>Thẻ thư viện</th>
                <th>Ngày tạo</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>{user.phone || "N/A"}</td>
                  <td>{user.roleName || "N/A"}</td>
                  <td>{user.dob || "N/A"}</td>
                  <td>{user.status || "N/A"}</td>
                  <td>{user.cardLibrary || "N/A"}</td>
                  <td>{user.createdDate || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <EditButton label="EDIT" onClick={() => toggleEditForm(user.id)} />
                      <RestoreButton label="RESTORE" onClick={() => handleRestore(user.id)}/>
                      <DeleteButton label="DELETE" onClick={() => handleDelete(user.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => setPage(0)} disabled={page === 0}>{"<<"}</button>
            <button onClick={handlePreviousPage} disabled={page === 0}>{"<"}</button>
            {generatePageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={page === pageNumber ? 'active' : ''}
              >
                {pageNumber + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={page === totalPages - 1}>{">"}</button>
            <button onClick={() => setPage(totalPages - 1)} disabled={page === totalPages - 1}>{">>"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
