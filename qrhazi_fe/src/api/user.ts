import { checkToken } from './auth';

export type User = {
  id: string;
  username: string;
  email: string;
  canEnter: boolean;
};

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
  };

  console.log(user);
  return user;
}
