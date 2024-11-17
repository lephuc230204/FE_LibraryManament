import React from 'react';
import '../assets/css/HienThi.css';  // Thêm style cho modal

const HienThi = ({ data, onClose }) => {
  if (!data) return null; // Nếu không có dữ liệu, không hiển thị gì

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Thông tin mượn sách</h2>
        <div className="modal-body">
          <p><strong>Borrowing ID:</strong> {data.lendingId}</p>
          <p><strong>Book ID:</strong> {data.bookId}</p>
          <p><strong>User ID:</strong> {data.userid}</p>
          <p><strong>Staff ID:</strong> {data.staffid}</p>
          <p><strong>Due Date:</strong> {data.dueDate}</p>
          <p><strong>Return Date:</strong> {data.returnDate ? data.returnDate : "SÁCH CHƯA TRẢ"}</p>
          <p><strong>Creation Date:</strong> {data.creationDate}</p>
        </div>
      </div>
    </div>
  );
};

export default HienThi;
