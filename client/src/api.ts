import axios from 'axios';
export const API_BASE = 'http://localhost:5000';

export function uploadFile(file: File) {
  const data = new FormData();
  data.append('file', file);
  return axios.post(`${API_BASE}/upload`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function fetchFiles() {
  return axios.get(`${API_BASE}/files`);
}
