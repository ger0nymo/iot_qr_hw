import axios from 'axios';

//const API_URL = 'https://qrhazi-backend.azurewebsites.net/auth';
const API_URL = 'http://localhost:3001/auth';
export async function register(
  username: string,
  email: string,
  password: string
) {
  const result = await axios.post(`${API_URL}/register`, {
    username: username,
    password: password,
    email: email,
  });
  return result;
}

export async function login(username: string, password: string) {
  const result = await axios.post(`${API_URL}/login`, {
    username: username,
    password: password,
  });
  return result;
}

export async function checkToken(token: string) {
  const result = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result;
}
