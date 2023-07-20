<template>
  <div>
    <div>
      <PageTitle
        icon="fa fa-list-ul "
        :main="serverMessages['relatorioCobranca.header.relatorio']"
      ></PageTitle>
    </div>
    <div class="main">
      <b-container fluid no-gutters class="p-0">
        <Spinner :state="spinner"></Spinner>
        <b-row class="principal">
          <SelecaoConsulta
            class="list-area card-bodySmall"
            :mesesPeriodo="1"
            :showOptionsCob="true"
          ></SelecaoConsulta>

          <SelecaoLista
            :title="serverMessages['relatorioFaturar.clientes']"
            class="card-bodySmall"
            :titlesel="
              serverMessages['relatorioFaturar.clientes'] + traduction.selection
            "
          ></SelecaoLista>
        </b-row>
      </b-container>
    </div>
    <hr class="my-4" />
    <div class="button-area">
      <!-- <b-button @click="excelDownload()">teste</b-button> 
      <excelExportVue :data="lstCobrancaItem" :table="lstCobAgrup"></excelExportVue> -->
      <b-button
        id="btnConsultar"
        class="btn-control btn-consultars"
        variant="primary"
        @click="search()"
        >{{ traduction.search }}</b-button
      >
      <div class="button">
        <downloadPdf :items="this.lstCobrancaItem" :campos="headerFields">
        </downloadPdf>
        <b-button
          class="export-options"
          variant="outline-secondary"
         
        >
        
          <export-excel
            class="btnExcel"
            :data="lstCobrancaItem"
            :fields="fieldsHeader"
            :footer="json_header"
            :title="json_meta"
            :name="`relatorioCobranca.xls`"
           
          >
            <img :src="require(`@/assets/excelicon.png`)" />
          </export-excel>
        </b-button>
      </div>
    </div>
    <hr class="my-4" />
    

    <table id="tableLoad" class="tableLoad" v-show="false">

      <div v-for="(e, acc) in this.lstCobAgrup" :key="acc">
          <thead >
            <tr style="background:black; color:white;">

