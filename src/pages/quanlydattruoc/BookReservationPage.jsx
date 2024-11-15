import React, { useEffect, useState } from 'react';
import '../../assets/css/bookreservationpage.css';
import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import EditButton from '../../components/editbutton.jsx';
import DeleteButton from '../../components/deletebutton.jsx';
import CreateReservationBook from '../../services/reservationbook/createreservationbook.jsx';
import { FaBook } from 'react-icons/fa'; // Biểu tượng thêm yêu cầu
import DeleteBookReservation from '../../services/reservationbook/deletereservationbook.jsx';
import EditReservationBook from '../../services/reservationbook/editreservationbook.jsx'; // Import EditReservationBook đúng cách

const BookReservationPage = () => {
    const [reservationData, setReservationData] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false); // State to control modal visibility
    const [showEditForm, setShowEditForm] = useState(false);  // State to control Edit form visibility
    const [selectedReservationId, setSelectedReservationId] = useState(null);  // Store selected reservation id
    const [selectedImage, setSelectedImage] = useState(null);  // Store the selected image URL for viewing in modal

    // Fetch reservation data
    const fetchReservationData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:8083/api/v1/admin/book-reservations', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error(`Error fetching data: ${response.status}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Dữ liệu đã lấy:", result);
            setReservationData(result.data || []); // Update state with fetched data
        } catch (error) {
            console.error('Error fetching reservation data:', error);
        }
    };

    useEffect(() => {
        fetchReservationData();  // Fetch data when component mounts
    }, []);

    // Show the "Add Request" form
    const handleAddRequestClick = () => {
        setShowCreateForm(true); // Show the modal form
    };

    // Close the modal form
    const handleCloseForm = () => {
        setShowCreateForm(false); // Hide the modal form
        setShowEditForm(false);   // Close edit form when the user closes it
    };

    // Show the Edit form and set the selected reservation id
    const handleEditBookReservation = (id) => {
        setSelectedReservationId(id);  // Set the reservation id to edit
        setShowEditForm(true);  // Show the Edit form modal
    };

    // Handle deleting a book reservation
    const handleDeleteBookReservation = async (id) => {
        try {
            await DeleteBookReservation({ id, onDeleteSuccess });
        } catch (error) {
            console.error('Lỗi khi xóa đặt sách:', error);
        }
    };

    // Function to refresh the reservation list after deletion
    const onDeleteSuccess = () => {
        fetchReservationData();  // Fetch the updated reservation data
    };

    // Show image in modal when clicked
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);  // Set the selected image URL
    };

    return (
        <div className="book-reservation-page">
            <div className="book-reservation-page-container">
                <NavBar />
                <div className="main-content">
                    <div className="top-bar">
                        <div className="top-row">
                            <SearchBar />
                            <SortBy />
                        </div>
                        <div className="add-button">
                            <AddButton label="ADD REQUEST" Icon={FaBook} onClick={handleAddRequestClick} />
                        </div>
                    </div>

                    <table className="book-reservation-table">
                        <thead>
                            <tr>
                                <th>Reservation ID</th>
                                <th>User</th>
                                <th>BookImage</th>
                                <th>BookId</th>
                                <th>BookName</th>
                                <th>Status</th>
                                <th>Creation Date</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservationData.map((reservation, index) => (
                                <tr key={index}>
                                    <td>{reservation.reservationId}</td>
                                    <td>{reservation.email || "N/A"}</td>
                                    <td>
                                        {reservation.image ? (
                                            <img 
                                                src={`http://localhost:8083/uploads/${reservation.image}`}
                                                alt={reservation.bookName}
                                                onClick={() => handleImageClick(`http://localhost:8083/uploads/${reservation.image}`)} 
                                            />
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td>{reservation.bookId}</td>
                                    <td>{reservation.bookName || "N/A"}</td>
                                    <td>{reservation.status || "N/A"}</td>
                                    <td>{reservation.creationDate || "N/A"}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <EditButton label="EDIT" onClick={() => handleEditBookReservation(reservation.reservationId)} />
                                            <DeleteButton label="DELETE" onClick={() => handleDeleteBookReservation(reservation.reservationId)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Show EditReservationBook when showEditForm is true */}
            {showEditForm && (
                <div className={`overlay ${showEditForm ? 'show' : ''}`}>  {/* Apply the 'show' class to display modal */}
                    <div>
                        <EditReservationBook
                            id={selectedReservationId}
                            onClose={handleCloseForm}
                            refreshReservations={fetchReservationData}  // Pass refreshReservations to refresh the list
                        />
                    </div>
                </div>
            )}

            {/* Show CreateReservationBook when showCreateForm is true */}
            {showCreateForm && (
                <div className={`overlay ${showCreateForm ? 'show' : ''}`}>
                    <div>
                        <CreateReservationBook onClose={handleCloseForm} onUpdateReservationList={fetchReservationData} />
                    </div>
                </div>
            )}

            {/* Image Modal for large view */}
            {selectedImage && (
                <div 
                    className={`image-modal-overlay ${selectedImage ? 'show' : ''}`} 
                    onClick={() => setSelectedImage(null)} // Close when clicking outside
                >
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside the modal */}
                        <img src={selectedImage} alt="Large view" />
                    </div>
                </div>
            )}

        </div>
    );
};

export default BookReservationPage;
