<template>

   <div class="auth-container">
       <div class="auth-modal-login">
           <div class="auth-lado-img">
               <img class="liz_logo" src="@/assets/LIZ_Wallpaper.png" alt="Logo">
           </div>
           <div class="auth-lado-content">
               <Language></Language>
            <div class="input-group">
               <b-form class="form">
               <input type="text" name="user" autoComplete="user" v-model="localUser.username" v-bind:placeholder="traduction.usuario" required>
               
               <input type="password" autoComplete="current-password" name="password" v-model="localUser.password" v-bind:placeholder="traduction.senha" required @keyup.enter="signin">
               </b-form>
            </div>
            <div class="button-login-area" >
               
                 <button  @click="signin" v-on:keyup.enter="signin"> 
                    <div v-if="loading" class="spinner-border spinner-border-sm"></div> 
                   {{traduction.entrar}}
                 </button>
            </div>
           </div>
       </div>
   </div>
</template>

<script>

import axios from 'axios'
import {  baseApiUrl , showError } from '@/global'
import { mapState } from 'vuex'
import Language from '../language/Language.vue'

export default {
     name:"Auth",
     data: function(){
        return{
           selected: true,
           localUser: {},
           messagesIdioma: [],
           loading:false
        }
     },
     computed:{
       ...mapState(['language' ,'user' , 'mainMenu','traduction','isloadingLogin', 'isMenuVisible'])  
     },
     components:{Language},
     methods: { 
      resetLogin(){
         this.$store.commit('setSelectedRep',{}) 
                           localStorage.removeItem("token")  
                         this.$store.commit('setUser',null)
                           this.$store.state.isMenuVisible = false
        }  ,     
        signin(){
           
           if(this.localUser.username && this.localUser.password){
              this.loading = !false
              setTimeout(()=>{
                 this.loading = !true
              },4000)
            const url = `${baseApiUrl}/token/auth`
            axios.post(url,{ 
                     grant_type: "password", 
                     client_id: "",
                     client_secret: "", 
                     email: "", 
                     username: this.localUser.username, 
                     password: this.localUser.password,
                     refresh_token: "" 
            }).then(resp => {
                    if (resp.data.status === 200){
                     // console.log('RESPOSTA' , resp.data)

                       this.$store.commit('setUser',resp.data.homePage)
                       this.$store.commit('setMessagesUi',resp.data.msg)
                       localStorage.setItem("token",JSON.stringify(resp.data.payload))
                       
                       //console.log("token: " , resp.data.homePage)
                       
                       if(resp.data.homePage.userType !== 'REP'){
                          this.$router.push({ path:"/salesoffice" })
                          
                       }else{
                          this.$router.push({ path:"/home" })
                       }
                       
                      
                    }else if(resp.data.status === 401){
                       showError(this.traduction.loginError)
                    }         
            }).catch(err =>{
                    
                    showError(err)
                    this.$router.push({ path:"/login" }) 
                    this.$store.state.isMenuVisible = false;               
                 })
            }
            else{
               showError(this.traduction.loginEmpty)              
            }
            
        }
       
     },
     async created(){
     
         await this.resetLogin();
      
                         

                   
      
     }
}
</script>

<style>
  .auth-container{
     display: flex;
     justify-content: center;
     align-items: center;
     background-image: url('../../assets/capa_login.jpg');
     background-size: cover;
     background-repeat: no-repeat;
     height: 100%;
  }

  .auth-modal-login{
     display: flex;
     justify-content: center;
     width: 350px;
     height: 350px;
     box-shadow: 0 1px 5px rgba(0,0,0,0.4);

     
  }
  .auth-lado-content{
     /* background-color: coral; */
     background-color: #eb7a09;
     display: flex;
     flex-direction: column;
     justify-content: space-around;
    
     padding: 5px;

  } 

  .auth-lado-content input{
     margin: 5px;
     border: 1px solid #bbb;
     padding: 5px;
  }
  
  .button-login-area{
     display: flex;
     flex-direction: column;
     justify-content: flex-start;
     align-items: center;
     height: 105px;
     
     
  }
  .button-login-area button {
        
        background-color: #5b5e63;
        color: #fff;
        padding: 5px 15px;
        border-radius: 5px;
        
   }
   .button-login-area button:hover{
        background-color: #2f3031;
   }
   .liz_logo{
      max-width:200px;
      max-height: 350px;
   }

   /* .img-flags:hover,
   .img-flags:focus{
      box-shadow: 0 0.5em 0.5em -0.4em ;
      transform: translateY(-0.25em);
      border-color: #bdcf1b;
      filter: none;
   }
   .img-flags {
      filter: grayscale(100%);
      filter: gray; 
   } */

</style>