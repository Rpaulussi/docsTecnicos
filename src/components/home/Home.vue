<template>
  <div v-show="user">

    <div class="home-wrapper  m-0">



      <!-- <PageTitle class="pageHome" :main="'HOME'" style="margin-bottom: 0px !important" /> -->
      <b-container fluid class="m-0" style="padding:8px 0px;">



<div v-if="this.user.equipeVendas === '533'">
        <div class="row">
          <div class="col-12">

           
       
            <Metas :api="Array.from(this.lstDataIndicadores)" :userId="this.user.loginUsuario" />
          </div>

        </div>
      </div>





        <b-modal id="modalNews" ref="modalNewsLiz" centered size="lg" header-bg-variant="dark" header-text-variant="light"
          ok-only>
          <template #modal-header>
            <span class="p-3">Liz News - Log de atualizações.</span>
          </template>
          <b-card no-body style="width:100%; text-align:center; justify-content:center;">
            <ul class="textArea-home home-card card">

              <h3> {{ traduction.welcomeMsg }} </h3>
              <h6> {{ traduction.welcomeMsg2 }} </h6>

              <li><span><b>Ricardo Paulussi - Desenvolvedor de Sistemas</b></span></li>
              <li><a style="color:darkorange" href="tel:+551145893500">(11)4589-3500 - Ramal 0362</a></li>
              <li><a style="color:darkorange"
                  href="mailto:ricardo.paulussi@cmrcia.com.br">ricardo.paulussi@cmrcia.com.br</a></li>
              <li><a style=" margin:0px 5px; color:darkorange" href="http://wa.me/5511971017599" target="_blank"><i
                    class="fa fa-2x fa-whatsapp"></i></a> <a style=" margin:0px 5px; color:darkorange"
                  href="tel:+551145893500" target="_blank"><i class="fa fa-2x fa-phone"></i></a> <a
                  style=" margin:0px 5px; color:darkorange" href="mailto:ricardo.paulussi@cmrcia.com.br"
                  target="_blank"><i class="fa fa-2x fa-envelope-o"></i></a></li>
              <li><span><b>Eduardo Pimenta - Gerente de TI.</b></span></li>
              <li><a style="color:darkorange" href="tel:+551145893500">(11)4589-3500 - Ramal 3531</a></li>
              <li><a style="color:darkorange" href="mailto:eduardo@cmrcia.com.br">eduardo@cmrcia.com.br</a></li>
              <li><a style="margin:0px 5px;color:darkorange" href="tel:+55114589-3500" target="_blank"><i
                    class="fa fa-2x fa-phone"></i></a> <a style="margin:0px 5px;color:darkorange"
                  href="mailto:eduardo@cmrcia.com.br" target="_blank"><i class="fa fa-2x fa-envelope-o"></i></a></li>
            </ul>

          </b-card>

          <b-card no-body class="mt-2" style="width:100%; text-align:center; justify-content:center;">
            <ul class="textArea-home home-card card">


              <h3> Últimas Atualizações: </h3>
              <li><b>[CadastroPedidos]: </b>Inclusão parcial das imagens da nova coleção beachwear.</li>
              <li><b>[CadastroPedidos]: </b>Readequação em tela do campo cliente.</li>
              <li><b>[CadastroTroca]: </b>Limite de 250 caracteres para o campo de Observação.</li>
              <li><b>[CadastroClientes]: </b> Remoção da obrigatoriedade, ao cadastrar, de bancos e endereço de fornecedor. </li>
            </ul>

          </b-card>




        </b-modal>


      </b-container>
    </div>
  </div>
</template>

<script>
//import PageTitle from "../template/PageTitle";
import { mapState } from 'vuex'
//import { baseApiUrl } from '@/global'
// import * as pbi from 'powerbi-client'
//import axios from 'axios'
import bgImg from '../../assets/capa-home.jpg';
import Metas from '../../components/indicadores/Metas'

//import axios from 'axios'
//import { baseApiUrl } from '@/global'


export default {

  computed: {
    ...mapState(["user", "traduction", "lstDataIndicadores"]),
  },
  components: { Metas },

  name: "Home",
  data() {
    return {
      img: require('../../assets/capa-home.jpg'),
      report: null,
      apiTest: [

      ],



    }
  },
  created() {
   
  },
  methods: {
    
    loadDash() {


    },
    checkImg() {
      console.log(bgImg, 'bgimg')


    },



  },
  mounted() {
    this.checkImg();

    this.$refs.modalNewsLiz.show()








  },

}



</script>

<style lang="scss" scoped>
.card {
  .card-body {
    max-width: 100%;
  }
}

.content {
  padding: 0 !important;
}

.home {
  margin: 10px;
}

.home-card {
  width: 100%;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.65) !important;

}

.home-wrapper {
  background-image: url("../../assets/capa-home.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  min-height: calc(99vh - 100px);

}

.home-title {
  margin: 0 !important;
}

.pageTitle-mainArea {
  margin-bottom: 0 !important;
}

.body-card {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1.25rem;
}

.card-header {
  background: rgba(68, 47, 45, 0.7);
  color: #e58b2a;
  text-transform: uppercase;
}

.cardHorizontal {
  display: flex;
  flex-direction: row;
}

.card-title {
  text-align: center;
  justify-content: center;

  i {
    padding: 8px 16px;
    background: black;
    border-radius: 25px;
    color: white;

    &:hover {
      color: black;
    }
  }

}

.textArea-home {
  display: block;
  width: auto;
  min-height: 200px;
  list-style-type: none;
  text-align: center;

  padding: 16px;
}


.pageHome {
  background: transparent;
}

.card-small {
  min-height: 205px;
  max-height: 350px;
  height: auto;
}

.card-big {
  min-height: 420px;
  max-height: 600px;
  height: auto;
}

@media(min-width:1910px) {
  .card-small {
    min-height: 205px;
    height: 300px;

  }

  .card-big {
    min-height: 420px;
    height: 600pxi
  }

}

.metasTitle {
  font: normal normal normal 14px/1 FontAwesome !important;

  :before {
    content: "\f012";

  }


}


.canvasFlexBox {
  background-color: rgba(255, 255, 255, 0.75) !important;
}</style>