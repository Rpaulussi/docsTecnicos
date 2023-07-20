<template>
    <div class="produtoExterno-wrapper">
        
        <Spinner :state="spinner"> </Spinner>
        <div class="main-selection-produto">
            <div v-if="caller !== 'Manutencao'">
               <b-form-group :label="serverMessages['clientes']">
                   <span style="word-spacing:2px; font-weight: 500; ">{{ cliente.replace(/[a-zA-Z-]/g, "")  }}   -   {{ cliente.replace(/[0-9]/g, "") }}</span>
               </b-form-group>
            </div>
            <div>
              <b-form-group :label="serverMessages['trocaEstatistico.relatorio.referencias.referencia']">
                <JqxComboBox ref="comboBoxRefes" @close="onClose($event)" class="comboBoxtester" :source="referencias" :width="200" :height="25" displayMember="text" valueMember="value" />
              </b-form-group>
            </div>
            <div v-if="caller !== 'Manutencao'" class="button-area-produto">
               <b-button class="mr-2" id="btnSalvar" variant="success" @click="save()">{{ serverMessages['noticia.cadastro.submit'] }}</b-button>
               <b-button class="mr-2" id="btnVoltar" variant="danger" @click.prevent="backToMain" >{{ this.serverMessages['geral.voltar']}}</b-button>
            </div>
        </div>
        <b-collapse :visible="showOrNo && showAfterLoaded" id="collapse-1">
            <div class="main-product-area">
                 <div class="box-product-area">
                  <img class="box-product-img"  alt="Imagem do Produto" :src="loadedImg">
                  <div lclass="box-product-txt">
                     <span style="width:100%; color:white; font-size:0.9rem !important;" class="preco">{{ serverMessages['pedido.cadastro.produtos.precoLista'] }}:  </span>
                    <span style="width:100%; display:flex; ;  justify-content:center; color:white;"> <a style="color:white; font-size:1.3rem !important; font-weight:600; text-decoration:none; text-align:center;"  href="#" class="preco-link">{{ precoLista }} </a></span>
                     <b-form-group v-if="caller === 'Pedido'" class="preco ml-2" style="text-align: center; color:white;" :label="serverMessages['pedidoProduto.valorPadrao']"> 
                       <b-form-input type="number" class="input-area-manual" v-if="caller === 'Pedido'" v-model="precoManual" @change="checkPreco()" placeholder=""></b-form-input>
                     </b-form-group>
                  </div>
                </div>
               <div class="table-itens"  v-for="value in lstRefFormat" v-bind:key="value.referencia">
                <div class="preco-itn">
                    <span><b>{{ serverMessages['pedido.cadastro.produtos.produto'] }}</b></span>
                </div>
                <div >
                    <div v-on:click="onClickToggleRef()"><i :class="refOpen ? 'fa fa-folder-open-o' : 'fa fa-folder'"></i><span class="ml-2">{{`Referência: ${value.referencia}`}}</span></div>
                    <div class="ml-2" v-for="(val , i) in value.cores" v-bind:key="val.cor" >
                        <i :class="val.open  ? 'fa fa-folder-open-o' : 'fa fa-folder'" v-on:click="onClickToggle(i)" ></i>
                        <span class="ml-2" :style="val.open ? 'color:green; font-weight:600; text-decoration:underline;':'color:#eb7a09; font-weight:600; text-decoration:underline;'">{{val.cor}}</span>
                        <transition name="fade">                   
                          <SelecaoProdutosItens  v-on:keypress.tab.prevent="" :tabindex="2" v-if="caller === 'Manutencao'" :trocapara="trocapara" :mainindex="mainindex" caller= 'Manutencao'  class="produtos" v-show="val.open" :listaProdutos="val.produtos"></SelecaoProdutosItens>
                         <SelecaoProdutosItens  v-on:keypress.tab.prevent="" :tabindex="1" v-else-if="caller === 'Pedido'" :corSelected="corSelected" :valorManual="precoManual" :trocapara="trocapara"  caller= 'Pedido' class="produtos" v-show="val.open" :listaProdutos="val.produtos"></SelecaoProdutosItens>
                         <SelecaoProdutosItens  v-on:keypress.tab.prevent="" :tabindex="0" v-else :trocapara="trocapara" :mainindex="mainindex" caller= '' class="produtos" v-show="val.open" :listaProdutos="val.produtos"></SelecaoProdutosItens>
                        </transition>                    
                    </div>
                </div>

                </div>
            </div>       
       </b-collapse>
       <div v-if="refSelected" class="footer-refe">
           
           <div>
             <span><b>Qtd.Total Referência: </b></span>
             <span><b>{{qtdTotalShow}}</b></span>
           </div>
           <div>
             <span><b>Vlr.Total Referência: </b></span>
             <span><b>{{vlrTotalShow}}</b></span>
           </div>
           
       </div>
    
    </div>

