<script>
  import KunjunganForm from "$lib/components/KunjunganForm.svelte";
  export let data;
  export let form;
</script>

<KunjunganForm
  formOptions={data.formOptions}
  defaultValues={data.defaultValues}
  isEditMode={true}
  {form}
/>
