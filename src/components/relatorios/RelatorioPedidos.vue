<template>
  <div>
    <Page-Title icon="fa  fa-balance-scale" :main="serverMessages['relatorioPedido']">
    </Page-Title>
    <Spinner :state="spinner"> </Spinner>
    <div class="main">
      <b-container fluid class="principal">
        <b-row>
          <b-col class="relatPedForm m-0 p-0" style="display: inline-flex; padding:0;" sm="12" xl="5">
            <b-form-group class="card-body cardSmall">
              <ul class="search-area" style="padding: 0; list-style-type: none">
                <li>
                  <b-form-datepicker id="dateDe" :dropup="false" :value="this.dateDe" v-model="dateDe" size="sm"
                    :date-format-options="{
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    }" />
                </li>
                <li>
                  <b-form-datepicker id="dateAte" :dropup="false" v-model="dateAte" :value="this.dateAte"
                    :v-model="dateAte" size="sm" :date-format-options="{
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    }" />
                </li>
                <li>
                  <b-button size="sm" class="btn" @click="loadSalesTeam2()" variant="primary">{{
                    this.traduction.search
                  }}</b-button>
                </li>
              </ul>
              <ul v-show="validationOne === true" class="search-area2" style="padding: 0; list-style-type: none">
                <li><label for="pField">{{ serverMessages['consultaRelatorioCliente.equipeVendas'] }}</label></li>
                <li>
                  <b-form-select ref="selectCriadores" v-model="selected" class="pField lista-reps"
                    @click="updateClients(selected)" v-on:change="onSelect(selected)" :options="this.lstCriadores">
                    <template v-slot:first>
                      <b-form-select-option :value="null">All {{
                        serverMessages['consultaRelatorioCliente.equipeVendas']
                      }}</b-form-select-option>
                    </template>
                  </b-form-select>
                </li>
                <li><label for="pField">{{ traduction.lookingFor }} {{ traduction['numPed'] }} </label></li>
                <li>
                  <b-form-input v-model="selectedPedidos" class="pField pedidosNum">
                  </b-form-input>
                  <b-button @click="searchNumPed(selectedPedidos)" class="btn  btnconsul" variant="outline-primary"
                    id="btn-numped">{{ traduction.search }}</b-button>
                </li>
                <li><label for="pField">{{ traduction.lookingFor }} - {{ traduction.numOv }}</label></li>
                <li>
                  <b-form-input v-model="selectedOV" class="pField pedidosOv">
                  </b-form-input>
                  <b-button @click="openOv(selectedOV)" class="btn" variant="outline-primary">{{
                    traduction.search
                  }}</b-button>
                </li>
              </ul>
            </b-form-group>
          </b-col>
          <b-col v-if="showFilter != false" class="p-0" sm="12" lg="6" xl="7">
            <div>
              <SelecaoLista :title="'Clientes'" :titlesel="'Selecionados'" :disabled="false"
                @click="updateClients(selected)" :source="
                  this.lstRepFilter.length > 0
                    ? this.lstRepFilter
                    : this.fatDetFilter
                " class="list-area">
                <ul>
                  <li v-for="(item, index) in this.fatDetFilter" :key="item[index]">
                    {{ item[1] }}
                  </li>
                </ul>
              </SelecaoLista>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <hr class="my-4" />
    <b-container>
      <b-row>
        <div class="button-area" v-if="showFilters === true && validationOne === true">
          <b-button class="btn btnTest" variant="primary" @click="searchOv()">{{ traduction.search }}</b-button>
          <b-button v-if="validationTwo === true" @click="clearVars()" variant="danger" class="btn">
            {{ traduction['goBack'] }}
          </b-button>
          <div class="download-area d-flex">
            <downloadPdf class="dlPdf" :items="
              this.lstFatDet.length > 0 ? this.lstFatDet : this.lstLoadedTable
            " :campos="this.lstFatDet.length > 0 ? this.fieldsPdf : this.pdfFields">
            </downloadPdf>
            <b-button class="export-options" variant="outline-secondary" style="margin-top: 12px">
              <export-excel class="btnExcel" :title="json_meta" :data="
                this.lstFatDet.length > 0 ? this.lstFatDet : this.lstLoadedTable
              " :fields="this.lstFatDet.length > 0 ? this.downloadFields : null" :name="`RelatPedido.xls`">
                <img :src="require(`@/assets/excelicon.png`)" />
              </export-excel>
            </b-button>
          </div>
        </div>
      </b-row>
    </b-container>
    <hr class="my-4" />
    <b-container fluid>
      <b-row>
        <b-col v-if="showTable != false">
          <b-table head-variant="dark" v-if="showFilter === true" striped simple responsive :items="this.lstLoadedTable"
            :fields="this.filteredItens" class="table-relatped" foot-clone>
            <template #cell(id)="data">
              <a href="#" @click="openOv(data.value)">{{ data.value }}</a>
            </template>
            <template #cell(DtEmissao)="data">
              {{ data.value.split("-").reverse().join("-") }}
            </template>
            <template #cell(valorDisplayItem)="data">
              {{ data.value }}
            </template>
            <template #foot(id)>
              <span></span>
            </template>
            <template #foot(Cliente)>
              <span></span>
            </template>
            <template #foot(ClienteDesc)>
              <span></span>
            </template>
            <template #foot(Criador)>
              <span></span>
            </template>
            <template #foot(Pedido)>
              <span></span>
            </template>
            <template #foot(DtEmissao)>
              <span>Total Geral:</span>
            </template>
            <template #foot(valorDisplayItem)>
              <span>{{ valorDisplay }}</span>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row v-if="validationTwo === true && this.lstFatSintetico.length > 0" class="detailsHeader">
        <b-col cols="12" style="background-color: black; color: white; padding: 5px"><b>{{
        serverMessages['relatorioFaturar.clientes'] }} : <span>{{
    lstFatSintetico[0]?
  this.lstFatSintetico[0].Emissor : ''}} - {{
  lstFatSintetico[0]? this.lstFatSintetico[0].EmissorDesc : ''
              }} </span></b>
        </b-col>
        <b-col cols="12" style="background-color: white; color: black; padding: 5px;"><b>{{ traduction.receiver }}:
            <span>{{ this.lstFatSintetico[0].Receptor }} - {{ this.lstFatSintetico[0].ReceptorDesc }} </span></b>
        </b-col>
        <b-col cols="4" v-if="(validationTwo = true && this.lstFatSintetico.length > 0)">
          <ul class="detailsHeader" v-if="(validationTwo = true)">
            <li>
              <span> {{ traduction.numOv }}:</span> <b>{{ this.selectedGR }}</b>
            </li>
            <li>
              <span> {{ serverMessages['relatorioFaturamento.numeroOrdem'] }}: </span>
              <b>{{ this.lstFatSintetico[0].Bstnk }} </b>
            </li>
            <li>
              <span> {{ serverMessages['pedido.cadastro.dataEmissao'] }} </span>
              <b>{{ this.lstFatSintetico[0].Erdat.split("-").reverse().join("-") }} </b>
            </li>
          </ul>
        </b-col>
        <b-col cols="4" v-if="validationTwo === true">
          <ul class="detailsHeader" v-if="(validationTwo = true)">
            <li>
              <span> {{ serverMessages['relatorioFaturar.table.dataDesRemessa'] }}</span>: <b>{{
                this.lstFatSintetico[0]
                  ? this.lstFatSintetico[0].DtRemessa.split("-").reverse().join("-") : ''
              }}</b>
            </li>
            <li>
              <span>{{ serverMessages['relatorioComissao.relatorio.vlrDesc'] }} </span>: <b>{{
                'R$' +
                  this.lstFatSintetico[0] ? this.lstFatSintetico[0].Netwr : ''
              }} </b>
            </li>
            <li>
              <span> {{ serverMessages['relatorioFaturar.table.qtdOrdem'] }}</span>:
              <b> {{ this.lstTotais }} </b>
            </li>
          </ul>
        </b-col>
        <b-col cols="4" v-if="validationTwo === true">
          <ul class="detailsHeader" v-if="(validationTwo = true)">
            <li>
              <span>{{ serverMessages['relatorioFaturar.docFat.rel.condicaoPagamento'] }}</span> : <b> {{
              `${this.lstFatSintetico[0].Zterm} - ${this.lstFatSintetico[0].ZtermDesc}`
              }}</b>
            </li>
            <li>
              <span>{{ serverMessages['pedido.email.descontoExtra'] }} </span>
              <b>{{ this.lstFatSintetico[0].DescFin * -1 }} </b>
            </li>
            <li>
              <span>{{ serverMessages['pedido.email.descontoComercial'] }} </span>
              <b>{{ this.lstFatSintetico[0].DescCom * -1 }} </b>
            </li>
          </ul>
        </b-col>
        <b-col cols="12">
          <b-table striped hover responsive simple class="coTable" :items="
            this.lstFatDet.length !== 0 ? this.lstFatDet : this.lstLoadedTable
          " :fields="fieldsDownload">
            <template #cell(totalItem)="data">
              <p>{{ data.value.toFixed(2) }}</p>
            </template>
            <template #cell(netpr)="data">
              <p>{{ data.value.toFixed(2) }}</p>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
