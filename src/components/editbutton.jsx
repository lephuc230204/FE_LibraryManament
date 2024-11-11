import React from 'react';
import '../assets/css/editbutton.css';

const EditButton = ({ label = "Edit"}, onClick) => {
  return (
    <button className="edit-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default EditButton;
