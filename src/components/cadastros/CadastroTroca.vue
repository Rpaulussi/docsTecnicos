<template>
  <div >
    <PageTitle  icon="fa fa-undo " :main="serverMessages['troca']"></PageTitle>
    <Spinner :state="spinner"> </Spinner>
    <div v-show="!showScreen">
        <div class="main-cadastro-troca">
        <b-card>
          <b-row>
             <b-col>
              
                <b-form-group
                  :label="serverMessages['relatorioCobranca.emissor']">
                  <Dropdown
                  ref="dropdownTest"
                      class="dropdown"
                      :options= lstClientesFiltered
                      v-on:selected="onSelect"  
                      :maxItem="10000"
                      id="clientes"
                      name="clientesRep">
                  </Dropdown>
                </b-form-group>
             </b-col>
             <b-col>
                <b-form-group
                  :label="serverMessages['relatorioFaturar.setorAtividade']">
                  <Dropdown
                      class="dropdown"
                      :options = lstSetoresFiltered
                      v-on:selected="onSelectSetor"  
                      :maxItem="10000"
                      id="setor"
                      name="setorAtividade">
                  </Dropdown>
                </b-form-group>
             </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group
                  :label="traduction.exchangeTo">
                  <b-form-radio-group v-model="radioOptions" default="A">
                     <b-form-radio selected value="A" class="space">Pessoa Jurídica</b-form-radio>
                     <b-form-group v-if="radioOptions === 'A'" class="mt-2">
                       <b-col sm="12">
                         <b-form-input v-model="nfenum" maxlength="8" :placeholder="serverMessages['cadastro.cliente.numero']"></b-form-input>
                       </b-col>                    
                     </b-form-group>  
                     <b-form-radio @change="clearNfe()" value="F" class="space">{{ serverMessages['relatorioCobranca.emissor']}} Final</b-form-radio>
                  </b-form-radio-group>
               </b-form-group>
            </b-col>
            <b-col>
               <b-form-group :label="serverMessages['trocaEstatistico.relatorio.dataTroca']">{{dateNow}}</b-form-group>
            </b-col>
          </b-row>
        
      </b-card>
      <b-card class="text-area m-0">
        <b-form-group  label-size="sm" label='Obs: Max 250 Caracteres' style="color:black">
            <b-form-textarea 
              v-model="observacao"
              id="textarea"    
              rows="5"
              :state="observacao.length <= 250 ? true : false"         
              max-rows="6">
            </b-form-textarea>
            <p style="font-size:10px; color:grey">{{ observacao.length }}</p>

        </b-form-group>
      </b-card>
      </div>
      <!-- <div>
        <b-button  variant="primary" @click="onSelect2">Toggle Collapse</b-button>
      </div> -->

      
         <b-collapse :visible="showColapse" id="collapse-1">
           <hr class="my-4">
           <div class="buttons-selectArea"> 
              <div class="buttons-menu-area">
                  <b-button class="mr-2 " id="btnConsultar" variant="success" :disabled="listProdutosTroca.length === 0 || controlSavetroca === true" @click="saveTroca">{{ serverMessages['pedido.cadastro.gravar'] }}</b-button>
                  <b-button class="mr-2 " id="btnIncluir"   variant="primary" @click="showProductSelecion">{{ serverMessages['geral.incluir'] }} / {{ serverMessages['geral.alterar'] }} {{ serverMessages['pedido.cadastro.produtos.produto'] }} </b-button>
                  <b-button class="mr-2 " id="btnNovaTroca" variant="primary" @click="clearFields()">{{ serverMessages['troca.novaTroca'] }}</b-button>
                  <b-button class="mr-2 "  id="btnExcluir"   variant="danger" :disabled="listProdutosTroca.length === 0" @click="$bvModal.show('modal-scoped')" >{{ serverMessages['pedido.cadastro.excluir'] }}</b-button>
              </div>
            </div>
         </b-collapse>
         <hr class="my-4">
         <b-table striped hover responsive ref="tableTroca" class="trocaTable" id="trocaTable" style="margin-bottom:0;" reponsive  v-show="listProdutosTroca.length > 0" :items="listProdutosTroca" :fields="fields">
           <template  #cell(marca)="data">
              <span v-if="data.item.child !== true">{{data.value}}</span>
            </template> 
            <template  #cell(tamanho)="data">
              <span v-if="data.item.child !== true">{{data.value}}</span>
            </template> 
            <template  #cell(cor)="data">
              <span v-if="data.item.child !== true">{{data.value}}</span>
            </template> 
            <template  #cell(copa)="data">
              <span v-if="data.item.child !== true">{{data.value}}</span>
            </template> 
            <template  #cell(descricao)="data"> 
              <span v-if="data.item.child !== true">{{data.value}}</span>
            </template>
            <template  #cell(vl_format)="data">
              <span v-if="data.item.child !== true">{{data.value}}</span>
            </template> 
            <template  #cell(defeito)="data">
              <span>{{data.value}}</span>
            </template> 
            <template  #cell(proText)="data">
              <span>{{data.value}}</span>
            </template>
            <template  #cell(precoView)="data">
              <span v-if="data.item.child !== true">{{data.value}}</span>
            </template> 
            <template  #cell(quantidade)="data">
              <span v-if="data.item.child !== true">{{data.value}}</span>
            </template>       
            <template  #cell(sel)="data">
              <b-form-checkbox @change="markItens(data.item)" v-if="data.item.child !== true"  value="X" v-model="data.item.sel" > </b-form-checkbox>
            </template> 
         </b-table>
         <div v-if="listProdutosTroca.length > 0" class="Footer" style="background-color:orange; padding: 5px ; border-radius:10px ; margin-top:10px">
              <span><b>{{ serverMessages['relatorioFaturar.ordem.quantidade'] }} - {{quantTotal}}</b></span>
              <span><b>{{ serverMessages['pedido.cadastro.valorBruto'] }} - {{valorTotal}}</b></span>
         </div>
    </div>   
    <div v-if="showScreen" class="mt-2 filterSelection">
        <SelecaoProdutoExterno :cliente="clientSelected ? clientSelected.nome : '' " :setor="setorSelected" :canal="canal"  :cond="condpag" moeda="BRL" pais="BRASIL" :caller="'cadTroca'" :referencias="lstReferencias"></SelecaoProdutoExterno>    
    </div>
    <b-modal id="modal-scoped" ref="modal-scoped" >
        <template #modal-title>
          {{ serverMessages['geral.confirmar'] }}
        </template>
        <span>{{ serverMessages['pedido.cadastro.excluir'] }}</span>
        <template #modal-footer="{ cancel }">
          <!-- Emulate built in modal footer ok and cancel button actions -->
          <b-button size="sm" variant="success" @click="deleteItens($event)" >
            {{ serverMessages['relatorio.mixProduto.sim'] }}
          </b-button>
          <b-button size="sm" variant="danger" @click="cancel()">
            {{ serverMessages['geral.cancelar'] }}
          </b-button>

          <b-table v-show="true"
          id="downloadArrays"
          ref="downloadArrays"
          :items="downloadArray"
          ></b-table>
        </template>
  </b-modal>


  

  <!-- <b-modal ref="modalSuccess" id="modalSuc" static lazy hide-backdrop no-close-on-esc no-close-on-backdrop  ok-only>
    
    <template #modal-header style="padding:10px !important;">
      <span >Cadastro de Trocas.</span>
    </template>

   
        <div class="modalText" >
            <h6>{{ successMsg }}</h6>
        </div>

        <template #modal-footer="{ ok }">
          <b-button size="xl" variant="danger" @click="ok()"> OK </b-button>
        </template>
        
  </b-modal> -->

  </div>

  
