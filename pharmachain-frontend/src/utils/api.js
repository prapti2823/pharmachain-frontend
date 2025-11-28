import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Manufacturer APIs
export const manufacturerAPI = {
  registerBatch: (formData) => api.post('/manufacturer/register-batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getBatches: () => api.get('/manufacturer/batches'),
};

// Pharmacy APIs
export const pharmacyAPI = {
  verifyMedicine: (formData) => api.post('/pharmacy/verify-medicine', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Watchdog APIs
export const watchdogAPI = {
  startMonitoring: () => api.post('/watchdog/start-monitoring'),
  getStatus: () => api.get('/watchdog/status'),
};

// QR & Search APIs
export const qrAPI = {
  verify: (qrData) => api.post('/qr/verify', { qr_data: qrData }),
};

export const medicineAPI = {
  search: (name) => api.get(`/medicine/search?name=${name}`),
};

export default api;