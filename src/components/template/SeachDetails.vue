<template id="searchDetails">
  <div class="">

  </div>
</template>


<script>
  export default{
    name: 'SearchDetails',
    props: [docFat]
    function(){
      return{
        fieldsDocFat: [
             {key: 'vbeln' , label: 'Doc.Fat'},
             {key: 'nf' , label: 'Nota Fiscal' },
             {key: 'dtfat' , label: 'Data do Faturamento'},
             {key: 'tipo' , label: 'Tipo'},
             {key: 'vlliq' , label: 'Valor Líquido' },
             {key: 'skus' , label: 'Sku´s' },
             {key: 'qtd' ,label:'Qtd.'},
             {key: 'descCom' , label: 'Desconto Comercial'},
             {key: 'descExtra' , label: 'Desconto Extra' }
        ],
      }
    }
  }
</script>


<style >

</style>