<th colspan="3" class="styleOrange">Cliente: </th>
<th colspan="3" class="styleBlack"> {{ e.clienteDesc }} </th>
</tr>
            <tr>

              <th colspan="3" class="styleBlack">Limite de Crédito Total: </th>
              <th colspan="3" class="styleOrange"> {{ e.limCredDisp }} </th>
           
            <th colspan="3" class="styleBlack">Limite Total Disponível: </th>
              <th colspan="3" class="styleOrange"> {{ e.limCredDisp }} </th>
              </tr>

              <tr>
              <th colspan="3" class="styleBlack">Valor de Juros de Pagamento: </th>
              <th colspan="3" class="styleOrange"> {{ e.vlrJuros }} </th>
              <th colspan="3" class="styleBlack">Valor Total à Vencer: </th>
              <th colspan="3" class="styleOrange">{{ e.vlrVencer }}</th>
            </tr>
            <tr>
              <th colspan="3" class="styleBlack">Prazo médio de Pagamento: </th>
              <th colspan="3" class="styleOrange">{{ e.prazoMedio }}</th>
              <th colspan="3" class="styleBlack">Valor Total Vencido: </th>
              <th colspan="3" class="styleOrange">{{ e.vlrVencido }}</th>
              
            </tr>
            <tr>
            <th colspan="3" class="styleBlack">Média de atraso de pagamento: </th>
              <th colspan="3" class="styleOrange">{{ e.atrasoMedio }}</th>
              <th colspan="3" class="styleBlack">Valor Duplicatas em Aberto: </th>
              <th colspan="3" class="styleOrange">{{ e.vlrDupAberto }}</th>
              
            </tr>



          </thead>

          <tr>
                  <th class="styleBlack" v-for="(ele, acc) in fields" :key="acc"><b>{{ ele.label }}</b></th>
              </tr>

         
          <!-- <th style="background:black; color:white;"> Nota Fiscal </th>
            <th style="background:black; color:white;"> Nº Parcela </th>
            <th style="background:black; color:white;"> Nº Ordem </th>
            <th style="background:black; color:white;"> Valor </th>
            <th style="background:black; color:white;"> Dt. Emiss. </th>
            <th style="background:black; color:white;"> Dt. Vcto. </th>
            <th style="background:black; color:white;"> Banco </th>
            <th style="background:black; color:white;"> Nome Banco </th>
            <th style="background:black; color:white;">Dt. Pagto</th>
            <th style="background:black; color:white;"> Obs.</th>
            <th style="background:black; color:white;"> Status </th> -->
     
          <tbody v-for="(el, acc) in e.arrayItens" :key="acc">
            

              <tr v-if="e.cliente === el.cliente">
                  <td v-for="(ele, acc) in el" :key="acc">{{ ele }}</td>
              </tr>

              <!-- <tr v-if="e.arrayItens.length > 0">
                <td v-for="(i, acc) in e.arrayItens" :key="acc"> {{ i }}</td>



            </tr> -->


          </tbody>
          <br>
        </div>
        </table>



    <div v-if="lstCobranca.length > 0" class="header-area">
      <span
        ><b>{{ `${serverMessages["relatorioCobranca.header"]}` }}</b></span
      >
    </div>
    <div v-if="lstCobranca.length > 0">
      <div
        v-for="value in lstCobAgrup"
        v-bind:key="value.cliente"
        class="border border-dark listaCob"
      >
        <label style="padding: 10px 0px" for=""
          ><b>{{ serverMessages["relatorioFaturar.table.cliente"] }}:</b
          >{{ `${value.cliente} - ${value.clienteDesc}` }}</label
        >
        <b-container style="margin: 15px auto" class="rowDl">
          <b-row cols="12">
            <b-col>
              <b-row>
                
                <span>  <b-form-group
                  style="font-weight: 600"
                  :label="`${serverMessages['relatorioCobranca.lmtCreditoTotal']} :`"
                  label-size="sm"
                ></b-form-group>
                </span>
                <b-form-group
                  :label="`${value.limCredTot}`"
                  label-size="sm"
                ></b-form-group>
              </b-row>
              <b-row>
                <b-form-group
                  style="font-weight: 600"
                  :label="`${serverMessages['relatorioCobranca.lmtCreditoDisponivel']} :`"
                  label-size="sm"
                ></b-form-group>
                <b-form-group
                  :label="`${value.limCredDisp}`"
                  label-size="sm"
                ></b-form-group>
              </b-row>
              <b-row>
                <b-form-group
                  style="font-weight: 600"
                  :label="`${serverMessages['relatorioCobranca.vrJurosAberto']} :`"
                  label-size="sm"
                ></b-form-group>
                <b-form-group
                  :label="`${value.vlrJuros}`"
                  label-size="sm"
                ></b-form-group>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-form-group
                  style="font-weight: 600"
                  :label="`${serverMessages['relatorioCobranca.prazoPagamento']} :`"
                  label-size="sm"
                ></b-form-group>
                <b-form-group
                  :label="`${value.prazoMedio}`"
                  label-size="sm"
                ></b-form-group>
              </b-row>
              <b-row>
                <b-form-group
                  style="font-weight: 600"
                  :label="`${serverMessages['relatorioCobranca.atrasoPagamento']} :`"
                  label-size="sm"
                ></b-form-group>
                <b-form-group
                  :label="`${value.atrasoMedio}`"
                  label-size="sm"
                ></b-form-group>
              </b-row>
              <b-row>
                <b-form-group
                  style="font-weight: 600"
                  label="Valor Total Pago:"
                  label-size="sm"
                ></b-form-group>
                <b-form-group
                  :label="`${value.vlrDupPagas}`"
                  label-size="sm"
                ></b-form-group>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-form-group
                  style="font-weight: 600"
                  :label="`${serverMessages['relatorioCobranca.vrVencer']}: `"
                  label-size="sm"
                ></b-form-group>
                <b-form-group
                  :label="`${value.vlrVencer}`"
                  label-size="sm"
                ></b-form-group>
              </b-row>
              <b-row>
                <b-form-group
                  style="font-weight: 600"
                  :label="`${serverMessages['relatorioCobranca.vrVencido']}: `"
                  label-size="sm"
                ></b-form-group>
                <b-form-group
                  :label="`${value.vlrVencido}`"
                  label-size="sm"
                ></b-form-group>
              </b-row>
              <b-row>
                <b-form-group
                  style="font-weight: 600"
                  :label="`${serverMessages['relatorioCobranca.vrDuplicadas']}: `"
                  label-size="sm"
                ></b-form-group>
                <b-form-group
                  :label="`${value.vlrDupAberto}`"
                  label-size="sm"
                ></b-form-group>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
        <b-table
          class="bTableContainer"
          v-show="value.arrayItens.length > 0"
          responsive
          hover
          striped
         
          :items="value.arrayItens"
          :fields="fields"
          small="small"
        >
          <template #head(notaFiscal)>
            <span>{{
              serverMessages["relatorioCobranca.itens.notaFiscal"]
            }}</span>
          </template>
          <template #head(parcela)>
            <span>{{
              serverMessages["relatorioCobranca.itens.nParcela"]
            }}</span>
          </template>
          <template #head(ordem)>
            <span>{{ serverMessages["relatorioCobranca.itens.nOrdem"] }}</span>
          </template>
          <template #head(valor)>
            <span>{{ serverMessages["relatorioCobranca.itens.valor"] }}</span>
          </template>
          <template #head(dtEmissao)>
            <span>{{ serverMessages["relatorioCobranca.itens.dtEmis"] }}</span>
          </template>
          <template #head(dtVcto)>
            <span>{{ serverMessages["relatorioCobranca.itens.dtVcto"] }}</span>
          </template>
          <template #head(banco)>
            <span>{{ serverMessages["relatorioCobranca.itens.banco"] }}</span>
          </template>
          <template #head(bancoDesc)>
            <span>{{
              serverMessages["relatorioCobranca.itens.banco.nome"]
            }}</span>
          </template>
          <template #head(dtCompensacao)>
            <span>{{
              serverMessages["relatorioCobranca.itens.dataPagamento"]
            }}</span>
          </template>
          <template #head(observacao)>
            <span>{{
              serverMessages["relatorioCobranca.itens.observacao"]
            }}</span>
          </template>
          <template #head(status)>
            <span>{{ serverMessages["relatorioCobranca.itens.status"] }}</span>
          </template>
          <template #cell(dtCompensacao)="data">
            <span v-if="data.value !== '0000-00-00'">{{ data.value }}</span>
          </template>
          <template #cell(status)="data">
            <div
              v-if="
                data.value === '0' && data.item.dtCompensacao === '0000-00-00'
              "
            >
              <img
                style="display: block; margin: 0 auto"
                src="../../assets/ball-red.png"
                title="Título Vencido"
              />
            </div>
            <div
              v-if="
                data.value === '0' && data.item.dtCompensacao !== '0000-00-00'
              "
            >
              <img
                style="display: block; margin: 0 auto"
                src="../../assets/ball-green.png"
                title="Título Pago"
              />
            </div>
            <div
              v-if="
                data.value !== '0' && data.item.dtCompensacao === '0000-00-00'
              "
            >
              <img
                style="display: block; margin: 0 auto"
                src="../../assets/ball-yellow.png"
                title="Título a Vencer"
              />
            </div>
            <div
              v-if="
                data.value !== '0' && data.item.dtCompensacao !== '0000-00-00'
              "
            >
              <img
                style="display: block; margin: 0 auto"
                src="../../assets/ball-green.png"
                title="Título Pago"
              />
            </div>
          
          </template>

            <template #cell(dtEmissao)="data">
                 {{ data.item.dtEmissao.replace(/[,.-]/gmi, "") }}

            </template>
          
        </b-table>
        <div v-if="lstCobranca.length > 0" class="totais-header">
          <span v-if="checkHistorico === 'X'"
            ><b>{{
              `${traduction.totalSelected} - ${dateDe.substr(
                8,
                2
              )}/${dateDe.substr(5, 2)}/${dateDe.substr(
                0,
                4
              )} - ${dateAte.substr(8, 2)}/${dateAte.substr(
                5,
                2
              )}/${dateAte.substr(0, 4)}`
            }}</b></span
          >
          <span v-else
            ><b>{{ traduction.totalTitleSelected }}</b></span
          >
        </div>
        <div class="totais-area">
          <div>
            <b
              ><b-form-group
                :label="serverMessages['relatorioCobranca.vrVencido']"
                label-size="sm"
              ></b-form-group
            ></b>
            <b-form-group
              :label="value.valorTotalVencido"
              label-size="sm"
            ></b-form-group>
          </div>
          <div>
            <b
              ><b-form-group
                :label="serverMessages['relatorioCobranca.vrVencer']"
                label-size="sm"
              ></b-form-group
            ></b>
            <b-form-group
              :label="value.valorTotalVencer"
              label-size="sm"
            ></b-form-group>
          </div>
          <div>
            <b
              ><b-form-group
                :label="traduction.totalBilled"
                label-size="sm"
              ></b-form-group
            ></b>
            <b-form-group
              :label="value.valorTotalPago"
              label-size="sm"
            ></b-form-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SelecaoConsulta from "../consultas/SelecaoConsulta.vue";
