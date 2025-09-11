import { redirect } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const load = async ({ parent, locals, cookies, fetch }) => {
  const parentData = await parent();

  if (!locals.user || (locals.user.exp && Date.now() >= locals.user.exp * 1000)) {
    cookies.delete('session_token', { path: '/' });
    throw redirect(303, '/login');
  }

  let profile;
  try {
    const token = cookies.get('session_token');
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const json = await res.json();
      profile = json.data;
    }
  } catch (err) {
    console.error('Gagal fetch profile:', err);
  }

  return {
    ...parentData,
    user: profile || locals.user,

  };
};
