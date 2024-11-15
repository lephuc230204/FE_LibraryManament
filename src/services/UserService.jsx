// src/services/userService.js

export const deleteUser = async (userId) => {
  const token = localStorage.getItem('accessToken'); // Get the access token

  if (!token) {
    throw new Error('Token is missing');
  }

  try {
    // Fetch the user details to check the status
    const response = await fetch(`http://localhost:8083/api/v1/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = `Error: ${response.status} - ${response.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    const userData = result.data;

    // Check if user status is not ACTIVE
    if (userData.status !== 'ACTIVE') {
      alert('This user is already deleted or inactive.');
      console.log('User already deleted or inactive');
      return; // If the status is not ACTIVE, exit without asking for confirmation
    }

    // Ask for user confirmation before proceeding with the deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");

    if (!isConfirmed) {
      console.log('User deletion was canceled');
      return; // If the user cancels, stop the deletion process
    }

    // Proceed to delete the user
    const deleteResponse = await fetch(`http://localhost:8083/api/v1/admin/users/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      const errorMessage = `Error: ${deleteResponse.status} - ${deleteResponse.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const deleteResult = await deleteResponse.json();
    console.log('User deleted:', deleteResult);
    return deleteResult;

  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
