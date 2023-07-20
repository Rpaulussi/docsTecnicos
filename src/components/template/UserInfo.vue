<template>
    <div class="user-info">
        <div class="icon-area">
             <i v-if="icon" :class="icon"></i>
        </div>
        <div class="text-area">
            <span class="d-none d-sm-block"> <b>{{ user.lblPerfil }}:</b> {{perfil}}</span>
            <span class="d-none d-sm-block"> <b>{{ user.lblRepresentante }}:</b> {{rep}}</span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: "UserInfo",
    props:['icon','perfil','rep'],
    computed:{
        ...mapState(['user'])
    }
}
</script>

<style>
    .user-info {
      display: flex;
      justify-content: flex-start;
      background-color: rgb(68, 47, 45);
      padding:10px 0px;
     
    }
    .text-area{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-wrap: wrap;
   
      margin-left: 10px;
      color: white;
    }
    .icon-area{
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;

        margin-left: 5px; 
    }
</style>