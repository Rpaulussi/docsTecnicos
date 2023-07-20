<template>
  <div>
    <PageTitle icon="fa fa-list" class="page-title" :main="traduction.fatHeader">
    </PageTitle>
    <Spinner :state="this.spinner" style="z-index: 999;"></Spinner>
    <div class="main">
      <SelecaoConsulta :lstEquipe="lstEquipes" :showEquipe="true" :mesesPeriodo="1" class="filter-area">
      </SelecaoConsulta>
      <SelecaoLista :title="serverMessages['relatorioFaturar.clientes']" :titlesel="
        serverMessages['relatorioFaturar.clientes'] + traduction.selection
      " class="list-area">
      </SelecaoLista>
    </div>
    <hr class="my-4" />
    <div class="button-area btnArea-mix">
      <b-button id="btnConsultar" variant="primary" @click="searchInfo()">
        {{ traduction.search }}
      </b-button>
      <div class="button">
        <downloadPdf :items="
          fatSelected === true ? this.fatDetFilter : this.lstFatSintetico
        " :campos="fatSelected === true ? this.fieldsFatDet : this.fieldsHeader">
        </downloadPdf>
        <b-button class="export-options" variant="outline-secondary">
          <export-excel :title="json_meta" class="btnExcel" :data="
            fatSelected === true ? this.fatDetFilter : this.lstFatSintetico
          " :fields="
  fatSelected === true ? this.fatFieldsDet : this.headerFields
" :name="`relatoroioFat.xls`" :dados="
  fatSelected === true ? this.fatDetFilter : this.lstFatSintetico
" :campos="
  fatSelected === true ? this.fatFieldsDet : this.headerFields
