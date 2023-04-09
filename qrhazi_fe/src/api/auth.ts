import axios from 'axios';

const API_URL = 'http://localhost:3001/auth';

export async function register(
  username: string,
  email: string,
  password: string
) {
  return 'register';
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
