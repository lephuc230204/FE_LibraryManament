import React, { useState, useEffect } from 'react';
import CloseButton from '../../components/closebutton.jsx';
import '../../assets/css/editreservationbook.css';

const EditReservationBook = ({ onClose, id, refreshReservations }) => {
  // State variables for reservation details
  const [reservation, setReservation] = useState({
    reservationId: '',
    user: '',
    bookImage: '',
    bookId: '',
    bookName: '',
    status: '',
    creationDate: '',
  });

  useEffect(() => {
    const loadReservationData = async () => {
      try {
        const response = await fetch(`http://localhost:8083/api/v1/admin/book-reservations/detail/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu đặt sách');
        }

        const result = await response.json();
        console.log(result);
          if (result.data) {
            setReservation({
              ...result.data,
            });
          }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu đặt sách:', error);
      }
    };

    if (id) {
      loadReservationData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation((prevReservation) => ({
      ...prevReservation,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedReservationData = {
      status: reservation.status,
    };

    try {
      const response = await fetch(`http://localhost:8083/api/v1/admin/book-reservations/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReservationData),
      });

      if (!response.ok) {
        throw new Error('Cập nhật đặt sách không thành công');
      }

      alert('Cập nhật đặt sách thành công!');
      onClose();
      refreshReservations();  // Gọi refreshReservations để làm mới danh sách đặt sách
    } catch (error) {
      console.error('Lỗi khi cập nhật đặt sách:', error);
    }
  };

  return (
    <div className="reservation-form-container">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Reservation ID:</label>
          <input
            type="text"
            name="reservationId"
            value={reservation.reservationId}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>User:</label>
          <input
            type="text"
            name="user"
            value={reservation.email}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Book Image:</label>
          {reservation.image ? (
            <img src={`http://localhost:8083/uploads/${reservation.image}`} alt="Book" width="100" />
          ) : (
            'No image available'
          )}
        </div>
        <div className="form-group">
          <label>Book ID:</label>
          <input
            type="text"
            name="bookId"
            value={reservation.bookId}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Book Name:</label>
          <input
            type="text"
            name="bookName"
            value={reservation.bookName}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={reservation.status} onChange={handleChange} required>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </div>
        <div className="form-group">
          <label>Creation Date:</label>
          <input
            type="text"
            name="creationDate"
            value={reservation.creationDate}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="button-container">
          <button type="submit">Update Reservation</button>
        </div>
      </form>
      <CloseButton onClick={onClose} />
    </div>
  );
};

export default EditReservationBook;
