import React from 'react';
import '../assets/css/addbutton.css';
import { FaUserPlus } from 'react-icons/fa';

const AddButton = ({ label = "Add", Icon = FaUserPlus }) => {
  return (
    <button className="add-button">
      <Icon className="add-button-icon" />
      {label}
    </button>
  );
};

export default AddButton;
