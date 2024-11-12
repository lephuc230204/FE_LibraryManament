import React, { useState, useEffect } from 'react';
import CloseButton from './closebutton.jsx'; // Import CloseButton
import '../assets/css/editbookform.css';

const EditBookForm = ({ onClose, bookId }) => {
  const [formData, setFormData] = useState({
    bookName: '',
    image: null,
    quantity: '1',
    categoryName: '',
    authorName: '',
    publisher: '',
    crackId: '1',
  });

  // Tải dữ liệu sách khi form được hiển thị (nếu đang chỉnh sửa sách)
  useEffect(() => {
    const loadBookData = async () => {
      try {
        const response = await fetch(`http://localhost:8083/api/v1/admin/books/${bookId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu sách');
        }

        const result = await response.json();
        if (result.data) {
          setFormData(result.data); // Set dữ liệu từ trường 'data'
        } else {
          setFormData([]); // Trường hợp không có dữ liệu
        }
        console.log("Dữ liệu đã lấy:", result);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sách:', error);
      }
    };

    if (bookId) {
      loadBookData();
    }
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuẩn bị dữ liệu form để gửi (sử dụng FormData cho việc upload file)
    const bookFormData = new FormData();
    bookFormData.append('bookName', formData.bookName);
    bookFormData.append('image', formData.image);
    bookFormData.append('quantity', formData.quantity);
    bookFormData.append('categoryName', formData.categoryName);
    bookFormData.append('authorName', formData.authorName);
    bookFormData.append('publisher', formData.publisher);
    bookFormData.append('crackId', formData.crackId);

    try {
      const response = await fetch(`http://localhost:8083/api/v1/admin/books/update/${bookId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: bookFormData,
      });

      if (!response.ok) {
        throw new Error('Cập nhật sách không thành công');
      }

      alert('Cập nhật sách thành công!');
      onClose(); // Đóng form sau khi cập nhật thành công
    } catch (error) {
      console.error('Lỗi khi cập nhật sách:', error);
    }
  };

  return (
    <div className="book-form-container">
      <form className="book-form" onSubmit={handleSubmit}>
        <label>
          Tên sách:
          <input
            type="text"
            name="bookName"
            value={formData.bookName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
        Hình ảnh:
        {formData.image && (
            <img
            src={`http://localhost:8083/uploads/${formData.image}`}
            alt="Current Book"
            style={{ maxWidth: '40%' }}
            />
        )}
        <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
        />
        </label>
        <label>
          Số lượng:
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Danh mục:
          <input
            type="text"
            name="categoryName"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Tác giả:
          <input
            type="text"
            name="authorName"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nhà xuất bản:
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Crack ID:
          <input
            type="number"
            name="crackId"
            min="1"
            value={formData.crackId}
            onChange={handleChange}
            required
          />
        </label>
        <div className="button-container">
          <button type="submit">Cập nhật sách</button>
        </div>
      </form>
      <CloseButton onClick={onClose} />
    </div>
  );
};

export default EditBookForm;
