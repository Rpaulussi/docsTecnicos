<template>
   
      
   <div class="main-area">
     
<b-card class="bcard" :sub-title="title" >
          <div class="list-cli">
             <JqxListBox  style="max-width:360px" ref="listbox" @select="onSelect()"
                :width="width" :height="height"
                :filterable="true"
                :searchMode="'containsignorecase'"
                :incrementalSearch="true"
                :disabled="showOrNo !== null || showOrNo !== undefined || showOrNo !== '' ? showOrNo : false"
                :filterPlaceHolder="traduction.lookingFor">
             </JqxListBox>
          </div>
       </b-card> 
      

    
          <b-card :sub-title="`${titlesel} :  ${quant}`" class="">
         <div class="list-clisel">
             <JqxListBox style="max-width:360px;" ref="listboxsel" @select="onSelect2()"
                :width="width" :height="height"
                :source="clientesSelecionados" :selectedIndex="3"
                :filterable="true"
                :searchMode="'containsignorecase'"
                :incrementalSearch="true"
                 :disabled="showOrNo !== null || showOrNo !== undefined || showOrNo !== '' ? showOrNo : false"
                :filterPlaceHolder="traduction.lookingFor">>
             </JqxListBox>
          </div>  
          <div class="button-area">
              <b-button  @click="clearCustomers"  variant="secondary">{{traduction.clearSelection}}</b-button>
          </div>
       </b-card>
    
   </div>

   
</template>

<script>
//import { mapState } from 'vuex'
import JqxListBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlistbox.vue";
import { mapState } from 'vuex'
export default {
   name:"SelecaoLista",
   components:{
      JqxListBox
   },
   props: [
      'disable',
      'title',
      'titlesel'
   ],
   data: function(){
      return {
         width: 320,
         height: 215,
         clientesSelecionados:[],
         quant: 0
      }
   },
   computed:{
     ...mapState(['listClientes','showOrNo','traduction'])
   },
   methods: {
      onSelect() {
         let items = this.$refs.listbox.getSelectedItems()       
         if(!this.$refs.listboxsel.getItemByValue(items[0].value)){
             this.$refs.listboxsel.addItem(items[0].value)
             this.quant+=1
         }
             this.$store.commit('setCustomersSel',this.$refs.listboxsel.getItems())             
      },
      onSelect2() {
         this.$store.state.setShowOrNo = true;
         let items = this.$refs.listboxsel.getSelectedItems();
         this.$refs.listboxsel.removeItem(items[0].value)    
         this.quant-=1    
         if(this.quant === 0){
            this.$store.commit('setCustomersSel',[])
         }
         
      },
      clearCustomers(){
          this.$refs.listboxsel.source = []
          this.$store.commit('setCustomersSel',[]) 
          this.quant = 0
      }
   },
   beforeUpdate(){
      //console.log("Clientes",this.listClientes)
      this.$refs.listbox.disabled = this.showOrNo
      this.$refs.listboxsel.disabled = this.showOrNo
      this.$refs.listbox.source = this.listClientes ? this.listClientes: []


   },
   beforeDestroy(){
       this.$store.commit('setCustomers',[])
       this.$store.commit('setCustomersSel',[])
       //this.$refs.listbox.clear();
   }
}
</script>

<style>
   .main-area{
      display: flex;
      justify-content: space-between;
      flex-wrap: no-wrap;
      padding: 9px;
   }
   .list-cli{
      margin-top: 5px ;
      
   }
   .list-clisel{
      margin-top: 5px ;
   }
   
</style>