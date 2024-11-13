// src/services/userService.js

export const deleteUser = async (userId) => {
    const token = localStorage.getItem('accessToken'); // Get the access token
  
    if (!token) {
      throw new Error('Token is missing');
    }
  
    try {
      const response = await fetch(`http://localhost:8083/api/v1/admin/users/delete/${userId}`, {
        method: 'DELETE',
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
      console.log('User deleted:', result);
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
};



