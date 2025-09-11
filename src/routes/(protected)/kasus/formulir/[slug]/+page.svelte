<script>
  import KasusForm from "$lib/components/KasusForm.svelte";

  export let data;
  export let form;
</script>

<KasusForm defaultValues={data.defaultValues} {form} isEditMode={true} />
