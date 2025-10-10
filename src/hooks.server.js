import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { getSystemInfo } from '$lib/cache/system';

const PUBLIC_ROUTES = ['/login', '/register', '/reset-password'];

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session_token');
  const path = event.url.pathname;

  if (!token) {
    event.locals.user = null;

    if (!PUBLIC_ROUTES.some((route) => path.startsWith(route)) && !path.startsWith('/api')) {
      throw redirect(303, '/login');
    }
  } else {
    try {
      const decoded = jwt.decode(token);

      if (!decoded) throw new Error('Invalid token');
      if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
        throw new Error('Token expired');
      }

      event.locals.user = {
        email: decoded.email,
        role: decoded.role,
        exp: decoded.exp
      };

      event.locals.system = await getSystemInfo(token);

    } catch (err) {
      event.cookies.delete('session_token', { path: '/' });
      if (!path.startsWith('/api')) {
        throw redirect(303, '/login?error=invalid_token');
      }
    }
  }

  return resolve(event);
};

