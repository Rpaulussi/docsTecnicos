
<template>
   <div>
      <div class="container-fluid">



      
      <!-- <PageTitle icon="fa fa-list" main="Relatório de Comissões"> </PageTitle> -->
      <b-row>
      <div class="col-12 spinnerArea">
         <Spinner :state="spinner" />
      </div>
   
      

       
           
               <b-col cols="12">
                  <b-card class="cardCom" style="display: flex; justify-content: flex-start; align-items: flex-start ; padding: 10px">          
                  <ul class="listaInput">
                 
                     
                     
                     
                     
                     <li>
                    <label for="datepicker-dateformat2" >Data de apuração:</label>
                  <input type="month" class="form-control" id="datepicker-dateformat2" v-model="dataAte" :placeholder="'Data de apuração:'" />
                  
               </li> 
                 <li>
                    <b-button class="mt-3" variant="success" @click=searchComis()>Buscar</b-button>

                 </li>
               </ul>
            </b-card>
               </b-col>
               </b-row>

               <b-row>

               <b-col v-show="showFooter === true" cols="12" style="display:flex; flex-direction: row;">

                  <div class="card-body" style="width:100%; display:flex; flex-direction: row; justify-content: center;">
         <!-- <xlsxExport :table="comissionsList" :tableRaw="true" :tableName="'tableCom'" ></xlsxExport> -->
         <downloadPdf :items="comissionsList" :campos="fieldsPdf"></downloadPdf>
         <b-button class="export-options" variant="outline-secondary">
            <export-excel :data="comissionsList"  :name="`RelatorioComissao.xls`">
              <img :src="require(`@/assets/excelicon.png`)">
            </export-excel>
          </b-button>
         </div>
      
      </b-col>
            </b-row>

            <b-row>
           
               <b-col cols="12 p-0 m-0">
               
            
                                   
<div class="table-responsive m-0 p-0">
        
            <b-table v-show="comissionsList.length > 0"  :items="comissionsList" :fields="fields" class="tableCom"  sticky-header="true" head-variant="dark" small simple striped responsive="md" >
               <template #cell(descricao)="data">
                  <div v-if="data.item.descricao === 'Fatura' || data.item.descricao === 'fatura'">
                     
                     <span style="color:lightseagreen; font-weight: 600;">{{ data.item.descricao }}</span>
                  </div>
                  <div v-else>
                     <span style="   color:lightcoral; font-weight: 600">{{ data.item.descricao }}</span>
                  </div>
               </template>
               <template #cell(percentual)="data">
                     <span>{{ data.item.percentual  }}% </span>
               </template>

               <!-- <template #cell(valorBaseCalculo)="data">
                 
                     <div v-if="data.item.valorBaseCalculo > `0.00`">
                        <td style="color:lightgreen; font-weight: 600;"> {{ data.item.valorBaseDisplay }} </td>
                     </div>
                     <div v-else>
                        <td style="color:lightcoral; font-weight: 600;"> {{ data.item.valorBaseDisplay }} </td>
                     </div>
               </template> -->

             
            </b-table>
         </div>
            </b-col>
        
            <b-col cols="12 p-0 m-0">
                  <div v-show="showFooter === true" >
                     <ul style="padding:13px; margin:0;  width:100%;list-style-type:none; display:flex; flex-direction:row; justify-content: space-between; background-color:darkorange; color:black;">
                        <li style="font-weight: 600;">Total:</li>
                        <li style="color:green; font-weight: 600;">{{ valorTotal }}</li>
                     </ul>
                  </div>
            </b-col>
      </b-row>   
      </div>
   </div>
 
</template>

<script>

