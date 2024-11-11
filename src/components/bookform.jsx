import React, { useState } from 'react';
import CloseButton from '../components/closebutton.jsx' // Import CloseButton
import '../assets/css/bookform.css';

const BookForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    bookName: '',
    image: null,
    quantity: '1',
    currentQuantity: '1',
    categoryName: '',
    authorName: '',
    publisher: '',
    crackId: '1'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuẩn bị dữ liệu form để gửi (sử dụng FormData cho upload file)
    const bookFormData = new FormData();
    bookFormData.append('bookName', formData.bookName);
    bookFormData.append('image', formData.image);
    bookFormData.append('quantity', formData.quantity);
    bookFormData.append('currentQuantity', formData.currentQuantity);
    bookFormData.append('categoryName', formData.categoryName);
    bookFormData.append('authorName', formData.authorName);
    bookFormData.append('publisher', formData.publisher);
    bookFormData.append('crackId', formData.crackId);

    try {
      const response = await fetch('http://localhost:8083/api/v1/admin/books/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: bookFormData
      });

      if (!response.ok) {
        throw new Error('Failed to create book');
      }

      alert('Book created successfully!');
      onClose(); // Đóng form sau khi thêm thành công
    } catch (error) {
      console.error('Lỗi khi tạo sách:', error);
    }
  };

  return (
    <div className="book-form-container">
      <form className="book-form" onSubmit={handleSubmit}>
        <label>
          Book Name:
          <input type="text" name="bookName" value={formData.bookName} onChange={handleChange} required />
        </label>
        <label>
          Image:
          <input type="file" name="image" onChange={handleFileChange} accept="image/*" required />
        </label>
        <label>
          Quantity:
          <input type="number" name="quantity" min= "1" value={formData.quantity} onChange={handleChange} required />
        </label>
        <label>
          Current Quantity:
          <input type="number" name="currentQuantity" min= "1" value={formData.currentQuantity} onChange={handleChange} required />
        </label>
        <label>
          Category:
          <input type="text" name="categoryName" value={formData.categoryName} onChange={handleChange} required />
        </label>
        <label>
          Author:
          <input type="text" name="authorName" value={formData.authorName} onChange={handleChange} required />
        </label>
        <label>
          Publisher:
          <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} required />
        </label>
        <label>
          Crack ID:
          <input type="number" name="crackId" min= "1" value={formData.crackId} onChange={handleChange} required />
        </label>
        <button type="submit">Add Book</button>
      </form>
      <CloseButton onClick={onClose} />
    </div>
  );
};

export default BookForm;
