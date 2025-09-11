<script>
  import Icon from "@iconify/svelte";
</script>

<section class="space-y-6">
  <div class="bg-white rounded-2xl overflow-hidden shadow-md">
    <div class="relative">
      <div class="w-full h-40 bg-gray-300"></div>
    </div>

    <div
      class="flex flex-col md:flex-row items-center md:items-start px-6 pt-6 pb-8 gap-6 md:gap-10"
    >
      <div class="-mt-16 shrink-0 relative z-10">
        <img
          src="https://i.pravatar.cc/120"
          alt="Avatar"
          class="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
        />
      </div>

      <div class="flex-1 w-full">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-800">Mathew Anderson</h2>
            <p class="text-sm text-gray-500">Designer</p>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <button
              class="text-white bg-violet-600 hover:bg-violet-700 text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
            >
              Add to Story
            </button>
            <a href="#" class="text-blue-500 hover:text-blue-600">
              <Icon icon="mdi:facebook" class="text-xl" />
            </a>
            <a href="#" class="text-sky-500 hover:text-sky-600">
              <Icon icon="mdi:twitter" class="text-xl" />
            </a>
            <a href="#" class="text-pink-500 hover:text-pink-600">
              <Icon icon="mdi:instagram" class="text-xl" />
            </a>
            <a href="#" class="text-red-500 hover:text-red-600">
              <Icon icon="mdi:youtube" class="text-xl" />
            </a>
          </div>
        </div>

        <div class="mt-6 flex justify-start gap-10 text-sm text-gray-700">
          <div class="text-center">
            <div class="font-bold text-base">938</div>
            <div class="text-gray-400">Posts</div>
          </div>
          <div class="text-center">
            <div class="font-bold text-base">3,586</div>
            <div class="text-gray-400">Followers</div>
          </div>
          <div class="text-center">
            <div class="font-bold text-base">2,659</div>
            <div class="text-gray-400">Following</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <div
      class="bg-white rounded-2xl p-6 shadow-md divide-y divide-gray-200 space-y-6"
    >
      <div class="space-y-4">
        <h3
          class="text-base font-semibold text-gray-600 uppercase tracking-wide"
        >
          Informasi Pengguna
        </h3>

        <div class="flex items-center gap-3 text-[15px] text-gray-800">
          <Icon icon="mdi:account" class="text-emerald-500 text-lg" />
          <span class="font-medium">Nama Lengkap:</span>
          <span class="text-gray-700">Nicholas Swatz</span>
        </div>

        <div class="flex items-center gap-3 text-[15px] text-gray-800">
          <Icon
            icon="mdi:account-box-outline"
            class="text-emerald-500 text-lg"
          />
          <span class="font-medium">Username:</span>
          <span class="text-gray-700">nicholas.swatz</span>
        </div>

        <div class="flex items-center gap-3 text-[15px] text-gray-800">
          <Icon icon="mdi:email-outline" class="text-emerald-500 text-lg" />
          <span class="font-medium">Email:</span>
          <span class="text-gray-700">nicholasswatz@gmail.com</span>
        </div>

        <div class="flex items-center gap-3 text-[15px] text-gray-800">
          <Icon icon="mdi:lock-outline" class="text-emerald-500 text-lg" />
          <span class="font-medium">Password:</span>
          <span class="text-gray-700">••••••••</span>
        </div>

        <div class="flex items-center gap-3 text-[15px] text-gray-800">
          <Icon
            icon="mdi:account-cog-outline"
            class="text-emerald-500 text-lg"
          />
          <span class="font-medium">Role:</span>
          <span class="text-gray-700">Administrator</span>
        </div>

        <div class="flex items-center gap-3 text-[15px] text-gray-800">
          <Icon icon="mdi:shield-check" class="text-emerald-500 text-lg" />
          <span class="font-medium">Status:</span>
          <span class="text-gray-700">Aktif</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-6 shadow-md space-y-6">
      <h3 class="text-base font-semibold text-gray-600 uppercase tracking-wide">
        Riwayat Aktivitas
      </h3>

      <div class="space-y-4 text-[15px] text-gray-800">
        <div class="flex items-center gap-3">
          <Icon icon="mdi:file-document" class="text-emerald-500 text-lg" />
          <span class="font-medium">Total Pengajuan:</span>
          <span class="text-gray-700">12 Berkas</span>
        </div>

        <div class="flex items-center gap-3">
          <Icon
            icon="mdi:clock-time-eight-outline"
            class="text-emerald-500 text-lg"
          />
          <span class="font-medium">Terakhir Aktif:</span>
          <span class="text-gray-700">29 Juli 2025 - 09:30 WIB</span>
        </div>

        <div class="flex items-center gap-3">
          <Icon icon="mdi:calendar-plus" class="text-emerald-500 text-lg" />
          <span class="font-medium">Dibuat Pada:</span>
          <span class="text-gray-700">12 Maret 2024</span>
        </div>

        <div class="flex items-center gap-3">
          <Icon icon="mdi:account-multiple" class="text-emerald-500 text-lg" />
          <span class="font-medium">Dibuat Oleh:</span>
          <span class="text-gray-700">Admin Sistem</span>
        </div>
      </div>
    </div>
  </div>
</section>
