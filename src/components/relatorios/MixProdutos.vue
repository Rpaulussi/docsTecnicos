<template>
    <div>
        <PageTitle icon="fa fa-list" :main="serverMessages['relatorio.mixProduto.header.Consulta']"> </PageTitle>
        <div class="container">
            <div class="row">
                <div class="col-12 spinnerArea">
                    <Spinner :state="spinner" />
                </div>
            </div>
        </div>
        <div class="main">

            <div class="card">
                <SelecaoConsulta :lstEquipe="lstEquipes" class="main-area p-0" :showEquipe="true" :mesesPeriodo="6"
                    :showMix="true"></SelecaoConsulta>
            </div>
            <div class="card">
                <SelecaoLista :title="serverMessages['relatorioFaturar.clientes']"
                    :titlesel="serverMessages['relatorioFaturar.clientes'] + traduction.selection" class="list-area">
                </SelecaoLista>
            </div>
        </div>
        <hr class="my-4">
        <div class="button-areaMix container">
            <b-row>
                <b-button style="text-align:flex-start;" variant="primary" id="btnConsultar2" @click="searchInfo()">{{
                    this.traduction.search
                }}</b-button>
            </b-row>
        </div>
        <hr class="my-4">
        <div v-if="showCollapse" class="main-area">
            <b-collapse :visible="lstItensRefer.length === 0 ? false : colap" id="collapse-1">
              <b-card class="alternateCard">
                    <b-col>
                        <b-row no-gutters>
                            <b-form-group class="form-group" v-bind:label="traduction.customer">
                                <v-select v-model="clienteSelected" label="name" :options="lstClientes">
                                    <template v-slot:no-options="{ search, searching }">
                                        <template v-if="searching">
                                            {{ traduction.noresultsfor }} <em>{{ search }}</em>.
                                        </template>
                                        <template v-else>
                                            {{ traduction.noresults }}
                                        </template>
                                    </template>
                                </v-select>
                                <!-- <Dropdown
                                 value="Todos da Seleção"
                                 class="dropdown"
                                 :options="lstClientes"
                                 v-on:selected="onClientSelect"
                                 :maxItem="1000"
                                 :disabled="spinner"
                                 name="dropCliente"
                                 :placeholder="traduction.choose" >
                               </Dropdown> -->
                            </b-form-group>
                            <b-form-group class="form-group" v-bind:label="traduction.ranking">
                                <v-select v-model="referSelected" label="name" :options="sourceViewRanking">
                                    <template v-slot:no-options="{ search, searching }">
                                        <template v-if="searching">
                                            {{ traduction.noresultsfor }} <em>{{ search }}</em>.
                                        </template>
                                        <template v-else>
                                            {{ traduction.noresults }}
                                        </template>
                                    </template>
                                </v-select>
                                <!-- <Dropdown
                                 class="dropdown"
                                 :options="sourceViewRanking"
                                 v-on:selected="onReferSelect"
                                 :maxItem="1000"
                                 :disabled="spinner"
                                 name="dropViewRanking"
                                 :placeholder="traduction.choose" >
                               </Dropdown> -->
                            </b-form-group>
                            <b-form-group v-bind:label="traduction.sortBy">
                                <v-select v-model="quantSelected" label="name" :options="sourceSortRanking">
                                    <template v-slot:no-options="{ search, searching }">
                                        <template v-if="searching">
                                            {{ traduction.noresultsfor }} <em>{{ search }}</em>.
                                        </template>
                                        <template v-else>
                                            {{ traduction.noresults }}
                                        </template>
                                    </template>
                                </v-select>
                                <!-- <Dropdown
                                 v-model="quantSelected"
                                 class="dropdown"
                                 :options="sourceSortRanking"
                                 v-on:selected="onQuantSelect"
                                 :maxItem="1000"
                                 :disabled="spinner"
                                 name="dropSortRanking"
                                 :placeholder="traduction.choose" >
                               </Dropdown> -->
                            </b-form-group>
                            <div class="button">
                                <b-button id="btnConsultar" class="" variant="primary" @click="onLoadOptions">{{
                                serverMessages['consulta'] }}</b-button>
                                <downloadPdf :items="lstTableRefSku"
                                    :campos="referSelected.id === 1 ? fieldsHeader : fieldsDownloadSku">
                                </downloadPdf>
                                <b-button class="btn-consultar"
                                    style="background:transparent !important; border: 1px solid #333 !important">

                                    <export-excel :title="this.json_meta" class="btnExcel" :data="lstTableRefSku"
                                        :fields="referSelected.id === 1 ? headerFields : downloadFieldsSku"
                                        :name="`mixProdutos.xls`" :footer="this.pdfBody">

                                        <img :src="require(`@/assets/excelicon.png`)">
                                    </export-excel>
                                </b-button>
                            </div>
                        </b-row>
                    </b-col>
                </b-card>
            </b-collapse>
        </div>
        <!-- <h3>{{ 10485760 | numeral('0b') }}</h3>
        <h3>{{ 200.425657 | numeral('$0,0.00') }}</h3>
        <h3>{{ 200.426767867 | vueNumeralFilterInstaller.currency }}</h3> -->
        <hr class="my-4">
        <div v-if="lstTableRefSku.length > 0" class="header-area2 headerMix">
            <span><b>{{`${serverMessages['relatorio.mixProduto.header.Consulta'].replace('.::', '').replace('::.', '')}
                        - ${clienteSelected.name} - ${radioMixOption} - ${traduction.rankingBy} : ${quantSelected.id === 1
            ? "Qtd." : "Valor"}`}}</b></span>
        </div>
        <div v-if="lstTableRefSku.length > 0" class="header-area headerMix2">
            <span><b>{{`${serverMessages['relatorioFaturar.equipeVendas']} : ${salesTeam.name} -
            ${serverMessages['relatorioFaturar.periodoDe']} -
            ${dateDe.split("-").reverse().join("-")}`}}</b></span>
        </div>
        <div class="table-wrapper" v-if="lstTableRefSku.length > 0">
            <b-table class="mixProdutosTable" style="min-height:50px; max-height:660px;" responsive hover small striped
                :items="lstTableRefSku" :fields="referSelected.id === 1 ? fieldsRef : fieldsSKU">

                <!-- A custom formatted column for Value-->
                <template v-if="quantSelected.id === 2" #cell(rnkV)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 2" #cell(vlr)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 2" #cell(particV)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 2" #cell(vlrAc)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 2" #cell(particAcV)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template #cell(curvaABCV)="data">
                    <div class="curva curva-colorA" v-if="data.value === 'A'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                    <div class="curva curva-colorB" v-if="data.value === 'B'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                    <div class="curva curva-colorC" v-if="data.value === 'C'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                </template>

                <!-- <template #cell(referencia)="data">
                    <span>{{ data.value }}</span>
                </template> -->

                <!-- A custom formatted column for Quant-->
                <template v-if="quantSelected.id === 1" #cell(rnkQ)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 1" #cell(qtd)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 1" #cell(particQ)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 1" #cell(qtdAc)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 1" #cell(particAcQ)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template #cell(curvaABCQ)="data">
                    <div class="curva curva-colorA" v-if="data.value === 'A'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                    <div class="curva curva-colorB" v-if="data.value === 'B'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                    <div class="curva curva-colorC" v-if="data.value === 'C'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                </template>
            </b-table>
        </div>
        <div v-if="lstTableRefSku.length > 0" class="header-area">
            <span><b>{{`${serverMessages['relatorioFaturar.equipeVendas']} : ${salesTeam.name} -
            ${serverMessages['relatorioFaturar.periodoDe']} -
            ${dateDe.substr(8, 2)}/${dateDe.substr(5, 2)}/${dateDe.substr(0, 4)} -
            ${dateAte.substr(8, 2)}/${dateAte.substr(5, 2)}/${dateAte.substr(0, 4)}`}}</b></span>
        </div>
        <div v-if="lstTableRefSku.length > 0" class="header-area2">
            <span><b>{{`ABC Clientes - ${radioMixOption} - ${traduction.rankingBy} ${quantSelected.id === 1 ? "Qtd." :
            "Valor"}`}} - % Copa B: Ref 25% a 30%</b></span>
        </div>
        <div v-if="lstClientesABC.length > 0">
            <b-table class="mixProdutosTable" style="min-height:50px; max-height:660px;" responsive hover striped
                :items="lstClientesABC" :fields="fieldsClientes" small="small">
                <!-- A custom formatted column for Value-->
                <template v-if="quantSelected.id === 2" #cell(rnkV)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 2" #cell(vlr)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 2" #cell(particV)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 2" #cell(vlrAc)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 2" #cell(particAcV)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template #cell(curvaABCV)="data">
                    <div class="curva curva-colorA" v-if="data.value === 'A'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                    <div class="curva curva-colorB" v-if="data.value === 'B'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                    <div class="curva curva-colorC" v-if="data.value === 'C'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                </template>
                <!-- A custom formatted column for Quant-->
                <template v-if="quantSelected.id === 1" #cell(rnkQ)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 1" #cell(qtd)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 1" #cell(particQ)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 1" #cell(qtdAc)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template v-if="quantSelected.id === 1" #cell(particAcQ)="data">
                    <b class="text-primary"> {{ data.value }}</b>
                </template>
                <template #cell(curvaABCQ)="data">
                    <div class="curva curva-colorA" v-if="data.value === 'A'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                    <div class="curva curva-colorB" v-if="data.value === 'B'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                    <div class="curva curva-colorC" v-if="data.value === 'C'">
                        <b class="text-white"> {{ data.value }}</b>
                    </div>
                </template>
                <template #cell(qtdCopaB)="data">
                    <b class="text-danger"> {{ data.value }}</b>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import SelecaoConsulta from '../consultas/SelecaoConsulta.vue'
