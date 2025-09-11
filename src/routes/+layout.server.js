import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, cookies, url }) {
  const token = cookies.get('session_token');

  if (token && url.pathname === '/') {
    throw redirect(302, '/beranda');
  }


  let systemInfo = {
    NamaAplikasi: 'Sistem Alih Media',
    Logo: '/logo.jpg',
    Deskripsi: ''
  };

  if (token) {
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
  }

  return {
    system: systemInfo
  };
}
