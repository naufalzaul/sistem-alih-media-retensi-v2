import { resetProfileCache } from '$lib/cache/profile.js';
import { resetSystemCache } from '$lib/cache/system.js';
import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
  cookies.delete('session_token', { path: '/' });
  resetProfileCache();
  resetSystemCache();
  return json({ success: true, message: 'Logout berhasil' });
}