//import vSelect from "vue-select";
import PageTitle from "../template/PageTitle";
import "vue-select/dist/vue-select.css";
import { mapState } from "vuex";
import { format, addMonths } from "date-fns";
//import SelecaoConsulta from "../consultas/SelecaoConsulta.vue";
import SelecaoLista from "../consultas/SelecaoLista.vue";
import { baseApiUrl, showError } from "@/global";
import Spinner from "../template/Spinner.vue";
//import Dropdown from "vue-simple-search-dropdown";
import { map, uniq, filter, each, extend, reduce, sortBy } from "underscore";
import downloadPdf from "../commons/downloadPdf.vue";
import numeral from 'numeral'
export default {
  name: "relatorioPedidos",
  components: {
    PageTitle,
    downloadPdf,
    SelecaoLista,
    Spinner
  },
  computed: {
    ...mapState([
      "user",
      "traduction",
      "salesTeam",
      "serverMessages",
      "traduction",
      "Spinner",
      "isMenuVisible",
      "listClientesSel"

    ]),
    searchOv2: function () {
      return this.$store.state.listboxsel;
    },
  },
  mounted() {
    this.$store.state.isMenuVisible = true
  },
  props: {},
  data: function () {
    return {
      spinner: false,
      selectedGN: null,
      selectedGR: null,
      selectedREP: null,
      arrayGR: [],
      valorDisplay: 0,
      json_meta: [],
      json_metaAlt: [],
      clienteId: null,
      lstFatSintetico: {},
      lstFatDet: [],
      lstEquipes: [],
      selection: [],
      lstDocfat: {},
      lstTotais: {},
      lstLoadedTable: [],
      lstClientes: [],
      fatDetFilter: {},
      showFaturado: [],
      clientsCode: [],
      dateDe: [],
      lstRepFilter: [],
      selectedOV: "",
      selectedPedidos: "",
      dateAte: [],
      showTable: false,
      showFilter: false,
      showFilters: false,
      selected: null,
      lstCriadores: [],
      validationOne: false,
      validationTwo: false,
      clientesFiltrados: {},
      clientesMapeados: {},
      findOv: [],
      headerFields: [
        { posnr: "Item" },
        { Matnr: "Material" },
        { fkimg: "Qtd" },
        { arktx: "Descricao" },
        { netwr: "Preço Lista" },
        { vlrTot: "Desconto %" },
        { netwrItm: "Valor Item(R$)" },
        { mwsbTot: "Vlr c/ Desc." },
      ],
      filteredItens: [
        { key: "Id", label: "Num. OV", sortable: true },
        { key: "Cliente", label: "Cód. Cliente", sortable: true },
        { key: "ClienteDesc", label: "Nome Cliente", sortable: true },
        { key: "Pedido", label: "Número", sortable: true },
        { key: "Criador", label: "Criador", sortable: true },
        { key: "DtEmissao", label: "Data de Emissão", sortable: true },
        { key: "valorDisplayItem", label: "Valor", sortable: true },
      ],

      fieldsDownload: [
        { Posnr: "Item" },
        { Marca: "Marca" },
        { Referencia: "Ref." },
        { Cor: "Cor" },
        { Tamanho: "Tam." },
        { Copa: "Copa" },
        { Maktx: "Descrição" },
        { Zmeng: "Quantidade" },
        { precoLista: "Preço Lista" },
        { descontoUn: "Desconto%" },
        { Netpr: "Valor Item(R$)" },
        { totalItem: "Valor Total c/ Desc.(R$)" },
      ],
      downloadFields: {
        "Item": "Posnr",
        "SKU": "Matnr",
        "Marca": "Marca",
        "Ref.": "Referencia",
        "Cor": "Cor",
        "Tam.": "Tamanho",
        "Copa": "Copa",
        "Descrição": "Maktx",
        "Quantidade": "Zmeng",
        "Preço Lista": "precoLista",
        "Desconto%": "descontoUn",
        "Valor Item(R$)": "Netpr",
        "Valor Total c/ Desc(R$).": "totalItem",
      },
      fieldsPdf: {
        "Posnr": "Item",
        "Marca": "Marca",
        "Referencia": "Ref.",
        "Cor": "Cor",
        "Tamanho": "Tam.",
        "Copa": "Copa",
        "Maktx": "Descrição",
        "Zmeng": "Quantidade",
        "precoLista": "Preço Lista",
        "descontoUn": "Desconto%",
        "Netpr": "Valor Item(R$)",
        "totalItem": "Valor Total c/ Desc.(R$)",
      },
      pdfFields: {
        "Id": "Num. OV",
        "Cliente": "Cód. Cliente",
        "ClienteDesc": "Nome Cliente",
        "Pedido": "Número",
        "Criador": "Criador",
        "DtEmissao": "Data de Emissão",
        "Valor": "Valor"
      }

    };
  },
  methods: {
    async loadSalesTeam2() {
      //console.log(this.dateDe, this.dateAte, )
      if (this.dateDe > this.dateAte) {
        showError(this.traduction['dateError'])
      }
      else if (this.dateDe <= this.dateAte) {
        this.spinner = true
        this.showFilters = true;
        const url = `${baseApiUrl}/cliente/repmarca`;
        this.lstLoadedTable = []
        this.showFaturado = []
        this.lstClientes = []
        await axios
          .post(url, {
            language: this.user.language,
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
            this.spinner = false;
          })
          .catch(() => {
            showError(this.traduction.internalError);
            this.$store.state.spinner = false
          });
        this.lstCriadores = Array.from(find(this.lstEquipes, (el) => {
          return el.name;
      }));
        this.$store.state.spinner = false
        this.validationOne = true;
        this.showFilter = true;
        this.loadReps();
      }
    },
    async loadReps2() {
      this.$store.state.spinner = true;
      const url = `${baseApiUrl}/pedido/ConsultarPedido`;
      this.lstLoadedTable = []
      await axios
        .post(url, {
          pDe: this.dateDe,
          pAte: this.dateAte,
          pUserLogin: this.user.loginUsuario,
        })
        .then((resp) => {
          this.showFaturado = map(resp.data.PedidoClientes, (ele) => {
            return ele
          });
        })
        .catch(() => {
          showError(this.traduction.internalError);
        });
      this.$store.state.spinner = false;
    },
    async loadReps() {
      const url = `${baseApiUrl}/pedido/ConsultarPedido`;
      this.lstLoadedTable = []
      await axios
        .post(url, {
          pDe: this.dateDe,
          pAte: this.dateAte,
          pUserLogin: this.user.loginUsuario,
        })
        .then((response) => {
          map(response.data.PedidoClientes, (ele) => {
            this.showFaturado.push(ele);
          });
          this.showFaturado = this.showFaturado.map(el => {
            return {
              ...el,
              valorDisplayItem: numeral(el.Valor).format('$0,0.00')
            }
          })
        })
        .catch(() => {
          showError(this.traduction.internalError);
        });
      this.showFaturado = map(this.showFaturado, el => { return el })
      this.lstClientes = this.showFaturado.map((ele) => {
        return `${ele.Cliente} - ${ele.ClienteDesc}`;
      });
      this.fatDetFilter = uniq(this.lstClientes);
      this.lstCriadores = this.showFaturado.map((ele) => {
        return ele.Criador;
      });
      this.lstCriadores = uniq(this.lstCriadores);
      this.$store.commit("setCustomers", this.fatDetFilter);
    },
    onSelect() {
      this.showFilter = true
      this.showFilters = true;
      this.$store.commit("setCustomers", null);
      this.showFaturado.map((el) => {
        if (el.Criador === this.selected) {
          this.lstRepFilter.push(`${el.Cliente} - ${el.ClienteDesc}`);
        }
      });
      this.lstRepFilter = uniq(this.lstRepFilter);
      this.$store.commit("setCustomers", this.lstRepFilter);
      this.$store.state.spinner = false;
    },
    onSelect2() {
      let items = this.fatDetFilter;
      this.$refs.listboxsel.removeItem(items[0].value);
      this.quant -= 1;
    },
    searchOv() {
      if (this.showFaturado.length === 0) {
        console.log('error passed');
        showError('Erro: não foram encontrados clientes no período informado.')
        this.validationTwo = false;
      }
      this.lstLoadedTable = []
      let clientesLista = {};
      clientesLista = uniq(
        this.$store.state.listClientesSel.map((el) => {
          return el.value.substr(0, 10);
        })
      );
      //this.lstLoadedTable.concat(each(filter(this.showFaturado, (el, acc))))
      if (this.listClientesSel.length > 0) {
        clientesLista.forEach((element) => {
          this.lstLoadedTable = this.lstLoadedTable.concat(
            filter(this.showFaturado, (el) => {
              return el["Cliente"] === element;
            })
          );
        });
      } else {
        this.lstLoadedTable = this.showFaturado
      }
      this.showTable = true;
      this.lstLoadedTable = sortBy(this.lstLoadedTable, 'ClienteDesc')
      this.valorDisplay = numeral(this.lstLoadedTable.reduce((vlrant, current) => { return vlrant + current.Valor }, 0)).format('$0,0.00')
      //this.clientesSelected['name'] = map(this.$store.state.listClientesSel, el => {return el.value.substr(13, 30)});
    },
    openOv(doc) {
      this.lstLoadedTable = []
      if (doc.length < 10) {
        // console.log('entrou if')
        doc = doc.replace(/^[0]{1,4}/gm, "")
        if (doc.length === 9)
          doc = '0' + doc
        else if (doc.length === 8)
          doc = '00' + doc
        else if (doc.length === 7)
          doc = '000' + doc
        else if (doc.length === 6)
          doc = '0000' + doc
        else if (doc.length === 5)
          doc = '00000' + doc
        else if (doc.length === 4)
          doc = '000000' + doc
      }
      // console.log(doc)
      this.showFilters = true
      this.selectedGR = doc;
      const url = `${baseApiUrl}/pedido/getpedidobyov`;
      axios
        .post(url, {
          language: this.user.language,
          ov: doc,
        })
        .then((resp) => {
          this.spinner = true;
          this.lstFatDet = resp.data.PedidoOV.Zweblf1056Response["TItens"];
          each(this.lstFatDet, function (it) { extend(it, { totalItem: it.Zmeng * it.Netpr }) })
          this.lstTotais = reduce(map(this.lstFatDet, el => el.Zmeng), function (memo, num) { return memo + num })
          this.lstFatSintetico = resp.data.PedidoOV.Zweblf1056Response["TCabecalho"];
          this.spinner = false
        })
        .catch((err) => {
          showError(err);
          this.spinner = false
        });
      this.spinner = false;
      this.showTable = false;
      this.validationTwo = true;
    },
    addTitleTable2() {
      this.json_meta = [];
      //console.log(this.lstFatSintetico)
      this.json_meta.push(this.serverMessages['pedidosFaturar'])
      this.json_meta.push(`${this.traduction.receiver}: ${this.lstFatSintetico[0].Receptor}  -  ${this.lstFatSintetico[0].ReceptorDesc}`)
      this.json_meta.push(`${this.serverMessages['relatorioFaturar.clientes']} : ${this.lstFatSintetico[0] ? this.lstFatSintetico[0].Emissor : ''} - ${this.lstFatSintetico[0] ? this.lstFatSintetico[0].EmissorDesc : ''} || ${this.traduction.numOv} : ${this.selectedGR} || ${this.serverMessages['relatorioFaturamento.numeroOrdem']} : ${this.lstFatSintetico[0] ? this.lstFatSintetico[0].Bstnk : ''}`)
      this.json_meta.push(`${this.serverMessages['pedido.cadastro.dataEmissao']} : ${this.lstFatSintetico[0] ? this.lstFatSintetico[0].Erdat.split("-").reverse().join("-") : ''} || ${this.serverMessages['relatorioFaturar.table.dataDesRemessa']} : ${this.lstFatSintetico[0] ? this.lstFatSintetico[0].DtRemessa.split("-").reverse().join("-") : ''} || ${this.serverMessages['relatorioComissao.relatorio.vlrDesc']} : ${this.lstFatSintetico[0] ? this.lstFatSintetico[0]['netwr'] : ''} || ${this.serverMessages['relatorioFaturar.table.qtdOrdem']} : ${this.lstTotais} `)
      this.json_meta.push(`${this.user.loginUsuario} - ${this.selected} || dataDe: ${this.dateDe} - dataAte: ${this.dateAte}`)
      this.json_meta.push(`${this.serverMessages['relatorioFaturar.docFat.rel.condicaoPagamento']} : ${this.lstFatSintetico[0] ? this.lstFatSintetico[0].Zterm : ''} - ${this.lstFatSintetico[0] ? this.lstFatSintetico[0].ZtermDesc : ''} || ${this.serverMessages['pedido.email.descontoExtra']} : ${this.lstFatSintetico[0] ? [this.lstFatSintetico[0].DescFin * -1] : ''} || ${this.serverMessages['pedido.email.descontoComercial']} : ${this.lstFatSintetico[0] ? this.lstFatSintetico[0].DescCom * -1 : ''}`)
      //console.log('jsons', this.json_meta, this.json_metaAlt)
    },
    addTitleTable() {
      this.json_meta = []
      this.json_meta.push(this.serverMessages['pedidosFaturar'])
      this.json_meta.push(this.user.loginUsuario)
      this.json_meta.push(`dataDe: ${this.dateDe} - dataAte: ${this.dateAte}`)
    },
    searchNumPed(doc) {
      console.log('doc searchnumped')
      this.lstLoadedTable = []
      this.spinner = true
      //console.log('buera' , doc)
      let newTable = filter(this.showFaturado, el => { return el.Pedido == doc })
      // console.log(newTable)
      this.openOv(newTable[0].Id)
      //   this.lstLoadedTable = map(this.lstLoadedTable, el => {return Object.assign({}, el.Valor.toFixed(2)) })
      // this.showTable = true;
    },
    searchPedOv() {
      // console.log('doc searchpedov')
      this.lstLoadedTable = []
      this.showFaturado.filter((elem) => {
        if (elem.Id === this.selectedOV) {
          return this.lstLoadedTable.push(elem);
        }
      });
      this.showTable = true;
    },
    clearCustomers() {
      this.$refs.listboxsel.source = [];
      this.$store.commit("setCustomersSel", []);
      this.$store.commit("listClientes", []);
      this.quant = 0;
    },
    updateClients() {
      this.showFilters = true
    },
    clearVars() {
      //this.lstTotais = []
      this.validationTwo = false;
      this.validationOne = true;
      this.showTable = true;
      this.lstFatDet = {}
      this.searchOv();
    },
  },

  beforeDestroy() {
    this.$store.commit("setCustomers", []);
    this.$store.commit("setCustomersSel", []);
    this.lstLoadedTable = [];
  },
  watch: {
    validationOne: function () {
      this.addTitleTable()
    },
    lstFatSintetico: function () {
      this.addTitleTable2();
    }
  },
  beforeMount() {
    this.dateDe = format(addMonths(new Date(), -1), "yyyy-MM-dd");
    this.dateAte = format(new Date(), "yyyy-MM-dd");

    if (this.language === "P") {
      this.locale = "pt-BR";
    } else if (this.language === "E") {
      this.locale = "en-US";
    } else if (this.language === "F") {
      this.locale = "fr";
    } else {
      this.locale = "es";
    }
    this.$store.commit('setShowOrNo', false)
  },
};
</script>

