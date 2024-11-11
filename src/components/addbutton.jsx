import React from 'react';
import '../assets/css/addbutton.css';
import { FaUserPlus } from 'react-icons/fa';

const AddButton = ({ label = "Add", Icon = FaUserPlus, onClick }) => {
  return (
    <button className="add-button" onClick={onClick}> {/* Thêm onClick */}
      <Icon className="add-button-icon" />
      {label}
    </button>
  );
};

export default AddButton;