import { mapState } from 'vuex'
import { baseApiUrl, showError } from '@/global'
import  numeral  from 'numeral'
import Spinner from '../template/Spinner.vue'
import downloadPdf from '../commons/downloadPdf'
//import XlsxExport from '../commons/XlsxExport.vue'
//import { reduce } from 'underscore'
import axios from 'axios'
export default {
   name:"RelatorioComissao",
   components: {Spinner, downloadPdf},
   data: function(){
       return{
          lstComissoes:[],
          spinner: false,
          dataBr: new Date(),
          showFooter: false,
          valorTotal: 0,
          dataAte: "",
          comissionsList: [],
          fields: [
             {key:'codigoCliente', label:'codCliente'},
             {key:'razaoCliente', label:'RazaoSocial'},
             {key:'equipeVendas', label: 'EqpVendas'},
             {key:'descrEquipe', label:'Equipe'},
             {key:'descrEscritorio', label: 'Escritório'},
             {key:'dataPedidoClean', label: 'DataPedido'},
             {key:'dataNfClean', label: 'DataNF'},
             {key:'notaFiscal', label: 'NF'},
             {key:'ordemVenda', label:'OrdemVenda'},
             {key:'condicao', label: 'Condicao'},
             {key:'parcela', label:'Parcela'},
             {key:'descricao', label:'Descricao'},
             {key:'valorBaseDisplay', label:'VlrBaseCalc'},
             {key:'valorComDisplay', label:'VlrComissao'},
             {key:'percentual', label: 'Percentual'},

          ],
          fieldsPdf:{
            equipeVendas: "eqpeVendas",
            codigoCliente: "codCliente",
            ordemVenda: "ordemVenda",
            notaFiscal: "NF",
            descricao: "desc",
            percentual: "Perc(%)",
            razaoCliente: "Cliente",
            condicao: "Cond.",
            descrEscritorio: "Escri",
            descrEquipe: "descrEquipe",
            parcela: "parcela",
            valorBaseDisplay: "valorBaseDisplay",
            valorComDisplay: "valorComDisplay",
            dataNfClean: "DtNF",
            dataPedidoClean: "DtPedido",

          }
          

       }
   },
   methods:{
      async searchComis(){
         this.spinner = true
         this.valorTotal = 0;
         if(this.dataAte.length > 0){
            let dataUm = this.dataAte.replace(/[^0-9]/g, "")
        // console.log('dataUm', dataUm)
         let mes = dataUm.substr(4, 6);
         let ano = dataUm.substr(0, 4)
         
         

         //console.log('data', mes, ano)

                  const url = `${baseApiUrl}/pedido/getcomissao`
            await axios.post(url, {
                equipeVendas: this.user.equipeVendas,
                ano: ano,
                mes:mes
            }).then(resp => {               
               if(resp.data.status == "false"){
                  this.spinner = !this.spinner
                  showError(resp.data.msg)
                  return
               }
               this.lstComissoes = resp.data.listComissoes
               // console.log(this.lstComissoes)
               this.spinner = !this.spinner
            }).catch(() => {
               showError(this.traduction.internalError)
               this.spinner = !this.spinner
            })
            this.manageData();
         }else {
            showError('Erro: Informe uma data.')
            this.spinner = false;
         }

        
      },
      async manageData(){
         this.valorTotal = 0;
         this.comissionsList = null;
     this.comissionsList =  this.lstComissoes.map(e => {
            return {...e, valorBaseDisplay: numeral(e.valorBaseCalculo).format('$0,0.00'), valorComDisplay: numeral(e.valorComissao).format('$0,0.00'), dataNfClean: e.dataNF.substr(0, 10).replaceAll("-", "/").split("/").reverse().join('/'), dataPedidoClean: e.dataPedido.substr(0, 10).replaceAll("-", "/").split("/").reverse().join('/')}
         })

       let valor = 0
        await this.comissionsList.forEach(e => {
            valor += Number(e.valorComissao)
         })


         this.valorTotal =  numeral(valor).format('$0,0.00')
        // console.log('vlrt', this.valorTotal)
         this.showFooter = true
      }

   },
   computed: {
    ...mapState(["serverMessages", "language", "user", "traduction", 'excelDownload', 'isMenuVisible'])
  },
}
</script>

<style lang="scss" scoped>
 .cl-form{
   display: flex;
   justify-content: "";
   flex-direction: column;
   align-items: flex-start;
  
 }
 .listaInput{
   display:flex;
   flex-direction: column;
   justify-content: space-evenly;
   list-style-type: none;
   padding:0px;
   width: 300px !important;
   min-height: 200px !important;
  
 }
 .tableCom{
  min-height:50px;
  margin-bottom: 0;
 
  
   max-height: calc(100vh - 538px);
  

 }


</style>