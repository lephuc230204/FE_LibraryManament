import React, { useEffect, useState } from 'react';
import '../../assets/css/borrowingpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import {FaBook,} from 'react-icons/fa';

const BookBorrowingPage = () => {
    const [borrowingData, setBorrowingData] = useState([]);

    useEffect(() => {
        const fetchBorrowingData = async () => {
            try {
                const response = await fetch('http://localhost:8083/api/v1/admin/borrowings');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setBorrowingData(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching borrowing data:', error);
            }
        };

        fetchBorrowingData();
    }, []);

    return (
        <div className="borrowing-page">
            <div className="borrowing-page-container">
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
                    <table className="borrowing-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Book ID</th>
                            <th>Creation Date</th>
                            <th>Due Date</th>
                            <th>Return Date</th>
                            <th>User</th>
                            <th>Staff</th>
                        </tr>
                        </thead>
                        <tbody>
                        {borrowingData.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.id}</td>
                                <td>{entry.bookId}</td>
                                <td>{entry.creationDate}</td>
                                <td>{entry.dueDate}</td>
                                <td>{entry.returnDate || "N/A"}</td>
                                <td>{entry.user}</td>
                                <td>{entry.staff}</td>
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
