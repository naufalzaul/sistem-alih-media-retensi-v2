<script>
  import "$src/app.css";
  import Sidebar from "$components/Sidebar.svelte";
  export let data;
</script>

<Sidebar {data}>
  <slot />
</Sidebar>
