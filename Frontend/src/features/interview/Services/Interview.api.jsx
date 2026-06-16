import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export const generateReport = async ({ selfDescription, jobDescription, resume }) => {

    try {
        const formData = new FormData();
        formData.append('selfDescription', selfDescription);
        formData.append('jobDescription', jobDescription);
        formData.append('resume', resume);

        const response = await api.post('/generate-report', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error generating interview report:', error);
        throw error;
    }
}

export const getReportById = async (interviewId) => {
    try {
        const response = await api.get(`/interviews/${interviewId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching interview report:', error);
        throw error;
    }
}