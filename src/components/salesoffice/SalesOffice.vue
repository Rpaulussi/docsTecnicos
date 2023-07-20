<template>
   <div >
       <Spinner required :state="this.spinner"/>
    <Page-Title icon="fa fa-building" :main="user.lblEscritVenda" > </Page-Title>
    <div class="sales-office-area">
        <div class="sales-office-card">
      <b-form>
         <b-row>
              <b-col xs='12'>
                  
                 <b-form-group v-if="user.userType == 'ADM'" v-bind:label="user.lblSelectGN" label-for="nacional" >
                     <v-select id="nacional" v-model="selectedGN" label="high" :options="user.lstGN" lang="pt-BR" >
                         <template v-slot:no-options="{search, searching}">
                             <template v-if="searching">
                                     {{traduction.noresultsfor}} <em>{{ search }}</em>.
                             </template>
                             <template v-else>
                                    {{traduction.noresults}} 
                             </template>
                         </template>
                     </v-select> 
                 </b-form-group> 
              </b-col>

              <b-col xs='12'>
                 <b-form-group  v-if="user.userType == 'ADM' || user.userType =='GN'" v-bind:label="user.lblSelectGR" label-for="regional">
                     <v-select id="regional" v-model="selectedGR" label="high"  
                     :options="this.selectedGN === null && this.user.userType !=='ADM'? user.lstGR : loadRegioManagers()"
                     @change="clear()">
                         <template v-slot:no-options="{search, searching}">                            
                             <template v-if="searching">
                                    {{traduction.noresultsfor}} <em>{{ search }}</em>.
                             </template>
                             <template v-else>
                                    {{traduction.noresults}} 
                             </template>
                         </template>
                     </v-select> 
                 </b-form-group>
              </b-col>

              <b-col xs='12'>
                 <b-form-group v-if="user.userType !== 'REP'" 
                   v-bind:label="user.lblRepresentante" label-for="representante">
                     <v-select id="representante" v-model="selectedREP"
                      label="high" :options="this.selectedGR === null && this.user.userType ==='GR'? user.lstREP : loadReps()">
                       <template v-slot:no-options="{search, searching}">
                             <template v-if="searching">
                                     {{traduction.noresults}} <em>{{ search }}</em>.
                             </template>
                             <template v-else>
                                     {{traduction.noresults}} 
                             </template>
                         </template>
                     </v-select> 
                 </b-form-group>
              </b-col>          
          </b-row>
      </b-form>
      </div>
    </div>
      
   </div>
   
</template>

<script>
import vSelect from 'vue-select'
import PageTitle from '../template/PageTitle'
import 'vue-select/dist/vue-select.css'
import  { mapState } from 'vuex'
import Spinner from "../template/Spinner.vue"

export default {
  name:"SalesOffice",
  components:{vSelect , PageTitle, Spinner},
  computed: {
      ...mapState(['user', 'traduction', 'Spinner'])
  },
  props:{
    
  },
  data:function(){
      return{
          selectedGN :null,
          selectedGR :null,
          selectedREP:null,
          arrayGR: [],
          spinner: false,
      }
  },
  methods: {
      loadRegioManagers(){
         if(this.selectedGN)
            return  this.user.lstGR.filter(el => el.low == this.selectedGN.high)
           
      },
      loadReps(){
          if(this.selectedGR)        
             return  this.user.lstREP.filter(el => el.low === this.selectedGR.high)
                   
      },
      clearSelectionHover(){
          let btnRemove = document.getElementsByClassName('vs__clear')
          
          if(btnRemove){
              btnRemove.forEach(element => {
                  element.title = this.traduction.clearSelection
              });
              return btnRemove[0].title 
          }else{
              return ""
          }    


      }
  },
  watch:{
    selectedREP: function(){
        this.spinner = true
       this.$store.commit("setSelectedRep",this.selectedREP)
       setTimeout(() => {

 this.$router.push({path: '/home'})
 this.spinner = false
       }, 1000)
      
    }
  },
  mounted(){
     this.clearSelectionHover()     
  }
  
}

</script>

<style>
   .v-select{
       
   width: 300px;
    }

    
    .sales-office-area{
        display: flex;
    }
    .sales-office-card{
        display:flex !important;
        flex-direction:row !important;
        width:fit-content !important;
        margin-top:16px;
        border-radius: 25px;
    box-shadow: 1px 1px 1px 1px #e58b2a;
    background:white;
    padding: 16px;
    justify-content:space-evenly;
}


    
</style>