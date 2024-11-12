import React, { useState } from 'react';
import CloseButton from './closebutton.jsx'; // Import CloseButton
import '../assets/css/createuserform.css';

const CreateUserForm = ({ onClose, refreshUsers }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    role: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log dữ liệu trước khi gửi
    console.log('Submitting user data:', userData);
    
    // Reset error and success messages
    setError('');
    setSuccessMessage('');
  
    // Ensure password and confirmPassword match
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    // Convert dob from yyyy-MM-dd to dd-MM-yyyy
    const [year, month, day] = userData.dob.split('-');
    const formattedDob = `${day}-${month}-${year}`;
  
    // Prepare data for the POST request as JSON
    const userPayload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      confirmPassword: userData.confirmPassword,
      dob: formattedDob,  // Send the date as dd-MM-yyyy
      role: userData.role
    };
  
    // Log dữ liệu gửi đi
    console.log('Payload:', userPayload);
  
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No access token found. Please log in.');
        return;
      }
  
      const response = await fetch('http://localhost:8083/api/v1/admin/users/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload)
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to create user');
      }
  
      setSuccessMessage('User created successfully!');
      onClose();
      if (refreshUsers) {
        refreshUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please try again.');
    }
  };
  

  return (
    <div className="user-form-container">
      <h2>Create User</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Role:
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_USER">User</option>
          </select>
        </label>

        <div className="button-container">
          <button type="submit">Create User</button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <CloseButton onClick={onClose} />
    </div>
  );
};

export default CreateUserForm;
