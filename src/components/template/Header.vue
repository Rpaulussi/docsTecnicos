<template>
  <header class="header">
       <button class="button button-toggle p-0" title="Menu" aria-label="Button" style="border: 0px;"  @click="toggleMenu" v-if="!hideToggle">
         <i class="fa fa-lg faCustom"  :class="icon"></i>
       </button>
       
       
       <h3 class="title"> 
          <!-- <router-link to="/" > {{title}} </router-link> -->
         {{ page }}
       </h3>
       <div v-show="user" class="homeBtn fa fa-home" style="display:flex; flex-direction:column; justify-content:center; text-align:center; align-items:center;" @click="$router.push({path:'/home'})"><span>Home</span>
       </div>
       <UserDropDown ></UserDropDown>
       

    </header>
</template>

<script>

import UserDropDown from './UserDropDown'
import { mapState } from 'vuex'
export default {
    name:"Header",
    computed: {
        icon(){
          return this.$store.state.isMenuVisible ? "fa-liz" :"fa-liz2"
      },
      page(){
        return this.$route.name === 'HOME' ? this.serverMessages.loginTitleHeader  : this.$route.name
      },
      ...mapState([
      "serverMessages",
      "language",
      "traduction",
      "user",
    ]),
    },
    props:{
      hideToggle: Boolean,
    },
    components: {UserDropDown},
    methods:{
       toggleMenu(){
          this.$store.commit('toggleMenu')
        
          // let elem = this.$refs.toggleMain.classList.add('toggleLarge')
          // console.log('classlistadd', elem)
          // elem.classList.add('toggleLarge')

       }
    }
}
</script>

<style lang="scss" >
.homeBtn{ 
  padding:20px 5px;
  color:antiquewhite;
&:hover{
  border-left: 1px solid #e58b2a;
  border-right: 1px solid #e58b2a;
  opacity: 0.75;
  background:rgba(255, 250, 240, 0.5);
  color:black;
}

 
}
.faCustom{
  padding:5px;
  color:#e58b2a;
  background:black;
  
}
.fa-liz{
      background-image: url("../../assets/logoSmall.png");
      height: 69px;
    width: 50px;
    background-size:cover;
    background-repeat: no-repeat;
    background-position: center center;
    opacity: 1;
    padding-top:0px;
    &:before{
      content: '';
    }
    &:hover{    
      box-shadow: 1px 1px 1px 1px #333;
      opacity: 0.75;
    }
     &:after{
      margin-left:30px;
      font-size:20px;
      color:black;
      content: '\f101';
     }


}
.fa-liz2{
  background-image: url("../../assets/logoSmall.png");
  height: 69px;
width: 50px;
background-size:cover;
background-repeat: no-repeat;
background-position: center center;
opacity: 1;
padding-top:0px;
&:before{
  content: '';
}
&:hover{    
  box-shadow: 1px 1px 1px 1px #333;
  opacity: 0.75;
}

  &:after{
    margin-left:30px;
   content: '\f100';
   font-size: 20px;
   color:black;
  }
}
.fa-lizDark{
     background-image: url("../../assets/logoSmall_negativo.png");
     height: 69px;
    width: 50px;
     background-size:cover;
    background-repeat: no-repeat;
    background-position: center center;
    padding-left:100px;
  opacity: 1;
  &:before{
      content: '';
    }
     &:hover{
      box-shadow: 1px 1px 1px 1px #e58b2a;
      opacity: 0.75;
      
    }
     &:after{
       margin-left:30px;
      content: '\f100';
      font-size: 20px;
      color:white;
     }
   
   

}
   .header{
       grid-area: header;
       border-bottom: 1px solid #e58b2a;
       /* background: linear-gradient( to right,#0e0f0f , #545455); */
       background-color: rgb(68, 47, 45);
       display: flex;
       justify-content: center;
       align-items: center;
       color: rgb(184, 176, 176);
   }

   .title{
     font-size: 1.2rem;
     
     font-weight: 100;
     flex-grow: 1;
     text-align: center;
     color:antiquewhite;
     text-decoration: "none";
     text-transform:uppercase;
  }
   header.header > a.toggle{
     width: 60px;
     height: 100%;
     color: #fff;
     justify-self: flex-start;
     text-decoration: none;

     display: flex;
     justify-content: center;
     align-items: center;
  }

  header.header > button.toggle:hover {
      color: #fff;   
      background-color: rgba(148, 144, 144, 0.2);
      
  }
  .toggle{
    background:black;
    color:white;
    padding:8px 16px;
    border:none;
  }
  
</style>