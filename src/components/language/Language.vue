<template>
    <div class="flags-countries">
        <LanguageItem :isSelected="language == 'P' " urlImage='bandeiraBrazil.gif' altImage="P"> </LanguageItem>
        <LanguageItem :isSelected="language == 'E' " urlImage='bandeiraUSA.gif'    altImage="E"> </LanguageItem>
        <LanguageItem :isSelected="language == 'F' " urlImage='bandeiraFrance.gif' altImage="F"> </LanguageItem>
        <LanguageItem :isSelected="language == 'S' " urlImage='bandeiraSpain.gif'  altImage="S"> </LanguageItem>
    </div>
</template>

<script>
import LanguageItem from './LanguageItem.vue'
import { mapState } from 'vuex'
export default {
    name:'Language',
    data: function(){
        return {
           
        }
    },
    components: { LanguageItem },
    methods: {

    },
    computed:{
    
      ...mapState(['language']) ,
      
    }
}
</script>

<style>
  .flags-countries{
     display: flex;
     justify-content: space-around;
  }
</style>