" :footer="json_footer ? json_footer : null">
            <img :src="require(`@/assets/excelicon.png`)" />
          </export-excel>
        </b-button>
      </div>
    </div>
    <hr class="my-4" />
    <div v-show="this.showCollapse === true">
      <b-container fluid class="containerFat">
        <b-row v-if="this.fatSelected !== true" class="header-area2">
          <b-col cols="12">
            <p style="
                border-bottom: 1px solid black;
                padding-bottom: 5px;
                background: black;
                color: white;
              ">
              <b>
                {{
                  serverMessages["relatorioFaturamento.header"]
                                .replace(".::", "")
                      .replace("::.", "")
                }}
              </b>
            </p>
            <p>
              <b>
                {{ serverMessages["troca.relatorio.quantidade.total"] }} :
                {{ totaisQtd !== null ? totaisQtd : "0" }}
              </b>
            </p>
            <p>
              <b>
                {{
  serverMessages["relatorioFaturar.table.valorTotalFaturado"]
                }}
                : {{ totais !== null ? JSON.stringify(totais).replace(".", ",") : "0,00" }}
              </b>
            </p>
          </b-col>
          <b-col cols="12"> </b-col>
          <b-col> </b-col>
        </b-row>

        <b-row v-else class="header-area2" style="padding: 0">
          <b-col cols="12" class="rowBlack" style="padding: 15px 0px">
            <div class="clienteInfo-area">
              <p>
                <b>{{ serverMessages["relatorioFaturamento.cliente"] }} -
                  {{ this.objOrder.name1 }}
                </b>
              </p>

              <button class="btn btn-dark" @click="clearSelected()">
                {{ serverMessages["geral.voltar"] }}
              </button>
            </div>
          </b-col>

          <b-col cols="4" style="padding: 0">
            <ul class="detailsHeader">
              <li>
                <b>{{
                  serverMessages[
                    "relatorioFaturamento.detalhes.doctoFaturamento"
                  ]
                }}
                  :
                </b>
                {{ this.objOrder.vbeln }}
              </li>
              <li>
                <b>{{
                  serverMessages["relatorioFaturamento.detalhes.notaFiscal"]
                }}
                  :
                </b>
                {{ this.objOrder.xblnr }}
              </li>
              <li>
                <b>{{ serverMessages["relatorioFaturamento.detalhes.tipo"] }} :
                </b>
                {{ this.objOrder.vtext }}
              </li>
            </ul>
          </b-col>
          <b-col cols="4" style="padding: 0">
            <ul class="detailsHeader">
              <li>
                <b>{{
                  serverMessages["relatorioFaturamento.condicaoPagamento"]
                }}
                  :
                </b>
                {{ this.objOrder.ztermDesc }}
              </li>
              <li>
                <b>{{
                  serverMessages[
                    "relatorioFaturamento.detalhes.descontoComercial"
                  ]
                }}
                  :
                </b>
                {{ this.objOrder.descontoComerc }}
              </li>
              <li>
                <b>{{
                  serverMessages[
                    "relatorioFaturamento.detalhes.descontoExtra"
                  ]
                }}
                  :
                </b>
                {{ this.objOrder.descontoExtra * -1 }}
              </li>
              <li>
                <b>{{ serverMessages["relatorioFaturamento.rel.qtFat"] }} : </b>
                {{ this.totaisItnQtd }}
              </li>
            </ul>
          </b-col>
          <b-col cols="4" style="padding: 0">
            <ul class="detailsHeader">
              <li>
                <b>{{ serverMessages["relatorioFaturamento.totalQtGeral"] }} :
                </b>
                {{ this.totaisItn.toFixed(2) }}
              </li>
              <li>
                <b>{{
                  serverMessages["relatorioFaturamento.detalhes.ordemVenda"]
                }}
                </b>
                {{ this.objOrder.aubel }}
              </li>
              <li>
                <b>{{
                  serverMessages["relatorioFaturamento.rel.dataFaturamento"]
                }}
                  :
                </b>
                {{ this.objOrder.erdat.split("-").reverse().join("-") }}
              </li>
            </ul>
          </b-col>
        </b-row>
        <b-table class="tableFaturamento" v-if="this.fatSelected !== true" responsive small hover striped
          :items="lstFatSintetico" :fields="fields" :foot-clone="true" foot-variant="dark">
          <template #cell(vbeln)="data">
            <a href="#" @click="showDetail(data.value)">{{ data.value }} </a>
          </template>
          <template #cell(netwr)="data">
            <span> R${{ JSON.stringify(data.value).replace(".", ",") }} </span>
          </template>
          <template #cell(kunnr)="data">
            <span>{{ data.value }}</span>
          </template>
          <template #cell(erdat)="data">
            <span>{{ data.value.split("-").reverse().join("-") }}</span>
          </template>
          <template #cell(descontoComerc)="data">
            {{ data.value * -1 }} %
          </template>
          <template #cell(descontoExtra)="data">
            {{ data.value * -1 }} %
          </template>
          <template #foot(name1)>
            <span>Totais: </span>
          </template>
          <!-- <template #foot(descontoComerc)>
            <span></span>
          </template> -->
          <template #foot(descontoExtra)>
            <span></span>
          </template>
          <template #foot(descfi)>
            <span></span>
          </template>
          <template #foot(fkimg)>
            <span style="color: whitesmoke; text-decoration: underline">
              {{ totaisQtd !== null ? totaisQtd.toFixed(2) : "0" }}
            </span>
          </template>
          <template #foot(netwr)>
            <span style="color: whitesmoke; text-decoration: underline">
              {{ totais !== null ? totais : "0" }}
            </span>
          </template>
          <template #foot(aubel)>
            <span></span>
          </template>
          <template #foot(erdat)>
            <span></span>
          </template>
          <template #foot(descontoComerc)>
            <span> </span>
          </template>
          <template #foot(vbeln)>
            <span></span>
          </template>
          <template #foot(vkgrp)>
            <span></span>
          </template>
          <template #foot(vkgrpDesc)>
            <span></span>
          </template>
          <template #foot(vtext)>
            <span></span>
          </template>
          <template #foot(xblnr)>
            <span></span>
          </template>
          <template #foot(zterm)>
            <span></span>
          </template>
          <template #foot(ztermDesc)>
            <span></span>
          </template>
        </b-table>
        <template v-else>
          <div class="mainSearch-head">
            <b-table class="mainSearch" :items="this.fatDetFilter" responsive hover striped small="small"
              :fields="fatDetFields">
            </b-table>
          </div>
        </template>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//import { closeMenu } from '../../mixins/closeMenu'
import SelecaoConsulta from "../consultas/SelecaoConsulta.vue";
import SelecaoLista from "../consultas/SelecaoLista.vue";
import PageTitle from "../template/PageTitle.vue";
import Spinner from "../template/Spinner.vue";
import numeral from 'numeral'
import axios from "axios";
import { filter } from "underscore";
import { baseApiUrl, showError } from "@/global";
//import downloadExcel from '../commons/downloadExcel.vue'
import downloadPdf from "../commons/downloadPdf.vue";

