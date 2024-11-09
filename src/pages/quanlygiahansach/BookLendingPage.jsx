import React, { useEffect, useState } from 'react';
import '../../assets/css/booklendingpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import {FaBook, FaUserPlus} from 'react-icons/fa'; // Biểu tượng thêm yêu cầu
import { jwtDecode } from 'jwt-decode'; // Đảm bảo jwtDecode được import chính xác

const BookLendingPage = () => {
    const [lendingData, setLendingData] = useState([]);

    useEffect(() => {
        const fetchLendingData = async () => {
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

                console.log("Đang lấy dữ liệu mượn sách...");
                const response = await fetch('http://localhost:8083/api/v1/admin/book-lending', {
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
                console.log("Dữ liệu mượn sách đã lấy:", data);

                setLendingData(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu mượn sách:', error);
            }
        };

        fetchLendingData();
    }, []);


    return (
        <div className="book-lending-page">
            <div className="book-lending-page-container">
                <NavBar />
                <div className="main-content">
                    <div className="top-bar">
                        <div className="top-row">
                            <SearchBar />
                            <SortBy />
                        </div>
                        <div className="add-button">
                            <AddButton label="ADD REQUEST" Icon={FaBook} />
                        </div>
                    </div>
                    <table className="book-lending-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Book Lending</th>
                            <th>Renewal Date</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lendingData.map((lending, index) => (
                            <tr key={index}>
                                <td>{lending.name}</td>
                                <td>{lending.id}</td>
                                <td>{lending.bookLending || "N/A"}</td>
                                <td>{lending.renewalDate || "N/A"}</td>
                                <td>{lending.status || "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookLendingPage;