<style lang="scss" scoped>
.main-area {
  justify-content: flex-start;
}
.relatPed-area {
  display: flex;
  .dropdown {
    margin: 5px 0px;
  }
  .pCard {
    border: 0;
    box-shadow: none;
    background-color: transparent;
  }
}
.pBody {
  border-radius: 25px;
  padding: 25px 0px 0px 15px;
  text-align: baseline;
  background-color: transparent;
}
.relatPedForm {
  display: inline-flex;
  border: 0;
}
.search-area {
  display: flex;
  flex-direction: row;
  width: 100%;
  li {
    margin: 0px 3px;
    width: 100%;
  }
}
.search-area2 {
  li {
    display: inline-flex;
    width: 100%;
    input {
      max-width: 75%;
    }
    button {
      max-width: 25%;
    }
    label {
      margin: 5px 0px;
    }
  }
}
.btn-area {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
}
.dlPdf {
  margin: 0;

  button {
    margin: 0px !important;
  }
}

.detailsHeader {
  background-color: white;
  color: black;
}

.coTable>>>thead {
  background-color: black;
  color: white;
}

@media(max-width:767px) {

  .main-area,
  .list-area {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    width: 100% !important;
    text-align: center !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .btn-area {
    justify-content: flex-start !important;
  }

  .btn-area>* {
    margin: 0px 10px;
  }

  .relatPedForm,
  .search-area {
    display: flex;
    border: 0;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
  }
}

.cardSmall {
  min-height: 1px !important;
}
</style> 