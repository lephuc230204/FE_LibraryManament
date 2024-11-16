import React, { useState } from 'react';
import '../assets/css/addborrowingform.css';

const AddBorrowingForm = ({ onClose, refreshBorrowingList }) => {
    const [bookId, setBookId] = useState('');
    const [userId, setUserId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Thêm state để lưu thông báo lỗi

    // Hàm xử lý khi form được submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage

            if (!token) {
                alert('Bạn cần đăng nhập trước khi thêm mượn sách!');
                return;
            }

            // Gọi API để thêm mượn sách
            const response = await fetch('http://localhost:8083/api/v1/admin/book-lending/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookId, dueDate, email: userId }), // Gửi dữ liệu trong body
            });

            const responseData = await response.json(); // Lấy dữ liệu trả về từ API

            // Kiểm tra nếu API trả về lỗi status 404
            if (responseData.status === 404) {
                setErrorMessage(responseData.message || 'Không tìm thấy thông tin.');
                throw new Error(responseData.message || 'Không tìm thấy thông tin.');
            }

            // Kiểm tra nếu API không thành công, ví dụ mã lỗi khác
            if (!response.ok) {
                setErrorMessage('Lỗi khi tạo BorrowingBook.');
                throw new Error('Lỗi khi tạo BorrowingBook.');
            }

            alert('Thêm mượn sách thành công!');
            refreshBorrowingList();  // Refresh danh sách sau khi thêm thành công
            onClose();  // Đóng form sau khi hoàn thành
        } catch (error) {
            console.error('Lỗi khi thêm BorrowingBook:', error);
        }
    };

    return (
        <div className="add-borrowing-form">
            <h2>Thêm Mượn Sách</h2>
            <form onSubmit={handleSubmit}>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Hiển thị thông báo lỗi nếu có */}
                <div>
                    <label>Book ID:</label>
                    <input
                        type="text"
                        value={bookId}
                        onChange={(e) => setBookId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>User ID (Email):</label>
                    <input
                        type="email"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="submit">Thêm</button>
                    <button type="button" onClick={onClose}>Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default AddBorrowingForm;
