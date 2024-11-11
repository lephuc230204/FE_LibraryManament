import React, { useEffect, useState } from 'react';
import '../../assets/css/booklendingpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import EditButton from '../../components/editbutton.jsx';
import DeleteButton from '../../components/deletebutton.jsx';
import {FaBook} from 'react-icons/fa'; // Biểu tượng thêm yêu cầu
import { jwtDecode } from 'jwt-decode'; // Đảm bảo jwtDecode được import chính xác

const BookExtensionPage = () => {
    const [BookExtensionData, setBookExtensionData] = useState([]);

    useEffect(() => {
        const fetchBookExtensionData = async () => {
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
            const response = await fetch('http://localhost:8083/api/v1/admin/book-renewal/getall', {
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
                setBookExtensionData(result.data); // Set dữ liệu từ trường 'data'
            } else {
                setBookExtensionData([]); // Trường hợp không có dữ liệu
            }
          } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
          }
        };
    
        fetchBookExtensionData();
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
                            <th>RenewalId</th>
                            <th>LendinngId</th>
                            <th>BookName</th>
                            <th>Renewal Date</th>
                            <th>Status</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {BookExtensionData.map((extension, index) => (
                            <tr key={index}>
                                <td>{extension.id}</td>
                                <td>{extension.bookLendingId || "N/A"}</td>
                                <td>{extension.bookName}</td>
                                <td>{extension.renewalDate || "N/A"}</td>
                                <td>{extension.status || "N/A"}</td>
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

export default BookExtensionPage;
