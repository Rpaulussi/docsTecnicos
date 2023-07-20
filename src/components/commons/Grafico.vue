<template>
   <div>
       <v-chart class="chart" @click="showInfo" :option="option"> </v-chart>
   </div>
</template>

<script>
import { use } from "echarts/core";
import VChart, { THEME_KEY } from "vue-echarts";
import { CanvasRenderer , SVGRenderer } from "echarts/renderers";
import {
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    RadarChart,
    MapChart,
    TreeChart,
    TreemapChart,
    GraphChart,
    GaugeChart,
    FunnelChart,
    ParallelChart,
    SankeyChart,
    BoxplotChart,
    CandlestickChart,
    EffectScatterChart,
    LinesChart,
    HeatmapChart,
    PictorialBarChart,
    ThemeRiverChart,
    SunburstChart,
    CustomChart
} from 'echarts/charts';
use([CanvasRenderer]);
use([SVGRenderer]);
// import {
//     UniversalTransition,
//     LabelLayout
// } from './export/features';
import {
    GridComponent,
    PolarComponent,
    GeoComponent,
    SingleAxisComponent,
    ParallelComponent,
    CalendarComponent,
    GraphicComponent,
    ToolboxComponent,
    TooltipComponent,
    AxisPointerComponent,
    BrushComponent,
    TitleComponent,
    TimelineComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
    LegendComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent,
    VisualMapComponent,
    VisualMapContinuousComponent,
    VisualMapPiecewiseComponent,
    AriaComponent,
    DatasetComponent,
    TransformComponent,
} from 'echarts/components';


use([
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    RadarChart,
    MapChart,
    TreeChart,
    TreemapChart,
    GraphChart,
    GaugeChart,
    FunnelChart,
    ParallelChart,
    SankeyChart,
    BoxplotChart,
    CandlestickChart,
    EffectScatterChart,
    LinesChart,
    HeatmapChart,
    PictorialBarChart,
    ThemeRiverChart,
    SunburstChart,
    CustomChart,
    GridComponent,
    PolarComponent,
    GeoComponent,
    SingleAxisComponent,
    ParallelComponent,
    CalendarComponent,
    GraphicComponent,
    ToolboxComponent,
    TooltipComponent,
    AxisPointerComponent,
    BrushComponent,
    TitleComponent,
    TimelineComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
    LegendComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent,
    VisualMapComponent,
    VisualMapContinuousComponent,
    VisualMapPiecewiseComponent,
    AriaComponent,
    DatasetComponent,
    TransformComponent,

]);


export default {
  name:"Grafico",
  components: {VChart},
  provide: {
    [THEME_KEY]: "dark"
  },
  watch: {
     registers: function(){
         this.generateComponent()
     }
  },
  props:["title","chartType","registers"],
  data: function(){
      return {
          option : {
                title: {
                    text: this.title,
                    left: "center"
                },
                xAxis: {
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                    data: [],
                    type: this.chartType
                    }
                ],
                tooltip: {
                    trigger: "item",
                    // formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
            },
      }
  },
  methods:{
     showInfo(eventInfo){
        this.$store.setChooseItem(eventInfo.name)
     },
     generateComponent(){
         this.registers.forEach(element => {
         this.option.xAxis.data.push(element.defeito)
         this.option.series[0].data.push(element.quantidade)
      }) 
     }
  },
  
}
</script>

<style>
    .chart {
      height: 50vh;
      width: 98vw;
    }
</style>