const DeleteBook = ({ bookId, onDeleteSuccess }) => {
    const handleDelete = async () => {
        const token = localStorage.getItem('accessToken'); // Get the access token

        if (!token) {
            throw new Error('Token is missing');
        }
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sách này?");
        if (!confirmDelete) return;

        try {
            console.log("Xóa sách với bookId:", bookId);
            const response = await fetch(`http://localhost:8083/api/v1/admin/books/delete/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Không thể xóa sách. Có thể sách không tồn tại.");
            }

            onDeleteSuccess();  // Gọi hàm onDeleteSuccess để cập nhật danh sách sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa sách:", error);
            alert("Lỗi khi xóa sách, vui lòng thử lại.");
        }
    };

    // Trả về một Promise thay vì JSX component
    return new Promise((resolve, reject) => {
        handleDelete().then(resolve).catch(reject);
    });
};

export default DeleteBook;
