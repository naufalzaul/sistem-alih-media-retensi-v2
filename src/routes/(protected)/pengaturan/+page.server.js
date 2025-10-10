import { PUBLIC_API_BASE_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, cookies, url }) => {
  const token = cookies.get('session_token');
  const result = {
    user: null,
    system: null,
    users: { data: [], total: 0, page: 1, per_page: 10, total_pages: 1 },
    error: null,
  };

  const page = url.searchParams.get('page') || 1;
  const per_page = url.searchParams.get('per_page') || 10;


  try {
    const profileRes = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!profileRes.ok) throw new Error('Gagal memuat data profil');
    const profileData = await profileRes.json();
    result.user = profileData?.data || null;
  } catch (err) {
    result.error = `Profil: ${err.message}`;
  }


  try {
    const systemRes = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/info-sistem`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!systemRes.ok) throw new Error('Gagal memuat info sistem');
    const systemData = await systemRes.json();
    result.system = systemData?.data || null;
  } catch (err) {
    result.error = result.error
      ? `${result.error} | Sistem: ${err.message}`
      : `Sistem: ${err.message}`;
  }

  try {
    const usersRes = await fetch(
      `${PUBLIC_API_BASE_URL}/api/v2/users?page=${page}&per_page=${per_page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const { status, data: responseData } = await usersRes.json();

    if (!usersRes.ok || status !== 'success') {
      throw new Error('Gagal memuat daftar user');
    }

    result.users = {
      data: responseData.data || responseData || [],
      columns: [
        { label: 'Nama', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Role', key: 'role' },
      ],
      total:
        responseData.total ||
        (responseData.data ? responseData.data.length : responseData.length),
      page: responseData.page || Number(page),
      per_page: responseData.per_page || Number(per_page),
      total_pages:
        responseData.total_pages ||
        Math.ceil(
          (responseData.total ||
            (responseData.data
              ? responseData.data.length
              : responseData.length)) /
          (responseData.per_page || Number(per_page))
        ),
    };
  } catch (err) {
    result.error = result.error
      ? `${result.error} | Users: ${err.message}`
      : `Users: ${err.message}`;
  }

  return {
    ...result
  };
};
