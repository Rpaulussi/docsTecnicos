<template>
  <div>
    <div>
      <PageTitle icon="fa fa-retweet " :main="
        serverMessages['troca.relatorio.header']
          .replace('.::', '')
          .replace('::.', '')
      "></PageTitle>
      <Spinner :state="spinner"> </Spinner>

    </div>
    <div class="main">
      <div class="principal" v-show="!wtSelected">
        <div>
        </div>
        <b-card class="bcard">
          <b-row>
            <b-form-group v-bind:label="serverMessages['relatorioFaturar.periodoDe']" label-for="dataDe" class="space">
              <b-form-datepicker id="dataDe" v-model="dataDe" size="sm" class="mb-2 date-area" :dropup="false"
                :locale="locale" :disabled="radioOptions === 'A'" v-bind="labels[locale] || {}" :date-format-options="{
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                }">
              </b-form-datepicker>
            </b-form-group>

            <b-form-group v-bind:label="serverMessages['geral.ate']" label-for="dataAte" class="space">
              <b-form-datepicker id="dataAte" size="sm" v-model="dataAte" class="mb-2 date-area" :locale="locale"
                :dropup="false" :disabled="radioOptions === 'A'" v-bind="labels[locale] || {}" :date-format-options="{
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                }"></b-form-datepicker>
            </b-form-group>
          </b-row>
          <b-row>
            <b-form-group>
              <b-form-radio-group v-model="radioOptions" default="A">
                <b-form-radio selected value="A" class="space">{{
                  serverMessages["troca.consulta.status.abertas"]
                }}</b-form-radio>
                <b-form-radio value="F" class="space">{{
                  serverMessages["troca.consulta.status.fechadas"]
                }}</b-form-radio>
                <b-form-radio value="T" class="space">{{
                  serverMessages["troca.consulta.status.todas"]
                }}</b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </b-row>
          <b-row>
            <b-form-group v-bind:label="serverMessages['troca.consulta.escritorio']">
              <Dropdown :options="lstEscritorios" v-on:selected="onSelectEscritorio" :maxItem="10000"
                :disabled="spinner" :placeholder="traduction.choose" id="equipe" name="eqpdeVendas">
              </Dropdown>
            </b-form-group>
            <b-form-group v-bind:label="'WT'">
              <b-form-input v-model="mip" placeholder=""></b-form-input>
            </b-form-group>
          </b-row>
          <b-row>
            <b-form-group v-bind:label="serverMessages['trocaProduto.defeito']">
              <JqxComboBox ref="comboBoxDefeitos" :width="200" :height="25" displayMember="text" valueMember="value"
                :checkboxes="true" />
            </b-form-group>
            <b-form-group v-bind:label="serverMessages['trocaProduto.procedimento']">
              <JqxComboBox ref="comboBoxProcedimentos" :width="200" :height="25" :checkboxes="true" />
            </b-form-group>
          </b-row>
        </b-card>
        <div class="breakpoint">
          <b-card class="bcard" :sub-title="serverMessages['noticia.cadastro.representantes']">
            <div class="list-cli">
              <JqxListBox ref="listbox" @select="onSelect()" :width="width" :height="height" :filterable="true"
                :searchMode="'containsignorecase'" :incrementalSearch="true" :disabled="false"
                :filterPlaceHolder="traduction.lookingFor" displayMember="display" valueMember="value">
              </JqxListBox>
            </div>
          </b-card>
          <b-card :sub-title="
            serverMessages['noticia.cadastro.representantes'] + ' Selecionados'
          ">
            <div class="list-clisel">
              <JqxListBox ref="listboxsel" @select="onSelect2()" :width="width" :height="height"
                :source="repsSelecionados" :selectedIndex="3" :filterable="true" :searchMode="'containsignorecase'"
                :incrementalSearch="true" :disabled="false" :filterPlaceHolder="traduction.lookingFor"
                displayMember="display" valueMember="value">
              </JqxListBox>
            </div>
            <div class="button-area">
              <b-button @click="clearCustomers" variant="secondary">{{
                traduction.clearSelection
              }}</b-button>
            </div>
          </b-card>
        </div>
      </div>
    </div>
    <hr class="my-4" v-if="!wtSelected" />

    <div class="button-areaDownloads button-area" @click="loadPdf" v-if="!wtSelected">
      <b-button id="btnConsultar" class="btn" variant="primary" @click="search();">{{
        traduction.search
      }}</b-button>

      <div class="download-area">
        <div class="imprimir">

        </div>
        <downloadPdf :campos="firstFields" :items="
      wtSelected === 'null' || wtSelected === 'undefined'
        ? lstArrayItensFiltered
        : lstTrocaDisplay">
        </downloadPdf>

        <b-button style="height: 40px; margin-top:12px;" class="export-option" variant="outline-secondary">
          <export-excel class="btnExcel" :name="`RelatorioTrocas.xls`" :data="
        wtSelected === 'null' || wtSelected === 'undefined'
          ? lstArrayItensFiltered
          : lstTrocaDisplay" :fields="fieldsFirst">
            <img :src="require(`@/assets/excelicon.png`)" />
          </export-excel>
        </b-button>
      </div>
    </div>
    <hr class="my-4" v-if="!wtSelected" />
    <div class="table tableTroca">
      <b-table-simple striped hover small responsive v-if="lstTrocaDisplay.length > 0 && wtSelected == null">
        <b-thead head-variant="dark">
          <b-tr class="header-name">
            <b-td colspan="12">{{ this.clienteName[0] }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>Numero WT</b-th>
            <b-th>{{ serverMessages["noticia.cadastro.usuario"] }}</b-th>
            <b-th>{{ serverMessages["noticia.cadastro.cliente"] }}</b-th>
            <b-th>Dt.Emissão</b-th>
            <b-th>Conclusão</b-th>
            <b-th>Qtde</b-th>
            <b-th>Valor Total</b-th>
          </b-tr>
        </b-thead>
        <b-tbody v-for="troca in lstTrocaDisplay" v-bind:key="troca.wt">
          <b-tr>
            <b-th class="link_fat" rowspan="2" @click="onSelectWT(troca)">{{
              troca.wt
            }}</b-th>
            <b-th style="color: #4682B4">{{ troca.userName }}</b-th>
            <b-th>{{ `${troca.cliente} - ${troca.clienteDesc} ` }}</b-th>
            <b-td :style="troca.difDias > 30 ? 'color:red' : 'color:#03cea4'"><b>{{ troca.dtEmissaoFormat }}</b></b-td>
            <b-td :style="troca.difDias > 30 ? 'color:red' : 'color:#03cea4'"><b>{{
              troca.dtFinalTroca === "0000-00-00" ? "" : troca.dtConclFormat
            }}</b></b-td>
            <b-td variant="success">{{ troca.quantidade }}</b-td>
            <b-td variant="success">{{ troca.valor }}</b-td>
          </b-tr>
          <b-tr>
            <b-td style="max-width: 150px" colspan="2"><span><b>Obs.Rep:</b></span> {{ `${troca.obs}` }}</b-td>
            <b-td colspan="2">
              <span><b>Obs.Sac:</b></span>{{ `${troca.obsSac}` }}</b-td>
          </b-tr>
        </b-tbody>
        <b-tfoot class="tFoot">
          <b-tr class="rowTotais">
            <b-td colspan="2"><span><b>{{ serverMessages["troca.relatorio.wt.total"] }}</b></span></b-td>
            <b-td><span><b>{{
              serverMessages["troca.relatorio.representate.unico.total"]
            }}</b></span></b-td>
            <b-td><span><b>{{
              serverMessages["troca.relatorio.cliente.unico.total"]
            }}</b></span></b-td>
            <b-td><span><b>{{
              serverMessages["troca.relatorio.quantidade.total"]
            }}</b></span></b-td>
            <b-td colspan="2"><span><b>{{
              serverMessages["troca.relatorio.valor.total"]
            }}</b></span></b-td>
          </b-tr>
          <b-tr class="rowTotais2">
            <b-td colspan="2"><span class="ml-5"><b>{{ lstTrocaDisplay.length }}</b></span></b-td>
            <b-td><span class="ml-5"><b>{{ lstQuantRep.length }}</b></span></b-td>
            <b-td><span class="ml-5"><b>{{ lstQuantCliente.length }}</b></span></b-td>
            <b-td><span class="ml-5"><b>{{ quantTotal - qtdMongoTroca }}</b></span></b-td>
            <b-td colspan="2"><span class="ml-3"><b>{{ valorTotal }}</b></span></b-td>
          </b-tr>
        </b-tfoot>
      </b-table-simple>
    </div>
    <div v-if="wtSelected" class="principal">
      <div class="principalDiv">
        <b-col>
          <b-row>
            <b-col>
              <b-form-group label="Número WT:" label-size="sm" label-class="font-style">
                <b-form-group :label="wtSelected.wt" label-size="sm"></b-form-group>
              </b-form-group>
            </b-col>
            <b-col>
              <div v-if="wtSelected.dtFinalTroca === '0000-00-00'" class="status btn-sucess">

                <b-form-group style="color: white; padding: -1px" label="Aberto" label-size="sm"></b-form-group>
              </div>
              <div v-else-if="wtSelected.difDias > 30" class="status3">
                <b-form-group style="color: white; padding: -1px" label="Finalizado" label-size="sm"></b-form-group>
              </div>
              <div v-else class="status2">
                <b-form-group style="color: white; padding: -1px" label="Finalizado" label-size="sm"></b-form-group>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :label="`${serverMessages['headRepresentante']}:`" label-size="sm" label-class="font-style">
                <b-form-group :label="wtSelected.userName" label-size="sm"></b-form-group>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :label="`${serverMessages['pedido.cadastro.cliente']}:`" label-size="sm"
                label-class="font-style">
                <b-form-group :label="wtSelected.clienteDesc" label-size="sm"></b-form-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group label="Troca Para:" label-size="sm" label-class="font-style">
                <b-form-group :label="
                  wtSelected.nfedev !== ''
                    ? `PJ - NF:${wtSelected.nfedev}`
                    : 'Consumidor Final'
                " label-size="sm"></b-form-group>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :label="`${serverMessages['pedido.cadastro.dataEmissao']}:`" label-size="sm"
                label-class="font-style">
                <b-form-group :label="wtSelected.dtEmissaoFormat" label-size="sm"></b-form-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group :label="`${serverMessages['troca.cadastro.dataRecebimento']}:`" label-size="sm"
                label-class="font-style">
                <b-form-group :label="wtSelected.dtRecebFormat" label-size="sm"></b-form-group>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group :label="`${serverMessages['troca.cadastro.dataFinal']}:`" label-size="sm"
                label-class="font-style">
                <b-form-group :label="wtSelected.dtConclFormat" label-size="sm"></b-form-group>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </div>
      <div class="text-area textArea-trocas">
        <b-form-group label="Obs Rep:" label-size="sm" label-class="font-style" style="color: black">
          <b-form-textarea id="textarea" rows="3" v-model="wtSelected.obs" max-rows="6" readonly>
          </b-form-textarea>
        </b-form-group>
        <b-form-group label="Obs Sac:" label-size="sm" label-class="font-style" style="color: black">
          <b-form-textarea id="textarea1" v-model="wtSelected.obsSac" rows="3" max-rows="6" readonly>
          </b-form-textarea>
        </b-form-group>
        <b-form-group label="Itens Substituídos:" label-size="sm" label-class="font-style" style="color: black">
          <JqxListBox ref="listboxMongo" width="500px" height="100px" :source="lstMongoSubtit" :filterable="true"
            :searchMode="'containsignorecase'" :incrementalSearch="true" :disabled="false"
            :filterPlaceHolder="traduction.lookingFor" displayMember="display" valueMember="value">
          </JqxListBox>
        </b-form-group>
      </div>
    </div>
    <hr class="my-4" v-if="wtSelected" />
    <div class="button-area" v-if="wtSelected">
      <div class="btnGroup">
        <b-button style="padding:5px; width:50px;" @click="manageData"><i class="fa fa-print"
            stlye="margin:"></i></b-button>
        <b-button id="btnVoltar" class="btn" variant="danger" @click="back()">{{ this.traduction.goBack }}</b-button>
        <b-button id="btnNovaTroca" class="btn" variant="success" @click="pushTroca()">{{
          serverMessages["troca.cadastro.novaTroca"]
        }}</b-button>
      </div>
      <div class="download-area">
        <downloadPdf :campos="filterFields" :items="lstArrayItensFiltered">
        </downloadPdf>

        <b-button style="height: 40px; margin-top:12px;" class="export-options" variant="outline-secondary">
          <export-excel class="btnExcel" :data="lstArrayItensFiltered" :fields="fieldsFilter"
            :name="`RelatPedTroca.xls`" :title="json_meta">
            <img :src="require(`@/assets/excelicon.png`)" />
          </export-excel>

        </b-button>
      </div>
    </div>
    <hr class="my-4" v-if="wtSelected" />
    <div v-if="wtSelected">
      <b-table class="tableSeg" head-variant="dark" small striped responsive :items="lstArrayItensFiltered"
        :fields="fields">
        <template #head(marca)>
          <span>{{ serverMessages["troca.cadastro.marca"] }}</span>
        </template>
        <template #head(ref)>
          <span>{{ serverMessages["troca.cadastro.referencia"] }}</span>
        </template>
        <template #head(cor)>
          <span>{{ serverMessages["troca.cadastro.cor"] }}</span>
        </template>
        <template #head(tam)>
          <span>{{ serverMessages["troca.cadastro.tamanho"] }}</span>
        </template>
        <template #head(copa)>
          <span>{{ serverMessages["troca.cadastro.copa"] }}</span>
        </template>
        <template #head(numeroMip)>
          <span>{{ serverMessages["troca.cadastro.mip"] }}</span>
        </template>
        <template #head(descDefeito)>
          <span>{{ serverMessages["trocaProduto.defeito"] }}</span>
        </template>
        <template #head(descProc)>
          <span>{{ serverMessages["trocaProduto.procedimento"] }}</span>
        </template>
        <template #head(dtPrevConclFormat)>
          <span>{{ serverMessages["troca.cadastro.dataPrevisaoItem"] }}</span>
        </template>
        <template #head(dtItemFinalFormat)>
          <span>{{ serverMessages["troca.cadastro.dataConclusaoItem"] }}</span>
        </template>
        <template #cell(dtPrevConclFormat)="data">
          <span v-if="data.item.difDias > 30" style="color: red"><b>{{ data.value }}</b></span>
          <span v-else style="color: #03cea4"><b>{{ data.value }}</b></span>
        </template>
      </b-table>
      <b-table-simple class="tableTer" striped hover small responsive>
        <b-tbody>
          <b-tr>
            <b-td><b>{{
            `${serverMessages["troca.relatorio.quantidade.total"]} : ${lstArrayItensFiltered.length}`
            }}</b></b-td>
            <b-td><b>{{
            `${serverMessages["troca.relatorio.valor.total"]} : ${lstArrayItensFiltered[0]["valorTotal"]}`
            }}</b></b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PageTitle from "../template/PageTitle";
import Spinner from "../template/Spinner";
import {
  format,
  addMonths,
  differenceInMonths,
  parseISO,
  differenceInDays,
} from "date-fns";
import axios from "axios";
import Dropdown from "vue-simple-search-dropdown";
import { baseApiUrl, showError } from "@/global";
import JqxListBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlistbox.vue";
import JqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";
import { find, map, filter, groupBy, sortBy, reduce } from "underscore";
import numeral from "numeral";
import downloadPdf from "../commons/downloadPdf.vue";
//import { closeMenu } from "../../mixins/closeMenu";
//import downloadExcel from "../commons/downloadExcel.vue";

export default {
  name: "RelatorioTroca",
  components: {
    PageTitle,
    Spinner,
    Dropdown,
    JqxListBox,
    JqxComboBox,
    downloadPdf,

  },
  data: function () {
    return {
      //mixins: [closeMenu],
      clienteName: [],
      json_meta: [],
      spinner: false,
      mip: "",
      wtSelected: null,
      selected: { name: null, id: null },
      disable: null,
      radioOptions: "A",
      quantTotal: null,
      lstEscritorios: [],
      lstEscritoriosOriginal: [],
      lstQuantCliente: [],
      lstQuantRep: [],
      lstWtsMongo: [],
      lstMongoSubtit: [],
      repsSelecionados: [],
      lstTrocaDisplay: [],
      lstArrayItensFiltered: [],
      lstTrocas: [],
      dataDe: null,
      dataAte: null,
      qtdMongoTroca: 0,
      valorMongoTroca: 0,
      width: 300,
      height: 215,
      locale: "pt-BR",
      fields: [
        { key: "index", label: "Item" },
        { key: "marca", label: "Marca" },
        { key: "ref", label: "Ref." },
        { key: "cor", label: "Cor" },
        { key: "tam", label: "Tam" },
        { key: "copa", label: "Copa" },
        { key: "numeroMip", label: "MIP" },
        { key: "descDefeito", label: "Defeito" },
        { key: "descProc", label: "Procedimento" },
        { key: "dtPrevConclFormat", label: "Data Prevista Conclusão" },
        { key: "dtItemFinalFormat", label: "Data Conclusão" },
        { key: "quantidade", label: "Qtd." },
        { key: "valorFormat", label: "Valor" },
        { key: "substPor", label: "Subst. por" },
      ],
      fieldsFilter: {
        Item: "index",
        Marca: "marca",
        "Ref.": "ref",
        Cor: "cor",
        Tam: "tam",
        Copa: "copa",
        MIP: "numeroMip",
        Defeito: "descDefeito",
        Procedimento: "descProc",
        "Data Prevista Conclusão": "dtPrevConclFormat",
        "Data Conclusão": "dtItemFinalFormat",
        "Qtd.": "quantidade",
        Valor: "valorFormat",
        "Subst. por": "substPor",
      },
      filterFields: {
        index: "Item",
        marca: "Marca",
        ref: "Ref.",
        cor: "Cor",
        tam: "Tam",
        copa: "Copa",
        numeroMip: "MIP",
        descDefeito: "Defeito",
        descProc: "Procedimento",
        dtPrevConclFormat: "Data Prevista Conclusão",
        dtItemFinalFormat: "Data Conclusão",
        quantidade: "Qtd.",
        valorFormat: "Valor",
        substPor: "Subst. por",
      },
      fieldsFirst: {
        "Numero WT": "wt",
        "Dt. Emissao": "dtEmissao",
        Conclusao: "dtConclFormat",
        Quantidade: "quantidade",
        "Valor Total": "valor",
        Obs: 'obs',
        ObsSac: 'obsSac'
      },
      firstFields: {
        wt: "Numero WT",
        dtEmissao: "Dt. Emissao",
        dtConclFormat: "Conclusao",
        quantidade: "Quantidade",
        valor: "Valor Total",
        obs: 'Obs',
        obsSac: 'ObsSac',
      },

      labels: {
        "pt-BR": {
          labelPrevDecade: "Década anterior",
          labelPrevYear: "Ano anterior",
          labelPrevMonth: "Mês anterior",
          labelCurrentMonth: "Mês atual",
          labelNextMonth: "Próximo mês",
          labelNextYear: "Próximo ano",
          labelNextDecade: "Próxima década",
          labelToday: "Hoje",
          labelSelected: "Ausgewähltes Datum",
          labelNoDateSelected: "Nenhuma Data Selecionada",
          labelCalendar: "Calendário",
          labelNav: "Kalendernavigation",
          labelHelp: "Use o cursor do mouse para navegar entre as datas",
        },
        fr: {
          labelPrevDecade: "Décennie précédente",
          labelPrevYear: "l'année dernière",
          labelPrevMonth: "Le mois dernier",
          labelCurrentMonth: "Mois en cours",
          labelNextMonth: "Le mois prochain",
          labelNextYear: "L'année prochaine",
          labelNextDecade: "Prochaine décennie",
          labelToday: "Aujourd'hui",
          labelSelected: "Ausgewähltes Datum",
          labelNoDateSelected: "Aucune date sélectionnée",
          labelCalendar: "Calendrier",
          labelNav: "Kalendernavigation",
          labelHelp:
            "Utilisez le curseur de la souris pour naviguer entre les dates",
        },
        es: {
          labelPrevDecade: "Década anterior",
          labelPrevYear: "El año pasado",
          labelPrevMonth: "Mes pasado",
          labelCurrentMonth: "Mes actual",
          labelNextMonth: "Proximo mes",
          labelNextYear: "Próximo año",
          labelNextDecade: "La próxima década",
          labelToday: "Hoy",
          labelSelected: "Ausgewähltes Datum",
          labelNoDateSelected: "Sin fecha seleccionada",
          labelCalendar: "Calendario",
          labelNav: "Kalendernavigation",
          labelHelp: "Use el cursor del mouse para navegar entre fechas",
        },
      },
    };
  },
  computed: {
    ...mapState([
      "serverMessages",
      "language",
      "traduction",
      "dateDe",
      "dateAte",
      "user",
      "isMenuVisible"
    ]),
  },
  methods: {
    onSelectWT(wt) {

      this.wtSelected = wt;
      // let array = [
      //    {_id: '00012468', seqs:[{skuR:"388011542500G000",skuV:"388011542500M000",sqR:1,sqV:7},{skuR:"388011519000G000",skuV:"388011519000M000",sqR:24,sqV:26}]}
      // ]

      //let arrayFiltrado = filter(array , el =>  el._id === wt.wt)
      let arrayFiltrado = filter(this.lstWtsMongo, (el) => el._id === wt.wt);

      let objectMongo = arrayFiltrado[0];
      this.lstArrayItensFiltered = wt.itens.map((el) => {
        if (objectMongo) {
          this.lstMongoSubtit = objectMongo.seqs.map(
            (el) => ` De: -> ${el.skuR} por -> ${el.skuV}`
          );
          return {
            index: el.seq,
            marca: el.material.substr(0, 2),
            ref: el.material.substr(2, 5),
            cor: el.material.substr(7, 3),
            tam: el.material.substr(10, 3),
            copa: el.material.substr(13, 3),
            valorTotal: numeral(reduce(wt.itens, (vlrAnt, curr) => { return vlrAnt + curr.valor }, 0) - this.valorMongoTroca).format("$0,0.00"),
            valorFormat: numeral(el.valor).format("$0,0.00"),
            dtPrevConclFormat: format(addMonths(parseISO(el.dtEmissao), 1), "dd-MM-yyyy"),
            dtItemFinalFormat: el.dtFinalizacao === "0000-00-00" ? "" : format(parseISO(el.dtFinalizacao), "dd-MM-yyyy"),
            difDias: el.dtFinalizacao !== "0000-00-00" ? differenceInDays(new Date(el.dtFinalizacao), new Date(el.dtEmissao)) : differenceInDays(new Date(), new Date(el.dtEmissao)),
            substPor: find(objectMongo.seqs, (e) => {
              return e.skuR === el.material && e.sqR === el.seq;
            })
              ? find(objectMongo.seqs, (e) => {
                return e.skuR === el.material && e.sqR === el.seq;
              })["sqV"]
              : find(objectMongo.seqs, (e) => {
                return e.skuV === el.material && e.sqV === el.seq;
              })
                ? find(objectMongo.seqs, (e) => {
                  return e.skuV === el.material && e.sqV === el.seq;
                })["sqR"]
                : "",
            ...el,
          };
        } else {
          return {
            index: el.seq,
            marca: el.material.substr(0, 2),
            ref: el.material.substr(2, 5),
            cor: el.material.substr(7, 3),
            tam: el.material.substr(10, 3),
            copa: el.material.substr(13, 3),
            valorTotal: numeral(
              reduce(
                wt.itens,
                (vlrAnt, curr) => {
                  return vlrAnt + curr.valor;
                },
                0
              )
            ).format("$0,0.00"),
            valorFormat: numeral(el.valor).format("$0,0.00"),
            dtPrevConclFormat: format(addMonths(parseISO(el.dtEmissao), 1), "dd-MM-yyyy"),
            dtItemFinalFormat: el.dtFinalizacao === "0000-00-00" ? "" : format(parseISO(el.dtFinalizacao), "dd-MM-yyyy"),
            difDias: el.dtFinalizacao !== "0000-00-00" ? differenceInDays(new Date(el.dtFinalizacao), new Date(el.dtEmissao)) : differenceInDays(new Date(), new Date(el.dtEmissao)),
            substPor: "",
            ...el,
          };
        }
      });
      this.lstArrayItensFiltered = sortBy(this.lstArrayItensFiltered, "index");
    },
    pushTroca() {
      this.$router.push({ path: '/troca' })
    },
    onSelect() {
      if (this.lstEscritoriosOriginal.length > 0) {
        let items = this.$refs.listbox.getSelectedItems();
        if (!this.$refs.listboxsel.getItemByValue(items[0].value)) {
          this.$refs.listboxsel.addItem(items[0]);
        }
      }
    },
    onSelect2() {
      let items = this.$refs.listboxsel.getSelectedItems();
      this.$refs.listboxsel.removeItem(items[0].value);
    },
    onSelectEscritorio(selection) {
      this.selectedEscri = selection;

      this.spinner = true;
      this.$store.commit("setSelectedEsc", this.selectedEscri);
      if (this.selectedEscri.id) {
        let objReps = find(this.lstEscritoriosOriginal, (e) => {
          return e.id === this.selectedEscri.id;
        })
          ? find(this.lstEscritoriosOriginal, (e) => {
            return e.id === this.selectedEscri.id;
          })["representantes"]
          : [];
        let arrayFiltered = objReps.map((el) => {
          return { display: `${el.id}- ${el.nome}`, value: el.id };
        });
        this.$refs.listbox.source = arrayFiltered;
      }
      this.spinner = false;
    },
    // onSelectDefeito() {
    //   // 
    // },
    // onSelectProcedimento() {
    //   //
    // },
    back() {
      this.wtSelected = null;
    },
    search() {



      const lstDefs = map(
        this.$refs.comboBoxDefeitos.getCheckedItems(),
        (el) => {
          return { High: "", Low: el.value, Opti: "EQ", Sign: "I" };
        }
      );
      const lstProcs = map(
        this.$refs.comboBoxProcedimentos.getCheckedItems(),
        (el) => {
          return { High: "", Low: el.value, Opti: "EQ", Sign: "I" };
        }
      );
      const url = `${baseApiUrl}/pedido/getmanutencaotroca`;

      let result = differenceInMonths(new Date(this.dataAte), new Date(this.dataDe));
      if (result > 12) {
        showError(this.serverMessages["relatorioCobranca.form.periodo.limit"]);
        return;
      }
      this.spinner = true;
      axios
        .post(url, {
          pAbertas: this.radioOptions,
          pDtAte: this.radioOptions !== "A" ? this.dataAte : format(new Date(), "yyyy-MM-dd"),
          pDtDe: this.radioOptions !== "A" ? this.dataDe : "2000-01-01",
          PNumPedido: this.mip,
          PSetor: "",
          PUser: "",
          TInpDefeitos: lstDefs,
          TInpProcedimentos: lstProcs,
          TInpRepresentantes: [],
          language: this.language,
        })
        .then((resp) => {
          if (resp.data.result === "OK") {
            this.lstTrocaDisplay = [];
            let arrayTemp = [];
            if (this.$refs.listboxsel.getItems().length > 0) {
              this.$refs.listboxsel.getItems().forEach((element) => {
                this.lstTrocas = filter(resp.data.trocasRQ, (el) => {
                  return el.userName === element.value;
                });
                this.lstTrocas.forEach((el) => {
                  arrayTemp.push(el);
                });
              });
            } else {
              if (this.user.userType === 'REP') {
                this.lstTrocas = filter(resp.data.trocasRQ, (el) => {
                  return el.userName === this.user.loginUsuario
                })
              } else {
                this.lstTrocas = resp.data.trocasRQ
                this.lstTrocas.forEach((el) => {
                  arrayTemp.push(el);
                });
              }
            }

            //Rotina para buscar registros dos gerentes regionais
            let arraySel = this.$refs.listboxsel.getItems()
            if (arraySel.length === 0) {
              this.lstTrocas = resp.data.trocasRQ.filter(el => { return el.userName === this.user.loginUsuario })
              this.lstTrocas.forEach(el => {
                arrayTemp.push(el)
              })
            }
            this.lstTrocaDisplay = map(
              map(groupBy(arrayTemp, (troca) => { return troca.numPedido; }),
                (value, key) => {
                  return {
                    wt: key,
                    cliente: value[0].cliente,
                    clienteDesc: value[0].clienteDesc,
                    userName: value[0].userName,
                    dtReceb: value[0].dtReceb,
                    dtEmissao: value[0].dtEmissao,
                    dtFinalizacao: value[0].dtFinalizacao,
                    dtFinalTroca: value[0].dtFinalTroca,
                    quantidade: reduce(value, (vlant, curr) => { return vlant + curr.quantidade; }, 0),
                    valorOrigin: reduce(value, (vlr, curr) => { return vlr + curr.valor; }, 0),
                    valor: numeral(reduce(value, (vlant, curr) => { return vlant + curr.valor }, 0)).format("$0,0.00"),
                    nfedev: value[0].nfedev,
                    obs: value[0].obs,
                    obsSac: value[0].obsSac,
                    itens: value,
                  };
                }
              ),
              (el) => {
                return {
                  ...el,
                  dtEmissaoFormat: format(parseISO(el.dtEmissao), "dd-MM-yyyy"),
                  difDias: el.dtFinalTroca !== "0000-00-00" ? differenceInDays(new Date(el.dtFinalTroca), new Date(el.dtEmissao)) : 0,
                  dtConclFormat: el.dtFinalTroca !== "0000-00-00" ? format(parseISO(el.dtFinalTroca), "dd-MM-yyyy") : "",
                  dtRecebFormat: el.dtReceb !== "0000-00-00" ? format(parseISO(el.dtReceb), "dd-MM-yyyy") : "",
                };
              }
            );
            this.lstTrocaDisplay = sortBy(this.lstTrocaDisplay, "dtEmissao");
            this.valorTotal = numeral(
              reduce(
                this.lstTrocaDisplay,
                (vlrAnt, current) => {
                  return vlrAnt + current.valorOrigin;
                },
                0
              )
            ).format("$0,0.00");
            this.quantTotal = reduce(
              this.lstTrocaDisplay,
              (vlrAnt, current) => {
                return vlrAnt + current.quantidade;
              },
              0
            );

            this.lstQuantCliente = map(
              groupBy(this.lstTrocaDisplay, (troca) => {
                return troca.cliente;
              }),
              (value, key) => {
                return { cliente: key, itens: value };
              }
            );
            this.lstQuantRep = map(
              groupBy(this.lstTrocaDisplay, (troca) => {
                return troca.userName;
              }),
              (value, key) => {
                return { rep: key, itens: value };
              }
            );

            this.loadWtsMongo(arrayTemp);
            this.spinner = false;
          }
        })
        .catch(() => {
          showError(this.traduction.serverError);
          this.spinner = false;
        });
    },
    async loadPdf() {
      this.clienteName = JSON.parse(JSON.stringify(this.lstQuantRep)).flatMap(el => el.rep)
    },
    manageData() {

      let tabelaSeg = document.querySelector('.tableSeg').innerHTML;
      // console.log(tabelaSeg)
      let imprimir = window.open('');
      imprimir.document.write(`<div class="tableWrapper"><ul><li>Num Wt: <b>${this.wtSelected.wt}</b></li>  <li>Rep: <b>${this.wtSelected.userName}</b></li> <li>Cliente: <b>${this.wtSelected.clienteDesc}</b> </li> <li>Troca para: <b>${this.wtSelected.nfedev ? this.wtSelected.nfedev : 'Consumidor Final'}</b></li> <li>Data Emissão: <b>${this.wtSelected.dtEmissaoFormat}</b></li> <li>Data Recebimento: <b>${this.wtSelected.dtRecebFormat}</b></li> <li>Data Conclusão: <b>${this.wtSelected.dtConclFormat}</b></li></ul> </div>` + tabelaSeg + '<style>ul{padding: 10px 0px; list-style-type:none; display:flex; justify-content:space-evenly; background:black; color:white; margin:0;} b{color:#eb7a09;} table, td, th{border:1px solid black;} table{width:100%;} .tableWrapper{max-width:2400px;}</style>');
      imprimir.print();
      imprimir.close();
    },
    async loadEscritorio() {
      const url = `${baseApiUrl}/pedido/getescritorio`;
      this.spinner = true;
      await axios
        .post(url, { language: this.language, loginUsuario: this.user.loginUsuario })
        .then((resp) => {
          this.lstEscritoriosOriginal = resp.data.escritorioVendas;
          this.lstEscritorios = resp.data.escritorioVendas.map((el) => {
            return {
              id: el.id,
              name: `${el.id} - ${el.descricao}`,
            };
          });
        })
        .catch(() => {
          showError(this.traduction.serverError);
        });
      this.spinner = false;
    },
    loadWtsMongo(arrayWts) {
      const url = `${baseApiUrl}/mongo/getseqrecover`;
      this.spinner = true;
      arrayWts = arrayWts.map((el) => {
        return el.numPedido;
      });
      axios
        .post(url, { ids: arrayWts })
        .then((resp) => {
          this.lstWtsMongo = resp.data;

          if (this.lstWtsMongo.length > 0) {
            this.qtdMongoTroca = reduce(this.lstWtsMongo, (vlrAnt, current) => { return vlrAnt + current.seqs.length }, 0)
            this.valorMongoTroca = reduce(this.lstWtsMongo, (vlrAnt, current) => { return vlrAnt + reduce(current.seqs, (vlr, curr) => { return vlr + curr.prR }, 0) })
          }
          this.spinner = false;
        })
        .catch(() => {
          showError(this.traduction.serverError);
          this.spinner = false;
        });
    },
    async loadDefeitosProcedimentos() {
      const url = `${baseApiUrl}/produto/getdefeitosprocedimentos`;
      this.spinner = true;
      await axios
        .get(url)
        .then((resp) => {
          if (resp.data.result === "OK") {
            this.lstDefeitos = resp.data.defeitos;
            this.lstProcedimentos = resp.data.procedimentos;
            this.$refs.comboBoxDefeitos.source = this.lstDefeitos.map((el) => {
              return { value: el.codDefeito, text: el.descricao };
            });
            this.$refs.comboBoxProcedimentos.source = this.lstProcedimentos.map(
              (el) => el.descricao
            );
          }
        })
        .catch(() => {
          showError(this.traduction.serverError);
        });
      this.spinner = false;
    },
    clearCustomers() {
      this.$refs.listboxsel.source = [];
    },
    excelDownload() {
      this.json_meta = []
      this.json_meta.push(`Relatório de Trocas`)
      this.json_meta.push(`Número WT: ${this.wtSelected.wt} - ${this.wtSelected.difDias === '0000-00-00' ? 'Aberto' : 'Finalizado'}`)
      this.json_meta.push(`Representante: ${this.wtSelected.userName} - Cliente: ${this.wtSelected.clienteDesc}`)
      this.json_meta.push(`Troca Para: ${this.wtSelected.nfedev !== '' ? `PJ - NF:${this.wtSelected.nfedev}` : 'Consumidor Final'} - Data Emissão: ${this.wtSelected.dtEmissao}`)
      this.json_meta.push(`Data Recebimento: ${this.wtSelected.dtRecebFormat} - Data Conclusão: ${this.wtSelected.dtConclFormat}`)
    }

  },
  watch: {
    wtSelected: function () {
      this.excelDownload()
    }
  },
  async mounted() {
    this.$store.state.isMenuVisible = true
    this.dataDe = format(addMonths(new Date(), -1), "yyyy-MM-dd");
    this.dataAte = format(new Date(), "yyyy-MM-dd");
    if (this.language === "P") {
      this.locale = "pt-BR";
    } else if (this.language === "E") {
      this.locale = "en-US";
    } else if (this.language === "F") {
      this.locale = "fr";
    } else {
      this.locale = "es";
    }
    await this.loadEscritorio();
    await this.loadDefeitosProcedimentos();

  },

  beforeDestroy() {
    this.$store.commit("setRepresentantesFil", []);
    this.$store.commit("setRepsSel", []);
  },

};
</script>

<style lang="scss" scoped>
.tableTer>table {
  background-color: #e58b2a;
}
.tableTer {
  background-color: black;
  border: 1px solid black;
  padding: 15px 0px;
}
.tableSeg>table>thead>tr {
  background-color: black;
  color: white;
}
.tableSeg {
  background-color: white;
  border: 1px solid black;
}
.tFoot {
  background-color: black;
  color: white;
}
.rowTotais2 {
  background-color: #e58b2a;
  color: black;
}
.tableTroca {
  background-color: white;

}
.principal {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 15px;
}
.link_fat {
  text-decoration: underline;
  color: rgb(16, 22, 187);
}
.link_fat:hover {
  cursor: pointer;
}
.status {
  background-color: green;
  width: 80px;
  border-radius: 5px;
  padding: 0px 10px;
}
.status2 {
  background-color: rgb(60, 3, 153);
  width: 105px;
  border-radius: 5px;
  padding-left: 12px;
  padding-top: 5px;
}
.status3 {
  background-color: rgb(230, 82, 36);
  width: 105px;
  border-radius: 5px;
  padding-left: 12px;
  padding-top: 5px;
}
.textArea-trocas {
  display: flex;
  justify-content: flex-start;
  width: 50vw;
}
.status>legend {
  padding: 10px;
}
.header-name>td {
  background-color: #e58b2a;
  font-weight: 600;
  width: 100%;
  text-align: center;
  padding: 10px 0px !important;
}

.card-body {
  padding: 2.25rem;
  text-align: center;
  justify-content: center;
}

.card-body>.row {
  justify-content: space-around;
}

.download-area {
  display: flex;
  justify-content: space-evenly;

}

.principalDiv,
.textArea-trocas {
  background-color: white;
  color: black;
  padding: 15px;
  border-radius: 25px;
  box-shadow: 1px 1px 1px 1px #e58b2a;
}
.status {
  padding: 0px 15px;
}
.button-areaDownloads {
  justify-content: space-around !important;
  border-radius: 25px;
  display: flex;
}
th {
  font-size: 0.8rem;
}
.button-area {
  justify-content: space-around;
}
#btnVoltar {
  margin: 5px;
}
.breakpoint {
  display: flex;
}
@media(max-width:767px) {
  .breakpoint {
    display: block;
    margin: 10px 0px;
    max-height: fit-content !important;
  }
  .button-area {
    justify-content: flex-start;
  }
  .button-area>* {
    margin: 0px 10px;
  }
  .principal {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 5px;
  }

  .principalDiv,
  .textArea-trocas {
    max-width: 550px;
    width: 100%;
    margin: 5px;
  }
}
</style>
