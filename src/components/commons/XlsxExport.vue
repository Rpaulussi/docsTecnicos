<template>
    <div id="XlsxExport" >
     
        <b-button  style="margin-top:12px;" variant="outline-success" @click="handleOk()">  <img :src="require(`@/assets/excelicon.png`)"> </b-button>
   

    </div>
</template>

<script>

const XLSX = require('sheetjs-style');
import { saveAs } from 'file-saver'
    export default {
        name: 'XlsxExport',
        
        props:{
            table: null,
            tableName: String,
            fields: null,
            tableRaw: Boolean,
            tableData: null,
        },
        methods:{
            handleOk: function(){
             
            console.log(this.table,  this.fields, this.tableName)

         

           
            console.log('entrou false', this.tableRaw)
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet(this.tableData)

        let wscols = [
    {wch:10},
    {wch:30},
    {wch:20},
    {wch:20},
    {wch:20}
];

            ws["!cols"] = wscols;
            XLSX.utils.book_append_sheet(wb, ws, 'aba1',)
            let xlsxFile = XLSX.write(wb, {bookType: "xlsx", type: "array", output: "buffer"})

            
            saveAs(new Blob([xlsxFile], {type: "application/octet-stream"}),`${this.tableName}.xlsx`); 
        
    }
        }
    }
</script>

<style lang="scss" scoped>

</style>