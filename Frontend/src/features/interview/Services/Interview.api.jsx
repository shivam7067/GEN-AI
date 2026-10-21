import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const generateReport = async ({ selfDescription, jobDescription, resume }) => {
    const formData = new FormData();
    if (selfDescription) {
        formData.append("selfDescription", selfDescription);
    }
    if (jobDescription) {
        formData.append("jobDescription", jobDescription);
    }
    if (resume) {
        formData.append("resume", resume);
    }

    const response = await api.post("/api/generate-report", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const getReportById = async (interviewId) => {
    const response = await api.get(`/api/interviews/${interviewId}`);
    return response.data;
};