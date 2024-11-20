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
            }else {
                alert('Người dùng đã trả sách hoặc chưa mượn sách');
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

            {bookLendingDetails && (
                <div className="modal-overlay">
                    <div className="return-form">
                        <h3>Thông tin sách đã trả:</h3>
                        <div className="form-group">
                            <label>Lending ID:</label>
                            <div className="form-input">{bookLendingDetails.lendingId}</div>
                        </div>
                        <div className="form-group">
                            <label>Book ID:</label>
                            <div className="form-input">{bookLendingDetails.bookId}</div>
                        </div>
                        <div className="form-group">
                            <label>Tên sách:</label>
                            <div className="form-input">{bookLendingDetails.bookName}</div>
                        </div>
                        <div className="form-group">
                            <label>Tác giả:</label>
                            <div className="form-input">{bookLendingDetails.author}</div>
                        </div>
                        <div className="form-group">
                            <label>Ngày hết hạn:</label>
                            <div className="form-input">{new Date(bookLendingDetails.dueDate).toLocaleDateString()}</div>
                        </div>
                        <div className="form-group">
                            <label>Ngày trả:</label>
                            <div className="form-input">{bookLendingDetails.returnDate ? new Date(bookLendingDetails.returnDate).toLocaleDateString() : "Chưa trả"}</div>
                        </div>
                        <div className="form-group">
                            <label>User ID:</label>
                            <div className="form-input">{bookLendingDetails.userid}</div>
                        </div>
                        <div className="form-group">
                            <label>Staff ID:</label>
                            <div className="form-input">{bookLendingDetails.staffid}</div>
                        </div>
                        <div className="form-group">
                            <label>Hình ảnh:</label>
                            <div className="book-image">
                                <img src={`http://localhost:8083/uploads/${bookLendingDetails.image}`} alt={bookLendingDetails.bookName} width="150" />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="close-modal" onClick={() => setBookLendingDetails(null)}>Đóng</button>
                            <button className="confirm-return" onClick={handleConfirmReturn}>Confirm Return</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnBook;
