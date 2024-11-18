import React, { useState } from 'react';

const PostNotificationButton = () => {
  const [notificationMessage, setNotificationMessage] = useState("Thông báo mượn sách mới!"); // Default message

  const handlePostNotification = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('Bạn cần đăng nhập để gửi thông báo!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8083/api/v1/admin/notification/lending/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: notificationMessage, // Use dynamic message
        }),
      });

      if (response.ok) {
        console.log('Notification sent successfully!');
        alert('Gửi thông báo thành công!');
      } else {
        console.error('Failed to send notification');
        alert('Gửi thông báo thất bại!');
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

export default PostNotificationButton;
