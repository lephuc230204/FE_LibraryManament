import React, { useState } from 'react';
import CloseButton from './closebutton.jsx'; // Import CloseButton
import '../assets/css/editborrowingform.css';

const EditBorrowingForm = ({ data, onSubmit, onClose }) => {
    // Hàm chuyển đổi ngày từ yyyy-MM-dd sang dd-MM-yyyy
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const parts = dateString.split('-');  // Ví dụ: "2024-11-17"
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Chuyển đổi sang "17-11-2024"
    };

    // Hàm chuyển đổi ngược lại từ dd-MM-yyyy sang yyyy-MM-dd
    const parseDate = (dateString) => {
        if (!dateString) return '';
        const parts = dateString.split('-'); // Ví dụ: "17-11-2024"
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Chuyển đổi sang "2024-11-17"
    };

    // Khởi tạo dữ liệu form với dueDate đã được chuyển đổi sang dd-MM-yyyy
    const [formData, setFormData] = useState({
        dueDate: formatDate(data.dueDate) || '',  // Chuyển đổi dueDate thành dd-MM-yyyy
        email: data.email || '',      // Dữ liệu mặc định của email
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Chuyển đổi dueDate sang định dạng yyyy-MM-dd khi gửi lên server
        const formattedDueDate = parseDate(formData.dueDate);
    
        // Gửi dữ liệu lên server với định dạng ngày tháng chuẩn
        onSubmit({
            dueDate: formattedDueDate,   // Định dạng ngày tháng chuẩn yyyy-MM-dd
            email: formData.email,       // Cập nhật email
        });
    };
    

    return (
        <div className="edit-borrowing-form-container">
            <form className="edit-borrowing-form" onSubmit={handleSubmit}>
                <div className="close-button-container">
                    <CloseButton onClick={onClose} />
                </div>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Due Date:
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button className="submit-button" type="submit">Lưu</button>
            </form>
        </div>
    );
};

export default EditBorrowingForm;
