import axios from 'axios';

//const API_URL = 'https://qrhazi-backend.azurewebsites.net/qr';
const API_URL = 'http://localhost:3001/qr';
export async function createQR(
  username: string,
  direction: boolean,
  token: string
) {
  const result = await axios.get(`${API_URL}/generate`, {
    params: {
      username: username,
      direction: direction,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return result;
}
