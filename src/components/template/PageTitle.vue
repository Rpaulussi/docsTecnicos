<template>
   <div>
       <div :class="this.main !== 'HOME' ? 'pageTitle-mainArea' : 'home-title'" style="border-bottom:1px solid black;">
          <div class="icon-home" style="">
              <i  class="fa fa-home fa-3x fa-custom" @click="goToHome()"></i>
          </div>
          <div class="page-title">
            

            <h3 class="fa-custom mt-2" style="text-transform:uppercase; margin-top:20px;">{{ main }} </h3>


          </div>
          <div class="icon-right">
         <i v-if="icon" class="fa fa-3x fa-custom" :class="icon" style="margin-right:15px"> </i>  
          </div>
         
       </div>
     <!-- <hr style="margin-top:0;  border:1px solid black "> -->
   </div>

</template>

<script>
export default {
   name:'PageTitle',
   props: ['icon','main','sub', 'link'],
   methods: {
       goToHome(){
           this.$router.push({name: 'home'})
       },
   },
  

}
</script>

<style>
  .page-title h1{
       margin: 0px;
       text-transform:uppercase;
       letter-spacing: 1px;
       color:black;
       font-weight: 500;
       margin-bottom:5px;
       font-family: 'Montserrat', sans-serif;
      
       
       
   }
    .pageTitle-mainArea{
           background: seashell !important;
           box-shadow:1px 1px 1px 1px #e58b2a;
           display:none;
           
 
    flex-direction: row;
    padding:8px;
    text-align: center;
    justify-content: space-between;
    margin-bottom:16px !important;
    

  }

   .page-title h2 {
       color: #777;
       margin-top: 5px;
       font-size: 1.3rem;
   }
   .main-area{
       display: flex;
       justify-content: space-between ;
       
    

   }
   .icon-home > i:hover{
      color: #777;
      cursor: pointer;
     
   }
   .icon-home{
    
   }
   .home-title{
    /* background: rgba(255,255,255, 0.5); */
    display: flex;
    flex-direction: row;
    padding:4px;
    text-align: center;
    justify-content: space-between;
   }
.fa-custom{
  color: black;

}
.fa-custom:hover{
  color:#e58b2a !important;
}
</style>
