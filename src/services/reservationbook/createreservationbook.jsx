import React, { useState } from 'react';
import CloseButton from '../../components/closebutton.jsx';
import '../../assets/css/createreservationbook.css';

const CreateReservationBook = ({ onClose, onUpdateReservationList }) => {
    const [email, setEmail] = useState('');
    const [bookId, setBookId] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const reservationData = {
            email: email,
            bookId: parseInt(bookId),
        };

        try {
            const response = await fetch('http://localhost:8083/api/v1/admin/book-reservations/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                // Reset form
                setEmail('');
                setBookId('');
                // Gọi lại hàm cập nhật danh sách đặt sách sau khi đặt sách thành công
                onClose();
                onUpdateReservationList();
            } else {
                console.error('Đặt sách thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    return (

        <div className="create-reservation-book-container">
            <h2 className="create-reservation-book-heading">Tạo Đặt Sách</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        className="create-reservation-book-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Book ID:</label>
                    <input
                        type="number"
                        className="create-reservation-book-input"
                        value={bookId}
                        onChange={(e) => setBookId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="create-reservation-book-submit-btn">Đặt Sách</button>
            </form>
            <CloseButton onClick={onClose} className="create-reservation-book-close-btn" />
        </div>
    );
};

export default CreateReservationBook;
