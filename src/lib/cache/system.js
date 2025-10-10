import { PUBLIC_API_BASE_URL } from '$env/static/public';

let cachedSystem = null;
let lastFetch = 0;
const TTL = 5 * 60 * 1000;

export function resetSystemCache() {
  cachedSystem = null;
  lastFetch = 0;
}

export async function getSystemInfo(token) {
  if (!cachedSystem || Date.now() - lastFetch > TTL) {
    let systemInfo = {
      NamaAplikasi: 'Sistem Alih Media',
      Logo: '/logo.jpg',
      Deskripsi: ''
    };

    try {
      const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/info-sistem`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const info = await res.json();
        if (info.data) {
          systemInfo = {
            NamaAplikasi: info.data.NamaAplikasi || systemInfo.NamaAplikasi,
            Logo: info.data.Logo
              ? `data:image/png;base64,${info.data.Logo}`
              : systemInfo.Logo,
            Deskripsi: info.data.Deskripsi || systemInfo.Deskripsi
          };
        }
      }
    } catch (err) {
      console.error('Gagal fetch info-sistem:', err);
    }

    cachedSystem = systemInfo;
    lastFetch = Date.now();
  }

  return cachedSystem;
}
