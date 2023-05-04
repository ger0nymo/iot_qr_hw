import { checkToken } from './auth';
import axios from 'axios';

//const API_URL = 'https://qrhazi-backend.azurewebsites.net/users';
const API_URL = 'http://localhost:3001/users';

export type User = {
  id: string;
  username: string;
  email: string;
  canEnter: boolean;
  isAdmin: boolean;
};

export function retrieveCurrentToken() {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token'))
    ?.split('=')[1];

  if (!token) {
    return null;
  }

  return token;
}

export async function retrieveUser() {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token'))
    ?.split('=')[1];

  if (!token) {
    return null;
  }

  const result = await checkToken(token!);

  if (result.status !== 200) {
    return null;
  }

  const user: User = {
    id: result.data.id,
    username: result.data.username,
    email: result.data.email,
    canEnter: result.data.canEnter,
    isAdmin: result.data.isAdmin,
  };

  return user;
}

export async function updateUserCanEnter(
  id: string,
  toValue: boolean,
  sender: string
) {
  const token = retrieveCurrentToken();

  if (!token) {
    return null;
  }

  const result = await axios.patch(
    `${API_URL}/update-can-enter`,
    {
      id: id,
      canEnter: toValue,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (result.status !== 200) {
    return null;
  }

  return result;
}

export async function getAllUsers() {
  const token = retrieveCurrentToken();
  const user = await retrieveUser();

  if (!user?.isAdmin) {
    return null;
  }

  if (!token) {
    return null;
  }

  const result = await axios.get(`${API_URL}/get-all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (result.status !== 200) {
    return null;
  }

  return result;
}