import SelecaoLista from "../consultas/SelecaoLista.vue";
import PageTitle from "../template/PageTitle.vue";
import { baseApiUrl, showError } from "@/global";
import Spinner from "../template/Spinner.vue";
import axios from "axios";
import numeral from "numeral";
import { map, filter, find, reduce } from "underscore";
import { format, parseISO, differenceInMonths } from "date-fns";
import downloadPdf from "../commons/downloadPdf";
import * as XLSX from 'xlsx';

export default {
  name: "RelatorioCobranca",
  components: {
    SelecaoConsulta,
    SelecaoLista,
    PageTitle,
    Spinner,
    downloadPdf,
    
    
  },
  computed: {
    ...mapState([
      "serverMessages",
      "language",
      "user",
      "traduction",
      "listClientesSel",
      "dateDe",
      "dateAte",
      "checkHistorico",
      "checkDupVencidas",
      "isMenuVisible",
    ]),
  },
  data: function () {
    return {
      spinner: false,
      lstClientes: [],
      lstCobranca: [],
      lstCobrancaItem: [],
      lstHeaderDet: [],
      lstCobAgrup: [],
      json_body: [],
      json_meta: [],
      json_header: [],
      fields: [
      { key: "banco", label: 'Banco', sortable: true },
      { key: "bancoDesc",  label: '', sortable: true },
      {key: 'cliente', label: 'Cliente', sortable: true },
      { key: "dtCompensacao", label: 'Data Comp', sortable: true },
      { key: "dtEmissao", label: 'Data Emissão', sortable: true },
      { key: "dtVcto",  label: 'Data Vencimento', sortable: true },
       {key: 'duplicata', label: '', sortable: true},
       {key: 'motivo', label: '', sortable: true},
        { key: "notaFiscal", label: 'Nota Fiscal', sortable: true },
        { key: 'observacao', label: 'Observacao', sortable: true},
        { key: "ordem",  label: 'Ordem', sortable: true },
        { key: "parcela",  label: 'Parcela', sortable: true },
        { key: "protestada",  label: '', sortable: true },
        { key: "status", label: 'Status', sortable:true },
        { key: "valor",  label: 'Valor', sortable: true },
        {key: 'valorOriginal', label: '', sortable: true}
        
        
        
      ],
      fieldsHeader:{ 
       'Nota': "notaFiscal", 
        'Parcela': "parcela", 
         'Ordem': "ordem", 
         "Preço Lista": "valor", 
         "Dt Emissao": "dtEmissao", 
         "Dt. Emissao": "dtVcto", 
         'Banco': "banco", 
         "Nome Banco": "bancoDesc", 
         "Data Pag" : "dtCompensacao", 
         'Obs' : "observacao", 
         'Statuses': "statuses", 
      },
      headerFields: {
        notaFiscal: "Nota",
        parcela: "Parcela",
        ordem: "Ordem",
        valor: "Preço Lista",
        dtEmissao: "Dt Emissao",
        dtVcto: "Dt Emissao",
        banco: "Banco",
        bancoDesc: "Nome Banco",
        dtCompensacao: "Data Pag",
        observacao: "Obs",
        status: "Status",
      },
    };
  },
  methods: {
    loadCustomers() {
      // this.$store.commit('setDataDe',this.dataDe)
      // this.$store.commit('setDataAte',this.dataAte)
      this.spinner = true;
      this.$store.commit("setShowOrNo", true);
      const url = `${baseApiUrl}/cliente/repclientes`;
      axios
        .post(url, {
          language: this.language,
          loginUsuario: this.user.loginUsuario,
          codrep: "",
        })
        .then((resp) => {
          this.spinner = false;
          this.lstClientes = resp.data.clientes.map((ele) => {
            return `${ele.id} - ${ele.nome}`;
          });
          this.$store.commit("setCustomers", this.lstClientes);
          this.$store.commit("setShowOrNo", false);
        })
        .catch(() => {
          showError(this.traduction.internalError);
        });
    },
    async search() {
      let clientsCode = [];
      if (
        this.listClientesSel.length === 0 ||
        this.listClientesSel === undefined ||
        this.listClientesSel === null
      ) {
        clientsCode = [];
      } else {
        clientsCode = this.listClientesSel.map((el) => {
          return {
            High: "",
            Low: el.value.substr(0, 10),
            Sign: "I",
            Opti: "EQ",
          };
        });
      }

      let result = differenceInMonths(
        new Date(this.dateAte),
        new Date(this.dateDe)
      );

      if (result > 12) {
        showError(this.serverMessages["relatorioCobranca.form.periodo.limit"]);
        return;
      }
      if (this.listClientesSel.length > 20) {
        showError(
          this.serverMessages["relatorioCobranca.form.emissor.limit.max"]
        );
        return;
      }
      let url = `${baseApiUrl}/cliente/getrelatoriocob`;
      this.spinner = true;
      await axios
        .post(url, {
          PAte: this.checkHistorico === "X" ? this.dateAte : "",
          PDe: this.checkHistorico === "X" ? this.dateDe : "",
          PFlagHist: this.checkHistorico === "X" ? "X" : "",
          PFlagVencido: this.checkDupVencidas === "X" ? "X" : "",
          Puser: this.user.loginUsuario,
          TInpCliente: clientsCode,
        })
        .then((resp) => {
          this.lstCobranca = resp.data.relatorioCobranca.tOutHeader;
          this.lstCobrancaItem = resp.data.relatorioCobranca.tOutItem.map(
            (el) => {
              return {
                banco: el.banco,
                bancoDes: el.bancoDesc,
                cliente: el.cliente,
                dtCompensacao:
                  el.dtCompensacao !== "0000-00-00"
                    ? format(parseISO(el.dtCompensacao), "dd-MM-yyyy")
                    : el.dtCompensacao,
                dtEmissao: format(parseISO(el.dtEmissao), "dd-MM-yyyy"),
                dtVcto: format(parseISO(el.dtVcto), "dd-MM-yyyy"),
                duplicata: el.duplicata,
                motivo: el.motivo,
                notaFiscal: el.notaFiscal,
                observacao: el.observacao,
                ordem: el.ordem,
                parcela: el.parcela,
                protestada: el.protestada,
                status: el.status,
                valor: numeral(el.valor).format("$0,0.00"),
                valorOriginal: el.valor,
              };
            }
          );
          //console.log(resp.data.relatorioCobranca.tOutHeader)
        })
        .catch(() => {
          showError(this.traduction.internalError);
          this.spinner = false;
        });

      url = `${baseApiUrl}/cliente/getposicaofinanceira`;

      await axios
        .post(url, {
          Puser: this.user.loginUsuario,
          Moeda: "BRL",
          TInpCliente: clientsCode,
        })
        .then((resp) => {
          this.lstHeaderDet = resp.data.posicaoFinanceira.tOutHeaderDet;
          //console.log(this.lstHeaderDet)
          this.spinner = false;
        })
        .catch((err) => {
          showError(err);
          this.spinner = false;
        });

      if (this.lstCobranca.length === 0) {
        showError(this.traduction.noresults);
        this.spinner = false;
        return;
      }

      //console.log("estou aquii")
      this.lstCobranca = this.lstCobranca.map((el) => {
        return {
          limCredDisp: numeral(
            find(this.lstHeaderDet, (e) => e.parceiro === el.cliente)[
              "klimgDis"
            ]
          ).format("$0,0.00"),
          limCredTot: numeral(el.limCredTot).format("$0,0.00"),
          prazoMedio: el.prazoMedio,
          vlrDupAberto: numeral(
            find(this.lstHeaderDet, (e) => e.parceiro === el.cliente)[
              "valortot"
            ]
          ).format("$0,0.00"),
          vlrDupPagas: numeral(el.vlrDupPagas).format("$0,0.00"),
          //vlrTotal: numeral(find(resp.data.posicaoFinanceira.tOutHeaderDet,e => e.parceiro === el.cliente)['valortot']).format('$0,0.00'),
          vlrJuros: numeral(el.vlrJuros).format("$0,0.00"),
          vlrVencer: numeral(
            find(this.lstHeaderDet, (e) => e.parceiro === el.cliente)[
              "vltotVencer"
            ]
          ).format("$0,0.00"),
          vlrVencido: numeral(
            find(this.lstHeaderDet, (e) => e.parceiro === el.cliente)[
              "vltotVencido"
            ]
          ).format("$0,0.00"),
          atrasoMedio: el.atrasoMedio,
          cliente: el.cliente,
          clienteDesc: el.clienteDesc,
          valorTotalVencido: numeral(
            reduce(
              filter(this.lstCobrancaItem, (e) => {
                return (
                  e.cliente === el.cliente &&
                  e.status === "0" &&
                  e.dtCompensacao === "0000-00-00"
                );
              }),
              (vlant, curr) => {
                return vlant + curr.valorOriginal;
              },
              0
            )
          ).format("$0,0.00"),
          valorTotalPago: numeral(
            reduce(
              filter(this.lstCobrancaItem, (e) => {
                return (
                  e.cliente === el.cliente &&
                  ((e.status === "0" && e.dtCompensacao !== "0000-00-00") ||
                    (e.status !== "0" && e.dtCompensacao !== "0000-00-00"))
                );
              }),
              (vlant, curr) => {
                return vlant + curr.valorOriginal;
              },
              0
            )
          ).format("$0,0.00"),
          valorTotalVencer: numeral(
            reduce(
              filter(this.lstCobrancaItem, (e) => {
                return (
                  e.cliente === el.cliente &&
                  e.status !== "0" &&
                  e.dtCompensacao === "0000-00-00"
                );
              }),
              (vlant, curr) => {
                return vlant + curr.valorOriginal;
              },
              0
            )
          ).format("$0,0.00"),
        };
      });
      //console.log(this.lstCobranca)
      this.lstCobAgrup = map(this.lstCobranca, (el) => {
        return {
          ...el,
          arrayItens: filter(this.lstCobrancaItem, (e) => {
            return e.cliente === el.cliente;
          }),
        };
      });
      this.spinner = false;
      this.sortPdf();
    },
    excelDownload() {
       
      this.json_body = document.getElementById('tableLoad');
      console.log(XLSX)
        console.log(this.json_body)
        
        var workbook = XLSX.utils.table_to_book(this.json_body);

// Process Data (add a new row)
var ws = workbook.Sheets["Relatório Cobrança"];
XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1});

// Package and Release Data (`writeFile` tries to write and save an XLSB file)
XLSX.writeFile(workbook, "RelatorioCobranca.xlsx");
      
    //  var wb = XLSX.utils.book_new()
      
      // this.json_body.forEach((e) => {
          
      //      XLSX.utils.book_append_sheet(wb,  XLSX.utils.table_to_sheet(e) , "Sheet1")
      // })

      // console.log(wb, ws)

      // let tabless = map(ws, (elem, acc) => {return {id: acc, tbl: elem  }})

      // console.log(tabless)
        
//       var ws1 = XLSX.utils.table_to_sheet(document.getElementById('table1'));
// var ws2 = XLSX.utils.table_to_sheet(document.getElementById('table2'));
// var ws3 = XLSX.utils.table_to_sheet(document.getElementById('table3'));
 

       //XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1})

      

       

      
    },
    sortPdf() {
      this.json_header = []
      
      this.json_header.push(`<b> <p style="text-align:center;"> Total Título Selecionados </p></b>`)
    
       let tabless = []
      this.$nextTick(() => {
          tabless = this.$el.querySelectorAll("#tableLoad");
          tabless.forEach(ele => {
            this.json_header.push(ele.innerHTML)
          })
          
     //console.log('tt', tabless)
      });

this.json_meta = []
     this.json_meta.push(`Relatório Cobrança - ${this.dateDe} - ${this.dateAte}`);
   

   
      
    //this.json_meta(this.lstCobAgrup[0].clienteDesc)
    },
  },
  mounted() {
    this.loadCustomers();
    this.$store.state.isMenuVisible = true;
  },
  beforeDestroy() {
    this.lstCobranca = [];
    this.lstCobAgrup = [];
    this.lstCobrancaItem = [];
    this.$store.commit("setCustomers", []);
    this.$store.commit("setCustomersSel", []);
    this.$store.commit("setHistorico", null);
    this.$store.commit("setDupVencidas", null);
  },
  watch : {
      lstCobAgrup : function() {
        this.sortPdf();
      }
  }
};
</script>

