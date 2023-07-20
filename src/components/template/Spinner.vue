<template>

   <div class="spinner-area" >
        
            <b-spinner
            v-show="state"
            ref="spinnerRef"
           style="width: 3rem; height: 3rem;"
            label="Large Spinner"
                variant="warning"
                
                
            ></b-spinner>
       
   </div>
</template>

<script>
export default {
   name:"Spinner",
   props:['state'],

   data() {
       return{
      
       }
   },
   
}
</script>

<style>
    .spinner-area{    
      position: relative;
    margin: auto;
    top: 36vh;
    bottom: 0;
    left: 50%;
    right: 50%;
    z-index: 2 !important
      
  }
   
</style>