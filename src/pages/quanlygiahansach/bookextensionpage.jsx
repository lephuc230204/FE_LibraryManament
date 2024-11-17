import React, { useEffect, useState } from 'react';
import EditBookExtension from '../../services/extensionbook/editextensionbook.jsx';
import '../../assets/css/bookextensionpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import EditButton from '../../components/editbutton.jsx';
import DeleteButton from '../../components/deletebutton.jsx';
import DeleteBookExtension from '../../services/extensionbook/deleteextensionbook.jsx';

const BookExtensionPage = () => {
    const [bookExtensionData, setBookExtensionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(13);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedExtensionId, setSelectedExtensionId] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    // Extract the data-fetching function here
    const fetchBookExtensionData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Không tìm thấy token trong localStorage!');

            const response = await fetch(
                `http://localhost:8083/api/v1/admin/book-renewal?page=${page}&size=${size}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();
            if (result.data) {
                setBookExtensionData(result.data.content || []);
                setTotalPages(result.data.totalPages || 1);
            } else {
                setBookExtensionData([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Call the function within useEffect
    useEffect(() => {
        fetchBookExtensionData();
    }, [page, size]);

    const handleEditBookExtension = (id) => {
        setSelectedExtensionId(id);
        setShowEditForm(true);
    };
    const handleDeleteBookExtension = async (id) => {
      try {
          await DeleteBookExtension({ id, onDeleteSuccess });
      } catch (error) {
          console.error('Lỗi khi xóa đặt sách:', error);
      }
    };
    const onDeleteSuccess = () => {
      fetchBookExtensionData(); // Fetch the updated reservation data
  };
    const handleCloseEditForm = () => {
        setSelectedExtensionId(null);
        setShowEditForm(false);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const generatePageNumbers = () => {
        return Array.from({ length: totalPages }, (_, i) => i);
    };

    const refreshExtensions = () => {
        setLoading(true);
        setError(null);
        fetchBookExtensionData();  // Now this function is defined and accessible
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error-message">Lỗi: {error}</div>;
    }

    return (
        <div className="book-extension-page">
            <div className="book-extension-page-container">
                <NavBar />
                <div className="main-content">
                    <div className="top-bar">
                        <div className="top-row">
                            <SearchBar />
                            <SortBy />
                        </div>
                    </div>
                    <table className="book-extension-table">
                        <thead>
                            <tr>
                                <th>RenewalId</th>
                                <th>LendingId</th>
                                <th>BookName</th>
                                <th>Renewal Date</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookExtensionData.length > 0 ? (
                                bookExtensionData.map((extension, index) => (
                                    <tr key={index}>
                                        <td>{extension.id}</td>
                                        <td>{extension.bookLendingId || 'N/A'}</td>
                                        <td>{extension.bookName}</td>
                                        <td>{extension.renewalDate || 'N/A'}</td>
                                        <td>{extension.status || 'N/A'}</td>
                                        <td>
                                            <div className="action-buttons">
                                              <EditButton
                                                    label="EDIT"
                                                    onClick={() => handleEditBookExtension(extension.id)}
                                                />
                                              <DeleteButton label="DELETE" onClick={() => handleDeleteBookExtension(extension.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">Không có dữ liệu.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={() => setPage(0)} disabled={page === 0}>
                            {"<<"}
                        </button>
                        <button onClick={handlePreviousPage} disabled={page === 0}>
                            {"<"}
                        </button>
                        {generatePageNumbers().map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={page === pageNumber ? 'active' : ''}
                            >
                                {pageNumber + 1}
                            </button>
                        ))}
                        <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                            {">"}
                        </button>
                        <button onClick={() => setPage(totalPages - 1)} disabled={page === totalPages - 1}>
                            {">>"}
                        </button>
                    </div>
                </div>
            </div>

            {showEditForm && selectedExtensionId && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-modal" onClick={handleCloseEditForm}>
                            &times;
                        </button>
                        <EditBookExtension 
                          id={selectedExtensionId} 
                          onClose={handleCloseEditForm}  // Truyền hàm đóng form
                          refreshExtensions={refreshExtensions}  // Truyền hàm làm mới dữ liệu
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookExtensionPage;
