const API_BASE = 'https://687dc9ec918b64224332bcf4.mockapi.io/api';

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...userData,
      token: `mock-token-${Math.random().toString(36).substring(2)}`,
    }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return await response.json();
};

export const checkEmailExists = async (email: string) => {
  const response = await fetch(`${API_BASE}/users?email=${email}`);
  if (!response.ok) {
    throw new Error('Error checking email');
  }
  const users = await response.json();
  return users.length > 0;
};