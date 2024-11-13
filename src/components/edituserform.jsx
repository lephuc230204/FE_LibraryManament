import React, { useState, useEffect } from 'react';
import CloseButton from './closebutton.jsx';
import '../assets/css/createuserform.css';

const EditUserForm = ({ onClose, refreshUsers, userId }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    dob: '',
    role: '',
    statusUser: ''  // Renamed to avoid confusion with HTTP status
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

        if (response.ok) {
          const data = await response.json();
          setUserData({
            username: data.username || '',
            email: data.email || '',
            phone: data.phone || '',
            dob: data.dob || '',
            role: data.role || '',
            statusUser: data.status || ''  // Assign to statusUser to maintain clarity
          });
        } else {
          const errorResponse = await response.json();
          setError(errorResponse.message || 'Failed to fetch user data.');
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

  // API update function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    // Format the date of birth to the required format
    const [year, month, day] = userData.dob.split('-');
    const formattedDob = `${day}-${month}-${year}`;
  
    // Prepare the payload for the API request
    const userPayload = {
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      dob: formattedDob,
      role: userData.role,
      status: userData.statusUser  // Use statusUser from the form
    };
  
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
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user');
      }
  
      // After successful update, show the success message
      setSuccessMessage('User updated successfully!');
      
      // Optionally, keep the updated status from form in the UI
      setUserData({
        ...userData,
        statusUser: userData.statusUser // Ensure the status selected is reflected in the UI
      });
  
      onClose(); // Close the form after success
      if (refreshUsers) {
        refreshUsers(); // Refresh user list after update (if needed)
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
            <select name="role" value={userData.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_USER">User</option>
            </select>
          </label>
          <label>Status:
            <select name="statusUser" value={userData.statusUser} onChange={handleChange} required>
              <option value="ACTIVE">Active</option>
              <option value="DELETED">Deleted</option>
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
