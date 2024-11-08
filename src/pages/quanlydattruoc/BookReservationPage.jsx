import React, { useEffect, useState } from 'react';
import '../../assets/css/bookreservationpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import {FaBook, FaUserPlus} from 'react-icons/fa'; // Biểu tượng thêm yêu cầu
import { jwtDecode } from 'jwt-decode'; // Đảm bảo jwtDecode được import chính xác

const BookReservationPage = () => {
    const [reservationData, setReservationData] = useState([]);

    useEffect(() => {
        const fetchReservationData = async () => {
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

                console.log("Đang lấy dữ liệu đặt trước sách...");
                const response = await fetch('http://localhost:8083/api/v1/admin/book-reservation', {
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
                console.log("Dữ liệu đặt trước sách đã lấy:", data);

                setReservationData(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu đặt trước sách:', error);
            }
        };

        fetchReservationData();
    }, []);


    return (
        <div className="book-reservation-page">
            <div className="book-reservation-page-container">
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
                    <table className="book-reservation-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Reservation ID</th>
                            <th>Creation Date</th>
                            <th>User</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reservationData.map((reservation, index) => (
                            <tr key={index}>
                                <td>{reservation.name}</td>
                                <td>{reservation.reservationId}</td>
                                <td>{reservation.creationDate || "N/A"}</td>
                                <td>{reservation.user || "N/A"}</td>
                                <td>{reservation.status || "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookReservationPage;
