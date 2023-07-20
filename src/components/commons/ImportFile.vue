<template>
   <div>  
    
      <b-modal id="LoadFile" ref="load-file">
      <!-- <b-spinner v-if="showspinner" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner> -->
      <b-overlay :show="showspinner" rounded="sm">
        <input v-on:change="loadFiles($event)" type="file" ref="formFile"  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xls"  class="mt-3" plain>
      </b-overlay> 
      <p v-if="showspinner" style="text-align: center; margin-top: 25px;" >Buscando dados no ERP...</p>
     </b-modal>

     <b-modal id="ShowRejectItens" ref="reject-itens" title="Skus Rejeitados">
      <p class="my-4">Os Skus abaixo não estão disponiveis para venda ou não foram encontrados no ERP</p>
      <b-table striped hover :items="lstRejectItens"></b-table>
      
     </b-modal>

    
    
   <b-button class="mr-2" @click="showModalPlan()">Upload Planilha</b-button>
   </div>
   
</template>

<script>
import * as XLSX from 'xlsx'
import _ from "underscore"
import { baseApiUrl, showError } from '@/global'
import axios from  'axios'
import { mapState } from "vuex"
export default {  
    name:"ImportFile",
    data(){
        return{
           lstRefs :[],
           lstProdutos:[],
           lstRefFormat:[],
           lstFileData:[], 
           lstRejectItens:[],
           showspinner : false
        }
    },
    computed: {
    ...mapState(["showScreen","language","user" ,"listProdutosTroca","commandSave","showOrNo","priceManu", "serverMessages", "showModal","lstOrdersItens","planpedido"]),
   },
   props:{
      canal : Object,
      cliente: Object,
      pais :Object,
   },
    methods:{
    loadFiles : function(event){
     
 
    // console.log('event', event)

     this.$nextTick(() => {

    
     this.file = event.target.files ? event.target.files[0] : null;
   if (this.file) {
     const reader = new FileReader();

     reader.onload = (e) => {
       /* Parse data */
       const bstr = e.target.result;
       const wb = XLSX.read(bstr, { type: 'binary' , cellDates: true, dateNF: 'yyyy/mm/dd;@'});
       /* Get first worksheet */
       const wsname = wb.SheetNames[0];
       const ws = wb.Sheets[wsname];
       /* Convert array of arrays */
       /*eslint-disable*/
       const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      let objRequest =  data.map((el) => {

        return {
             sku : el[0],
             qtd : el[1]
        }
        })

        //console.log('TABLE' , objRequest)

        this.lstFileData = objRequest
        this.showspinner = true
        this.manipulateArray()
          let refList = []
        this.lstRefs.forEach(element => {
          refList.push(element.ref)
          // this.searchProductsByRef(element.ref)
        });

        this.searchStacked(refList)

        console.log('refList', refList)
       

     }

     reader.readAsBinaryString(this.file);

   } })      
    
 },
  showModalPlan(){
    this.$refs["load-file"].show()
    this.lstFileData = []
    this.lstProdutos = []
    this.lstRefs =[]
    this.lstRejectItens = []
  },
  async searchStacked(refer){
    this.spinner = true
            const url = `${baseApiUrl}/produto/GetSkusplan`
             await axios.post(url,{
                language: this.user.language,
                canaldistribid: this.canal.id,
                canaldistribnome: "",
                condpagid: "",
                flgFora:"",
                //listapreco: this.moeda === 'EUBR' ? 'E2': this.moeda === 'USD' ? 'E0' : this.listapreco,
                listapreco: this.cliente.codListaPrecoCondPagto,
                moeda:this.cliente.moeda,
                pais:this.pais.nome,
                referencia: '',
                referencias: refer,
                setoratividadeid:'03',
                setoratividadenome: ""
            }).then(resp =>{
                this.spinner = false
               // this.precoLista = numeral(resp.data[0]["preco"]).format('$0,0.00')
                this.lstProdutos = this.lstProdutos.concat(resp.data)
                this.lstRefFormat = _.unique(this.lstProdutos.map(el =>{
                    return {
                        referencia: el.referencia,
                        /* eslint-disable */
                        cores: _.map(_.unique(_.map(this.lstProdutos, elemento => elemento.cor)),el => {return {cor: `${el} - ${_.find(this.user.lstCoresDiasLimite.cores,elemento => elemento.id === el) ? _.find(this.user.lstCoresDiasLimite.cores,elemento => elemento.id === el)['nome']:'Cor desconhecida'}` , open:false ,produtos: _.filter(this.lstProdutos , produto => produto.cor === el)}})
                     /* eslint-enable */
                    }
                }),el => el.referencia)
                
                 //this.$store.commit("setShowOrNo",true)

                 //console.log("PRODUTOS:",this.lstProdutos)

            }).catch(() =>{
                
                showError(this.traduction.serverError)
                this.spinner = false
            });
             this.$nextTick(() => {
          this.FilterValidItens()
        })
    
  },
  showReject(){
    this.$refs["load-file"].hide()
    if(this.lstRejectItens.length > 0)
       this.$refs["reject-itens"].show()
  },
  manipulateArray(){

    this.lstProdutos = []
    //Eliminar registros duplicados 
    this.lstFileData = _.uniq(this.lstFileData, e => e.sku)

    //Consolidar referencias 
    this.lstRefs = this.lstFileData.map( e => {
       return {
          ref: e.sku.substr(2,5)
       }
    }
    )
    //Eliminar referencias duplicadas 
    this.lstRefs = _.uniq(this.lstRefs,e => e.ref)
    //console.log(this.lstRefs)
  }, 
  searchProductsByRef(ref){
    console.log(ref, 'importFile', 'searchProdutsByRef')
    this.spinner = true
            const url = `${baseApiUrl}/produto/getprodutoinfo`
            axios.post(url,{
                language: this.user.language,
                canaldistribid: this.canal.id,
                canaldistribnome: "",
                condpagid: "",
                flgFora:"",
                //listapreco: this.moeda === 'EUBR' ? 'E2': this.moeda === 'USD' ? 'E0' : this.listapreco,
                listapreco: this.cliente.codListaPrecoCondPagto,
                moeda:this.cliente.moeda,
                pais:this.pais.nome,
                referencia: ref,
                setoratividadeid:'03',
                setoratividadenome: ""
            }).then(resp =>{
                this.spinner = false
               // this.precoLista = numeral(resp.data[0]["preco"]).format('$0,0.00')
                this.lstProdutos = this.lstProdutos.concat(resp.data)
                this.lstRefFormat = _.unique(this.lstProdutos.map(el =>{
                    return {
                        referencia: el.referencia,
                        /* eslint-disable */
                        cores: _.map(_.unique(_.map(this.lstProdutos, elemento => elemento.cor)),el => {return {cor: `${el} - ${_.find(this.user.lstCoresDiasLimite.cores,elemento => elemento.id === el) ? _.find(this.user.lstCoresDiasLimite.cores,elemento => elemento.id === el)['nome']:'Cor desconhecida'}` , open:false ,produtos: _.filter(this.lstProdutos , produto => produto.cor === el)}})
                     /* eslint-enable */
                    }
                }),el => el.referencia)
                
                 //this.$store.commit("setShowOrNo",true)

                 //console.log("PRODUTOS:",this.lstProdutos)

            }).catch(() =>{
                
                showError(this.traduction.serverError)
                this.spinner = false
            });
  },
   FilterValidItens(){
    let lstFiltered = []

     if(this.lstFileData.length > 420){
      showError("Quantidade da planilha excede o limite de 420 skus")
      return
     }
        this.lstFileData.forEach(el =>{
           let obj = this.lstProdutos.find(elem => { return elem.id === el.sku })
           if(obj){
            obj.quantidade = el.qtd
            obj.precoCalc = obj.preco
            obj.index = ''
             lstFiltered.push(obj)
           }else{
            this.lstRejectItens.push(el)
           }
        })
        
       // console.log("Filtrado",lstFiltered)
        
        
        this.$store.commit('setListaRejectOrdersItens',lstFiltered)
        this.$store.commit('setPlanToSave',lstFiltered.length + Math.random())
        this.showReject()  
        this.showspinner = false
   }


    },
  mounted(){
    //this.showModalPlan()
  }
}
</script>

<style>

</style>