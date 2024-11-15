const DeleteBookReservation = ({ id, onDeleteSuccess }) => {
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa đặt sách này?");
        if (!confirmDelete) return;

        try {
            console.log("Xóa đặt sách với bookId:", id);
            const response = await fetch(`http://localhost:8083/api/v1/admin/book-reservations/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error("Không thể xóa đặt sách. Có thể đặt sách không tồn tại.");
            }

            onDeleteSuccess(); // Gọi hàm onDeleteSuccess để cập nhật danh sách sau khi xóa
            return Promise.resolve();  // Trả về Promise thành công khi xóa hoàn tất
        } catch (error) {
            console.error("Lỗi khi xóa đặt sách:", error);
            alert("Lỗi khi xóa đặt sách, vui lòng thử lại.");
            return Promise.reject(error);  // Trả về Promise lỗi nếu có sự cố
        }
    };

    // Trả về một Promise thay vì JSX component
    return new Promise((resolve, reject) => {
        handleDelete().then(resolve).catch(reject);
    });
};

export default DeleteBookReservation;
