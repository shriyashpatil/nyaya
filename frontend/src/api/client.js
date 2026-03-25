import axios from 'axios';

// Axios instance with base config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 130000,  // 130 seconds (matches backend 120s + buffer)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. The AI is processing your request. Please try again.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check if the server is running.'));
    }
    const message = error.response?.data?.errorMessage || error.response?.data?.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// --- API Service Functions ---

/**
 * Generate a RERA compliance checklist.
 * @param {string} state - e.g. "Maharashtra"
 * @param {string} projectType - e.g. "Residential"
 * @param {string} location - e.g. "Mumbai"
 */
export const generateChecklist = async (state, projectType, location) => {
  const response = await apiClient.post('/api/checklist/generate', { state, projectType, location });
  return response.data;
};

/**
 * Upload a document for RERA compliance review.
 * @param {File} file - PDF or Word document
 * @param {string} state - State to check rules against
 */
export const uploadDocument = async (file, state) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('state', state);
  const response = await apiClient.post('/api/documents/review', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 130000,  // 130 seconds for document processing
  });
  return response.data;
};

/**
 * Ask a RERA compliance question.
 * @param {string} question
 * @param {string} state
 */
export const askQuestion = async (question, state) => {
  const response = await apiClient.post('/api/chat/ask', { question, state });
  return response.data;
};

/**
 * Health check.
 */
export const getHealth = async () => {
  const response = await apiClient.get('/actuator/health');
  return response.data;
};

export default apiClient;
