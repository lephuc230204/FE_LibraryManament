import React, { useState } from 'react';
import '../assets/css/addborrowingform.css';

const AddBorrowingForm = ({ onClose, refreshBorrowingList }) => {
    const [bookId, setBookId] = useState('');
    const [userId, setUserId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Hàm xử lý khi form được submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowConfirmDialog(true); // Hiển thị hộp thoại xác nhận
    };

    const handleConfirm = async () => {
        try {
            const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage
    
            if (!token) {
                alert('Bạn cần đăng nhập trước khi thêm mượn sách!');
                return;
            }
    
            // Chuyển đổi dueDate thành định dạng dd-MM-yyyy
            const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''; // Chuyển đổi thành dd-MM-yyyy
    
            // Gọi API để thêm mượn sách
            const response = await fetch('http://localhost:8083/api/v1/admin/book-lending/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookId,
                    dueDate: formattedDueDate, // Gửi giá trị ngày theo định dạng dd-MM-yyyy
                    email: userId
                }),
            });
    
            const responseData = await response.json(); // Lấy dữ liệu trả về từ API
    
            if (responseData.status === 404) {
                setErrorMessage(responseData.message || 'Không tìm thấy thông tin.');
                throw new Error(responseData.message || 'Không tìm thấy thông tin.');
            }
    
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
    

    const handleCancel = () => {
        setShowConfirmDialog(false); // Đóng hộp thoại xác nhận nếu người dùng hủy
    };

    return (
        <div className="add-borrowing-form">
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
                    <label>Email:</label>
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
                    <button type="submit">Add</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>

            {/* Hiển thị hộp thoại xác nhận nếu showConfirmDialog là true */}
            {showConfirmDialog && (
                <div className="confirm-dialog">
                    <p>Are you sure you want to borrow more of this book?</p>
                    <div className="confirm-dialog-actions">
                        <button onClick={handleConfirm}>Confirm</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddBorrowingForm;
