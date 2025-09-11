<script>
  export let data;
</script>

<svelte:head>
  <title>{data.system?.NamaAplikasi}</title>
  <meta name="description" content={data.system?.Deskripsi} />
  <link rel="icon" href={data.system?.Logo} />
</svelte:head>

<slot />