<style lang="scss" >
  .styleBlack{
    background-color:black !important;
    color:white !important;
  }
  .styleOrange{
    background-color:#e58b2a;
    color:black;
  }
 
.b-card {
  max-width: 650px;
}
.main {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.listaCob {
  color: black;
  font-weight: 500px;
  background-color: whitesmoke;
}
.listaCob > label {
  width: 100%;
  text-align: center;
  justify-content: center;
  font-weight: 600;
  padding: 15px 0px;
  margin: 0;
  border: 1px solid black;
  background-color: #e58b2a;
}
.bTableContainer > table > thead > tr > th {
  border-right: 1px solid white;
}
.bTableContainer {
  max-height: 500px;
  overflow: auto;
  background-color: white;
  color: black;
  border-bottom: 10px solid black;
  margin-bottom: 0 !important;
  font-size: 14.5px;
}
.bTableContainer > table > thead {
  background-color: black !important;
  color: white;
}
legend {
  font-size: 1rem !important;
}

.col-form-label-sm {
  font-size: 16px;
}
.totais-area {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  background-color: #ffbba3;
  padding: 10px 0px;
}
.totais-header {
  background-color: #e58b2a;
  display: flex;
  justify-content: center;
  color: white;
  background-color: black;
  padding: 10px 0px;
}
.header-area {
  padding: 15px 0px;
}
</style>
