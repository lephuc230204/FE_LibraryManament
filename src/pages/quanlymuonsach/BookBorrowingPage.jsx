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
import AddBorrowingForm from '../../components/addborrowingform';
import ReturnBook from '../../components/returnbook.jsx';
import PostNotificationButton from '../../components/PostNotificationButton.jsx';
import EditBorrowingForm from '../../components/editborrowingform.jsx';
const BookBorrowingPage = () => {
    const [borrowingData, setBorrowingData] = useState([]); // State to store borrowing data
    const [showAddForm, setShowAddForm] = useState(false); // State to toggle Add Form visibility
    const [showEditForm, setShowEditForm] = useState(false); // State to toggle Edit Form visibility
    const [editData, setEditData] = useState(null); // Data for editing

    // Fetch borrowing data when the component is mounted
    useEffect(() => {
        fetchBorrowingData();
    }, []);

    const fetchBorrowingData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Không tìm thấy token trong localStorage!');
            
            console.log("Đang lấy danh sách mượn sách...");
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
            setBorrowingData(result.data?.content || []);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    const handleEditClick = async (id) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Không tìm thấy token trong localStorage!');
            
            console.log(`Đang lấy thông tin cho bản ghi với ID: ${id}`);
            const response = await fetch(`http://localhost:8083/api/v1/admin/book-lending/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.error(`Lỗi khi lấy thông tin bản ghi: ${response.status} - ${response.statusText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('dang lay du lieu',result)
            setEditData(result.data); // Lưu thông tin bản ghi
            setShowEditForm(true); // Hiển thị form chỉnh sửa
        } catch (error) {
            console.error('Lỗi khi gọi API GET:', error);
        }
    };

    const handleEditSubmit = async (updatedData) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Không tìm thấy token trong localStorage!');
        
            // Ensure you are passing the correct lendingId from the updatedData
            const { lendingId } = editData; // Assuming editData contains lendingId
            console.log("Đang cập nhật dữ liệu...");
        
            const response = await fetch(`http://localhost:8083/api/v1/admin/book-lending/update/${lendingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData) // Use updatedData here
            });
            const result = await response.json();
            if (result.status === 404){
                alert(result.message);
            }
            if (!response.ok) {
                console.error(`Lỗi khi chỉnh sửa: ${response.status} - ${response.statusText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            console.log('Chỉnh sửa thành công!');
            setShowEditForm(false); // Đóng form chỉnh sửa
            fetchBorrowingData(); // Làm mới danh sách
        } catch (error) {
            console.error('Lỗi khi gọi API PUT:', error);
        }
    };
    
    

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa không?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Không tìm thấy token trong localStorage!');
            
            console.log("Đang xóa...");
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
            fetchBorrowingData(); // Làm mới danh sách
        } catch (error) {
            console.error('Lỗi khi gọi API DELETE:', error);
        }
    };

    return (
        <div className="borrowing-page">
            <div className="borrowing-page-container">
                <NavBar />
                <div className="main-content">
                    <div className="top-bar">
                        <div className="top-row">
                            <SearchBar />
                            <PostNotificationButton />
                            <SortBy />
                            <ReturnBook refreshBorrowingList={fetchBorrowingData} />
                        </div>
                        <div className="add-button">
                            <AddButton label="ADD REQUEST" Icon={FaBook} onClick={() => setShowAddForm(true)} />
                        </div>
                    </div>

                    {showAddForm && (
                        <div className="modal-overlay">
                            <AddBorrowingForm onClose={() => setShowAddForm(false)} refreshBorrowingList={fetchBorrowingData} />
                        </div>
                    )}

                    {showEditForm && editData && (
                        <div className="modal-overlay">
                            <EditBorrowingForm
                                data={editData}
                                onSubmit={handleEditSubmit}
                                onClose={() => setShowEditForm(false)}
                            />
                        </div>
                    )}

                    <table className="borrowing-table">
                        <thead>
                            <tr>
                                <th>Borrowing ID</th>
                                <th>Book ID</th>
                                <th>User</th>
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
                                    <td>{bookBorrow.email}</td>
                                    <td>{bookBorrow.staffid}</td>
                                    <td>{bookBorrow.dueDate}</td>
                                    <td>{bookBorrow.returnDate || "SÁCH CHƯA TRẢ"}</td>
                                    <td>{bookBorrow.creationDate}</td>
                                    <td>
                                        <EditButton label="EDIT" onClick={() => handleEditClick(bookBorrow.lendingId)} />
                                    </td>
                                    <td>
                                        <DeleteButton label="DELETE" onClick={() => handleDelete(bookBorrow.lendingId)} />
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
