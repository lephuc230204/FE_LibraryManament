// src/services/userService.js

export const restoreUser = async (userId) => {
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

        // Check if user status is already ACTIVE
        if (userData.status === 'ACTIVE') {
            alert('This user is already active.');
            console.log('User already active');
            return; // If the status is already ACTIVE, exit without asking for confirmation
        }

        // Ask for user confirmation before proceeding with the restoration
        const isConfirmed = window.confirm("Are you sure you want to restore this user?");

        if (!isConfirmed) {
            console.log('User restoration was canceled');
            return; // If the user cancels, stop the restoration process
        }

        // Proceed to restore the user
        const restoreResponse = await fetch(`http://localhost:8083/api/v1/admin/users/restore/${userId}`, {
            method: 'PUT', // Assuming the REST API uses PUT method to restore users
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!restoreResponse.ok) {
            const errorMessage = `Error: ${restoreResponse.status} - ${restoreResponse.statusText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        const restoreResult = await restoreResponse.json();
        console.log('User restored:', restoreResult);
        return restoreResult;

    } catch (error) {
        console.error('Error restoring user:', error);
        throw error;
    }
};
