<template>
   <img class= "img-flags" :style="isSelected?'filter:none': ''" :src="require(`@/assets/${urlImage}`)"  :alt= altImage @click="setCurrentLanguage"> 
</template>

<script>
import { mapState } from 'vuex'
export default {
   name:"LanguageItem",
   computed:mapState(['language']),
   props:{
      urlImage : String,
      altImage: String,
      isSelected :Boolean,
   },
   methods:{
     setCurrentLanguage(){
        this.$store.commit('setLanguage',this.altImage)      
        document.cookie = 'cmrweblanguage=' + this.altImage + '; expires=Thu, 2 Aug 2100 20:47:11 UTC; path=/';         
     }
   }
}
</script>

<style>
  .img-flags{
      filter: grayscale(100%);
      filter: gray; /* IE */
  }
  .img-flags:hover,
  .img-flags:focus{
      box-shadow: 0 0.5em 0.5em -0.4em ;
      transform: translateY(-0.25em);
      border-color: #bdcf1b;
      filter: none;
   }
</style>