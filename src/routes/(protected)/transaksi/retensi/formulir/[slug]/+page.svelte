<script>
  import TransaksiForm from "$lib/components/TransaksiForm.svelte";
  export let data;
  export let form;
</script>

<TransaksiForm
  formOptions={data.formOptions}
  defaultValues={data.defaultValues}
  {form}
  isEditMode={true}
  title="Retensi"
/>
