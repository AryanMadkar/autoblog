import axios from 'axios';

const API_BASE_URL = 'https://autoblog-x3m1.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const blogAPI = {
    // Get all blogs
    getAllBlogs: async () => {
        const response = await api.get('/blogs');
        return response.data;
    },

    // Get single blog by ID
    getBlogById: async (id) => {
        const response = await api.get(`/blogs/${id}`);
        return response.data;
    },

    // Health check
    healthCheck: async () => {
        const response = await api.get('/');
        return response.data;
    },
};

export default api;
