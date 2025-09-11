import { PUBLIC_API_BASE_URL } from '$env/static/public';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, cookies }) {
  const token = cookies.get('session_token');

  try {
    const resKasus = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/kasus`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });


    let kasusOptions = [];
    let dataKasus = [];
    if (resKasus.ok) {
      const kasusJson = await resKasus.json();
      kasusOptions = kasusJson.data?.data.map(k => k.JenisKasus);
      dataKasus = kasusJson.data?.data
    } else {
      kasusOptions = [];
      dataKasus = []
    }

    const kunjunganOptions = ["Rawat Jalan", "Rawat Inap"];
    const genderOptions = ["Laki-Laki", "Perempuan"];
    const statusOption = ["Aktif", "Tidak Aktif"]
    const today = new Date().toISOString().split('T')[0];

    return {
      formOptions: {
        kunjunganOptions: kunjunganOptions,
        kasusOptions: kasusOptions,
        genderOptions: genderOptions,
        statusOption: statusOption
      },
      defaultValues: {
        tanggal_kunjungan: today,
        kasus: dataKasus,
      }
    };
  } catch (err) {
    return {
      formOptions: {
        kunjunganOptions: ["Rawat Jalan", "Rawat Inap"],
        kasusOptions: [],
        genderOptions: ["Laki-Laki", "Perempuan"],
        statusOption: ["Aktif", "Tidak Aktif"]
      },
      defaultValues: {
        tanggal_kunjungan: new Date().toISOString().split('T')[0],
        dataKasus: [],
      },
      error: err.message || 'Terjadi kesalahan server'
    };
  }
}
