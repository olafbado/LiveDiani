import axios from 'axios';

const api = axios.create({
    baseURL: 'http://work-1-tttjawtuglcpntpt.prod-runtime.all-hands.dev:12000/api', 
});

export default api;