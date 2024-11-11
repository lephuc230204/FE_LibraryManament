// src/services/AuthService.jsx

const API_URL = 'http://localhost:8083/api/v1/auth/';

class AuthService {
  // Hàm gọi API logout
  static async logout() {
    const accessToken = localStorage.getItem('accessToken'); // Lấy token từ LocalStorage

    if (!accessToken) {
      throw new Error('No access token found');
    }

    try {
      const response = await fetch(`${API_URL}logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Truyền token vào header
        },
      });

      if (!response.ok) {
        // Nếu API trả về lỗi
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }

      return response.json(); // Trả về dữ liệu nếu logout thành công
    } catch (error) {
      throw new Error(error.message || 'An error occurred during logout');
    }
  }
}

export default AuthService;
