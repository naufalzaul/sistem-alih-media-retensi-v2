<script>
  import PasienForm from "$lib/components/PasienForm.svelte";
  export let data;
  export let form;
</script>

<PasienForm
  formOptions={data.formOptions}
  defaultValues={data.defaultValues}
  {form}
/>
