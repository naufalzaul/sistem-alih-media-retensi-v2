import { PUBLIC_API_BASE_URL } from '$env/static/public';

let cachedProfile = null;
let lastFetch = 0;
const TTL = 5 * 60 * 1000;

export function resetProfileCache() {
  cachedProfile = null;
  lastFetch = 0;
}

export async function getProfile(token) {
  if (!cachedProfile || Date.now() - lastFetch > TTL) {
    let profile = null;

    try {
      const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        profile = json.data || null;
      }
    } catch (err) {
      console.error('Gagal fetch profile:', err);
    }

    cachedProfile = profile;
    lastFetch = Date.now();
  }

  return cachedProfile;
}
