import { getProfile } from '$lib/cache/profile.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, locals, cookies }) => {
  const parentData = await parent();

  if (!locals.user || (locals.user.exp && Date.now() >= locals.user.exp * 1000)) {
    cookies.delete('session_token', { path: '/' });
    throw redirect(303, '/login');
  }

  const token = cookies.get('session_token');
  let profile = await getProfile(token);

  return {
    ...parentData,
    user: profile || locals.user,
  };
};
