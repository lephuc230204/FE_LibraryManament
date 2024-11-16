import React, { useState, useEffect } from 'react';
import CloseButton from './closebutton.jsx';
import '../assets/css/createuserform.css';

const EditUserForm = ({ onClose, refreshUsers, userId }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    dob: '', // Ensure dob is handled correctly
    roleName: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('No access token found. Please log in.');
          return;
        }

        const response = await fetch(`http://localhost:8083/api/v1/admin/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json();
        console.log('User data from API:', result);

        if (result.data) {
          const { dob, ...rest } = result.data;

          // Convert the date format to yyyy-MM-dd for the input field
          const formattedDob = dob ? dob.split('-').reverse().join('-') : '';

          setUserData({
            ...rest,
            dob: formattedDob, // Store the formatted dob here
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    // Format dob to dd-MM-yyyy before sending it
    const formattedDob = userData.dob ? userData.dob.split('-').reverse().join('-') : '';
  
    // Prepare the payload with the formatted `dob`
    const userPayload = {
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      dob: formattedDob,  // Format dob to dd-MM-yyyy before sending
      role: userData.roleName,
    };
  
    console.log('User payload to be sent:', userPayload);
  
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No access token found. Please log in.');
        return;
      }
  
      // Send PUT request to update user data
      const response = await fetch(`http://localhost:8083/api/v1/admin/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload)
      });
  
      const result = await response.json(); // Parse the response to get the result message
      console.log('Response from server:', result);
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user');
      }
  
      // After successful update, show success message
      setSuccessMessage('User updated successfully!');
      
      onClose(); // Close the form after success
      if (refreshUsers) {
        refreshUsers(); // Refresh the user list if necessary
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="user-form-container">
        <h2>Edit User</h2>
        <form className="user-form" onSubmit={handleSubmit}>
          <label>Username:
            <input type="text" name="username" value={userData.username} onChange={handleChange} required />
          </label>
          <label>Email:
            <input type="email" name="email" value={userData.email} onChange={handleChange} required />
          </label>
          <label>Phone:
            <input type="tel" name="phone" value={userData.phone} onChange={handleChange} required />
          </label>
          <label>Date of Birth:
            <input type="date" name="dob" value={userData.dob} onChange={handleChange} required />
          </label>
          <label>Role:
            <select name="roleName" value={userData.roleName} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_USER">User</option>
            </select>
          </label>
          <div className="button-container">
            <button type="submit">Update User</button>
          </div>
        </form>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <CloseButton onClick={onClose} />
      </div>
    </div>
  );
};

export default EditUserForm;
