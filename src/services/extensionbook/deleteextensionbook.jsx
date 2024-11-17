const DeleteBookExtension = ({ id, onDeleteSuccess }) => {
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa gia hạn sách này?");
        if (!confirmDelete) return;

        try {
            console.log("Xóa gia hạn sách với :", id);
            const response = await fetch(`http://localhost:8083/api/v1/admin/book-renewal/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error("Không thể xóa gia hạn sách.");
            }

            onDeleteSuccess(); // Gọi hàm onDeleteSuccess để cập nhật danh sách sau khi xóa
            return Promise.resolve();  // Trả về Promise thành công khi xóa hoàn tất
        } catch (error) {
            console.error("Lỗi khi xóa gia hạn sách:", error);
            alert("Lỗi khi gia hạn sách, vui lòng thử lại.");
            return Promise.reject(error);  // Trả về Promise lỗi nếu có sự cố
        }
    };

    // Trả về một Promise thay vì JSX component
    return new Promise((resolve, reject) => {
        handleDelete().then(resolve).catch(reject);
    });
};

export default DeleteBookExtension;
