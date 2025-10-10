import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
  if (locals.user && url.pathname === '/') {
    throw redirect(302, '/beranda');
  }

  return {
    system: locals.system || {
      NamaAplikasi: 'Sistem Alih Media Retensi',
      Logo: '/logo.jpg',
      Deskripsi: ''
    }
  };
};

