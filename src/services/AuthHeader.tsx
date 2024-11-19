type User = {
  token: string;
};

export default function authHeader(): { Authorization?: string } {
  const userString = localStorage.getItem('user'); 
  const user: User | null = userString ? JSON.parse(userString) : null;

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}
  