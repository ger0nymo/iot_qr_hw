import axios from 'axios';

const API_URL = 'https://qrhazi-backend.azurewebsites.net/logging';
//const API_URL = 'http://localhost:3001/logging';
export async function getAllLogs(userToken: string) {
  const result = await axios.get(`${API_URL}/all`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  return result;
}
