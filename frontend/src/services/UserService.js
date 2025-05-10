import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const UserService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active users
  getActiveUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/active`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Activate user
  activateUser: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Deactivate user
  deactivateUser: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Follow user
  followUser: async (userId, userToFollowId) => {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/follow/${userToFollowId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default UserService; 