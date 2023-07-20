<template>
  <div v-if="!user" id="app" :class="{'hide-menu-total' : !isMenuVisible}" >
    <Header :hideToggle="!user" :main="'CMR WEB'"></Header>
    <Menu v-if = "user"></Menu>
    <Content>
      
    </Content>
    <Footer></Footer>
  </div>
  <div v-else-if="user" id="app" :main="'CMR WEB'" :class="{'hide-menu' : isMenuVisible}" >

    
    <Header :hideToggle="!user">
    
      
    </Header>
    
    <Menu v-if = "user" ></Menu>
 
    
    <Content></Content>
    <Footer></Footer>
  </div>
</template>

<script>
import Content from './components/template/Content'
import Menu from './components/template/Menu'
import Footer from './components/template/Footer'
import Header from './components/template/Header'





import axios from 'axios'
import { mapState } from 'vuex'
import { baseApiUrl } from '@/global'



export default {
  name: 'App',
  components: {
    Content,
    Menu,
    Footer,
    Header,
  },
  methods:{
    getCookie(name) {
      let re = new RegExp(name + "=([^;]+)");
      let value = re.exec(document.cookie);
       return (value != null) ? unescape(value[1]) : 'P';
    },
    // setLang(){
    //   let cmrLang = this.getCookie("cmrweblanguage")
    //   console.log(cmrLang)
    //   if(cmrLang === 'P')
    //   {
    //     const html = document.documentElement // returns the html tag
    //         html.setAttribute('lang', 'pt-BR')
    //   }
    //   else if(cmrLang === 'E'){
    //     const html = document.documentElement // returns the html tag
    // html.setAttribute('lang', 'en')
    //   }
    //   else if(cmrLang === 'S'){
    //     const html = document.documentElement // returns the html tag
    // html.setAttribute('lang', 'es')
    //   }
    //   else if(cmrLang === 'F'){
    //     const html = document.documentElement // returns the html tag
    // html.setAttribute('lang', 'fr')
    //   }
    // },
    getHomeData(){
      const url = `${baseApiUrl}/homedata/verifyuseraccount`
            axios.get(url)
                 .then(resp => {
                    if(resp.data.status === 200){
                       this.$store.commit('setUser',resp.data.payload)
                      this.$store.commit('setMessagesUi',resp.data.msg)
                      this.$router.push({ path:"/home" })
                    }else{
                      
                      this.$router.push({ path:"login" })
                      
                    }
   
                 })
                 .catch(() =>{
                  //console.log('error login api', err)
                    this.$router.push({name: 'login'})
                 })
    }
  },
   computed: mapState(['isMenuVisible','user','isloadingLogin']),
   created(){
  
   // console.log(this.getCookie("cmrweblanguage"))
    const html = document.documentElement
    html.setAttribute('lang', this.getCookie("cmrweblanguage"))
    this.$store.commit("setLanguage",this.getCookie("cmrweblanguage"))
    this.getHomeData()

  },
    
 
}
</script>

<style lang="scss">


:root {
  --vs-font-size: 0.6rem;
}

.vs__selected-options {
    flex-wrap: nowrap;
    max-width: calc(100% - 41px);
  }
  .vs__dropdown-toggle{
    height:35px;
  }

  .vs__selected {
     display: block;
     white-space: nowrap;
     text-overflow: ellipsis;
     max-width: 100%;
     overflow: hidden;
   }
*{
font-family: "Lato","sans-serif";
}
#app{
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
	display: grid;
	grid-template-rows: 70px 1fr 40px;
  grid-template-columns: 290px 1fr;
  transition: grid-template-columns 0.3s ease-in-out;
  grid-template-areas:
	"header header"
	"menu content"
	"footer footer";
}
#app.hide-menu {
	grid-template-columns: 0px 1fr;
}
#app.hide-menu-total{
grid-template-areas:
"header header"
"content content"
"footer footer";
}
body{
  margin: 0;
}
@font-face {
  font-family: "Lato-light";
  src: local("Lato"),
   url("../public/styles/fonts/Lato-Light.woff2") format("woff2");
   font-display: swap;
}
@font-face {
  font-family: "Lato";
  src: local("Lato"),
   url("../public/styles/fonts/Lato-Regular.woff2") format("woff2");
   font-display: swap;
}
@font-face {
  font-family: "Lato-bold";
  src: local("Lato"),
   url("../public/styles/fonts/Lato-Bold.woff2") format("woff2");
   font-display: swap;
}

h1{
  font-family: 'Lato-light';
  font-size:6rem;
}
 h2{
  font-family: 'Lato-light';
  font-size:2.75rem;
}
h3{
font-family: 'Lato';
font-size:2rem;
}
h4{
font-family: 'Lato';
font-size:1.125rem
}
h5 {
 font-family: 'Lato';
 font-size:0.8rem;
  
}
.menu-small{
  visibility: hidden;
        opacity:0;
       width: 0px;

}
.menu{
  grid-area: menu;
       /* background: linear-gradient(to right , #696867, #bdbebe); */
       background: antiquewhite;
       display: flex;
       width:auto;
       flex-direction: column;
       flex-wrap: wrap;
      opacity:1;
      visibility:visible;
       border-right:2px solid black;
       overflow: hidden;
       transition:2s ease;
      

}

@media(max-width:767px){
  #app.hide-menu{
    grid-template-columns: 0px 1fr !important;
  }
  .menu-small{
    opacity:0;
    visibility:hidden;
    transition: visibility 0s, opacity 0.5s linear;
  
  }
 
  #app{

  grid-template-columns: 230px 1fr;
  }
  .menu{
    visibility:visible;
    opacity:1;
    max-width:230px;
    
  }
}
@media(max-width:576px){
  .card-body{
    width:370px;
  }
  #app{

  grid-template-columns: 180px 1fr;
  }
  .menu{
    max-width:180px;
  }
}

</style>
