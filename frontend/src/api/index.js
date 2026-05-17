import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Template APIs
export const getTemplates = () => API.get('/templates');
export const getTemplate = (id) => API.get(`/templates/${id}`);

// Resume APIs
export const createResume = (data) => API.post('/resume', data);
export const getResumes = () => API.get('/resume');
export const getResume = (id) => API.get(`/resume/${id}`);
export const updateResume = (id, data) => API.put(`/resume/${id}`, data);
export const deleteResume = (id) => API.delete(`/resume/${id}`);

// AI APIs
export const improveText = (text, context) => API.post('/ai/improve', { text, context });

// Export APIs
export const getResumeHTML = (id) => API.get(`/resume/${id}/preview/html`);
export const exportPDF = (id) => {
  return API.get(`/resume/${id}/export/pdf`, { responseType: 'blob' });
};

export default API;
