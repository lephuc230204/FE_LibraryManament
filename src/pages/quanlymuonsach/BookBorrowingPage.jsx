import React, { useEffect, useState } from 'react';
import '../../assets/css/borrowingpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import EditButton from '../../components/editbutton.jsx';
import DeleteButton from '../../components/deletebutton.jsx';
import { FaBook } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode
import AddBorrowingForm from '../../components/addborrowingform'; // Import the AddBorrowingForm component
import ReturnBook from '../../components/returnbook.jsx';

const BookBorrowingPage = () => {
    const [borrowingData, setBorrowingData] = useState([]); // State to store borrowing data
    const [showAddForm, setShowAddForm] = useState(false); // State to toggle the form visibility

    // Fetch borrowing data when the component is mounted
    useEffect(() => {
        const fetchBorrowingData = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // Lấy accessToken
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
                const response = await fetch('http://localhost:8083/api/v1/admin/book-lending/getall?page=0&size=10', {
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

                // Cập nhật dữ liệu vào state
                if (result.data && result.data.content) {
                    setBorrowingData(result.data.content); // Set dữ liệu từ trường 'content'
                } else {
                    setBorrowingData([]); // Trường hợp không có dữ liệu
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        fetchBorrowingData();
    }, []); // Chỉ chạy một lần khi component được mount

    const handleAddRequestClick = () => {
        setShowAddForm(true); // Hiển thị form khi nhấn nút "Add Request"
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false); // Đóng form khi hủy
    };

    const handleDelete = async (id) => {
      // Hiển thị hộp thoại xác nhận
      const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa không?');
      if (!isConfirmed) {
          return; // Nếu người dùng chọn "Cancel", dừng lại không thực hiện hành động xóa
      }
  
      const token = localStorage.getItem('accessToken'); // Lấy accessToken
      if (!token) {
          console.error('Không tìm thấy token trong localStorage!');
          return;
      }
  
      try {
          const response = await fetch(`http://localhost:8083/api/v1/admin/book-lending/delete/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });
  
          if (!response.ok) {
              console.error(`Lỗi khi xóa: ${response.status} - ${response.statusText}`);
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          console.log("Xóa thành công!");
          // Cập nhật lại danh sách mượn sách sau khi xóa
          refreshBorrowingList();
      } catch (error) {
          console.error('Lỗi khi gọi API DELETE:', error);
      }
  };

    const refreshBorrowingList = () => {
        // Refresh the borrowing list after adding a new borrowing request
        const fetchBorrowingData = async () => {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:8083/api/v1/admin/book-lending/getall?page=0&size=10', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (result.data && result.data.content) {
                setBorrowingData(result.data.content);
            } else {
                setBorrowingData([]);
            }
        };
        fetchBorrowingData();
    };

    return (
        <div className="borrowing-page">
            <div className="borrowing-page-container">
                <NavBar />
                <div className="main-content">
                    <div className="top-bar">
                        <div className="top-row">
                            <SearchBar />
                            <SortBy />
                            <ReturnBook refreshBorrowingList={refreshBorrowingList} /> {/* Thêm ReturnBook */}
                        </div>
                        <div className="add-button">
                            <AddButton label="ADD REQUEST" Icon={FaBook} onClick={handleAddRequestClick} />
                        </div>
                    </div>

                    {/* Hiển thị form AddBorrowingForm khi showAddForm là true */}
                    {showAddForm && (
                        <div className="modal-overlay">
                            <AddBorrowingForm
                                onClose={handleCloseAddForm}
                                refreshBorrowingList={refreshBorrowingList}
                            />
                        </div>
                    )}

                    <table className="borrowing-table">
                        <thead>
                            <tr>
                                <th>Borrowing ID</th>
                                <th>Book ID</th>
                                <th>User ID</th>
                                <th>Staff ID</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Creation Date</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowingData.map((bookBorrow, index) => (
                                <tr key={index}>
                                    <td>{bookBorrow.lendingId}</td>
                                    <td>{bookBorrow.bookId}</td>
                                    <td>{bookBorrow.userid}</td>
                                    <td>{bookBorrow.staffid}</td>
                                    <td>{bookBorrow.dueDate}</td>
                                    <td>{bookBorrow.returnDate ? bookBorrow.returnDate : "SÁCH CHƯA TRẢ"}</td>
                                    <td>{bookBorrow.creationDate}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <EditButton label="EDIT" />
                                            <DeleteButton label="DELETE" onClick={() => handleDelete(bookBorrow.lendingId)} />
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

export default BookBorrowingPage;
