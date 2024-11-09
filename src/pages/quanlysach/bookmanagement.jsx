import React, { useEffect, useState } from 'react';
import '../../assets/css/bookmanagement.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import { FaBook } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode

const BookPage = () => {
    const [bookData, setBookData] = useState([]);

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

                console.log("Đang lấy dữ liệu sách...");
                const response = await fetch('http://localhost:8083/api/v1/admin/books', {
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

                const data = await response.json();
                console.log("Dữ liệu sách đã lấy:", data);

                // Set bookData only if `data` is an array
                setBookData(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sách:', error);
            }
        };

        fetchTableData();
    }, []);


    return (
        <div className="book-page">
            <div className="book-page-container">
                <NavBar />
                <div className="main-content">
                    <div className="top-bar">
                        <div className="top-row">
                            <SearchBar />
                            <SortBy />
                        </div>
                        <div className="add-button">
                            <AddButton label="ADD BOOK" Icon={FaBook} />
                        </div>
                    </div>
                    <table className="book-table">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>ID</th>
                            <th>Book Name</th>
                            <th>Category</th>
                            <th>Posting Date</th>
                            <th>Crack</th>
                            <th>Publisher</th>
                            <th>Current Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookData.map((book, index) => (
                            <tr key={index}>
                                <td>{book.image || "N/A"}</td>
                                <td>{book.id}</td>
                                <td>{book.name}</td>
                                <td>{book.category || "N/A"}</td>
                                <td>{book.postingDate || "N/A"}</td>
                                <td>{book.crack || "N/A"}</td>
                                <td>{book.publisher || "N/A"}</td>
                                <td>{book.currentQuantity || "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookPage;
