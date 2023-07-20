<template>
  
    
    
   
   
  
   <aside  class="menu"  :class="isMenuVisible ? 'menu-small': 'menu' ">
   

      <div v-if="user.userType !==  'REP'">
         <User-info v-if="!isMenuVisible" :rep="repSelected.high" icon="fa fa-user-circle-o fa-3x" :perfil="user.userType === 'GN' ? user.lblSelectGN : user.lblSelectGR ">  </User-info>
      </div>
      <div v-else>
        <User-info v-if="!isMenuVisible" :rep="user.dataRepresentante" icon="fa fa-user-circle-o fa-3x" :perfil="user.lblSelectREP">  </User-info>
      </div>
      <div v-if="user.userType !== 'REP' " class ="menu-button" @click="callSalesOffice()">
          <div>
             <i class=" fa fa-building fa-sm"></i>
             <span :hidden="isMenuVisible"> {{ user.lblEscritVenda }}</span>
          </div>
     </div>
     
     
     
    
     
   
      <sidebar-menu v-if="repSelected.high || user.userType === 'REP'" ref="dropdownSideMenu" :collapsed ='isMenuVisible' :disable-hover="isMenuVisible" :menu="menu" @item-click="setMenuVisible"  showOneChild:true>
      </sidebar-menu >
   

   
   </aside>
    
</template>

<script>
import  { mapState } from 'vuex'
import { SidebarMenu } from 'vue-sidebar-menu'
import UserInfo from '../template/UserInfo.vue'

export default {
    name:"Menu",
    computed:mapState(['isMenuVisible' ,'user' , 'menu', 'repSelected']),
    components:{SidebarMenu, UserInfo},
    data() {
      return{
        
      }
    },
    methods:{
     
  
       async callSalesOffice(){
       
             await this.$router.push({path: '/salesoffice'})
        },
        setMenuVisible(){
       
          this.$store.commit('toggleMenu', false)
           
        },
       

    },
    
    
   
 
  }
</script>

<style lang="scss">

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}


.user-info{
  .text-area{
    background-color: antiquewhite ;
    color:black;
  }
}

.text-area{
  
  color:black;
  
  padding:20px;
  border-radius:20px;
  margin:5px;
}
    
   .menu {
      
      
       
    


   }

  
   .vsm--item{

     font-size:1.25rem !important;
     font-weight:500;



   }
   .vsm--list > div{
     margin-top:5px;

   }
   .vsm--link_level-1:hover{
     padding-left:5px;
     font-weight:600;
   }
   .vsm--link_level-2:hover
   {
    color:#e58b2a !important;
     padding-left:10px;
     font-weight:600;
   }


   .vsm--link_active{
     font-weight:600;
     border-left:5px solid black;

   }




   .menu-small{
        visibility: hidden;
        opacity:0;
       width: 0px;

   }

   .menu-button{
       display: flex;
       justify-content: space-around;
       /* background: linear-gradient( to right,#0e0f0f , #545455); */
       background-color: rgb(68, 47, 45);
       border-top:1px solid #e58b2a;
       color: white;
       align-items: center;
       font-size: 1.2rem;
       padding-left: 2px;
       padding-top: 10px;
       padding-bottom: 10px;
       max-width: 300px ;
   }
   .menu-button span {
       flex-wrap: wrap;
   }
   .menu-button:hover{
      background-color: rgb(49, 46, 46);
      cursor: pointer;
   }

   .v-sidebar-menu .vsm--toggle-btn {
       display:none;
   }
   .v-sidebar-menu .vsm--link {
       text-decoration: none;
       color: rgb(27, 24, 24);
       display:flex;
       padding:5px 0px;
   }


   .v-sidebar-menu .vsm--icon {
      
       margin: 4.5px 10px 0px 15px;
   }
   .vsm--item_open, .vsm--list{
     //background:rgba(68, 47,45, 0.7);

   }
   .hoverColor{
     background-color: rgb(236, 158, 12);
   }
   .vsm--item:hover, .vsm--item:active, .vsm--link_active{
      
      width:100%;



   }
  
     .router-link-active, .vsm--link_active{
border-left:8px solid black;
//box-shadow:0px 0px 10px 3px #000;
border-bottom:2px solid black;
border-top:2px solid black;
background-color: rgb(68, 47, 45);
      color:rgb(236, 158, 12) !important;
min-width: 50px;
   }
   
  
   .vsm--title{
font-size: 0.85rem;
text-transform: uppercase;
   }

 



</style>
