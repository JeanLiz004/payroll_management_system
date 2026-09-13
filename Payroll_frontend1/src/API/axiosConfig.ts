import axios from 'axios';

const API_URL = 'https://localhost:7016/api';

export const getGovernmentEntities = async (search?: string, sector?: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/GovernmentEntities`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { search, sector }
  });
  return response.data;
};