import SelecaoLista from '../consultas/SelecaoLista.vue'
import PageTitle from '../template/PageTitle.vue'
import { baseApiUrl, showError } from '@/global'
//import { closeMenu } from '../../mixins/closeMenu.js'
import Spinner from '../template/Spinner.vue'
//import Dropdown from 'vue-simple-search-dropdown';
import { differenceInMonths } from 'date-fns'
import { map, filter, groupBy, reduce, each, sortBy, find } from 'underscore'
import axios from 'axios'
import numeral from 'numeral'
import vSelect from "vue-select";
import downloadPdf from '../commons/downloadPdf.vue'
export default {
    name: "MixProdutos",
    components: { SelecaoConsulta, PageTitle, SelecaoLista, Spinner, vSelect, downloadPdf },
    // mixins: [closeMenu],
    data: function () {
        return {
            json_meta: [],
            json_fields: {},
            json_data: [],
            pdfBody: [],
            lstEquipes: [],
            lstClientes: [],
            sourceViewRanking: [{ id: 1, name: "Referência" }, { id: 2, name: "SKU" }],
            sourceSortRanking: [{ id: 1, name: "Quantidade" }, { id: 2, name: "Valor" }],
            spinner: false,
            showCollapse: true,
            colap: false,
            lstItensSKU: [],
            lstItensRefer: [],
            lstItens: [],
            lstClientesABC: [],
            lstFit: [],
            lstFitSenseTrans: [],
            lstTableRefSku: [],
            clienteSelected: null,
            referSelected: {},
            quantSelected: {},
            mountFooter: false,
            fieldsObj: {},
            fieldsSKU: [
                { key: 'refComp', label: 'Ref. Completa', sortable: true },
                { key: 'marca', label: 'Marca', sortable: true },
                { key: 'ref', label: 'Ref.', sortable: true },
                { key: 'cor', label: 'Cor', sortable: true },
                { key: 't', label: 'Tam', sortable: true },
                { key: 'copa', label: 'Copa', sortable: true },
                { key: 'descricao', label: 'Descrição', sortable: true },
                { key: 'rnkV', label: '#Rnk', sortable: true },
                { key: 'vlr', label: 'Valor', sortable: true },
                { key: 'particV', label: '% Part.', sortable: true },
                { key: 'vlrAc', label: 'Valor Acumu', sortable: true },
                { key: 'particAcV', label: '% Part Ac.', sortable: true },
                { key: 'curvaABCV', label: ' Curva ABCV', sortable: true },
                { key: 'rnkQ', label: '#Rnk', sortable: true },
                { key: 'qtd', label: 'Quant.', sortable: true },
                { key: 'particQ', label: '% Part.', sortable: true },
                { key: 'qtdAc', label: 'Qtd.Ac', sortable: true },
                { key: 'particAcQ', label: '% Part Ac.', sortable: true },
                { key: 'curvaABCQ', label: 'Curva ABCQ', sortable: true },
            ],
            fieldsRef: [
                { key: 'referencia', label: 'Referência', sortable: true },
                { key: 'rnkV', label: '#Rnk', sortable: true },
                { key: 'vlr', label: 'Valor', sortable: true },
                { key: 'particV', label: '% Part.', sortable: true },
                { key: 'vlrAc', label: 'Valor Acumu', sortable: true },
                { key: 'particAcV', label: '% Part Ac.', sortable: true },
                { key: 'curvaABCV', label: '', sortable: true },
                { key: 'rnkQ', label: '#Rnk', sortable: true },
                { key: 'qtd', label: 'Quant.', sortable: true },
                { key: 'particQ', label: '% Part.', sortable: true },
                { key: 'qtdAc', label: 'Quant.Ac', sortable: true },
                { key: 'particAcQ', label: '% Part Ac.', sortable: true },
                //{key: 'refComp', label : 'Ref. Completa', sortable: true},
            ],
            fieldsClientes: [
                { key: 'nome', label: 'Clientes', sortable: true },
                { key: 'rnkV', label: '#Rnk', sortable: true },
                { key: 'vlr', label: 'Valor', sortable: true },
                { key: 'particV', label: '% Part.', sortable: true },
                { key: 'vlrAc', label: 'Valor Ac', sortable: true },
                { key: 'particAcV', label: '% Part Ac.', sortable: true },
                { key: 'curvaABCV', label: '', sortable: true },
                { key: 'rnkQ', label: '#Rnk', sortable: true },
                { key: 'qtd', label: 'Quant.', sortable: true },
                { key: 'particQ', label: '% Part.', sortable: true },
                { key: 'qtdAc', label: 'Qtd.Ac', sortable: true },
                { key: 'particAcQ', label: '% Part Ac.', sortable: true },
                { key: 'curvaABCQ', label: '', sortable: true },
                { key: 'qtdCopaB', label: '% Copa B', sortable: true },
            ],
            headerFields: {
                'Referencia': 'referencia',
                '#Rnk': 'rnkV',
                'Valor': 'vlr',
                'Part%%.': 'particV',
                'Valor Acumu': 'vlrAc',
                ' Part Ac. %': 'particAcV',
                'Curva': 'curvaABCV',
                'Rnk#': 'rnkQ',
                'Quant.': 'qtd',
                '% Part.': 'particQ',
                'Quant.Ac': 'qtdAc',
                'Part Ac %': 'particAcQ'
            },
            fieldsHeader: {
                'referencia': 'Referencia',
                'rnkV': '#Rnk',
                'vlr': 'Valor',
                'particV': 'Part%%.',
                'vlrAc': 'Valor Acumu',
                'particAcV': ' Part Ac. %',
                'curvaABCV': 'Curva',
                'rnkQ': 'Rnk#',
                'qtd': 'Quant.',
                'particQ': '% Part.',
                'qtdAc': 'Quant.Ac',
                'particAcQ': 'Part Ac %',
            },
            fieldsDownloadSku: {
                'marca': 'Marca',
                'ref': 'Ref.',
                'cor': 'Cor',
                't': 'Tam',
                'copa': 'Copa',
                'descricao': 'Descrição',
                'rnkV': '#Rnk',
                'vlr': 'Valor',
                'particV': '% Part.',
                'vlrAc': 'Valor Acumu',
                'particAcV': '% Part Ac.',
                'curvaABCV': ' Curva ABCV',
                'rnkQ': '#Rnk',
                'qtd': 'Quant.',
                'particQ': '% Part.',
                'qtdAc': 'Qtd.Ac',
                'particAcQ': '% Part Ac.',
                'curvaABCQ': 'Curva ABCQ',
            },
            downloadFieldsSku: {
                'Marca': 'marca',
                'Ref.': 'ref',
                'Cor': 'cor',
                'Tam': 't',
                'Copa': 'copa',
                'Descrição': 'descricao',
                '#Rnk': 'rnkV',
                'Valor': 'vlr',
                '% Part.': 'particV',
                'Valor Acumu': 'vlrAc',
                '% Part Ac.': 'particAcV',
                'Curva ABCV': 'curvaABCV',
                '#Rank': 'rnkQ',
                'Quant.': 'qtd',
                '% Parte.': 'particQ',
                'Qtd.Ac': 'qtdAc',
                '% Parte Ac.': 'particAcQ',
                'Curva ABCQ': 'curvaABCQ',
                'Ref. Completa': 'refComp',
            },
        }
    },
    computed: {
        ...mapState(["serverMessages", "language", "user", "traduction", "listClientesSel", "radioMixOption", "salesTeam", "dateDe", "dateAte", "replace", "isMenuVisible"])
    },
    watch: {
        clienteSelected: function () {
            this.lstTableRefSku = []
            this.lstClientesABC = []
        },
        quantSelected: function () {
            this.lstTableRefSku = []
            this.lstClientesABC = []
        },
        referSelected: function () {
            this.lstTableRefSku = []
            this.lstClientesABC = []
        }
    },
    beforeMount() {
        this.$store.commit('setShowOrNo', false)
    },
    mounted() {
        this.loadSalesTeam()
        this.clienteSelected = { id: "1", name: "Todos da seleção - Consolidado " }
        this.referSelected = { id: 1, name: "Referencia" }
        this.quantSelected = { id: 1, name: "Quantidade" }
        document.onreadystatechange = () => {
            if (document.readyState == "complete") {
                // console.log('Page completed with image and files!')
                // fetch to next page or some code
            }
        }

    },
    methods: {
        async searchInfo() {
            this.spinner = !this.spinner
            if (!this.salesTeam) {
                //console.log("Passei sales team ")
                showError("Por favor selecione uma equipe de vendas")
                this.showCollapse = false
                return
            }
            let result = differenceInMonths(new Date(this.dateAte), new Date(this.dateDe))
            if (result > 12) {
                showError(this.serverMessages["relatorioFaturamento.error.form.periodo.limit.12months"])
                this.showCollapse = false
                return
            }
            let clientsCode
            if (this.listClientesSel.length === 0 || this.listClientesSel === undefined || this.listClientesSel === null) {
                clientsCode = []
            } else {
                clientsCode = this.listClientesSel.map(el => {
                    return el.value.substr(0, 10)
                })
            }
            this.loadReportMixProduto(clientsCode)
            this.spinner = !this.spinner
        },
        async loadSalesTeam() {
            this.spinner = !this.spinner
           const url = `${baseApiUrl}/cliente/repmarca`
            await axios.post(url, {
                language: this.language,
                loginUsuario: this.user.loginUsuario
            }).then(resp => {
                console.log('resp', resp)

                this.lstEquipes = resp.data.representantes.map(ele => {
                    return {
                        id: ele.agenciaVendas,
                        agenciaDesc: ele.agenciaDesc,
                        name: `${ele.agenciaVendas} - ${ele.agenciaDesc}`
                    }
                })
                this.spinner = !this.spinner
            }).catch(() => {
                showError(this.traduction.internalError)
                this.spinner = !this.spinner
            })
            await axios.get(`${baseApiUrl}/produto/fitsense`)
                .then(resp => {

                    this.lstFit = resp.data.fitSense
                })
                .catch(() => {
                    this.spinner = !this.spinner
                    showError(this.traduction.internalError)

                })
        },
        loadReportMixProduto(clientes) {
            this.spinner = !this.spinner;
            this.lstTableRefSku = []
            this.lstClientesABC = []
            const url = `${baseApiUrl}/produto/getmix`
            axios.post(url, { pUsuario: this.user.loginUsuario, equipeVendaId: this.salesTeam.id, periodoDe: this.dateDe, periodoAte: this.dateAte, pFaturados: this.radioMixOption === 'Mix Faturados' ? "X" : "", language: "P", items: clientes })
                .then(resp => {
                    if (resp.data.result === "NOT FOUND") {
                        showError("Nenhum registro encontrado")
                        this.spinner = !this.spinner
                        return
                    }
                    let lista = resp.data.tOutputRefer.sort(function (a, b) {
                        if (a.name1 > b.name1) {
                            return 1
                        }
                        if (a.name1 < b.name1) {
                            return -1
                        }
                        return 0
                    }).map(el => {
                        return {
                            id: el.kunnr,
                            name: el.kunnr + ' - ' + el.name1
                        }
                    })
                    this.lstItensSKU = resp.data.tOutputProduto
                    this.lstItensRefer = resp.data.tOutputRefer
                    this.lstClientes = []
                    this.lstClientes.push({ id: "1", name: "Todos da seleção - Consolidado " })
                    const map = new Map();
                    for (const item of lista) {
                        if (!map.has(item.id)) {
                            map.set(item.id, true);    // set any value to Map
                            this.lstClientes.push({
                                id: item.id,
                                name: item.name
                            });
                        }
                    }
                    //this.$root.$emit('bv::toggle::collapse', 'collapse-1')
                    this.colap = true
                    this.spinner = false
                })
                .catch(() => {

                    this.spinner = !this.spinner
                    showError(this.traduction.internalError)

                })
        },
        onLoadOptions() {
            if (this.referSelected.id === 1) {
                if (this.clienteSelected.id === "1") {
                    this.lstItens = map(groupBy(this.lstItensRefer, (mxprod) => mxprod.referencia), (value, key) => { return { referencia: key, produtos: value }; });
                } else {
                    this.lstItens = map(groupBy(filter(this.lstItensRefer, (clt) => { return clt.kunnr === this.clienteSelected.id; }), (mxprod) => { return mxprod.referencia }), (value, key) => { return { referencia: key, produtos: value }; })
                }
            } else {
                if (this.clienteSelected.id === "1") {
                    this.lstItens = map(groupBy(this.lstItensSKU, (mxprod) => mxprod.matnr), (value, key) => { return { referencia: key, produtos: value }; });
                } else {
                    this.lstItens = map(groupBy(filter(this.lstItensSKU, (clt) => { return clt.kunnr === this.clienteSelected.id; }), (mxprod) => mxprod.matnr), (value, key) => { return { referencia: key, produtos: value }; })
                }
            }

            let lstByClient = map(groupBy(this.lstItensRefer, (mxprod) => { return mxprod.kunnr }), (value, key) => { return { codcliente: key, produtos: value }; })
            this.lstClientesABC = map(lstByClient, (itn) => {
                return {
                    codcliente: itn.codcliente,
                    nome: itn.produtos[0].name1,
                    rnkQ: 0,
                    particQ: 0,
                    particAcQ: 0,
                    curvaABCQ: '',
                    rnkV: 0,
                    particV: 0,
                    particAcV: 0,
                    curvaABCV: '',
                    vlrAc: 0,
                    qtdAc: 0,
                    qtd: reduce(itn.produtos, function (memo, num) { return memo + num.fkimg; }, 0),
                    vlr: reduce(itn.produtos, function (memo, num) { return memo + num.netwr; }, 0),
                    qtdCopaB: 0
                }

            });
            var ftsense = map(groupBy(this.lstItensSKU, (mxprod) => { return mxprod.kunnr }), (value, key) => { return { codcliente: key, produtos: value }; });
            this.lstFitSenseTrans = map(ftsense, (ft) => {
                return {
                    codcliente: ft.codcliente,
                    qtdSoutiens: reduce(ft.produtos, (memo, num) => { return memo + (this.lstFit.includes(num.matnr.substr(0, 7)) ? num.fkimg : 0) }, 0),
                    qtdCopaB: reduce(ft.produtos, (memo, num) => {
                        return memo + ((this.lstFit.includes(num.matnr.substr(0, 7)) && num.matnr.substr(13, 3) === "00B") ? num.fkimg : 0)
                    }, 0)
                };
            });
            this.lstTableRefSku = map(this.lstItens, (itn) => {
                return {
                    marca: itn.referencia.substr(0, 2),
                    ref: itn.referencia.substr(2, 5),
                    cor: itn.referencia.substr(7, 3),
                    t: itn.referencia.substr(10, 3),
                    copa: itn.referencia.substr(13, 3),
                    referencia: itn.referencia,
                    descricao: itn.produtos[0].maktx,
                    rnkQ: 0,
                    particQ: 0,
                    particAcQ: 0,
                    curvaABCQ: '',
                    refComp: itn.referencia,
                    rnkV: 0,
                    particV: 0,
                    particAcV: 0,
                    curvaABCV: '',
                    vlrAc: 0,
                    qtdAc: 0,
                    qtd: reduce(itn.produtos, (memo, num) => { return memo + num.fkimg; }, 0),
                    vlr: reduce(itn.produtos, (memo, num) => { return memo + num.netwr; }, 0)
                }
            });
            //processa ABC Produtos/Skus
            let rankingpos = 1;
            let qtdtotal = reduce(this.lstTableRefSku, (memo, num) => { return memo + num.qtd }, 0);
            let vlrtotal = reduce(this.lstTableRefSku, (memo, num) => { return memo + num.vlr }, 0);
            let particAnterior = 0;
            let vlrqtdAnterior = 0;
            each(sortBy(this.lstTableRefSku, (itm) => { return itm.qtd * -1 }), (it) => {
                var calcPartQtd = it.qtd / qtdtotal
                var calcPartAcu = calcPartQtd + particAnterior
                it.rnkQ = rankingpos;
                it.particQ = numeral(calcPartQtd).format('0.00%')
                it.particAcQ = numeral(calcPartAcu).format('0.00%')
                it.qtdAc = it.qtd + vlrqtdAnterior;
                it.curvaABCQ = this.getCurva(calcPartAcu * 100),
                particAnterior = calcPartAcu;
                vlrqtdAnterior = it.qtdAc;
                rankingpos += 1;
            });
            rankingpos = 1;
            particAnterior = 0;
            vlrqtdAnterior = 0;
            each(sortBy(this.lstTableRefSku, (itm) => { return itm.vlr * -1 }), (it) => {
                var calcPartVal = it.vlr / vlrtotal
                var calcPartValAc = calcPartVal + particAnterior
                var calcValor = it.vlr + vlrqtdAnterior
                it.vlr = numeral(it.vlr).format('$0,0.00')
                it.rnkV = rankingpos;
                it.particV = numeral(calcPartVal).format('0.00%')
                it.particAcV = numeral(calcPartValAc).format('0.00%')
                it.vlrAc = numeral(calcValor).format('$0,0.00')
                it.curvaABCV = this.getCurva(calcPartValAc * 100),
                particAnterior = calcPartValAc;
                vlrqtdAnterior = calcValor;
                rankingpos += 1;

                // it.rnkV = rankingpos;
                // it.particV = it.vlr / vlrtotal;
                // it.particAcV = it.particV + particAnterior;
                // it.vlrAc = it.vlr + vlrqtdAnterior;
                // it.curvaABCV = this.getCurva(it.particAcV),
                // particAnterior = it.particAcV;
                // vlrqtdAnterior = it.vlrAc;
                // rankingpos += 1;
            });
            if (this.quantSelected.id === 1) {
                this.lstTableRefSku = sortBy(this.lstTableRefSku, (itn) => { return itn.rnkQ })
            } else {
                this.lstTableRefSku = sortBy(this.lstTableRefSku, (itn) => { return itn.rnkV })
            }
            //Processa ABC Clientes
            rankingpos = 1;
            qtdtotal = reduce(this.lstClientesABC, (memo, num) => { return memo + num.qtd }, 0);
            vlrtotal = reduce(this.lstClientesABC, (memo, num) => { return memo + num.vlr }, 0);
            particAnterior = 0;
            vlrqtdAnterior = 0;
            each(sortBy(this.lstClientesABC, (itm) => { return -itm.qtd; }), (it) => {
                var calcPartQtd = it.qtd / qtdtotal
                var calcPartAcu = calcPartQtd + particAnterior

                it.rnkQ = rankingpos;
                it.particQ = numeral(calcPartQtd).format('0.00%')
                it.particAcQ = numeral(calcPartAcu).format('0.00%')
                it.qtdAc = it.qtd + vlrqtdAnterior;
                it.curvaABCQ = this.getCurva(calcPartAcu * 100),
                    particAnterior = calcPartAcu;
                vlrqtdAnterior = it.qtdAc;
                rankingpos += 1;
            });

            rankingpos = 1;
            particAnterior = 0;
            vlrqtdAnterior = 0;
            each(sortBy(this.lstClientesABC, (itm) => { return -itm.vlr; }), (it) => {
                var calcPartVal = it.vlr / vlrtotal
                var calcPartValAc = calcPartVal + particAnterior
                var calcValor = it.vlr + vlrqtdAnterior
                let ft = find(this.lstFitSenseTrans, (ft) => { return ft.codcliente === it.codcliente })
                it.qtdCopaB = numeral((ft.qtdCopaB / ft.qtdSoutiens)).format('0.00%')

                it.vlr = numeral(it.vlr).format('$0,0.00')
                it.rnkV = rankingpos;
                it.particV = numeral(calcPartVal).format('0.00%')
                it.particAcV = numeral(calcPartValAc).format('0.00%')
                it.vlrAc = numeral(calcValor).format('$0,0.00')
                it.curvaABCV = this.getCurva(calcPartValAc * 100),
                    particAnterior = calcPartValAc;
                vlrqtdAnterior = calcValor;
                rankingpos += 1;

                // it.rnkV = rankingpos;
                // it.particV = it.vlr / vlrtotal;
                // it.particAcV = it.particV + particAnterior;
                // it.vlrAc = it.vlr + vlrqtdAnterior;
                // it.curvaABCV = this.getCurva(it.particAcV),
                // particAnterior = it.particAcV;
                // vlrqtdAnterior = it.vlrAc;
                // rankingpos += 1;
            });

            this.lstClientesABC = sortBy(this.lstClientesABC, 'vlr')
            this.$nextTick(function () {
                this.excelDownload()
            })
        },
        getCurva(percentual) {
            if (percentual < 81) {
                return 'A'
            } else if (percentual >= 81 && percentual < 96) {
                return 'B'
            } else {
                return 'C'
            }
        },

        excelDownload() {
            this.json_meta = [];
            let dataAte = `${this.serverMessages['relatorioFaturar.equipeVendas']} : ${this.salesTeam.name} - ${this.serverMessages['relatorioFaturar.periodoDe']} - ${this.dateDe.split("/").reverse().join("/")} - ${this.dateAte.split("/").reverse().join("/")}`
            let infoMsg = `${this.serverMessages['relatorio.mixProduto.header.Consulta'].replace('.::', '').replace('::.', '')} - ${this.clienteSelected.name} -  ${this.radioMixOption} - ${this.traduction.rankingBy} : ${this.quantSelected.id === 1 ? "Qtd." : "Valor"}`
            this.json_meta.push(`${this.salesTeam.name}`)
            this.json_meta.push(dataAte)
            this.json_meta.push(infoMsg)
            this.json_meta.push(this.user.userName ? this.user.userName : this.clienteSelected.name);
            this.pdfBody = []
            try {
                let tabelatest = this.$el.querySelectorAll('table');
                //console.log(tabelatest)
                this.pdfBody.push(`\n<p style="text-align:center;"><b>ABC Clientes - ${this.radioMixOption} - ${this.traduction.rankingBy} ${this.quantSelected.id === 1 ? "Qtd." : "Valor"} - % Copa B: Ref 25% a 30% </b></p>`)
                this.pdfBody.push(tabelatest[1].innerHTML);

            } catch (err) {
                console.log(err)
            }
            //        this.pdfBody = []

            //        this.pdfBody.push(`<table><tr>`)
            //         this.fieldsRef.forEach(el => {this.pdfBody.push(`<th>${el.key}</th>`)})
            //         this.pdfBody.push(`</tr>`)
            //        this.lstClientesABC.forEach((el) => {
            //         console.log(Object.keys(el), Object.values(el))

            //         this.pdfBody.push(`<td>${el.codcliente}</td><td>${el.rnkQ}</td><td>${el.vlr}</td><td>${el.rnkV}</td><td>${el.particAcQ}</td>${el.particV}<td>${el.qtdCopaB}</td><td>${el.qtd}</td><td>${el.qtdAc}</td>`)

            //        this.pdfBody.push(`</tr>`)

            //        })

            //  this.pdfBody.push('</table>')
            this.json_fields = this.headerFields
            return

        }
    },
    beforeUpdate() {
        // if (this.listClientesSel.length === 0 ){
        //     this.lstTableRefSku = []
        //     this.lstClientesABC = []
        //     this.colap = false
        // }
    },
    //updated(){if(this.lstTableRefSku.length > 0){this.excelDownload()}},
    beforeDestroy() {
        this.$store.commit('setCustomers', [])
        this.$store.commit('setCustomersSel', [])
        this.$store.commit('setRadioOption', null)
        this.$store.commit('setChooseSalesTeam', null)
    }
}
</script>

