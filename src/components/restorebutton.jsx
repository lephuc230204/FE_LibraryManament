import React from 'react';
import '../assets/css/restorebutton.css';

const RestoreButton = ({ label = "RESTORE", onClick }) => {
  return (
    <button className="restore-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default RestoreButton;
