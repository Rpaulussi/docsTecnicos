<template> 
   <div class="content" @click="toggleMenu" ref="content" :class="!user ? 'back-color' : '' ">
       <router-view></router-view>
   </div>
</template>

<script>

import { mapState } from 'vuex'
export default {
   name:'Content',
   computed: mapState(['user','isMenuVisible']),
    data(){
      return{
        
      }
    },
       methods:{
    toggleMenu(){
     // console.log(this.$route.path)
      if(this.$route.path !== '/login' && this.$route.path !== undefined){
 this.$store.state.isMenuVisible = false
      this.$store.commit('toggleMenu')
      }
     
      
    }
},
    
}

</script>

<style>
  .content {
      grid-area: content;
      padding: 0px;
      background: floralwhite;
  }
 
  .back-color{
    /* background:linear-gradient( to right,#0e0f0f , #545455); */
    padding: 0px;
  }
  
  
</style>