</template>

<script>
import JqxComboBox from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue';
import SelecaoProdutosItens from './SelecaoProdutosItens.vue'
import { mapState } from "vuex"
import { baseApiUrl, showError , showSuccess} from '@/global'
import _ from "underscore";
import Spinner from '../template/Spinner.vue'
import axios from  'axios'
import numeral from 'numeral'

export default {
   name: "SelecaoProdutoExterno",
   props:["cliente","referencias","cond","trocapara","canal","moeda", "pais", "setor","canalname","caller","refe","mainindex","listapreco"],
   components: {JqxComboBox , Spinner , SelecaoProdutosItens},
   data: function(){
     return{
         spinner : false,
         toggle: false,
         lstDefeitos:[],
         lstProcedimentos:[],
         showColapse: false,
         refOpen: false,
         showAfterLoaded : false,
         lstProdutos: [],
         lstRefFormat:[],
         corSelected:[],
         path: null,
         precoLista: null,
         precoManual:null,
         refSelected:null,
         loadedImg: null,
         vlrTotalShow: null,
         qtdTotalShow: null

     }
   },
   computed: {
    ...mapState(["showScreen","language","user" ,"listProdutosTroca","commandSave","showOrNo","priceManu", "serverMessages", "showModal","lstOrdersItens","qtdTotal","vlrTotal","lstFitSense"]),
   },
   watch:{
      priceManu: function(){ 
        if(this.caller === 'Pedido'){
           if(this.priceManu){
               this.precoManual = this.priceManu
           }
        }         
      },
      qtdTotal: function(){
         if(this.caller === 'Pedido'){
            this.qtdTotalShow =  this.qtdTotal
            this.vlrTotalShow = numeral(this.vlrTotal).format('$0,0.00')
         }
      }
    },
   methods:{
       checkPreco(){
          if( this.precoManual < 0){
              this.precoManual = 0
          }
       },
       onClickToggle(index){
          this.lstRefFormat[0].cores = this.lstRefFormat[0].cores.map((el,i) =>{
              if(index == i){
                  el.open = !el.open
              }
              return el
          })

          this.corSelected = _.find(this.lstRefFormat[0].cores , el => { return el.open === true})
       },
       onClickToggleRef(){
         this.refOpen = !this.refOpen
         this.lstRefFormat[0].cores = this.lstRefFormat[0].cores.map((el) =>{          
            el.open = !el.open           
            return el
          })
       
       },
       backToMain(){
          if(this.caller === 'Pedido')
          {
              this.$store.commit('setShowModal', false)
              this.refSelected = null

              //this.$store.commit('setSaveCesta',Math.random())
          }
         
          this.$store.commit('setShowScreen')
          this.$bvModal.hide('modalProduct')
          
       },
       onClose(){  
         this.refSelected = this.$refs.comboBoxRefes.getSelectedItem();
         
         this.$store.commit('setTempItens',this.lstOrdersItens.filter(el => el.referencia === this.refSelected.value))               
         this.qtdTotalShow =  _.reduce(_.filter(this.lstOrdersItens, el => { return  el.referencia === this.refSelected.value }) , (vlant ,curr) => {return vlant + Number(curr.quantidade)},0)
         this.vlrTotalShow =  numeral(_.reduce(_.filter(this.lstOrdersItens, el => { return  el.referencia === this.refSelected.value }) , (vlant ,curr) => {return vlant + curr.quantidade * curr.precoCalc},0)).format('$0,0.00')

   
      try {
        this.loadedImg = require(`@/assets/products/${this.refSelected.value}.jpg`);
        
        
      } catch (err) {
        
        if (typeof err === "object") {
          
          this.loadedImg = require("../../assets/products/placeholder.jpg");
        }
      }
      finally{
            this.showAfterLoaded = true;
      }
this.caller === '' || this.caller === ''
      if(this.caller === 'Manutencao' || this.caller === 'cadTroca')
      this.loadProdutoInfoManutencao(this.refSelected)
      else if (this.caller === 'Pedido')
      this.loadProdutoInfo(this.refSelected);
       else if (this.caller === 'cadTroca')
        this.loadProdutoTroca(this.refSelected)
        },
       loadProdutoInfo(selected){  
        console.log('selecaoExterno')
            this.spinner = true
            const url = `${baseApiUrl}/produto/getprodutoinfo`
            axios.post(url,{
                language: this.user.language,
                canaldistribid: this.canal.id,
                canaldistribnome: this.canal.nome,
                condpagid: this.cond.id,
                flgFora:"",
                listapreco: this.moeda === 'EUBR' ? 'E2': this.moeda === 'USD' ? 'E0' : this.listapreco,
                moeda:this.moeda,
                pais:this.pais,
                referencia: selected.value,
                setoratividadeid:this.setor['id'],
                setoratividadenome: this.setor['nome']
            }).then(resp =>{
                this.spinner = false
                this.precoLista = numeral(resp.data[0]["preco"]).format('$0,0.00')
                this.lstProdutos = resp.data 
                this.lstRefFormat = _.unique(this.lstProdutos.map(el =>{
                    return {
                        referencia: el.referencia,
                        /* eslint-disable */
                        cores: _.map(_.unique(_.map(this.lstProdutos, elemento => elemento.cor)),el => {return {cor: `${el} - ${_.find(this.user.lstCoresDiasLimite.cores,elemento => elemento.id === el) ? _.find(this.user.lstCoresDiasLimite.cores,elemento => elemento.id === el)['nome']:'Cor desconhecida'}` , open:false ,produtos: _.filter(this.lstProdutos , produto => produto.cor === el)}})
                     /* eslint-enable */
                    }
                }),el => el.referencia)
                
                 this.$store.commit("setShowOrNo",true)

            }).catch(() =>{
                
                showError(this.traduction.serverError)
                this.spinner = false
            });
       },
       copabCheck(){
         let qtdSoutiens = _.reduce(this.lstOrdersItens, (memo, num) => { return memo + (this.lstFitSense.includes(num.id.substr(0, 7)) ? Number(num.quantidade) : 0) }, 0)
         let qtdCopaB = _.reduce(this.lstOrdersItens, (memo, num) => {
                          return memo + ((this.lstFitSense.includes(num.id.substr(0, 7)) && num.id.substr(13, 3) === "00B") ? Number(num.quantidade) : 0)
         }, 0)
         //console.log(qtdSoutiens , qtdCopaB)
         showSuccess(`Seu percentual de COPA B no pedido é de ${numeral(( qtdCopaB / qtdSoutiens )).format('0.00%')}`)
      },
       loadProdutoInfoManutencao(selected){  
            console.log('loadProdInfoManu')
            this.spinner = true
            const url = `${baseApiUrl}/produto/getprodutoinfo`
            axios.post(url,{
                language: 'P',
                canaldistribid: "20",
                canaldistribnome: "Varejo",
                condpagid: "601",
                flgFora:"",
                listapreco:"",
                moeda:"BRL",
                pais:"",
                referencia: selected.value,
                setoratividadeid:"03",
                setoratividadenome: "03 - LIZ"
            }).then(resp =>{
                this.spinner = false
                this.precoLista = numeral(resp.data[0]["preco"]).format('$0,0.00')
                this.lstProdutos = resp.data      
                      
                this.lstRefFormat = _.unique(this.lstProdutos.map(el =>{
                    return {
                        referencia: el.referencia,
                        cores: _.map(_.unique(_.map(this.lstProdutos, elemento => elemento.cor)),el => {return {cor: `${el} - ${_.find(this.user.lstCoresDiasLimite.cores,elemento => elemento.id === el) ? _.find(this.user.lstCoresDiasLimite.cores,elemento => elemento.id === el)['nome']:'Cor desconhecida'}` , open:false ,produtos: _.filter(this.lstProdutos , produto => produto.cor === el)}})
                    }
                }),el => el.referencia)
                
                 this.$store.commit("setShowOrNo",true)

            }).catch(() =>{
                
                showError(this.traduction.serverError)
                this.spinner = false
            });
       },
       save(){
           this.spinner = true  
           console.log("Externo", this.commandSave)
            this.$store.commit('setCommandSave',!this.commandSave) 
            this.$refs.comboBoxRefes.clearSelection();
            setTimeout(() => {
                this.$store.commit('setShowOrNo', false)
                this.$refs.comboBoxRefes.focus();
                this.spinner = false
            }, 1000)
            
            if(this.caller === 'Pedido'){
               setTimeout(() => {
                this.$store.commit('setSaveCesta',Math.random())
                this.copabCheck()
               }, 2000)

            }
               
          // this.showColapse =  false      
        
       },
   },
   mounted(){
      if(this.caller === "Manutencao"){
         this.$refs.comboBoxRefes.val(this.refe)
         this.onClose()
      }
   },
   beforeDestroy(){
      this.$store.commit('setShowScreen',false)
      this.$store.commit("setManualPrice",null)
   }
}
</script>

