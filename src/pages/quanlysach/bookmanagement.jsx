import React, { useEffect, useState } from 'react';
import '../../assets/css/bookmanagement.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import EditButton from '../../components/editbutton.jsx';
import DeleteButton from '../../components/deletebutton.jsx';
import { FaBook } from 'react-icons/fa';
import CreateBookForm from '../../components/createbookform.jsx';
import EditBookForm from '../../components/editbookform.jsx';
import DeleteBook from '../../services/book/deletebook.jsx';

const BookPage = () => {
    const [bookData, setBookData] = useState([]);
    const [showBookForm, setShowBookForm] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const toggleBookForm = () => setShowBookForm(!showBookForm);

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token không tìm thấy!');
                setErrorMessage('Token không tìm thấy! Vui lòng đăng nhập lại.');
                return;
            }

            const response = await fetch('http://localhost:8083/api/v1/admin/books', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Dữ liệu đã lấy:", result);
            setBookData(result.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu sách:', error);
            setErrorMessage('Lỗi khi lấy dữ liệu sách. Vui lòng thử lại sau.');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const handleEditClick = (bookId) => {
        setSelectedBookId(bookId);
        setShowEditForm(true);
    };

    const handleDeleteBook = async (bookId) => {
        try {
            await DeleteBook({ bookId, onDeleteSuccess: fetchBooks });
            setSuccessMessage('Sách đã được xóa thành công!');
            fetchBooks();
        } catch (error) {
            console.error('Lỗi khi xóa sách:', error);
            setErrorMessage('Lỗi khi xóa sách. Vui lòng thử lại.');
        }
    };

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
                            <AddButton label="ADD BOOK" Icon={FaBook} onClick={toggleBookForm} />
                        </div>
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <table className="book-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>ID</th>
                                <th>Book Name</th>
                                <th>Category</th>
                                <th>Crack</th>
                                <th>Publisher</th>
                                <th>Author</th>
                                <th>Current Quantity</th>
                                <th>Quantity</th>
                                <th>PostingDate</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookData.map((book, index) => (
                                <tr key={index}>
                                    <td>
                                        {book.image ? (
                                            <img
                                                src={`http://localhost:8083/uploads/${book.image}`}
                                                alt={book.bookName}
                                                onClick={() => handleImageClick(`http://localhost:8083/uploads/${book.image}`)} 
                                            />
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td>{book.bookId}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.categoryName || "N/A"}</td>
                                    <td>{book.crackId || "N/A"}</td>
                                    <td>{book.publisher || "N/A"}</td>
                                    <td>{book.authorName || "N/A"}</td>
                                    <td>{book.currentQuantity || "N/A"}</td>
                                    <td>{book.quantity || "N/A"}</td>
                                    <td>{book.postingDate || "N/A"}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <EditButton label="EDIT" onClick={() => handleEditClick(book.bookId)} />
                                            <DeleteButton label="DELETE" onClick={() => handleDeleteBook(book.bookId)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedImage && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content">
                        <img src={selectedImage} alt="Selected" className="modal-image" />
                    </div>
                </div>
            )}

            {showBookForm && (
                <div className="modal">
                    <div className="modal-content">
                        <CreateBookForm onClose={toggleBookForm} refreshBooks={fetchBooks} /> {/* Truyền refreshBooks vào */}
                    </div>
                </div>
            )}

            {showEditForm && selectedBookId && (
                <div className="modal">
                    <div className="modal-content">
                        <EditBookForm onClose={() => setShowEditForm(false)} bookId={selectedBookId} refreshBooks={fetchBooks}/> {/* Truyền refreshBooks vào */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookPage;
