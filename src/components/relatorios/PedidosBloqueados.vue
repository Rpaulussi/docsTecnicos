<template>
  <div>
    <div>
      <PageTitle icon="fa fa-ban "
        :main="serverMessages['pedidoBloqueado.header'].replace('.::', '').replace('::.', '')"></PageTitle>
      <div class="button-area">
        <div class="button">
          <downloadPdf :items="lstPedidos" :campos="headerFields">
          </downloadPdf>

          <!-- <XlsxExport :table="lstPedidos" :tableName="'tableCobranca'" :fields="this.fieldsHeader"></XlsxExport> -->
          <b-button class="export-options" variant="outline-secondary" @click="excelDownload();">
            <export-excel :data="lstPedidos" :fields="fieldsHeader" :name="`RelatorioBloqueados.xls`">
              <img :src="require(`@/assets/excelicon.png`)">
            </export-excel>
          </b-button>
        </div>
      </div>
      <hr class="my-4">
    </div>
    <div class="main-area p-0 tableCob-header">
      <div class="header-bloqueados">
        <span> <b>{{ traduction.totalBloq }} : </b> {{`${lstPedidos.length}`}}</span>
        <!-- <b-button  variant="secondary" >Fechar</b-button> -->
      </div>
      <Spinner :state="spinner"></Spinner>
    </div>
    <b-table responsive hover striped class="tablePedidosBloq" id="tableCobranca" :items="lstPedidos" :fields="fields" small="small">
      <template #head(cliente)>
        <span>{{ serverMessages['pedidoBloqueado.cliente'] }}</span>
      </template>
      <template #head(bstnk)>
        <span>{{ serverMessages['pedidoBloqueado.numeroPedido'] }}</span>
      </template>
      <template #head(vbeln)>
        <span>{{ serverMessages['pedidoBloqueado.ordemPedido'] }}</span>
      </template>
      <template #head(textblk)>
        <span>{{ serverMessages['pedidoBloqueado.motivo'] }}</span>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PageTitle from '../template/PageTitle.vue'
import Spinner from '../template/Spinner.vue'
//import  XlsxExport  from "../commons/XlsxExport"
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'
import downloadPdf from "../commons/downloadPdf"
export default {
  name: "PedidosBloqueados",
  data: function () {
    return {
      spinner: false,
      lstPedidos: [],
      json_meta: [],
      fields: [
        { key: 'cdCli', label: 'Código'},
        { key: 'name', label: 'Cliente'},
        { key: 'bstnk', label: 'Numero Pedido'},
        { key: 'vbeln', label: 'Ordem do Pedido'},
        { key: 'textblk', label: 'Motivo'},
      ],
      headerFields: {
        'cdCli': 'Código',
        'name': 'Cliente',
        'bstnk': 'Numero Pedido',
        'vbeln': 'Ordem do Pedido',
        'textblk': 'Motivo',
      },
      fieldsHeader: {
        'Código': 'cdCli',
        'Cliente': 'name',
        'Numero Pedido': 'bstnk',
        'Ordem do Pedido': 'vbeln',
        'Motivo': 'textblk',
      },
    }
  },
  components: { PageTitle, Spinner, downloadPdf    },
  computed: {
    ...mapState(["serverMessages", "language", "user", "traduction", 'excelDownload', 'isMenuVisible'])
  },

  methods: {
    loadOrdersBloq() {
      const url = `${baseApiUrl}/pedido/getpedidosbloqueados`
      this.spinner = true
      axios.post(url, {
        loginUsuario: this.user.loginUsuario,
        language: this.language
      }).then(resp => {
        if (resp.data.result === 'OK') {
          this.lstPedidos = resp.data.pedidosBloq
        } else {
          showError(this.traduction.noresults)
        }
        this.spinner = false
      }).catch(() => {
        showError(this.traduction.internalError)
        this.spinner = false
      })
    },

  },
  async mounted() {
    this.$store.state.isMenuVisible = true
    this.loadOrdersBloq()
  },

}

</script>

<style lang="scss">
.main {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.main-area {
  padding: 0;
}

.header-bloqueados {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #e58b2a;
  border: 1px solid black;

}

.header-bloqueados>span {
  font-weight: bolder;
  width: 100%;
  text-align: center;
  padding: 15px 0px;
  justify-content: center;
  align-items: center;
}

.tablePedidosBloq>table>thead {
  background-color: black;
  color: white;
}

.tablePedidosBloq>table>tbody {
  background-color: white;
}

.tablePedidosBloq {
  border: 1px solid black;
}

.tableCob-header {
  width: 100% !important;
}
</style>
