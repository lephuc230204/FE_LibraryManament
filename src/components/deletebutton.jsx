import React from 'react';
import '../assets/css/deletebutton.css';

const DeleteButton = ({ label = "Delete", onClick }) => {
  return (
    <button className="delete-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default DeleteButton;
