import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export async function GET({ fetch, cookies }) {
  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/pemusnahan/export`, {
      headers: {
        Authorization: `Bearer ${cookies.get('session_token')}`,
      },
    });

    if (!res.ok) {
      let errMsg = 'Gagal export data';
      try {
        const errJson = await res.json();
        errMsg = errJson.message || errMsg;
      } catch (_) {
      }
      throw error(res.status || 400, errMsg);
    }

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="pemusnahan.xlsx"',
      },
    });
  } catch (err) {
    console.error('Export pemusnahan gagal:', err);
    throw error(500, err.message || 'Terjadi kesalahan server');
  }
}