<style lang="scss">
.produtoExterno-wrapper{
    *{
        letter-spacing:0.6px;
        word-spacing: 1.5px;
        font-weight: 400;
    }
}
    .main-selection-produto{
        display: flex;
        justify-content: space-between;
        background-color: white;
        flex-wrap: wrap;
        padding-left: 5px;
        box-shadow:1px 1px 1px 1px #e58b2a;
    }
    .button-area-produto{
        display: flex;
        align-items: center;
    }
    .main-product-area{
        display: flex;
        justify-content: flex-start;
        margin-top: 10px;
    }
    .main-product-area .table-itens{
        flex-grow: 4;
        background:white;
        box-shadow:1px 1px 1px 1px #e58b2a;
        
    }
    .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
    .preco{
        font-weight: 600;
        margin-top: 20px;
        display:flex;
         justify-content:center;
          align-items:center;
          padding:10px 0px;
          font-size: 0.8rem !important;
          color:black;
          
          
    }
        .preco-link{
            font-size:1rem !important;
            text-decoration:underline;
            color:black;
            margin:5px 5px 5px 5px;
        }
    .box-product-area{
        // background:linear-gradient(to right, #eb7a09, #dda152);
        background: #704F4A;
    }
    .box-product-img{
        max-width: 170px;
        padding:10px;
        display:block;
        margin:0 auto;
        border-radius:15px;
    }
   .preco-itn{
       display:flex ; 
       justify-content:center ; 
       align-itens:center ;
        background-color:black;
        color:white;
        padding:10px 0px;
        font-size:1rem;
   }
   .table{
       background-color:white;
       
   }
   .input-area-manual{
       max-width: 95px;
   }
   .footer-refe{
     display: flex;
     justify-content: space-around;
   }
   @media(max-width:967px){
       .main-product-area{
           flex-direction:column;
       }
   }
    
</style>