import React from 'react';
import '../assets/css/closebutton.css'; // Đảm bảo rằng CSS đã được chỉnh sửa đúng

const CloseButton = ({ onClick }) => {
  return (
    <button className="close-button" onClick={onClick}>
      &#10005; 
    </button>
  );
};

export default CloseButton;
