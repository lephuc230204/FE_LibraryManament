import React, { useState } from 'react';

const PostNotificationCardLibrary = () => {
  const [notificationMessage, setNotificationMessage] = useState("Thông báo từ thư viện!"); // Default message

  const handlePostNotification = async () => {
    const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage

    if (!token) {
      alert('Bạn cần đăng nhập để gửi thông báo!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8083/api/v1/admin/notification/card-library/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: notificationMessage, // Thông báo động
        }),
      });

      // Đọc response.json() và kiểm tra status
      const result = await response.json(); 

      if (response.status === 200) {
        console.log('Notification sent successfully!');
        alert(result.message || 'Thông báo đã được gửi thành công!'); // Hiển thị message từ response (nếu có)
      } else {
        console.error('Failed to send notification');
        alert(result.message || 'Gửi thông báo thất bại!'); // Nếu API có message, hiển thị message đó
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Lỗi khi gửi thông báo!');
    }
  };

  return (
    <div>
      <button onClick={handlePostNotification} className="post-notification-button">
        Gửi Thông Báo
      </button>
    </div>
  );
};

export default PostNotificationCardLibrary;
