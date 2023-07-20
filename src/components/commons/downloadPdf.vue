<template>
  <div id="downloadPdf" @click="pdfData();">
    <b-button
      class="export-options"
      variant="outline-secondary"
      style="margin-top:12px;"
      
    >
      <img :src="require(`@/assets/iconpdf.png`)" />
    </b-button>
  </div>
</template>

<script>
import Vue from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";

//import {flatten} from 'underscore'

Vue.component("downloadPdf", jsPDF);

export default {
  name: "downloadPdf",
  props: ["items", "campos"],

  data() {
    return {
      pdfHead: {},
      pdfBody: [],
      row: [],
      columns: [],
      output: null
      
    };
  },
  methods: {
    
    pdfData() {
   
       
        const doc = new jsPDF({
        theme: 'grid',
        orientation: "landscape",
        cellWidth: 'auto',
        tableWidth: 'auto',
        fontSize: '6px',
        horizontalPageBreak: true,
        
        
      });
   
   
      
        
  
      doc.autoTable({
        

head: [this.campos],
body: this.items,

        
        
        
      });

     

      doc.save("relatorioPdf.pdf");
    },
  },
  mounted() {},

};
</script>


<style>
</style>
