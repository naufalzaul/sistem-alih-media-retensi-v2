import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, fetch }) {
  const token = cookies.get('session_token');
  const filePath = url.searchParams.get('file');

  if (!filePath) {
    throw error(400, 'File path tidak ada');
  }

  const response = await fetch(`${PUBLIC_API_BASE_URL}/${filePath}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw error(response.status, 'Gagal mengambil file');
  }

  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${filePath.split('/').pop()}"`
    }
  });
}
