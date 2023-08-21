<template>
  <footer class="footer">
    <span
      style="font-size: 12px !important; text-decoration:underline; text-transform: lowercase;"
      >Versão: 1.3.2</span
    >
    <span
      >Copyright
      <b style="color: #e58b2a;"> CMR Industria e Comércio </b> 2022-2023</span
    >
  </footer>
</template>

<script>
export default { 
  name: "Footer",
};
</script>

<style>
.footer {
  grid-area: footer;
  /* background-color: #ddd; */
  background: rgb(68, 47, 45);
  color: white;
  border-top: 1px solid #e58b2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}
</style>