</template>

<script>
import PageTitle  from '../template/PageTitle.vue'
import SelecaoProdutoExterno from '../commons/SelecaoProdutoExterno.vue'
import Dropdown from 'vue-simple-search-dropdown'
import { baseApiUrl ,showError , showSuccess} from '@/global'
import _ from "underscore";
import axios from  'axios'
import Spinner from '../template/Spinner.vue'
import { mapState } from "vuex";
import { format } from 'date-fns'
import numeral from 'numeral'
export default {
   name:"CadastroTroca",
   components:{ PageTitle , SelecaoProdutoExterno ,Dropdown , Spinner },
   computed: {
    ...mapState(["serverMessages","language","traduction","user","showScreen","listProdutosTroca","repSelected", "router"]),
   },
   watch: {
      listProdutosTroca: function(){
        this.valorTotal =  numeral(_.reduce(_.filter(this.listProdutosTroca, el => el.child !== true), (vlrAnt , current) => { return vlrAnt + current.vl_tot},0)).format('$0,0.00')
        this.quantTotal =  _.reduce(_.filter(this.listProdutosTroca, el => el.child !== true), (vlrAnt , current) => { return vlrAnt + parseInt(current.quantidade)},0)
      }
   },
   data: function() {
     return {
        downloadArray: {},
        wtSaved: [],
        radioOptions: 'A',
        controlSavetroca: false,
        nfenum: null,
        dateNow: format(new Date(),'dd/MM/yyyy'),
        showColapse: false,
        setorSelected:null,
        spinner: false,
        colap: false,
        lstClientes:[],
        lstClientesFiltered:[],
        clienteInfo:null,
        clientSelected:null,
        lstSetores:[],
        lstSetoresFiltered:[],
        lstReferencias:[],
        lstRecebedor:[],
        condpag:null,
        canal:null,
        moeda:null,
        quantTotal: null,
        valorTotal: null,
        observacao:'',
        canalname:null,
        successMsg : [],
        fields: [
              {key: 'sel' , label: ''},
              {key: 'marca' , label: 'Marca'},
              {key: 'referencia' , label: 'Ref'},
              {key: 'tamanho' , label: 'Tamanho'},
              {key: 'copa' , label: 'Copa'},
              {key: 'cor', label: 'Cor'},
              {key: 'descricao' , label: 'Produto'},
              {key: 'precoView' , label: 'Valor Item'},
              {key: 'vl_format' , label: 'Total Item'},
              {key: 'quantidade' , label: 'Quantidade'},
              {key: 'defeito', label: 'Defeito'},
              {key: 'proText' , label: 'Procedimento'},
            ]
     }
   },
   methods:{
     onSelect(selection){
         selection ? this.clientSelected = this.lstClientes.find(e => e.id  === selection.id): this.clientSelected = null
         this.clientSelected ? this.loadClientInfo(this.clientSelected) : ''     
     },
     clearFields(){
        this.condpag = null
        this.canal = null
        this.canalName = null
        this.colap = false
        this.lstRecebedor = null
        this.lstReferencias = null
        this.nfenum = null
        //this.setorSelected = null
        this.moeda = null
        this.quantTotal =  null
        this.valorTotal =  null
        this.observacao = ''
        this.canalname = null
        //this.clienteInfo = null

        this.lstSetores = null
        this.$store.state.listProdutosTroca = []
     
       // this.$refs.tableTroca.reset();
        
        //this.lstSetoresFiltered = null
        //this.listProdutosTroca = null
        
        

     },
     onSelectSetor(select){
      //  this.$root.$emit('bv::toggle::collapse', 'collapse-1') 
       this.setorSelected = select
     },
     showProductSelecion(){

       if(this.setorSelected.id){
          
          this.loadReferencias()
       }else{
          showError("O setor de atividade dever ser preenchido !")
       }
        
     },
     markItens(item){
       let array = []
       array = this.listProdutosTroca
       array.forEach(element => {
            if(element.id === item.id){
               if(item.sel === ''){
                  element.sel = ''
               }
               else if(item.sel === 'X'){
                  element.sel = 'X'
               }         
            }
       });
       
       this.$store.commit("setListaRejectItens",array)

     },
     saveTroca(){
     //console.log('saveTroca', this.listProdutosTroca)
      this.wtSaved = []
       if(this.radioOptions === 'A' && this.nfenum === null){
            showError("Necessario indicar o numero da nota")
            return
       }    
       this.spinner = true
       this.controlSavetroca = true
     
              
              //console.log('arrays', this.downloadArray)
            const url = `${baseApiUrl}/pedido/savetroca`
                axios.post(url, {
                  PCanal: this.canal,
                  PCliente: this.clientSelected.id,
                  PCondPgto: this.condpag,
                  PDivisao: "",
                  PDtEmissao: format(new Date(),'yyyy-MM-dd'),
                  PDtReceb: "",
                  language: this.language,
                  PNfeDev: this.nfenum,
                  PNumPedido: "",
                  PObs: this.observacao,
                  PObsSac: "",
                  POrgVda: "1000",
                  PRecebedor: "0000114948",
                  PSetor: this.setorSelected.id,
                  PUserName: this.repSelected.high ? this.repSelected.high : this.user.loginUsuario,
                  TItem: this.listProdutosTroca.map(element => {
                    return{
                        CodDefeito: element.defeitoCod,
                        CodProcedimento: element.procedimento,
                        DtFinalizacao:'',
                        Material: element.id,
                        NumPedido: '',
                        NumeroMip: '',
                        Quantidade: 1,
                        Seq: element.ordem,
                        Valor: element.preco                  
                    }
                  })

              }).then(resp =>{
                this.spinner = false
                
                this.wtSaved.push(resp.data.numWT)
               // console.log('resp save troca', resp)
                this.successMsg = resp.data.message
              
                //this.$refs['modalSuccess'].show()
               if(resp.data.result === 'OK'){
                 
                 showSuccess(resp.data.message) 
                 this.controlSavetroca = false       
                 this.printDataSavedTroca();
                //  setTimeout(this.$router.go(), 5000) 
                 //this.$router.go();
             
               
               }
               else if(resp.data.Result === 'ERROR'){
                showError(this.traduction.internalError)
                this.controlSavetroca = false

               }
              
               
              }).catch(() =>{
                showError(this.traduction.internalError)
                this.spinner = false
                this.controlSavetroca = false
                //console.log(err)
              });
        
     },
     clearNfe(){
        this.nfenum = null
     },
     
     async printDataSavedTroca() {

      //console.log('generateDownload')
     let header = [];
     header.push('CMR Ind. Comércio');
     header.push(this.wtSaved !== null ? this.wtSaved : this.nfenum)
     header.push(this.dateNow)
     header.push( `${this.repSelected.high ? this.repSelected.high : this.user.loginUsuario}`)
     header.push(this.nfenum)
     header.push(this.setorSelected.name)

     
      let g = document.querySelector(".trocaTable").innerHTML;

      
        await this. $nextTick(function () {
          let h = window.open('')
   
         h.document.write(`<div class="tableLoad" style="display:block;"><h2 style=" width:100%; text-align:center; background-color:black; color:white;margin: 2px 0px;">CMR Indústria e Comércia Ltda. - Cadastro de Trocas - DetalheWt - ${this.dateNow}</h2><table style="width:100%; margin-bottom:18px;"> <tr style="border: 2px solid black"> <th style="font-size:16px; background-color:#ede7f6; padding:5px;"> Numero WT:</th> <th style="font-size:16px; background-color:#ede7f6; padding:5px;">Representante: </th> <th style="font-size:16px; background-color:#ede7f6; padding:5px;">Troca Para: </th> <th style="font-size:16px; background-color:#ede7f6; padding:5px;">Cliente:</th> <th style="font-size:16px; background-color:#ede7f6; padding:5px;">Emissão: </th> <th style="font-size:16px; background-color:#ede7f6; padding:5px;">Setor Atividade:</th>  <th style="font-size:16px; background-color:#ede7f6;">OBS. Representante:</th></tr> <tr> <td style="background-color:#F5F5F6; font-size:16px; text-decoration:underline;"> ${this.wtSaved} </td>  <td style="background-color:#F5F5F6; font-size:16px; text-decoration:underline;"> ${this.user.dataOperadorNome} </td> <td style="background-color:#F5F5F6; font-size:16px; text-decoration:underline;"> ${this.radioOptions === 'F' ? 'Cliente Final' : 'Pessoa Jurídica'} </td>  <td style="background-color:#F5F5F6; font-size:16px; text-decoration:underline;"> ${this.clientSelected.nome}  </td> <td style="background-color:#F5F5F6; font-size:16px; text-decoration:underline;"> ${this.dateNow} </td>  <td style="background-color:#F5F5F6; font-size:16px; text-decoration:underline;"> ${this.setorSelected.name }</td> <td style="word-wrap:wrap; ">${this.observacao}</td> </tr> </table>` + g + `<ul style="padding:0; width:100%; list-style-type:none; display:inline-flex; justify-content:space-evenly;"> <li style="font-size:16px;">Valor Total: <b style="color:red">${this.valorTotal}</b></li> <li>Quantidade Total: <b style="color:red">${this.quantTotal}</b></li>  </ul></div>` + `<style>table, th, td {border:1px solid black;} .tableLoad{max-width:2400px; } table{width:100%;}</style>`);
         
         h.print();
         h.close();
       
    this.clearFields();
  })
      
    },
     deleteItens(e){
       e.preventDefault()
       let array = _.reject(this.listProdutosTroca , el => el.sel === 'X')
       this.$store.commit("setListaRejectItens",array)
       this.$refs['modal-scoped'].hide()
     },
     loadCustomers(){
       this.spinner = true
       const url = `${baseApiUrl}/cliente/repclientes`
          axios.post(url,{
            language: this.language,
            loginUsuario: this.repSelected.high ? this.repSelected.high : this.user.loginUsuario,
            codrep: ""
        }).then(resp =>{
          this.spinner = false
          this.lstClientes = resp.data.clientes
          this.lstClientesFiltered = resp.data.clientes.map(ele =>{
              return  {id: ele.id , name: `${ele.id} - ${ele.nome}`}   
          })                     
        }).catch(() =>{
            showError(this.traduction.internalError)
            this.spinner = false
        });
     },
     loadClientInfo(cliente){
       this.spinner = true
       const url = `${baseApiUrl}/cliente/getinfotoorder`
          axios.post(url,{
            clienteId: cliente.id,
            condpag: cliente.codListaPrecoCondPagto,
            language: this.language,
            moeda: cliente.moeda,
            nome: cliente.nome,
            representante:this.repSelected.high ? this.repSelected.high : this.user.loginUsuario,
            rz: cliente.nome
        }).then(resp =>{
          
          this.clienteInfo = resp.data
          this.condpag = this.clienteInfo.clienteLangRQ.cliente.codListaPrecoCondPagto
          this.moeda = this.clienteInfo.clienteLangRQ.cliente.moeda
          this.canal = this.clienteInfo.clienteLangRQ.canalDistribuicao.id
          this.canalname = this.clienteInfo.clienteLangRQ.canalDistribuicao.nome
      
          //Arrays Originais 
          this.lstSetores = resp.data.listSetorAtividade
          this.lstRecebedor = resp.data.listRecebedor
          this.lstSetoresFiltered = this.lstSetores.map(el => {return { id: el.id , name: `${el.id} - ${el.nome}`}})
          this.showColapse = true
          
          this.spinner = false

        }).catch(() =>{
            showError(this.traduction.internalError)
            this.spinner = false
        });
     },
     loadReferencias(){
       this.spinner = true
      
       const url = `${baseApiUrl}/produto/GetRefProduto`
          axios.post(url,{
          clienteId: this.clienteInfo.clienteLangRQ.cliente.id,
          condpagid: this.clienteInfo.clienteLangRQ.cliente.codListaPrecoCondPagto,
          flgFora:'',
          lista: "03.05.08.11.18.38.90.99",
          pais: "BRASIL",
          tipoOrdem: "",
          canaldistribid: this.clienteInfo.clienteLangRQ.canalDistribuicao.id,
          canaldistribnome: this.clienteInfo.clienteLangRQ.canalDistribuicao.nome,
          setoratividadeid: this.setorSelected.id,
          setoratividadenome: this.setorSelected.name,
          language: this.user.language,
          moeda: this.clienteInfo.clienteLangRQ.cliente.moeda,
          nome: this.clienteInfo.clienteLangRQ.cliente.nome,
          representante:this.user.loginUsuario,
          rz: this.clienteInfo.clienteLangRQ.cliente.nome
        }).then(resp =>{        
          //Arrays Originais 
          this.lstReferencias = resp.data          
          this.spinner = false
          this.$store.commit('setShowScreen',true)
        }).catch(() =>{
            showError(this.traduction.internalError)
            this.spinner = false
        });
     },
     returnQuant(){
       
     },
     returnValue(){
      return _.reduce(this.listProdutosTroca, (vlrAnt , current) => { vlrAnt = vlrAnt + current.vl_tot},0)
     },
     
   },
   mounted(){
      this.loadCustomers()
      this.$store.commit('toggleMenu')
      //this.printDataSavedTroca()
   },
   beforeDestroy(){
      this.$store.commit('setShowScreen',false)
      this.$store.commit('setListaRejectItens',[])
   }
   
}
</script>

<style lang="scss" scoped>

 .modal-open .modal{
  background:black !important;
 }
  
.text-area{
  box-shadow:1px 1px 1px 1px #e58b2a;
  min-width:360px;
  max-width:420px;
  padding:0px;

.card-body{
  box-shadow: 0px 0px 0px 0px;
  margin:0px !important;

}
}

.buttons-selectArea{
  background-color:white;
  box-shadow:1px 1px 1px 1px #e58b2a !important;
  margin:10px 0px;
  border-radius:25px;
  padding:20px 0px;

}

   .main-cadastro-troca{
     display: flex;
     justify-content: flex-start;
     flex-wrap: wrap;
     padding:10px 0px 0px 24px;
     
   }
    
   .buttons-menu-area{
      display: flex;
      justify-content: center;
   }
   .Footer{
     display: flex;
     justify-content: space-around;
   }
   .blackBg{
    background:black;
   }
   
  
</style>