import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5084/api', 
    // baseURL: 'http://0.0.0.0:5084/api', 
    // baseURL: 'http://192.168.0.31:5084/api', 
    
});

export default api;