import React, { useState } from 'react';
import '../assets/css/returnbook.css';

const ReturnBook = ({ refreshBorrowingList }) => {
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [formData, setFormData] = useState({
        bookId: '',
        email: ''
    });
    const [bookLendingDetails, setBookLendingDetails] = useState(null); // State để lưu thông tin sách mượn

    const handleReturnBookClick = () => {
        setShowReturnForm(true); // Hiển thị form
    };

    const handleCloseReturnForm = () => {
        setShowReturnForm(false); // Đóng form
        setFormData({ bookId: '', email: '' }); // Reset form
        setBookLendingDetails(null); // Reset thông tin sách
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitReturnForm = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Không tìm thấy token!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8083/api/v1/admin/book-lending/get-email-booId', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                console.error(`Lỗi khi trả sách: ${response.status} - ${response.statusText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Kết quả trả về từ API:", result); // Kiểm tra dữ liệu trả về từ API

            if (result.status === 200) {
                setBookLendingDetails(result.data); // Lưu thông tin sách trả về vào state
                alert('Trả sách thành công!');
            }

            // Không đóng form ngay lập tức, giữ lại modal thông tin sách đã trả
            refreshBorrowingList(); // Làm mới danh sách mượn sách
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            alert('Đã xảy ra lỗi khi trả sách!');
        }
    };

    // Hàm xác nhận trả sách
    const handleConfirmReturn = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Không tìm thấy token!');
            return;
        }

        if (bookLendingDetails && bookLendingDetails.lendingId) {
            try {
                const response = await fetch(`http://localhost:8083/api/v1/admin/return-book/${bookLendingDetails.lendingId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    console.error(`Lỗi khi trả sách: ${response.status} - ${response.statusText}`);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log("Kết quả trả về từ API:", result); // Kiểm tra dữ liệu trả về từ API

                if (result.status === 200) {
                    alert('Trả sách thành công!');
                    setBookLendingDetails(null); // Reset thông tin sách sau khi trả thành công
                    refreshBorrowingList(); // Làm mới danh sách mượn sách
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                alert('Đã xảy ra lỗi khi trả sách!');
            }
        }
    };

    return (
        <div className="return-book-container">
            {/* Nút Return Book */}
            <button className="return-button" onClick={handleReturnBookClick}>
                Return Book
            </button>

            {/* Form Popup */}
            {showReturnForm && (
                <div className="modal-overlay">
                    <div className="return-form">
                        <h3>Return Book</h3>
                        <form onSubmit={handleSubmitReturnForm}>
                            <div className="form-group">
                                <label htmlFor="bookId">Book ID:</label>
                                <input
                                    type="number"
                                    id="bookId"
                                    name="bookId"
                                    value={formData.bookId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={handleCloseReturnForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hiển thị thông tin sách đã mượn trong modal */}
            {bookLendingDetails && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Thông tin sách đã trả:</h4>
                        <div className="book-info">
                            <div><strong>Lending ID:</strong> {bookLendingDetails.lendingId}</div>
                            <div><strong>Book ID:</strong> {bookLendingDetails.bookId}</div>
                            <div><strong>Tên sách:</strong> {bookLendingDetails.bookName}</div>
                            <div><strong>Tác giả:</strong> {bookLendingDetails.author}</div>
                            <div><strong>Ngày tạo:</strong> {new Date(bookLendingDetails.creationDate).toLocaleDateString()}</div>
                            <div><strong>Ngày hết hạn:</strong> {new Date(bookLendingDetails.dueDate).toLocaleDateString()}</div>
                            <div><strong>Ngày trả:</strong> {bookLendingDetails.returnDate ? new Date(bookLendingDetails.returnDate).toLocaleDateString() : "Chưa trả"}</div>
                            <div><strong>User ID:</strong> {bookLendingDetails.userid}</div>
                            <div><strong>Staff ID:</strong> {bookLendingDetails.staffid}</div>
                        </div>
                        <div className="book-image">
                            <strong>Hình ảnh:</strong>
                            <img src={`http://localhost:8083/uploads/${bookLendingDetails.image}`} alt={bookLendingDetails.bookName} width="150" />
                        </div>
                        <button className="close-modal" onClick={() => setBookLendingDetails(null)}>Đóng</button>
                        <button className="confirm-return" onClick={handleConfirmReturn}>Confirm Return</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnBook;
