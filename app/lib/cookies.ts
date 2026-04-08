import Cookies from 'js-cookie';
import { StoredUser } from '../types';

const USERS_KEY = 'ra_users';
const ACTIVE_USER_KEY = 'ra_active_user';

export function saveUserToCookies(user: { id: string; name: string; email: string }, token: string): void {
  const users = getStoredUsers();
  const newUser: StoredUser = { userId: user.id, name: user.name, email: user.email, token };
  
  const filtered = users.filter(u => u.userId !== user.id);
  filtered.unshift(newUser);
  if (filtered.length > 5) filtered.pop();

  Cookies.set(USERS_KEY, JSON.stringify(filtered), { expires: 7 });
  Cookies.set(ACTIVE_USER_KEY, JSON.stringify(newUser), { expires: 7 });
}

export function getStoredUsers(): StoredUser[] {
  const usersStr = Cookies.get(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
}

export function switchToUser(userId: string): StoredUser | null {
  const users = getStoredUsers();
  const targetUser = users.find(u => u.userId === userId);
  if (targetUser) {
    Cookies.set(ACTIVE_USER_KEY, JSON.stringify(targetUser), { expires: 7 });
    return targetUser;
  }
  return null;
}

export function removeActiveUser(): void {
  Cookies.remove(ACTIVE_USER_KEY);
}