// export async function handle({ event, resolve }) {
//   const token = event.cookies.get('token');
//   event.locals.user = token ? { name: 'Admin' } : null;
//   return resolve(event);
// }

import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session_token');
  const path = event.url.pathname;

  if (token) {
    try {
      const decoded = jwt.decode(token);

      event.locals.user = {
        email: decoded?.email,
        role: decoded?.role,
        exp: decoded?.exp
      };

      if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
        throw new Error('Token expired');
      }

    } catch (err) {
      event.cookies.delete('session_token', { path: '/' });

      if (!path.startsWith('/api')) {
        throw redirect(303, '/login?error=invalid_token');
      }
    }
  }

  return await resolve(event);
};
