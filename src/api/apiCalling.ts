import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  get: async (endpoint: string) => {
    try {
      const response = await API.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const response = await API.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (endpoint: string, data: any) => {
    try {
      const response = await API.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (endpoint: string) => {
    try {
      const response = await API.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};