<style lang="scss" scoped>
.filter-area {

    margin-top: 5px;
}
.list-area {
    margin-top: 5px;

}
.button-area {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 15px;
}
.button-area>button {
    margin-left: 5px;
}
.filter-area {
    margin-top: 10px;
    padding: 5px;
}
.form-group {
    margin-right: 5px;
}
.button {
    display: flex;
    align-items: center;
}
.button>button {
    margin-top: 12px;
    margin-right: 9px;
}
.export-options {
    margin-right: 10px;
    border: solid 1px;
}
.export-options:hover {
    box-shadow: 0 0.5em 0.5em -0.4em;
}
.curva {
    display: flex;
    justify-content: center;
    border-radius: 5px;
}

.curva-colorA {
    background-color: rgb(42, 42, 184)
}

.curva-colorB {
    background-color: rgb(135, 135, 228)
}

.curva-colorC {
    background-color: rgb(221, 167, 67)
}

.vs__selected-options {
    flex-wrap: nowrap;
    max-width: calc(100% - 41px);
}

.vs__selected {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    overflow: hidden;
}

/* .vs__search {
  position: absolute;
} */
.vs--open .vs__search {
    position: static;
}

.vs__dropdown-option {
    white-space: normal;
}

.mixProdutosTable {
    background-color: white;
    border: 1px solid black;
}

.mixProdutosTable>table>thead {
    background-color: black;
    color: white;
}

.headerMix {
    padding: 10px 0px;
    background: black !important;
    color: white;
}

.headerMix2 {
    padding: 10px 0px;
    background-color: #e58b2a !important;
    color: black !important;
}
.btnArea {
    justify-content: flex-start;
}
.card-body {
    width: 100%;
    min-height: 10px !important;
}
.vs__clear {
    margin: 0;
}
@media(max-width:767px) {
    .card-body {
        max-width: 550px;
    }

    .main-area {
        flex-direction: column;
    }

    .button-areaMix {
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
    }
}

div.vs__actions {
    padding: 0;
}

.button-areaMix {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
}
</style>
