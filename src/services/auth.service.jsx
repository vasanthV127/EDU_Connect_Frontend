// src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_Backend_API_URL

const getToken = () => {
  return localStorage.getItem('token');
};

const getUserId = () => {
  const userString = localStorage.getItem("user");
  const Id = JSON.parse(userString).id;
  return Id;
};

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.id);
      console.log('Login successful, user ID:', response.data.id);
    }
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
};

const makeAuthenticatedPostRequest = async (endpoint, data) => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error(`POST request to ${endpoint} failed:`, error.response?.data || error.message);
    throw error;
  }
};

const makeAuthenticatedRequest = async (endpoint) => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`GET request to ${endpoint} failed:`, error.response?.data || error.message);
    throw error;
  }
};

const makeAuthenticatedFileUpload = async (endpoint, formData) => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  } catch (error) {
    console.error(`File upload to ${endpoint} failed:`, error.response?.data || error.message);
    throw error;
  }
};

const makeAuthenticatedDeleteRequest = async (endpoint) => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`DELETE request to ${endpoint} failed:`, error.response?.data || error.message);
    throw error;
  }
};

const makeAuthenticatedPutRequest = async (endpoint, data) => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error(`PUT request to ${endpoint} failed:`, error.response?.data || error.message);
    throw error;
  }
};

// New method for PUT requests with form data
const makeAuthenticatedFilePutRequest = async (endpoint, formData) => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  } catch (error) {
    console.error(`PUT file request to ${endpoint} failed:`, error.response?.data || error.message);
    throw error;
  }
};

export { 
  login, 
  logout, 
  getUserId,
  makeAuthenticatedRequest, 
  makeAuthenticatedPostRequest, 
  makeAuthenticatedFileUpload,
  makeAuthenticatedDeleteRequest,
  makeAuthenticatedPutRequest,
  makeAuthenticatedFilePutRequest // Export the new method
};