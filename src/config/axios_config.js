import axios from 'axios';

// Default Axios configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',  // Your FastAPI backend URL
  withCredentials: false,  // This allows cookies and credentials to be sent
});

export default apiClient;
