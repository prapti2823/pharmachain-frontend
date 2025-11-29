import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Manufacturer APIs
export const manufacturerAPI = {
  create: (data) => api.post('/manufacturer/', data),
  getByName: (name) => api.get(`/manufacturer/${encodeURIComponent(name)}`),
  getById: (id) => api.get(`/manufacturer/${id}`),
  registerBatch: (formData) => api.post('/manufacturer/register-batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getBatches: (manufacturerId) => api.get(`/manufacturer/batches${manufacturerId ? `?manufacturer_id=${manufacturerId}` : ''}`),
  getEncryptionKey: () => api.get('/manufacturer/encryption-key'),
  regenerateQR: (medicineId) => api.get(`/manufacturer/batch/${medicineId}/qr-regenerate`),
  test: () => api.get('/manufacturer/test'),
};

// Pharmacy APIs
export const pharmacyAPI = {
  verifyMedicine: (formData) => api.post('/pharmacy/verify-medicine', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  detailedVerify: (formData) => api.post('/pharmacy/detailed-verify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  test: () => api.get('/pharmacy/test'),
};

// Watchdog APIs
export const watchdogAPI = {
  startMonitoring: (data = {}) => api.post('/watchdog/start-monitoring', data),
  getStatus: () => api.get('/watchdog/status'),
};

// Medicine APIs
export const medicineAPI = {
  getAll: () => api.get('/medicine/'),
  getById: (id) => api.get(`/medicine/${id}`),
  create: (data) => api.post('/medicine/', data),
  update: (id, data) => api.put(`/medicine/${id}`, data),
  delete: (id) => api.delete(`/medicine/${id}`),
  verify: (id) => api.get(`/medicine/${id}/verify`),
  getScans: () => api.get('/medicine/scans'),
  getScanDetails: (scanId) => api.get(`/medicine/scans/${scanId}`),
  createWithImage: (formData) => api.post('/medicine/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// QR APIs
export const qrAPI = {
  generateJson: (data) => api.post('/qr/generate-qr-json', data),
  encryptData: (data) => api.post('/qr/encrypt-qr-data', data),
  generateImage: (data) => api.post('/qr/generate-qr-image', data),
  createComplete: (data) => api.post('/qr/create-complete-qr', data),
  decryptData: (data) => api.post('/qr/decrypt-qr-data', data),
  verifyFormat: (data) => api.post('/qr/verify-qr-format', data),
  getFormatExample: () => api.get('/qr/qr-format-example'),
};

// AI APIs
export const aiAPI = {
  runAgent: (data) => api.post('/ai/agent', data),
  agenticAnalyze: (data) => api.post('/ai/agentic-analyze', data),
  verifyScan: (data) => api.post('/ai/verify-scan', data),
  scan: (data) => api.post('/ai/scan', data),
  autonomousVerify: (data) => api.post('/ai/autonomous-verify', data),
  supplyChainAnalysis: (data) => api.post('/ai/supply-chain-analysis', data),
  batchVerify: (data) => api.post('/ai/batch-verify', data),
  getAgentStatus: () => api.get('/ai/agent-status'),
};

// Chat APIs
export const chatAPI = {
  pharmaChat: (data) => api.post('/chat/pharma-chat', data),
  getSession: (sessionId) => api.get(`/chat/session/${sessionId}`),
  deleteSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
  getSessions: () => api.get('/chat/sessions'),
  getProcessingStatus: (processingId) => api.get(`/chat/processing-status/${processingId}`),
  getTemplates: () => api.get('/chat/templates'),
};

// Test APIs
export const testAPI = {
  manufacturer: () => api.get('/manufacturer/test'),
  pharmacy: () => api.get('/pharmacy/test'),
};

export default api;