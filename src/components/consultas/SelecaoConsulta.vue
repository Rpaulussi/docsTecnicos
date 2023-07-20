<template>
  <div class="main-area">
    
    <b-card class="bcard" >
      <Spinner :state="spinner"> </Spinner>
      <b-col xs="12">
      <b-row no-gutters>
        <b-form-group
          v-bind:label="serverMessages['relatorioFaturar.periodoDe']"
          label-for="dataDe"
          class="space"
        >
          <b-form-datepicker
            id="dataDe"
              :dropup="false"
              size="sm"
            v-model="dataDe"
            class="mb-2 date-area"
            :locale="locale" 
            :disabled ="showOptionsCob === true && ( checkDupVencidas === 'X' || checkHistorico !== 'X' )" 
            v-bind="labels[locale] || {}"
            :date-format-options="{
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
            }" >
             </b-form-datepicker>
        </b-form-group>

        <b-form-group
          v-bind:label="serverMessages['geral.ate']"
          label-for="dataAte"
          class="space"
        >
          <b-form-datepicker
            id="dataAte"
            size="sm"
              :dropup="false"
            v-model="dataAte"
            class="mb-2 date-area"
            :locale="locale"
            :disabled ="showOptionsCob === true && ( checkDupVencidas === 'X' || checkHistorico !== 'X' )" 
            v-bind="labels[locale] || {}"
            :date-format-options="{
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
            }"
          ></b-form-datepicker>
        </b-form-group>
      </b-row>
    </b-col>

    <b-form-group
      v-if="showSetor"
      v-bind:label="serverMessages['relatorioFaturar.setorAtividade']"    
    >
      <!-- <v-select
        id="setorAtividade"
        v-model="setorAtividade"
        :options="lstSetorAtividade"
      >

      </v-select> -->
      <Dropdown
          class="dropdown1"
          :options="lstSetorAtividade"
          v-on:selected="onSelectSetor"  
          :maxItem="10000"
          :disabled="spinner"
          :placeholder="traduction.choose" 
          id="setorAtiv"
          name="stAtiv">
      </Dropdown>
    </b-form-group>
    <b-form-group
      v-if="showEquipe"
      v-bind:label="serverMessages['relatorioFaturar.equipeVendas']">
      <Dropdown
          class="dropdown"
          :options="lstEquipe"
          v-on:selected="onSelect"  
          :maxItem="10000"
          :disabled="spinner"
          :placeholder="traduction.choose"
          id="equipe"
          name="eqpVendas">>
      </Dropdown>
    </b-form-group>
    <b-form-group v-if="showOcultarFat">
      <b-form-checkbox value="X" v-model="checkOcultarFaturados">
        {{ serverMessages["relatorioFaturar.ocultarFaturados"] }}
      </b-form-checkbox>
    </b-form-group>
    <b-form-group>
      <b-col>
        <b-row v-if="showMix" no-gutters>
          <b-form-radio-group v-model="radioMix" default="Mix Faturados">
            <b-form-radio selected value="Mix Faturados" class="space">{{traduction.mixFaturado}}</b-form-radio>
            <b-form-radio  value="Mix Vendas" class="space">{{traduction.mixVendas}}</b-form-radio>
          </b-form-radio-group>  
        </b-row>
        <b-row v-if="showOutros" no-gutters>
          <b-form-radio class="space"> {{serverMessages['trocaEstatistico.relatorio.status.todos']}}</b-form-radio>
          <b-form-radio class="space"> {{ traduction.concluded }} </b-form-radio>
        </b-row>
      </b-col>
    </b-form-group>
    <b-form-group>
      <b-row v-if="showOptionsCob"  no-gutters class="my-2">
         <b-form-checkbox style="margin:0px 5px;" v-model="checkHistorico" value="X"  @change="deselected()">Flag Historico</b-form-checkbox>
         <b-form-checkbox  style="margin:0px 5px;" v-model="checkDupVencidas" value="X" @change="deselectedDupli()">Duplicatas Vencidas</b-form-checkbox>
      </b-row>
    </b-form-group>
     <!-- <b-form-group>
       <b-row>
             <b-form-group  v-bind:label="serverMessages['trocaProduto.defeito']">
               <Dropdown                 
                  :options="lstDefeitos"
                  v-on:selected="onSelect"  
                  :maxItem="10000"
                  :disabled="spinner"
                  :placeholder="traduction.choose"
                  id="defeitos"
                  name="defeitos">
               </Dropdown>
            </b-form-group>  
            <b-form-group  v-bind:label="serverMessages['trocaProduto.procedimento']">
               <Dropdown                 
                  :options="lstProcedimentos"
                  v-on:selected="onSelect"  
                  :maxItem="10000"
                  :disabled="spinner"
                  :placeholder="traduction.choose"
                  id="procedimentos"
                  name="procedimentos">
               </Dropdown>
            </b-form-group>       
          </b-row>
     </b-form-group> -->
     
    </b-card>
  </div>
</template>

<script>
//import vSelect from "vue-select";
import axios from  'axios'
import { mapState } from "vuex";
import { baseApiUrl ,showError } from '@/global'
import { format, addMonths} from 'date-fns'
import Dropdown from 'vue-simple-search-dropdown';
import Spinner from '../template/Spinner.vue'
//import { find } from 'underscore'

