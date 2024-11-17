import React, { useState, useEffect } from 'react';
import CloseButton from '../../components/closebutton.jsx';
import '../../assets/css/editextensionbook.css';

const EditExtensionBook = ({ onClose, id, refreshExtensions }) => {
  // State variables for extension details
  const [bookRenewal, setBookRenewal] = useState({
    renewalId: '',
    bookLendingId: '',
    bookName: '',
    image: '',
    renewalDate: '',
    status: '',
  });

  // Fetch book renewal data (GET request)
  useEffect(() => {
    const loadBookRenewalData = async () => {
      try {
        const response = await fetch(`http://localhost:8083/api/v1/admin/book-renewal/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu gia hạn sách');
        }

        const result = await response.json();
        if (result.data) {
          setBookRenewal(result.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu gia hạn sách:', error);
      }
    };

    if (id) {
      loadBookRenewalData();
    }
  }, [id]);

  // Handle change for extension form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookRenewal((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Tạo URL với tham số status trong query string
    const url = `http://localhost:8083/api/v1/admin/book-renewal/reply/${bookRenewal.id}?status=${bookRenewal.status}`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json', // Mặc dù body không chứa dữ liệu, vẫn cần 'Content-Type' để server biết cách xử lý
        },
      });
  
      if (!response.ok) {
        throw new Error('Cập nhật gia hạn sách không thành công');
      }
  
      alert('Cập nhật gia hạn sách thành công!');
      onClose(); // Đóng form sau khi cập nhật thành công
      refreshExtensions(); // Refresh the list of book extensions
    } catch (error) {
      console.error('Lỗi khi cập nhật gia hạn sách:', error);
    }
  };

  return (
    <div className="extension-form-container">
      <form className="extension-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Renewal ID:</label>
          <input
            type="text"
            name="renewalId"
            value={bookRenewal.id}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Book Lending ID:</label>
          <input
            type="text"
            name="bookLendingId"
            value={bookRenewal.bookLendingId}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Book Name:</label>
          <input
            type="text"
            name="bookName"
            value={bookRenewal.bookName}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Book Image:</label>
          {bookRenewal.image ? (
            <img
              src={`http://localhost:8083/uploads/${bookRenewal.image}`}
              alt="Book"
            />
          ) : (
            'No image available'
          )}
        </div>
        <div className="form-group">
          <label>Renewal Date:</label>
          <input
            type="text"
            name="renewalDate"
            value={bookRenewal.renewalDate}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={bookRenewal.status} onChange={handleChange} required>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
        <div className="button-container">
          <button type="submit">Update Extension</button>
        </div>
      </form>
      <CloseButton onClick={onClose} />
    </div>
  );
};

export default EditExtensionBook;