export default {
  name: "RelatorioFaturados",
  components: {
    SelecaoConsulta,
    PageTitle,
    Spinner,
    SelecaoLista,
    downloadPdf,
  },
  data: function () {
    return {
      //mixins: [closeMenu],
      clienteSelected: [],
      repSelected: [],
      showCollapse: false,
      json_fields: {},
      json_data: [],
      json_meta: [],
      json_metaAlt: [],
      lstEquipes: [],
      lstClientes: [],
      lstFatSintetico: [],
      fatSelected: false,
      lstFatDet: [],
      spinner: false,
      objOrder: [],
      footerTable: null,
      totais: 0,
      totaisQtd: 0,
      totaisItn: 0,
      totaisItnQtd: 0,
      fatDetFilter: [],
      json_footer: [],
      fields: [
        { key: "name1", label: "Cliente" },
        { key: "kunnr", label: "Cod. Cliente" },
        { key: 'erdat', label: 'Data' },
        { key: "vbeln", label: "Doc.Fat" },
        { key: "xblnr", label: "Nota Fiscal" },
        { key: "netwr", label: "Valor" },
        { key: "fkimg", label: "Qtd Pecas" },
        { key: "vtext", label: "Tipo Doc." },
        { key: "aubel", label: "Num. Ordem" },
        { key: "ztermDesc", label: "Cond.Pagto." },
        { key: "descontoComerc", label: "Desc.Com" },
        { key: "descontoExtra", label: "Desc.Extra" },
        { key: "descfi", label: "Desc.Fin" },
      ],
      fatDetFields: [
        { key: "posnr", label: "Item", sortable: true },
        { key: "matnr", label: "Cod. Material", sortable: true },
        { key: "maktx", label: "Denominacao", sortable: true },
        { key: "fkimg", label: "Quantidade", sortable: true },
        { key: "netwr", label: "Valor Total", sortable: true },
      ],
      fatDetHeader: [
        { key: "vbeln", label: "Doc. Fat.", sortable: true },
        { key: "xblnr", label: "Nota. Fis.", sortable: true },
        { key: "aubel", label: "Ordem Venda", sortable: true },
        { key: "vtext", label: "Tipo", sortable: true },
        { key: "netwr", label: "Valor Fat.", sortable: true },
        { key: "fkimg", label: "Qtd.", sortable: true },
        { key: "erdat", label: "Data", sortable: true },
        { key: "ztermDesc  ", label: "Cond. de Pagto", sortable: true },
        { key: "descontoComerc", label: "Desc.Com", sortable: true },
        { key: "descontoExtra", label: "Desc.Extra", sortable: true },
      ],
      headerFields: {
        Cliente: "name1",
        "Doc.Fat": "vbeln",
        "Nota Fiscal": "xblnr",
        Valor: "netwr",
        "Qtd Pecas": "fkimg",
        "Tipo Doc.": "vtext",
        "Num. Ordem": "aubel",
        "Cond.Pagto.": "ztermDesc",
        "Desc.Com": "descontoComerc",
        "Desc.Extra": "descontoExtra",
        "Desc.Fin": "descfi",
      },
      fieldsHeader: {
        name1: "Cliente",
        vbeln: "Doc.Fat",
        xblnr: "Nota Fiscal",
        netwr: "Valor",
        fkimg: "Qtd Pecas",
        vtext: "Tipo Doc.",
        aubel: "Num. Ordem",
        ztermDesc: "Cond.Pagto.",
        descontoComerc: "Desc.Com",
        descontoExtra: "Desc.Extra",
        descfi: "Desc.Fin",
      },
      fieldsFatDet: {
        posnr: "Item",
        matnr: "Cod. Material",
        maktx: "Denominacao",
        fkimg: "Quantidade",
        netwr: "Valor Total",
      },
      fatFieldsDet: {
        Item: "posnr",
        "Cod. Material": "matnr",
        Denominacao: "maktx",
        Quantidade: "fkimg",
        "Valor Total": "netwr",
      },
    };
  },
  computed: {
    ...mapState([
      "serverMessages",
      "language",
      "user",
      "traduction",
      "listClientesSel",
      "salesTeam",
      "dateDe",
      "dateAte",
      "isMenuVisible",
    ]),
  },
  methods: {
    async loadSalesTeam() {
      const url = `${baseApiUrl}/cliente/repmarca`;
      await axios
        .post(url, {
          language: this.language,
          loginUsuario: this.user.loginUsuario,
        })
        .then((resp) => {
          this.lstEquipes = resp.data.representantes.map((ele) => {
            return {
              id: ele.agenciaVendas,
              agenciaDesc: ele.agenciaDesc,
              name: `${ele.agenciaVendas} - ${ele.agenciaDesc}`,
            };
          });
        })
        .catch(() => {
          showError(this.traduction.internalError);
        });
    },
    searchInfo() {
      this.spinner = true
      if (!this.salesTeam) {
        showError("Por favor selecione uma equipe de vendas");
        this.showCollapse = false;
        this.spinner = false
        return;
      }
      let clientsCode = [];
      if (
        this.listClientesSel.length === 0 ||
        this.listClientesSel === undefined ||
        this.listClientesSel === null
      ) {
        clientsCode = [];
      } else {
        clientsCode = this.listClientesSel.map((el) => {
          return el.value.substr(0, 10);
        });
      }
      let request = {};
      request.PUsuario = this.user.loginUsuario;
      request.periodoDe = this.dateDe;
      request.periodoAte = this.dateAte;
      request.equipeVendaId = this.salesTeam.id;
      request.language = "P";
      request.TInpCliente = clientsCode.map((el) => {
        return {
          High: "",
          Low: el,
          Sign: "I",
          Opti: "EQ",
        };
      });
      this.spinner = false;
      this.loadBilled(request);
    },
    loadBilled(request) {
      this.spinner = true;
      let url = `${baseApiUrl}/cliente/getfat`;
      axios
        .post(url, request)
        .then((resp) => {
          this.spinner = true
          if (resp.data.result === "ERROR") {
            this.spinner = false
            showError("Dados não encontrados para o período");
            return;
          }
          this.totaisQtd = 0
          this.totais = 0
          this.lstFatDet = resp.data.relatorioFaturamento.tOutFatDet;
          this.lstFatSintetico = resp.data.relatorioFaturamento.tOutFatSint;
          if (this.lstFatSintetico.length == 0) {
            showError(this.serverMessages['global.error.020']); // colocar na traduÃƒÂ§ÃƒÂ£o
            this.spinner = false;
          } else {
            this.showCollapse = true;
            this.footerTable = this.lstFatSintetico.filter((el) => {
              this.totais = el.netwr + this.totais;
              this.totaisQtd = el.fkimg + this.totaisQtd;
              return el.fkimg;
            });
            this.spinner = false
          }
          //Formatando para buscar dados de ordem de vendas no Mongo DB
          //let ovs2search = map(this.lstFatSintetic, (ov) => { return ov.Aubel; });
          //let mongoJson =  { ids: ovs2search , prj: [ "_id","dc", "df", "de"] };
          //console.log(this.lstFatSintetico , this.lstFatDet)
          this.totais = numeral(this.totais).format('$0,0.00')
        })
        .catch((err) => {
          showError(err);
        });
    },
    showDetail(doc) {
      //console.log("chamadafn", doc);
      this.fatSelected = !this.fatSelected;
      this.totaisItn = 0
      this.totaisItnQtd = 0
      this.fatDetFilter = filter(this.lstFatDet, (f) => f.vbeln === doc);
      this.fatDetFilter.forEach(el => {
        this.totaisItn += (el.netwr)
        this.totaisItnQtd += el.fkimg
      })
      // fatDetTotais = filter(this.lstFatDet, el =>{
      //console.log('totaisClick', this.totaisItn, this.totaisItnQtd)
      // })
      this.objOrder = this.lstFatDet.find((s) => {
        return s.vbeln === doc;
      });
    },
    clearSelected() {
      this.fatSelected = !this.fatSelected;
    },
    excelDownload() {
      this.json_meta = [],
        this.json_footer = []
      //console.log('excelDownload')
      this.json_meta.push(`Consulta de Faturamento`)
      this.json_meta.push(`Cliente: <b>${this.objOrder ? this.objOrder.name1 : ''}</b>`)
      this.json_meta.push(`<div style="width:100%; text-align:start; background-color:blue;">${this.serverMessages['relatorioFaturamento.detalhes.doctoFaturamento']} : ${this.objOrder.vbeln}  `)
      this.json_meta.push(`${this.serverMessages["relatorioFaturamento.detalhes.notaFiscal"]} : ${this.objOrder.xblnr ? this.objOrder.xblnr : ''}`)
      this.json_meta.push(`${this.serverMessages["relatorioFaturamento.detalhes.tipo"]} : ${this.objOrder.vtext ? this.objOrder.vtext : ''}`)
      this.json_meta.push(`${this.serverMessages["relatorioFaturamento.condicaoPagamento"]} : ${this.objOrder.ztermDesc}  `)
      this.json_meta.push(` ${this.serverMessages["relatorioFaturamento.detalhes.descontoExtra"]} : ${this.objOrder.descontoExtra ? this.objOrder.descontoExtra * -1 : ''} `)
      this.json_meta.push(`<b>${this.serverMessages["relatorioFaturamento.rel.qtFat"]} : ${this.totaisItnQtd ? this.totaisItnQtd : '0'} </b>`)
      this.json_meta.push(`${this.serverMessages["relatorioFaturamento.detalhes.descontoComercial"]} : ${this.objOrder.descontoComerc ? this.objOrder.descontoComerc : ''}`)
      this.json_meta.push(`${this.serverMessages["relatorioFaturamento.rel.dataFaturamento"]} : ${this.objOrder.erdat ? this.objOrder.erdat : ''}`)
      this.json_footer.push(`${this.serverMessages["relatorioFaturamento.detalhes.ordemVenda"]} : ${this.objOrder.aubel ? this.objOrder.aubel : ''} `)
      this.json_footer.push(` <b>${this.serverMessages["relatorioFaturamento.totalQtGeral"]} : ${this.totaisItn.toFixed(2)} </b> `)
      //console.log('jsons', this.json_meta)
    },
    excelDownload2() {
      //console.log('excelDownload2')
      this.json_meta = []
      this.json_footer = []
      this.json_meta.push(`${this.serverMessages['relatorioFaturar.periodoDe']} - ${this.dateDe.split("/").reverse().join("/")} - ${this.dateAte.split("/").reverse().join("/")}`)
      this.json_meta.push(`Consulta de Faturamento`)
      this.json_meta.push(`${this.serverMessages['relatorioFaturar.equipeVendas']} : ${this.salesTeam.name}`)
      this.json_footer.push(`<b>${this.serverMessages["troca.relatorio.quantidade.total"]} : ${this.totaisQtd !== null ? this.totaisQtd : "0"}</b>`)
      this.json_footer.push(`<b>${this.serverMessages["relatorioFaturar.table.valorTotalFaturado"]} : ${this.totais !== null ? this.totais : "0"}</b>`)

    }
  },
  async mounted() {
    await this.loadSalesTeam();
    this.$store.state.salesTeam = [];
    // this.showCollapse = false;
  },
  watch: {
    objOrder: function () {
      this.excelDownload()
    },

    lstFatSintetico: function () {
      this.excelDownload2()
    }
  },
  beforeMount() {
    this.$store.commit('setShowOrNo', false)
  },
  beforeUpdate() { },
  beforeDestroy() {
    this.$store.state.listClientesSel = [];
    this.listClientes = [];
  },
};
</script>
<style lang="scss">
.containerFat {
  border: 1px solid black;
  background-color: white;
  padding: 0px 0px !important;
  overflow: hidden;
}

