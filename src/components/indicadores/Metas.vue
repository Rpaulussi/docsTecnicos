<template>
  <div style="width: 100%;display:flex; flex-direction:row; flex-wrap:wrap; text-align:center; justify-content: center; align-items: center;">
    
    <h1 class="text-uppercase text-center my-2 title-metas" >Metas do mês: {{ dateBr }}</h1>
        
    <div class="toggleBtn" >
      <div class="btnBox">
      <span ref="titleSelectedOne"  :class="showLoadedChart === false ? 'title-selected' : ''" class="title-selector">Tabela</span>
        <i v-on:click="btnChange" class="fa fa-2x  fa-laranja" :class="showLoadedChart === false ? 'fa-toggle-off' : 'fa-toggle-on'" style="color:darkorange;margin:16px 0px; max-width:200px; height:50px; cursor:pointer;"></i>
        <span ref="titleSelectedTwo" :class="showLoadedChart === true ? 'title-selected' : ''" class="title-selector">Gráfico</span>
      </div>
        <div v-show="showLoadedChart === true">
        <div class="d-flex flex-row flex-wrap mt-2" >
      <b-card  style="background-color:rgba(255,255,255, 0.5)" v-for="(data, index) in this.api" :key="data.subCategoria"
        v-show="data.valorMeta !== 0 && data.valorVenda !== 0">

        <h3 class="mb-4 text-center text-uppercase text-decoration-underline" style=" color:#f57424">

          {{ data.subCategoria }}
        </h3>
        <div id="Metas" :class="`ct-chart-` + index">
        </div>
      </b-card>
    </div>


      </div>
      <div v-show="showLoadedChart === false" class="w-100"  >
        
        <b-table  class="tableData flex-row w-100" foot-clone selectable head-variant="dark" :items="lstDetails" :fields="headerFields" striped responsive></b-table>
      </div>
</div>
    


    


    

     
    


  </div>
</template>

<script>
import Chartist from 'chartist';
import 'chartist/dist/chartist.min.css';
import { map } from 'underscore'
import { mapState } from 'vuex'
import numeral from 'numeral'
import axios from 'axios'
import { baseApiUrl, showError } from '../../global';


