import axios from 'axios';

const API_URL = window.blftAbAdmin?.apiUrl || '/wp-json/blft-ab/v1/';
const NONCE = window.blftAbAdmin?.nonce || '';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'X-WP-Nonce': NONCE,
    'Content-Type': 'application/json',
  },
});

// Interceptor for logging requests
apiClient.interceptors.request.use(request => {
  console.log('Starting Request:', JSON.stringify(request, null, 2));
  return request;
});

// Interceptor for logging responses
apiClient.interceptors.response.use(response => {
  console.log('Response:', JSON.stringify(response, null, 2));
  return response;
}, error => {
  console.error('Response Error:', JSON.stringify(error.response || error.message, null, 2));
  return Promise.reject(error);
});


export const fetchTests = (params) => {
  console.log('[API Service] Fetching tests with params:', params);
  return apiClient.get('tests', { params });
};

export const fetchTest = (id) => {
  console.log(`[API Service] Fetching test with ID: ${id}`);
  return apiClient.get(`tests/${id}`);
};

export const createTest = (testData) => {
  console.log('[API Service] Creating test with data:', testData);
  return apiClient.post('tests', testData);
};

export const updateTest = (id, testData) => {
  console.log(`[API Service] Updating test with ID: ${id}, Data:`, testData);
  return apiClient.put(`tests/${id}`, testData);
};

export const deleteTest = (id) => {
  console.log(`[API Service] Deleting test with ID: ${id}`);
  return apiClient.delete(`tests/${id}`);
};

export default apiClient;