export default {
  name: "SelecaoConsulta",
  components: { Dropdown , Spinner },
  data: function () {
    return {
      setorAtividade: null,
      selected: { name: null, id: null },
      selectedSetor:{ name: null, id: null },
      selectedEscri: {name: null , id: null},
      spinner: false,
      checkHistorico: null,
      checkDupVencidas: null,
      dataDe: null,
      dataAte: null,
      mip:null,
      checkOcultarFaturados: '',
      radioMix: "Mix Faturados",
      radioOptions: null,
      lstClientes:[],
      arrayFiltered:[],
      locale: 'pt-BR',
      labels: {
        'pt-BR': {
          labelPrevDecade: "Década anterior",
          labelPrevYear: "Ano anterior",
          labelPrevMonth: "Mês anterior",
          labelCurrentMonth: "Mês atual",
          labelNextMonth: "Próximo mês",
          labelNextYear: "Próximo ano",
          labelNextDecade: "Próxima década",
          labelToday: "Hoje",
          labelSelected: "Ausgewähltes Datum",
          labelNoDateSelected: "Nenhuma Data Selecionada",
          labelCalendar: "Calendário",
          labelNav: "Kalendernavigation",
          labelHelp: "Use o cursor do mouse para navegar entre as datas",
        },
        'fr':{
          labelPrevDecade: "Décennie précédente",
          labelPrevYear: "l'année dernière",
          labelPrevMonth: "Le mois dernier",
          labelCurrentMonth: "Mois en cours",
          labelNextMonth: "Le mois prochain",
          labelNextYear: "L'année prochaine",
          labelNextDecade: "Prochaine décennie",
          labelToday: "Aujourd'hui",
          labelSelected: "Ausgewähltes Datum",
          labelNoDateSelected: "Aucune date sélectionnée",
          labelCalendar: "Calendrier",
          labelNav: "Kalendernavigation",
          labelHelp: "Utilisez le curseur de la souris pour naviguer entre les dates",
        },
        'es':{
          labelPrevDecade: "Década anterior",
          labelPrevYear: "El año pasado",
          labelPrevMonth: "Mes pasado",
          labelCurrentMonth: "Mes actual",
          labelNextMonth: "Proximo mes",
          labelNextYear: "Próximo año",
          labelNextDecade: "La próxima década",
          labelToday: "Hoy",
          labelSelected: "Ausgewähltes Datum",
          labelNoDateSelected: "Sin fecha seleccionada",
          labelCalendar: "Calendario",
          labelNav: "Kalendernavigation",
          labelHelp: "Use el cursor del mouse para navegar entre fechas",
        }
      },
    };
  },
  methods: {
     onSelect(selection){
       this.selected = selection;
       this.$store.commit('setChooseSalesTeam',this.selected)
        if(this.selected.id)
                  this.loadCustomers();
     },
     onSelectSetor(selection){
       this.selectedSetor = selection;
       this.$store.commit('setChooseSetorAtividade',this.selectedSetor)
     },  
     deselected(){
        this.checkDupVencidas = false
     } , 
     deselectedDupli(){
        this.checkHistorico = false     
     } ,
     loadCustomers(){
        this.$store.commit('setDataDe',this.dataDe)
        this.$store.commit('setDataAte',this.dataAte)
        this.$store.commit('setRadioOption',this.radioMix)
        this.spinner = true
        this.$store.commit('setShowOrNo',true) 
        const url = `${baseApiUrl}/cliente/repclientes`
          axios.post(url,{
            language: this.language,
            loginUsuario: this.user.loginUsuario,
            codrep: this.selected.id
        }).then(resp =>{
          this.spinner = false
          this.lstClientes = resp.data.clientes.map(ele =>{
              return  `${ele.id} - ${ele.nome}`         
          })             
          this.$store.commit('setCustomers',this.lstClientes)  
          this.$store.commit('setShowOrNo',false)          
        }).catch(() =>{
            showError(this.traduction.internalError)
        });
     }
     
  },
  computed: {
    ...mapState(["serverMessages","language","traduction","user","lstReps"]),
  },
  watch: {
     radioMix: function() {
       this.$store.commit('setRadioOption',this.radioMix)
     },
     dataDe: function(){
       this.$store.commit('setDataDe',this.dataDe)
     },
     dataAte: function(){
       this.$store.commit('setDataAte',this.dataAte)
     },
     checkOcultarFaturados: function(){
       this.$store.commit('setOcultarFaturados',this.checkOcultarFaturados)
     },
     checkHistorico: function(){     
       this.$store.commit('setHistorico',this.checkHistorico)     
     },
     checkDupVencidas: function(){
       this.$store.commit('setDupVencidas',this.checkDupVencidas)     
     }

  },
  props: [
    "showSetor",
    "showEscritorio",
    "mesesPeriodo",
    "showEquipe",
    "showOcultarFat",
    "showMix",
    "showOutros",
    "lstEquipe",
    "lstSetorAtividade",
    "lstEscritorio",
    "showOptionsCob",
    "showRadioOptions",
    "lstDefeitos",
    "lstProcedimetos"
  ],
  mounted(){   
      this.dataDe = format(addMonths(new Date(), -this.mesesPeriodo), "yyyy-MM-dd")
      this.dataAte = format(new Date(), "yyyy-MM-dd")
  
      if(this.language === 'P'){
          this.locale = 'pt-BR'
      }else if(this.language === 'E'){
          this.locale = 'en-US'
      }else if( this.language === 'F'){
          this.locale = 'fr'
      }else{
          this.locale = 'es'
      }

  }
};
</script>

<style>

.dropdown{
  
  font-size: 1.2rem;
}

.dropdown1{
  
  font-size: 1.2rem;
}
.bcard{
  min-height: 370px;
  
}

</style>