.main {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.list-area {
  margin-top: 0px;
}

@media (max-width: 767px) {
  .list-area {
    display: flex;
    flex-direction: column;
  }

  .detailsHeader {
    padding: 0px 10px !important;

    li {
      word-wrap: wrap !important;
      padding: 15px !important;
    }
  }
}

.filter-area {
  margin-top: 5px;
}

.button-area {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.header-area {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  text-align: center;
  margin-left: 0px;
  margin-right: 0px;
}

.card {
  border-radius: 25px !important;
  border: 0px;
  text-align: start;
}

.card-body {
  border-radius: 25px;
  box-shadow: 1px 1px 1px 1px #e58b2a;
}

.jqx-listitem-state-hover,
.jqx-listitem-state-pressed,
.jqx-listitem-state-selected {
  background-color: #e58b2a;
}

.detailsHeader {
  flex-direction: row;
  flex-wrap: wrap;
  list-style-type: none;
  justify-content: space-between;
  text-align: space-between;
}

.detailsHeader>li {
  padding: 15px 50px;
  font-size: 14.5px;
}

.rowBlack {
  background-color: black;
  color: white;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 15px;
  border: 1px solid black;
}

.clienteInfo-area {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-evenly;
}

.mainSearch>table>thead {
  background-color: black;
  color: white;
}

.tableFaturamento>table>thead {
  background-color: black !important;
  color: white;
}

.hide {
  display: none;
}

.rowHeader {
  text-align: center;
  margin: 0px 0px 0px 0px;
  border: 1px solid black;
  padding: 10px 0px;
  background-color: rgba(224, 187, 185, 0.3);
}

.btnArea {
  justify-content: space-around;
}

.header-area2 {
  // background: linear-gradient(to left, #eb7a09, #dda152);
  background: #897167;
  text-align: center;
  border: 1px solid black;
}
</style>
