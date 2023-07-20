<template>
   <div class="user-dropdown" v-if="user">
       <div class="user-button">
            <span class="d-none d-sm-block"> {{user.dataOperadorNome}}</span>
            <i class="fa fa-angle-down"></i>
        </div>
        <div class="user-dropdown-content">

                <a href refs="resetPassDiv" @click.prevent="resetPass()">
                 <i class="fa fa-cogs"></i>
                {{user.menuPassword}}
            </a>
           <!-- <router-link to='/admin' v-if="user.admin">
                <i class="fa fa-cogs"></i>
                Administração
            </router-link> -->
            <a href @click.prevent="logout">
                <i class="fa fa-sign-out"></i>
                {{ user.menuSair }}
            </a>
        </div>
         <b-container>
       <b-row>
           <b-col>
               <b-modal @ok="handleOk" id="resetPass" centered class="resetPass-box" ref="resetPass" no-close-on-esc no-close-on-backdrop v-b-modal.modal-prevent-closing>
                   <template class="modalHead" #modal-header>
                       <div class="modalBg col">  <img src="@/assets/logo.png" style="max-width:60px;" alt="" > <p style="padding:5px 0px; margin: 5px 0px;">Alterar Senha</p></div></template>
                    <p style="text-align:center; font-size:14px !important; font-weight:600; letter-spacing: 1px;"> {{ this.user.loginUsuario }}</p>
                    <b-form>
                        <b-form-group>
                            
<b-form-input type="password" maxlength="18" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" :invalid-feedback="'Senha Atual é Requerida'" :state="senhaAtual.length > 2 && senhaAtual.length <= 18" v-model="senhaAtual" id="senhaAtual" placeholder="Senha Atual" autoComplete="current-password"></b-form-input>
<b-form-input type="password" maxlength="18" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" :invalid-feedback="'Senha Nova é Requerida'" :state="novaSenha.length > 4 && novaSenha === novaSenhaRepete" v-model="novaSenha" id="novaSenha" placeholder="Nova Senha" autoComplete="new-password"></b-form-input>
<b-form-input type="password" maxlength="18" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" :invalid-feedback="'As senhas não coincidem'" :state="novaSenhaRepete.length > 4 && novaSenhaRepete === novaSenha" v-model="novaSenhaRepete" id="novaSenhaRepete" placeholder="Nova Senha novamente" autoComplete="new-password"></b-form-input>
                       
                     
                        </b-form-group>
                    </b-form>
                   <template #modal-footer="{ ok, cancel }">
      <b-button  size="sm" type="button" variant="success" @click="ok()">
        {{ traduction.confirm }}
      </b-button>
      <b-button size="sm" type="button" variant="danger" @click="cancel()">
        {{ traduction.cancel }}
      </b-button>
       
    
      
    </template>
    
                  
               </b-modal>
           </b-col>
       </b-row>
   </b-container>
   </div>
  
</template>

<script>
import { mapState } from 'vuex'
import {  baseApiUrl , showError, showSuccess  } from '@/global'
import  axios  from 'axios'
export default {
    name:'UserDropDown',
    computed: mapState(['user','traduction','isMenuVisible']),
    data(){
        return{
            dataUsrConf: {},
            senhaAtual : '',
            novaSenha : '',
            novaSenhaRepete: '',
            usrName: '',
            
        }
    },
    
    methods:{
    logout(){
       
           const url = `${baseApiUrl}/token/logout`
           this.$store.commit('toggleMenu', false)
            axios.get(url)
                 .then(() => {
                    this.$store.commit('setSelectedRep',{}) 
                    this.$store.commit('setUser',null)
                    this.$store.state.isMenuVisible = false
                    this.$router.push({name: 'login'})
                    localStorage.removeItem("token")  
                 })
                 .catch(() =>{
                    showError(this.traduction.internalError)
                    this.$store.state.isMenuVisible = false
                    this.$router.push({name: 'login'})
                 })
        },
        resetPass(){
             
            this.$bvModal.show('resetPass')
        
            
            
            this.$store.commit('setResetPass', true)
        },
        handleOk(el){         
             if(this.senhaAtual === this.novaSenha && this.senhaAtual.length > 0 )
                {
                    el.preventDefault(); 
                    showError(this.traduction.loginError) 
               
                }
                else if (this.novaSenha !== this.novaSenhaRepete)
                    {
                        el.preventDefault(); 
                        showError(this.traduction.errorPass)
                      
                    } 
                    else if(this.novaSenha === this.novaSenhaRepete && this.senhaAtual.length > 2)
                    { 
                         axios.post(`${baseApiUrl}/homeData/changePassword`, {
                             usuario: this.user.loginUsuario,
                             senhaAtual: this.senhaAtual,
                             novaSenha: this.novaSenha
                         }).then(resp => {
                             showSuccess(resp)
                            
                         }).catch(err => {
                             showError(err)
                             el.preventDefault();
                         }) 
                        this.novaSenha = ''  
                        this.novaSenhaRepete = ''
                        this.senhaAtual = ''
                        // this.$bvModal.hide('resetPass')


                    }


                    
        },
        cancel(){
this.$bvModal.hide('resetPass')
        },
     

    },
    
   
}
</script>

<style lang="scss">


   .user-dropdown{
       position: relative;
       height: 100%;
      
   }
   .user-button{
       display: flex;
       align-items: center;
       color: antiquewhite;
       font-weight: 100;
       height: 100%;
       padding: 0 20px;
   }
   .user-dropdown-content{
       position: absolute;
       right: 0px;
       background-color: #f9f9f9;
       min-width: 170px;
       box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.2);
       padding: 10px;
       

       display: flex;
       flex-direction: column;
       flex-wrap: wrap;

       visibility: hidden;
       opacity: 0;
       
   }
    .dropdown .dropdown-content[data-v-6149e08a] {
        z-index:99 !important;
    }
   .user-dropdown:hover{
       background-color : rgba(0,0,0,0.2);
   }
   .user-button i{
       margin-left: 10px;
   }
   .user-dropdown:hover .user-dropdown-content{
       visibility: visible;
       opacity: 1;
       z-index:1;
   }
   .user-dropdown-content a{
       text-decoration: none;
       color: #000;
       padding: 10px;
   }
   .user-dropdown-content a:hover{
       text-decoration: none;
       color: #000;
       background-color: #EDEDED;
   }
   .resetPass-box{
     background-color:black;
     color:white;
     border-radius:20px;
     border:1px solid black;
     
     
   }
   .modal-header{
         background-color:black !important;
         color:white;
         text-align:center;
         justify-content:space-between !important;
         padding:0 !important;
     }
     .modal-body{
         background-color:#F6EAEA;
     }
     .modal-footer{
         background-color:#F6EAEA;
         border-top:1px solid #333 !important;
     }
    
     
</style>