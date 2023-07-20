<template>
  <div>
    <b-table
      v-if="i.show === true"
      small
      striped
      head-variant="dark"
      :items="lstTable"
      :style="i.show !== true ? 'display:none' : 'display:block'"
      :fields="lstClientesDetalhe"
    >
      <!-- <template #head(Status)="data">
                               <div v-if=" data.value === 'x' || data.value === 'X' ">
                                  <img style="display:block; margin:0 auto;" src="../../assets/ball-red.png"/>
                               </div>
                     </template> -->
    </b-table>
  </div>
</template>

<script>
export default {
  name: "DetalheCliente",
  props: ["lstTable"],
};
</script>

<style>
</style>