export default {
  name: "Metas",
  props: {
    api: {
      type: Array,
      required: true
    },
    userId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      totalDonut: 0,
      showLoadedChart: true,
      realizados: '',
      lstChart: ['Pie', 'Bar', 'Line'],
      total: 0,
      codeRep: "",
      lstDetails: Array,
      dateBr: '',
      headerFields: [
      
        {label:  "Equipe Vendas", key: "equipeVendas",  },
        {label:  "Categoria", key: "subCategoria", sortable:true },
        {label:  "Valor Meta", key: "valorMetaDisplay", sortable:true },
        {label:  "Valor Venda/Realizado", key: "valorVendaDisplay", sortable:true },
        {label:  "Porcentagem (%)", key: "porcentagemDisplay", sortable:true },
        
      ],
    }
  },

  computed: {
    ...mapState(["user", "lstDataIndicadores", "language"])
  },

  created() {


    // this.filterTest();
  },

  mounted() {
    this.loadApiIndicator();
    
  },
  methods: {
    btnChange() {
      
      this.showLoadedChart = !this.showLoadedChart;
    },
    showDetailsModal(item) {
      
      this.lstDetailsModal = item;
      this.$refs.modalDetails.show();
    },
    async loadApiIndicator() {
    this.spinner = true;
      try {
        var date = new Date()
        let firstDayMonth = `${date.getFullYear()}-` + `0${date.getMonth() + 1}-` + `01`
          console.log(firstDayMonth)
        const resp = await axios.post(`${baseApiUrl}/pedido/getmetavendacategoria`,
          { dataInicial: '2023-01-01', equipeVendas: this.user.equipeVendas })
          .then(e => {
            this.$store.commit('setlstDataIndicadores', e.data.listVendas);
            console.log('respapi', e.data);
             
          }).catch(err => { console.error(err) })
        console.log('resp', resp)
       

this.dateBr = `${date.getMonth() + 1}/` + `${date.getFullYear()}`  
        
        //Pie Chart
        



        this.api.forEach((e, index) => {

          const chartName = `.ct-chart-` + index
          this.total = 0
         

          if (e.valorVenda > e.valorMeta) {
            
            this.total = (e.valorVenda+e.valorMeta) * 2

            this.lstDetails = Array.from(this.$store.state.lstDataIndicadores)
            this.lstDetails = map(this.lstDetails, (i) => {
         let porcentagem = ((i.valorVenda / i.valorMeta) * 100).toFixed(2);
         let valorMetaDisplay  = numeral(i.valorMeta).format('$0,0.00')
                 let valorVendaDisplay = numeral(i.valorVenda).format('$0,0.00')
                 let porcentagemDisplay = numeral(porcentagem/100).format('0.00%')
          return{...i,  porcentagemDisplay, valorMetaDisplay, valorVendaDisplay }
        })

        

        
            let perc = (((e.valorVenda / e.valorMeta) * 100)-100)
            
            this.labels = ['100%', numeral((perc)/100).format('0.00%') ];
            this.series = [e.valorVenda, e.valorMeta]

            

            new Chartist.Pie(chartName, {
              labels: this.labels,
              series: this.series
            }, {
              donut: true,

              total: this.total,
              width: 300,
              height: 200,
              showLabel: true,
              startAngle: 270,
              classNames: {
                label: 'testClass'
              },



            });

          }

          else if (e.valorMeta >= e.valorVenda) {

            
        this.lstDetails = Array.from(this.$store.state.lstDataIndicadores)
        
        this.lstDetails = this.lstDetails.map( (i) => {
                  const porcentagem = ((i.valorVenda*100)/i.valorMeta).toFixed(2);

                   let valorMetaDisplay  = numeral(i.valorMeta).format('$0,0.00')
                 let valorVendaDisplay = numeral(i.valorVenda).format('$0,0.00')
                 let porcentagemDisplay = numeral(porcentagem/100).format('0.00%')
          return{ ...i, porcentagemDisplay, valorMetaDisplay, valorVendaDisplay}
        })

            this.total = (e.valorMeta * 2)
            this.labels = [`${((e.valorVenda * 200) / this.total).toFixed(2)}%`];
            this.series = [e.valorVenda]

            
            new Chartist.Pie(chartName, {
              labels: this.labels,
              series: this.series
            }, {
              donut: true,
              total: this.total,
              width: 300,
              height: 200,
              showLabel: true,
              startAngle: 270,
              ignoreEmptyValues: true,
              classNames: {
                label: 'testClass'
              },

            });
          }
          else if (e.valorMeta === 0) {
            showError('Valor da meta não definida.')
          }
        })
        
        this.showLoadedChart = true;
        this.spinner = false;
      } catch (err) {
        console.error(err)
      }
    },
  }
}
</script>

<style lang="scss" >
.card-body {
  background: rgba(255, 255, 255, 0.7) !important;
  width: auto;
}

.testClass {
  fill: black !important;
 
  font-weight: 600;
  font-size:0.8rem;
}

.ct-series-b {
  .ct-slice-donut {
    stroke: #A3AEBA;
  }
}

.ct-series-a {
  .ct-slice-donut {
    stroke: #28a745 !important;
  }
}

.ct-series-b {
  .ct-slice-donut {
    stroke: #0076C0;
  }

  


}
.title-selected{
    color:darkorange;
    height:50px;
    padding-bottom:5px;
    font-weight: 600;
    text-decoration:underline;
    vertical-align: center;
    font-size:2rem 
    
  }

  .title-selector{
    font-size:1.2rem !important;
    margin:8px;
  }
  .toggleBtn{
    width:100%;
  }
  .title-metas{
    color:#442f2d;
    text-shadow: 0 0 white;
    letter-spacing:2px;
    margin: 16px 0px 8px 0px;
    font-weight: 600;
    text-shadow: 0 0 darkorange;
  }
  .tableData{
    background-color: rgba(255, 255, 255, 0.75) !important;
    td, th{
      font-weight: 600 !important;
      
    }
  }

</style>