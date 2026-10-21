import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export const register = async ({ username, email, password }) => {
    const response = await api.post('/api/register', {
        username,
        email,
        password
    });
    return response.data;
};

export const login = async ({ email, password }) => {
    const response = await api.post('/api/login', {
        email,
        password
    });
    return response.data;
};

export async function logout() {
    const response = await api.get('/api/logout');
    return response.data;
}

export async function getme() {
    const response = await api.get('/api/get-me');
    return response.data;
}