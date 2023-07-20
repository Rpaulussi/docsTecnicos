<template>
    <div>
        
        <b-table v-if="caller === 'Manutencao' || caller !== 'Pedido'"  selectable single responsive hover striped simple head-variant="dark" :items="lstProdTemp" :fields="caller === 'Manutencao' ? fieldsManu : fields"> 
             
             <template  #cell(descricao)="data">
                 <span v-if="data.item.child !== true">{{data.value}}</span>
             </template> 
             <template  #cell(marca)="data">
                 <span v-if="data.item.child !== true">{{data.value}}</span>
             </template>
             <template  #cell(tamanho)="data">
                 <span v-if="data.item.child !== true">{{data.value}}</span>
             </template>
             <template  #cell(copa)="data">
                 <span v-if="data.item.child !== true">{{data.value}}</span>
             </template>         
             <template v-if="caller !== 'Manutencao'" #cell(quantidade)="data">
                <b-form-input v-if="data.item.child !== true" @change="onChangeQuant(data)" v-model="data.item.quantidade"></b-form-input>
             </template>
 
 
             <template v-if="caller !== 'Manutencao'" #cell(defeito)="data">
 
 
                 <!-- <b-form-select v-model="data.item.defeito" :options="lstDefeitos"></b-form-select> -->
 
 
                 
                 <div class="form-group">
 
                     
     
     <div class="input-group mb-3">
       <input
         type="search"
         id="usersearch"
         list="lstDefs"
         class="form-control"
         placeholder="Defeitos..."
         @blur="checkDefeitoSelected($event)"
         v-model="data.item.defeito"
         v-on:input="searchDefeito($event)"
       />
      
     </div>
     <datalist id="lstDefs">
       <option v-for="(u, acc) in lstDefeitos" :key="acc">{{ u.text }}</option>
     </datalist>
   </div>
 
             </template>
 
 
 
             <template v-if="caller !== 'Manutencao'" #cell(procedimento)="data">
                 <b-form-select v-model="data.item.procedimento" :options="lstProcedimentos"></b-form-select>
             </template>
             <template v-if="caller === 'Manutencao'" #cell(action)="data">
                 <b-form-checkbox value="X"  @change ="chooseNewProduct(data.item)"></b-form-checkbox>
             </template>
             <template v-if="caller === 'Pedido'" #cell(descontoPerc)="data">
                <b-form-input  v-model.number="data.item.desconto"></b-form-input>
             </template>
             <template v-if="caller === 'Pedido'" #cell(precoManual)>
                <b-form-checkbox value="X" ></b-form-checkbox>
             </template>
             <!-- <template v-if="caller === 'Pedido'" #cell(quantidade)="data">
                 <b-form-select  v-model="data.item.procedimento" :options="lstProcedimentos"></b-form-select>
             </template> -->
             <template v-if="caller === 'Pedido'" #cell(preco)>
                 <b-form-checkbox value="X" ></b-form-checkbox>
             </template>
             <template v-if="caller === 'Pedido'" #cell(precoTotal)>
                 <b-form-checkbox value="X"  ></b-form-checkbox>
             </template>
             
        </b-table>
        <b-table v-else-if="caller === 'Pedido'"  small simple responsive hover striped head-variant="dark" :items="lstProdTemp" :fields="fieldsPedido" foot-clone> 
 
             <template #head(precoManual)>
                <b-form-checkbox :disabled="valorManual === null || valorManual === '' || valorManual === '0'" tabindex="-1" value= true @change="changePriceAllItens()" ></b-form-checkbox>
             </template>
             <template #head(descricao)>
                <span class="reduzido">Descrição</span>
             </template>
             <template #cell(descricao)="data">
                 <span class="reduzido" :style="data.item.selecionado===  true ? 'color:red' : ''  " >{{data.value}}</span>
             </template>
 
             <template  #cell(referencia)="data">
                 <span :style="data.item.selecionado ===  true ? 'color:red': ''" >{{data.value}}</span>
             </template>
 
             <template  #cell(cor)="data">
                 <span :style="data.item.selecionado ===  true ? 'color:red': ''" >{{data.value}}</span>
             </template>
 
             <template  #cell(tamanho)="data">
                 <span :style="data.item.selecionado ===  true ? 'color:red': ''" >{{data.value}}</span>
             </template>
 
             <template  #cell(marca)="data">
                 <span :style="data.item.selecionado ===  true ? 'color:red': ''" >{{data.value}}</span>
             </template>
             <template  #cell(copa)="data">
                 <!-- <span :style="data.item.selecionado ===  true ? 'color:red': ''" >{{data.value}}</span> -->
                 <span :style="`color:${data.item.color}`"><b class="boldCopa">{{data.value}}</b></span>
             </template>
 
             <template  #cell(quantidade)="data">
                <b-form-input  tabindex="2" onClick="this.select()" :style="data.item.selecionado ===  true ? 'color:red': ''" class="input-area input-qtd" size="sm" type="number" v-model="data.item.quantidade" @change="manipulate(data) "></b-form-input>  
             </template>
             <template  #cell(descontoPerc)="data">
                <b-form-input onClick="this.select()" :style="data.item.selecionado ===  true ? 'color:red': ''"  tabindex="1" @change="setDesconto(data)" type="number" :disabled="data.item.precoManual !== false" class="input-area input-desc" size="sm" v-model="data.item.descontoPerc"></b-form-input>
             </template>
 
             <template #cell(precoManual)="data">
                <b-form-checkbox :disabled="valorManual === null || valorManual === '' || valorManual === '0'" :value= true @change="changePriceItem(data)" :checked="data.item.precoManual"  v-model="data.item.precoManual" ></b-form-checkbox>
             </template>
             <template  #cell(precoCalc)="data">       
                 <span v-if="data.item.quantidade > 0">{{parseFloat(data.value).toFixed(2)}}</span>
             </template>
             <template  #cell(precoTotal)="data">
                 <span :style="data.item.selecionado ===  true ? 'color:red': ''" >{{parseFloat(data.value).toFixed(2)}}</span>
             </template>
 
              <template #foot(quantidade)>
                  <span >{{ footerColor }}</span>
              </template>
              <template #foot(precoManual)>
                  <span ></span>
              </template>
              <template #foot(descricao)>
                  <span ></span>
              </template>
              <template #foot(referencia)>
                  <span ></span>
              </template>
              <template #foot(descontoPerc)>
                  <span ></span>
              </template>
              <template #foot(marca)>
                  <span ></span>
              </template>
              <template #foot(copa)>
                  <span ></span>
              </template>
              <template #foot(tamanho)>
                  <span ></span>
              </template>
              <template #foot(cor)>
                  <span ></span>
              </template>
              <template #foot(precoCalc)>
                  <span ></span>
              </template>
              <template #foot(precoTotal)>
                  <span ></span>
              </template>
 
             
        </b-table>
    </div>
 </template>
 
 <script>
 import axios from 'axios'
 import customSelect from '../../mixins/customSelect.js'
 import _ from "underscore";
 import { mapState } from "vuex"
 import {  baseApiUrl , showError , showSuccess} from '@/global'
 import numeral from 'numeral'
 
 export default {
     name:"SelecaoProdutosItens",
     mixins:[customSelect],
     props:["listaProdutos","caller","mainindex","trocapara","valorManual","corSelected","priceManu"],
     computed: {
     ...mapState(["listProdutosTroca","commandSave","showOrNo","lstOrdersItens", "isMenuVisible","qtdTotal","vlrTotal","lstTempItensToOrder"]),
      },
     watch:{
       commandSave: function(){ 
         if(this.caller === 'Pedido'){
            this.validateToOrder()
           
         }else{
            this.validate()  
         }            
       },
       valorManual: function(){
         if(this.caller === 'Pedido'){
            this.recalcPriceItens()         
         }
       }
     },
     data:function(){
         return {
             lstDefeitos:[],
             lstProcedimentos:[],
             quant:null,
             valorOriginal:null,
             lstProdTemp:[],
             controlChecked:false,
             controleEmpty : null,
             footerColor: 0,
             control:null,
             controlSkip: [],
             qtdCol : [],
             descCol : [],
             tabIndex: {
                 type: Number,
                 required: false,
                 default: 1
             },
             current: '',
             next: '',
             bfore: '',
             fields: [
               {key: 'descricao' , label: 'Produto'},
               {key: 'marca' , label: 'Marca'},
               {key: 'tamanho' , label: 'Tamanho'},
               {key: 'copa' , label: 'Copa'},
               {key: 'quantidade' , label: 'Quantidade'},
               {key: 'defeito' , label: 'Defeito'},
               {key: 'procedimento' , label: 'Procedimento'},
             ],
             fieldsManu: [
               {key: 'descricao' , label: 'Produto', sortable:true},
               {key: 'marca' , label: 'Marca', sortable:true},
               {key: 'tamanho' , label: 'Tamanho', sortable:true},
               {key: 'copa' , label: 'Copa', sortable:true},
               {key: 'action' , label: 'Selec.', sortable:true},
             ],
             fieldsPedido: [
               {key: 'marca' , label: 'Marca'},
               {key: 'referencia' , label: 'Ref.'},
               {key: 'cor' , label: 'Cor'},
               {key: 'tamanho' , label: 'Tam.'},
               {key: 'copa' , label: 'Copa'},
               {key: 'descricao' , label: 'Produto' },          
               {key: 'descontoPerc' , label: 'Desconto'},
               {key: 'precoManual' , label: 'Preco Manual'},
               {key: 'quantidade' , label: 'Quantidade'},
               {key: 'precoCalc' , label: 'Valor do Item'},
               {key: 'precoTotal' , label: 'Total Item'},
             ],
             link_colors: [
                 "#1204B3",
                 "#289909",
                 "#D609CF",
                 "#806304",
                 "#D92109",
                 "#0CE82C",
                 "#D92109",
                 "#1204B3",
                 "#289909",
                 "#D609CF",
                 "#806304",
             ],
         }
     },
     methods:{
         setDesconto(line){        
            if(line.item.descontoPerc === ""  || line.item.descontoPerc === 0 || line.item.descontoPerc === '0'){
                this.manipulate(line)              
            }else{
               
               if(line.item.descontoPerc < 0){
                 line.item.descontoPerc = 0
                 this.manipulate(line)
                 return
               }
               else{
                 line.item.descontoPerc = line.item.descontoPerc.replace(',','.')
                 line.item.precoCalc =  line.item.preco -  (line.item.preco * line.item.descontoPerc / 100)
                 //line.item.precoTotal = line.item.precoTotal - (line.item.precoTotal * line.item.descontoPerc / 100 )
                 line.item.precoTotal = line.item.preco * line.item.quantidade - ((line.item.preco * line.item.quantidade) * line.item.descontoPerc / 100 )
               }
               
            }
            
         },     
         chooseNewProduct(data){
           let objtmp = {...data , material: data.id , valor: data.preco, 
                         seq:data.ordem ,mainIndex : this.mainindex}
           this.$store.commit("setNewProduct",objtmp)       
         },
         recalcPriceItens(){
            this.lstProdTemp.forEach(el => {
             if(el.precoManual === true && this.valorManual){
                 el.precoCalc  = this.valorManual
                 el.precoTotal = (el.quantidade * this.valorManual).toFixed(2)
             }else{
                 if(el.descontoPerc > 0){
                     el.precoCalc =  el.preco -  (el.preco * el.descontoPerc / 100)
                     el.precoTotal = el.preco * el.quantidade - ((el.preco * el.quantidade) * el.descontoPerc / 100 )
                  }else{
                     el.precoCalc  = el.preco.toFixed(2)
                     el.precoTotal = (el.quantidade * el.preco).toFixed(2)
                 }     
             }       
             if(this.lstTempItensToOrder.find(el => el.id === el.id)){
                 this.lstTempItensToOrder.forEach(elem => {
                     if(elem.id === el.id){
                         elem.quantidade = Number(el.quantidade)
                         elem.precoCalc = el.precoCalc
                     }
                 })
             }else{
             this.lstTempItensToOrder.push(el)
             }
            })
         },
         manipulate(line){
           if(line.item.quantidade < 0){
              line.item.quantidade = 0
              return
           }
           if(line.item.precoManual === true && this.valorManual){
              line.item.precoCalc  = this.valorManual
              line.item.precoTotal = (line.item.quantidade * this.valorManual).toFixed(2)
           }else{
              if(line.item.descontoPerc > 0){
                line.item.precoCalc =  line.item.preco -  (line.item.preco * line.item.descontoPerc / 100)
                line.item.precoTotal = line.item.preco * line.item.quantidade - ((line.item.preco * line.item.quantidade) * line.item.descontoPerc / 100 )
              }else{
                line.item.precoCalc  = line.item.preco.toFixed(2)
                line.item.precoTotal = (line.item.quantidade * line.item.preco).toFixed(2)
              }     
           }       
           if(this.lstTempItensToOrder.find(el => el.id === line.item.id)){
              this.lstTempItensToOrder.forEach(el => {
                 if(el.id === line.item.id){
                     el.quantidade = Number(line.item.quantidade)
                     el.precoCalc = line.item.precoCalc
                 }
              })
           }else{
             this.lstTempItensToOrder.push(line.item)
           }
          
         this.$store.commit("setTotalQtd", _.reduce(this.lstTempItensToOrder , (vlant ,curr) => {return vlant + Number(curr.quantidade) },0))
         this.$store.commit("setValorTotal", _.reduce(this.lstTempItensToOrder , (vlant ,curr) => {return vlant + Number(curr.quantidade * curr.precoCalc) },0))
         this.footerColor = _.reduce(this.lstProdTemp , (vlant ,curr) => {return vlant + Number(curr.quantidade)},0)
         },
         
         changePriceItem(line){
 
              if(this.valorManual === null){
                showError("Digite o preço manual")
                return
              }
             
             //Alterado 11/07/22 
             //line.item.descontoPerc = 0
 
             line.item.descontoPerc = ''
 
            if(!this.valorOriginal)
                this.valorOriginal = this.lstProdTemp[0].preco
 
             this.lstProdTemp.forEach(el => {
                 if(el.id === line.item.id){
                   if(el.precoCalc !== this.valorManual){
                     el.precoCalc = this.valorManual
                     el.precoTotal = el.quantidade * this.valorManual
                   }else{
                     el.precoCalc = this.valorOriginal.toFixed(2)
                     el.precoTotal = (el.quantidade * this.valorOriginal).toFixed(2)
                   }
                 }
                
             })
         },
         changePriceAllItens(){
            this.controlChecked = !this.controlChecked
            if(!this.valorOriginal)
                this.valorOriginal = this.lstProdTemp[0].preco
 
             this.lstProdTemp.forEach(el => {
 
                 if(el.precoCalc !== this.valorManual){
                     el.precoCalc = this.valorManual
                     el.precoTotal = el.quantidade * this.valorManual
                     el.descontoPerc = 0
 
                     if(this.controlChecked === true ){
                         el.precoManual = true
                         
                     }else{
                         el.precoManual = false
                     }
                     
                 }else{
                     
                     if(this.controlChecked === true ){
                         el.precoCalc = this.valorManual
                         el.precoTotal = el.quantidade * this.valorManual
                         el.descontoPerc = 0
                         el.precoManual = true
                         
                     }else{
                         el.precoCalc = this.valorOriginal.toFixed(2)
                         el.precoTotal = (el.quantidade * this.valorOriginal).toFixed(2)
                         el.descontoPerc = 0
                         el.precoManual = false
                     }
                 }
                           
             })
         },
          loadDefeitosProcedimentos(){
          const url = `${baseApiUrl}/produto/getdefeitosprocedimentos`
          axios.get(url)
               .then(resp => {
                  if(resp.data.result ==='OK'){
 
                     // if(this.trocapara){
                     //     this.lstProcedimentos = _.reject(resp.data.procedimentos , el =>  { return el.codProcedimento !== "007" })
                     //     this.lstProcedimentos = this.lstProcedimentos.map(ele => {return { value: ele.codProcedimento , text: ele.descricao }})
                     // }
                     // else{
                     //     this.lstProcedimentos = _.reject(resp.data.procedimentos , el =>  { return el.codProcedimento === "007" })
                     //     this.lstProcedimentos = this.lstProcedimentos.map(el => {return { value: el.codProcedimento , text: el.descricao }})
                     // }
                     this.lstDefeitos = resp.data.defeitos.map(el => { return { value : el.codDefeito , text:el.descricao }} )
                     this.lstProcedimentos = resp.data.procedimentos.map(ele => {return { value: ele.codProcedimento , text: ele.descricao }})
 
                     
                  }                
               }).catch(() => {
                  showError(this.traduction.serverError)
               })
         },
         onChangeQuant(line){      
             let item = line.item             
             let arrayTmp = this.lstProdTemp.filter(el => el.id === item.id)
             
             if(arrayTmp.length < item.quantidade){
                 for(let i = 1 ; i <= item.quantidade - arrayTmp.length ; i++ ){                   
                    if (i <= 25){
                        item = { ...item , indice: i ,child: true , procedimento:'' , defeito:''} 
                        this.lstProdTemp.push(item)
                    }                 
                 }
             }
             else if(arrayTmp.length > item.quantidade){
                this.lstProdTemp = _.reject(this.lstProdTemp, function(el){return  el.id === item.id})
                arrayTmp = _.initial(arrayTmp,arrayTmp.length - item.quantidade)
                this.lstProdTemp = this.lstProdTemp.concat(arrayTmp)
             }     
             
             //this.lstProdTemp = _.sortBy(this.lstProdTemp, el => el.ordem)
             this.lstProdTemp = _.sortBy(this.lstProdTemp, el => el.ordem+el.copa)
              
         },
         validate(){
             let array = this.lstProdTemp.filter(el => el.quantidade > 0) 
             let cont = _.reduce(this.lstProdTemp, (vlrant ,current) => { return  vlrant  + current.quantidade},0)
             if(cont > 0 ){
 
                 //Comparar com a lista de defeitos, e ver se defeito/procedimento existe na lista.
                 
                 this.controleEmpty = _.find(array , el => el.defeito === '' || el.procedimento ==='') ? 1 : 0
 
                 if(this.controleEmpty === 1 ){
                     showError(`Defeito e Procedimentos são obrigatórios para cor ${array[0]['cor']}`)   
                     this.$store.commit("setShowOrNo",true)        
                 }else{         
                     this.preSaveItens()
                     showSuccess(`Itens da cor ${array[0]['cor']} salvos com sucesso`)             
                     this.$store.commit("setShowOrNo",false)      
                 }
             }         
         },
         preSaveItens(){        
             let array = this.lstProdTemp.filter(el => el.quantidade > 0)         
             let arrayStore = []
             this.$store.commit('setEmptyQtdError', !this.lineEmpty) 
             
             this.listProdutosTroca.forEach(element => {
             let vartemp = _.find(array,el => el.id === element.id)
                 if (!vartemp){    
                    arrayStore.push(element)     
                 }
             });      
             this.$store.commit("setListaRejectItens",arrayStore)
             array = array.map(el => {
                 
                 return {
                     ...el,
                     vl_format: numeral(el.preco * el.quantidade).format('$0,0.00'),   
                     vl_tot: el.preco * el.quantidade,
                     precoView : numeral(el.preco).format('$0,0.00'),              
                     sel:'',
                     // defText: _.find(this.lstDefeitos, ele => ele === el.defeito) ? _.find(this.lstDefeitos, ele => ele === el.defeito)["text"] : '',
                     proText: _.find(this.lstProcedimentos, ele => ele.value === el.procedimento) ? _.find(this.lstProcedimentos, ele => ele.value === el.procedimento)["text"] : ''
                 }
             })
             
             array.forEach((e) => {
                // console.log(e.defeito, e, acc, 'test')
               
                 e.defeitoCod = e.defeito.replace(/[^0-9]/g, '')
                 e.defText = e.defeito.replace(/[^A-Za-z ]+/g, "")
             })  
 
             this.$store.commit("setListaProdutos",array)  
             //console.log('arrayFileld ', array)     
            
             
         },
         preSaveOrderItens(){
             
             let arrayTmp = this.lstProdTemp.filter(el =>  el.quantidade > 0)
             
             //let arrayExists = []
 
             let arrayCopy = this.lstOrdersItens.slice()
             this.$store.commit("setListaRejectOrdersItens",[])
             arrayCopy.forEach(element => {
                 
                  let vartmp = arrayTmp.filter(el => el.id === element.id)
                  
                 //  if(vartmp.length === 0){
                 //     arrayExists.push(element)
                 //  }
                 //  else{
                 //     element = vartmp[0]
                 //  }
                 if(vartmp.length > 0){
                     element.preco = vartmp[0]["preco"]
                     element.precoCalc = vartmp[0]["precoCalc"]
                     element.quantidade = vartmp[0]["quantidade"]
                     element.descontoPerc = vartmp[0]["descontoPerc"]
                     element.precoManual = vartmp[0]["precoManual"]
                     element.descontoPercItemNormal = vartmp[0]["descontoPercItemNormal"]
                     //console.log(vartmp[0])
                 }
                 
             })
 
             let arrayForAdd = _.map(arrayTmp.filter(el => {
                 return !_.find(arrayCopy, ele => { return ele.id === el.id})
             }), elem => {
                 return {...elem ,index:'' , prManual:this.valorManual}
             })
             //console.log("array",arrayCopy)
             this.$store.commit("setListaRejectOrdersItens",arrayCopy)
             this.$store.commit("setListOrderItens",arrayForAdd)
             
 
             // this.$store.commit("setListaRejectOrdersItens",arrayExists)
 
             // this.$store.commit("setListOrderItens",arrayTmp.map(el => {return {...el , index:'' , prManual:this.valorManual}}))
 
             let hasPMOrDescPerc = _.find(this.lstOrdersItens, function (produto) { return  (produto.precoManual === true || produto.descontoPerc > 0); }) === undefined ? false : true;
     
             this.$store.commit("setHasPMOrDescPerc",hasPMOrDescPerc)
         },
         validateToOrder(){
            let cont = _.reduce(this.lstProdTemp, (vlrant ,current) => { return  vlrant  + current.quantidade},0)
            if(cont === 0){
                if(this.lstProdTemp.length > 0)
                     if(this.lstProdTemp[0].cor === this.corSelected.cor.substr(0,3)){
                         showError(`Indique a quantidade do produto`)
                     }                 
            }else{
                this.preSaveOrderItens()
            }
         }
     },
     mounted(){
         this.loadDefeitosProcedimentos()
         
         this.lstProdTemp = this.listaProdutos  
            
         if(this.caller === 'Pedido'){
             this.lstProdTemp.forEach(element => {
                 _.find(this.lstOrdersItens, el => {
                     if(element.id === el.id){
                         element.quantidade = el.quantidade
                         element.precoTotal = el.precoTotal
                         element.precoManual  = el.precoManual
                         //adicionado 11/07/2022
                         element.descontoPerc = el.descontoPerc
                         element.precoCalc = el.precoCalc
                           
                         if(el.prManual > 0){
                             
                             this.$store.commit("setManualPrice",el.prManual)
                             element.precoCalc = el.prManual
                            // element.precoManual = true
                         }else{
                             if(el.precoManual === true){
                                 this.$store.commit("setManualPrice",el.precoCalc)
                             }
                         }
                         
                         // else{
                         //     //element.precoCalc = el.preco
                         // }
 
                     }else{
                         element.quantidade = element.quantidade === 0 ? '':element.quantidade
                         element.descontoPerc = element.descontoPerc === 0 ? '':element.descontoPerc
                     }     
                 })
 
                 if(this.lstOrdersItens.length === 0){
                     element.precoCalc = element.preco
                 }
 
                 element.quantidade = element.quantidade === 0 ? '':element.quantidade
                 element.descontoPerc = element.descontoPerc === 0 ? '':element.descontoPerc
                 
             });
 
                   
             if(this.valorManual > 0){
                this.changePriceItem()
             }
             
             this.footerColor = _.reduce(this.lstProdTemp , (vlant ,curr) => {return vlant + Number(curr.quantidade)},0)
             this.lstProdTemp = _.sortBy(this.lstProdTemp, el => el.copa)
         }else{
             this.lstProdTemp.forEach(element => {
 
                 _.find(this.listProdutosTroca, el => {
                     if(element.id === el.id && el.child !== true){
                     element.defeito = el.defeito
                     element.procedimento = el.procedimento,
                     element.quantidade = el.quantidade
                     }     
                 })                   
                 _.filter(this.listProdutosTroca, el => (el.id === element.id && el.child === true)).forEach(linha => {               
                     this.lstProdTemp.push(linha)          
                 })
 
                 element.quantidade = element.quantidade === 0 ? '' : element.quantidade
 
             });
 
             this.lstProdTemp = _.sortBy(this.lstProdTemp, el => el.ordem+el.copa)
 
         }
         
          //this.lstProdTemp = _.sortBy(this.lstProdTemp, el => el.ordem+el.copa)
 
          
          let conttemp = 'X'
          let contIndex = 0
          this.lstProdTemp = this.lstProdTemp.map(el => { return { ...el , color: ''}})
          this.lstProdTemp.forEach(el => {
             if(conttemp !== el.copa){
                contIndex += 1
                el.color = this.link_colors[contIndex]
             }else{
                el.color = this.link_colors[contIndex]
             }
             conttemp = el.copa
          })
          
          
 
     }
 }
 </script>
 
 <style>
    .input-area{
        max-width: 60px;
    }
     .boldCopa {
     font-weight: 600 !important;
     text-decoration: underline;
    }
    
     @media (max-width: 650px) {
      .reduzido {
         color: blueviolet;
         display:none;
      }
    }
 
    input::-webkit-outer-spin-button,
         input::-webkit-inner-spin-button {
             -webkit-appearance: none;
             margin: 0;
         }
 </style>