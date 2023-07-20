<template>
  <div>
    <PageTitle
    
      icon="fa fa-retweet"
      :main="serverMessages['consultaTroca']"
    ></PageTitle>
    <b-modal head-variant="dark" centered ref="modalDelete">
         <template #modal-header class="modalBg col">
             
                 <div class="imgBg">
                            <h4 style="margin-top:24px;">{{ traduction['delItnSel'] }}</h4>
                 </div>
                 <!-- <img :rel="preload" :src="require('../../assets/logo.png')" style="max-width:60px;" alt="liz-Logo"  /> -->
                 
                  </template> 
            <div class="modalTxtbox">
            <h5>{{ traduction.delItnSel }} {{ this.traduction.selection }} ? </h5>
            </div>
           
            <template #modal-footer class="btn-modal-area">
                <b-button class="btn btn-success" @click="deleteWT()">{{ traduction['confirm']}}</b-button>
                <b-button class="btn btn-danger" @click="toggleModal()">{{ traduction['cancel']}}</b-button>
                </template>
      </b-modal>
    <div v-show="!wtSelected" class="principal">
      <div>
        <Spinner :state="spinner"> </Spinner>
      </div>

      <b-card class="bcard formInicio" >
        <div class="formControl" style="display: flex">
          <b-form-group
            v-bind:label="serverMessages['relatorioFaturar.periodoDe']"
            label-for="dataDe"
            class="space"
          >
            <b-form-datepicker
              id="dataDe"
              :dropup="false"
              v-model="dataDe"
              class="mb-2 date-area"
              :locale="locale"
              :disabled="radioOptions === 'A'"
              v-bind="labels[locale] || {}"
              :date-format-options="{
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
              }"
            >
            </b-form-datepicker>
          </b-form-group>

          <b-form-group
            v-bind:label="serverMessages['geral.ate']"
            label-for="dataAte"
            class="space"
          >
            <b-form-datepicker
              id="dataAte"
              :dropup="false"
              v-model="dataAte"
              class="mb-2 date-area"
              :locale="locale"
              :disabled="radioOptions === 'A'"
              v-bind="labels[locale] || {}"
              :date-format-options="{
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
              }"
            ></b-form-datepicker>
          </b-form-group>
        </div>

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

        <div class="formControl formInputs" style="">
          <b-form-group
            style="z-index: 3; width: 45%; display: inline-block"
            v-bind:label="serverMessages['troca.consulta.escritorio']"
          >
            <Dropdown
              :options="lstEscritorios"
              v-on:selected="onSelectEscritorio"
              :maxItem="10000"
              :disabled="spinner"
              :placeholder="traduction.choose"
              id="equipe"
              name="eqpdeVendas"
            >
            </Dropdown>
          </b-form-group>
          <b-form-group
            label="Troca para:"
            style="width: 45%; display: inline-block"
          >
            <Dropdown
              :options="lstTrocaOptions"
              v-on:selected="onSelectTipo"
              :maxItem="10000"
              :disabled="spinner"
              :placeholder="traduction.choose"
              id="troca"
              name="trocapara"
            >
            </Dropdown>
          </b-form-group>

          <b-form-group label="Wt">
            <b-form-input v-model="mip" placeholder=""></b-form-input>
          </b-form-group>
        </div>
      </b-card>

  <div class="breakpoint">  
      <b-card
     
        class="bcard "
        :sub-title="serverMessages['noticia.cadastro.representantes']"
       
      >
        <div class="list-cli" >
          <JqxListBox
            ref="listboxrep"
            @select="onSelect()"
            :width="width"
            :height="height"
            :filterable="true"
            :searchMode="'containsignorecase'"
            :incrementalSearch="true"
            :disabled="false"
            :filterPlaceHolder="traduction.lookingFor"
            displayMember="display"
            valueMember="value"
          >
          </JqxListBox>
        </div>
      </b-card>

      <b-card
        class=""
        :sub-title="
          serverMessages['noticia.cadastro.representantes'] + ' Selecionados'
        "
      >
        <div class="list-clisel">
          <JqxListBox
            ref="listboxsel"
            @select="onSelect2()"
            :width="width"
            :height="height"
            :source="repsSelecionados"
            :selectedIndex="3"
            :filterable="true"
            :searchMode="'containsignorecase'"
            :incrementalSearch="true"
            :disabled="false"
            :filterPlaceHolder="traduction.lookingFor"
            displayMember="display"
            valueMember="value"
          >
          </JqxListBox>
        </div>
        <div class="button-area">
          <b-button @click="clearCustomers" class="btn" variant="secondary">{{
            traduction.clearSelection
          }}</b-button>
        </div>
      </b-card>
      </div>
    </div>
    <hr class="my-2" v-if="!wtSelected" />
    <div class="button-area">
      <b-button
        v-show="!wtSelected"
        class="mb-3 btn-control"
        id="btnConsultar"
        variant="primary"
        @click="search()"
        >{{ traduction.search }}</b-button
      >

      <div
        class="button download-area"
        style="display: inline-flex"
        v-show="!wtSelected"
      >
        <downloadPdf
          :items="lstTrocaDisplay"
          :fields="fieldsMain"
          :campos="dlFields"
        >
        </downloadPdf>
        <b-button
          class="export-options"
          variant="outline-secondary"
          style="max-height: 40px"
        >
          <export-excel
            :data="lstTrocaDisplay"
            :items="lstTrocaDisplay"
            :fields="fieldsDl"
            :name="`manuTroca1.xls`"
            :dados="lstTrocaDisplay"
          >
            <img :src="require(`@/assets/excelicon.png`)" />
          </export-excel>
        </b-button>
      </div>
    </div>
    <hr class="my-2" />

    <div class="grid" v-if="lstTrocaDisplay.length > 0">
      <b-table
        v-if="!wtSelected"
        head-variant="dark"
        class="tableSeg tableFirst"
        striped
        responsive
        :items="lstTrocaDisplay"
        :fields="fieldsMain"
      >
        <template #cell(action)="row" class="rowTest">
          <b-button
            variant="warning"
            size="sm"
            @click="toggleModal(row.item.wt)"
            class="fa fa-trash"
          >
          </b-button>
        </template>
        <template #cell(wt)="data">
          <a href="#" @click="onSelectWT(data.item, [])">{{ data.value }} </a>
        </template>
        <template #cell(clienteDesc)="data">
          <span>{{ `${data.item.cliente} - ${data.value}` }} </span>
        </template>
        <template #cell(trocapara)="data">
          <span v-if="data.item.nfedev === ''"> Consumidor Final </span>
          <span v-else> {{ `PJ / NF: ${data.item.nfedev}` }} </span>
        </template>
        <template #cell(difDias)="data">
          <span> {{ data.value }} </span> </template
        >]
        <template #cell(dtConclFormat)="data">
          <span
            :style="
              data.item.difDiasRecebToFin > 60 ? 'color:red' : 'color: green'
            "
          >
            {{ data.value }}
          </span>
        </template>
        <template #cell(dtEmissaoFormat)="data">
          <span
            :style="
              data.item.difDiasRecebToFin > 60 ? 'color:red' : 'color: green'
            "
            ><b> {{ data.value }}</b>
          </span>
        </template>
      </b-table>
      <b-table-simple responsive v-if="!wtSelected" class="tFoot">
        <b-tr class="rowTotais">
          <b-td colspan="2"
            ><span
              ><b>{{ serverMessages["troca.relatorio.wt.total"] }}</b></span
            ></b-td
          >
          <b-td
            ><span
              ><b>{{
                serverMessages["troca.relatorio.representate.unico.total"]
              }}</b></span
            ></b-td
          >
          <b-td
            ><span
              ><b>{{
                serverMessages["troca.relatorio.cliente.unico.total"]
              }}</b></span
            ></b-td
          >
          <b-td
            ><span
              ><b>{{
                serverMessages["troca.relatorio.quantidade.total"]
              }}</b></span
            ></b-td
          >
          <b-td colspan="2"
            ><span
              ><b>{{ serverMessages["troca.relatorio.valor.total"] }}</b></span
            ></b-td
          >
        </b-tr>
        <b-tr class="rowTotais2">
          <b-td colspan="2"
            ><span class="ml-5"
              ><b>{{ lstTrocaDisplay.length }}</b></span
            ></b-td
          >
          <b-td
            ><span class="ml-5"
              ><b>{{ lstQuantRep.length }}</b></span
            ></b-td
          >
          <b-td
            ><span class="ml-5"
              ><b>{{ lstQuantCliente.length }}</b></span
            ></b-td
          >
          <b-td
            ><span class="ml-5"
              ><b>{{ quantTotal - qtdMongoTroca }}</b></span
            ></b-td
          >
          <b-td colspan="2"
            ><span class="ml-3"
              ><b>{{ valorTotal }}</b></span
            ></b-td
          >
        </b-tr>
      </b-table-simple>
    </div>

    <div v-if="wtSelected" class="principal">
      <div class="principalDiv container-fluid">
        <b-row>
          <b-col md="4" sm="12" class="card-box" style="display: inline-flex">
            <div class="colSplit">
              <b-form-group
                label="Número WT:"
                label-size="sm"
                label-class="font-style"
              >
                <b-form-group
                  :label="wtSelected.wt"
                  label-size="sm"
                ></b-form-group>
              </b-form-group>

              <b-form-group
                :label="`${serverMessages['headRepresentante']}:`"
                label-size="sm"
                label-class="font-style"
              >
                <b-form-group
                  :label="wtSelected.userName"
                  label-size="sm"
                ></b-form-group>
              </b-form-group>
              <b-form-group
                label="Troca Para:"
                label-size="sm"
                label-class="font-style"
              >
                <b-form-group
                  :label="
                    wtSelected.nfedev !== ''
                      ? `PJ - NF:${wtSelected.nfedev}`
                      : 'Consumidor Final'
                  "
                  label-size="sm"
                ></b-form-group>
              </b-form-group>

              <b-form-group
                :label="`${serverMessages['troca.cadastro.dataRecebimento']}:`"
                label-size="sm"
                label-class="font-style"
              >
                <b-form-datepicker
                  v-model="dataReceb"
                  size="sm"
                  :dropup="false"
                  id="datepickerReceb"
                  class="mb-2"
                  placeholder=""
                  :date-format-options="{
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  }"
                  :disabled="
                    wtSelected.dtFinalTroca !== '0000-00-00' ||
                    wtSelected.dtReceb !== '0000-00-00'
                  "
                >
                </b-form-datepicker>
              </b-form-group>
            </div>
            <div class="colSplit">
              <div
                v-if="wtSelected.dtFinalTroca === '0000-00-00'"
                class="status btn-control btn-success btn-aberto"
              >
                <b-form-group
                  style="color: white; padding: -1px"
                  :label="serverMessages['troca.consulta.status.abertas']"
                  label-size="sm"
                ></b-form-group>
              </div>
              <div v-else class="status btn-control btn-danger btn-aberto">
                <b-form-group
                  style="color: white; padding: -1px"
                  label="Finalizada"
                  label-size="sm"
                ></b-form-group>
              </div>

              <b-form-group
                :label="`${serverMessages['pedido.cadastro.cliente']}`"
                label-size="sm"
                label-class="font-style"
              >
                <b-form-group
                  :label="wtSelected.clienteDesc"
                  label-size="sm"
                ></b-form-group>
              </b-form-group>

              <b-form-group
                :label="`${serverMessages['pedido.cadastro.dataEmissao']}`"
                label-size="sm"
                label-class="font-style"
              >
                <b-form-group
                  :label="wtSelected.dtEmissaoFormat"
                  label-size="sm"
                ></b-form-group>
              </b-form-group>

              <b-form-group
                :label="`${serverMessages['troca.cadastro.dataFinal']}:`"
                label-size="sm"
                label-class="font-style"
              >
                <b-form-group
                  :label="wtSelected.dtConclFormat"
                  label-size="sm"
                ></b-form-group>
              </b-form-group>
            </div>
          </b-col>

          <b-col cols="12" md="6" class="card-box" style="padding: 15px">
            <b-form-group
              label="Obs Rep:"
              label-size="sm"
              label-class="font-style"
              style="color: black"
            >
              <b-form-textarea
                id="textarea"
                rows="3"
                v-model="wtSelected.obs"
                max-rows="6"
                readonly
              >
              </b-form-textarea>
            </b-form-group>
            <b-form-group
              label="Obs Sac:"
              label-size="sm"
              label-class="font-style"
              style="color: black"
            >
              <b-form-textarea
                id="textarea1"
                v-model="wtSelected.obsSac"
                rows="3"
                max-rows="6"
                :readonly="wtSelected.dtFinalTroca !== '0000-00-00' "
               
              >
              </b-form-textarea>
            </b-form-group>
            <b-form-group
              label="Itens Substituídos:"
              label-size="sm"
              label-class="font-style"
              style="color: black"
              v-if="false"
            >
              <JqxListBox
                ref="listboxMongo"
                width="500px"
                height="100px"
                :source="lstMongoSubtit"
                :filterable="true"
                :searchMode="'containsignorecase'"
                :incrementalSearch="true"
                :disabled="false"
                :filterPlaceHolder="traduction.lookingFor"
                displayMember="display"
                valueMember="value"
              >
              </JqxListBox>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </div>
    <hr class="my-2" v-if="wtSelected" />
    <div class="button-area" v-if="wtSelected">
      <b-button
        class="btn-control"
        id="btnVoltar"
        variant="danger"
        @click="back()"
        >{{ this.traduction.goBack }}</b-button
      >
      <b-button
        :disabled="wtSelected.dtFinalTroca != '0000-00-00' || controlSavetroca === true"
        style="height: 40px; width: 150px"
        id="btnGerarMip"
        variant="success"
        @click="gerarMip()"
        >{{ this.traduction.generate }} MIP</b-button
      >
      <b-button
        :disabled="wtSelected.dtFinalTroca != '0000-00-00'"
        style="height: 40px; width: 150px"
        id="btnGrava"
        variant="primary"
        @click="saveTroca()"
        >{{ serverMessages['pedido.cadastro.gravar'] }}</b-button
      >

      <div class="downloadArea" id="downloadArea">
        <downloadPdf
          :items="lstArrayItensFiltered"
          :fields="downloadFields"
          :campos="downloadFields"
        >
        </downloadPdf>

        <b-button
          style="height: 40px; margin-top: 12px"
          class="export-options"
          variant="outline-secondary"
        >
          <export-excel
            :data="lstArrayItensFiltered"
            :fields="fieldsDownload"
            :name="'manuTroca2.xls'"
          >
            <img :src="require(`@/assets/excelicon.png`)" />
          </export-excel>
        </b-button>
      </div>
    </div>
    <hr class="my-2" v-if="wtSelected" />
    <div v-if="wtSelected">
      <b-container fluid>
        <b-row>
          <b-col>
            <b-table
              class="tableSeg"
              striped
              style="min-height:400px"
              
              responsive
              :items="lstArrayItensFiltered"
              :fields="fields"
              head-variant="dark"
            >
              <template #head(marca)>
                <span >{{ serverMessages["troca.cadastro.marca"] }}</span>
              </template>
              <template #head>

              </template>
              <template #head(ref)>
                <span>{{ serverMessages["troca.cadastro.referencia"] }}</span>
              </template>
              <template #head(cor)>
                <span>{{ serverMessages["troca.cadastro.cor"] }}</span>
              </template>
              <template #head(descMaterial)>
                <span>{{ traduction["description"] }}</span>
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
            
              <template #head(descProc)>
                <span>{{ serverMessages["trocaProduto.procedimento"] }}</span>
              </template>
              <template #head(dtPrevConclFormat)>
                <span>{{
              
                   traduction['dataprev']
                }}</span>
              </template>
              <template #head(dtItemFinalFormat)>
                <span>{{
                  serverMessages["troca.cadastro.dataConclusaoItem"]
                }}</span>
              </template>
              <template #cell(dtPrevConclFormat)="data">
                <span v-if="data.item.difDias > 30" style="color: red"
                  ><b>{{ data.value }}</b></span
                >
                <span v-else style="color: #03cea4"
                  ><b>{{ data.value }}</b></span
                >
              </template>
              <template #cell(descDefeito)="data">
               <!-- <div class="form-group">

                    
    
<div class="input-group mb-3">
   <input
  :disabled="
                    data.item.troca ||
                    data.item.substPor !== '' ||
                    data.item.dtFinalTroca != '0000-00-00' ||
                    data.item.numeroMip.length === 10
                  "
    type="search"
    id="usersearch"
    list="lstDefs"
    class="form-control"
    placeholder="Defeitos..."
    @blur="checkDefeitoSelected($event)"
    v-model="data.item.descDefeito"
    v-on:input="searchDefeito($event)"
  />
 
</div>
<datalist id="lstDefs">
  <option v-for="(u, acc) in lstDefeitos" :key="acc" :value="u.text"></option>
</datalist>
</div> -->
                <b-form-select
                colspan="3"
                  :disabled="
                    data.item.troca ||
                    data.item.substPor !== '' ||
                    data.item.dtFinalTroca != '0000-00-00' ||
                    data.item.numeroMip.length === 10
                  "
                  
                  v-model="data.item.codDefeito"
                  :label="data.item.codDefeito"
                  :options="lstDefeitos"
                ></b-form-select>

              </template>
              <template #cell(descProc)="data">
                <b-form-select
                  :disabled="
                    data.item.troca ||
                    data.item.substPor !== '' ||
                    data.item.dtFinalTroca != '0000-00-00' ||
                    data.item.numeroMip.length === 10
                  "
                  v-model="data.item.codProcedimento"
                  :options="lstProcedimentos"
                ></b-form-select>
              </template>
              <template #cell(dtFinalizacao)="data">
                
                <input
                type="date"
                  v-model="data.item.dtFinalizacao"
                :max="dataHoje"
                  size="sm"
                  id="datepickerFinal"
                  class="mb-2 dateFinal custom-select"   
                >
               
                
              </template>
              <template v-if="false" #cell(substPor)="data">
                <div
                  v-if="
                    data.item.numeroMip && data.item.numeroMip.length === 10
                  "
                >
                  <span></span>
                </div>
                <div v-else-if="!data.item.troca">
                  <div v-if="data.item.substPor !== ''">
                    <span v-if="data.item.numeroMip === ''"
                      ><b>{{ `#${data.value}` }}</b></span
                    >
                  </div>
                  <div v-else>
                    <b-button
                      v-show="data.item.codProcedimento === '001'"
                      class="mb-3 btn-control"
                      id="btnSub"
                      variant="primary"
                      @click="showModal(data.item)"
                      >Subs. por</b-button
                    >
                  </div>
                </div>
                <div v-else>
                  <b-button
                    v-show="data.item.codProcedimento === '001'"
                    class="mb-3 btn-control"
                    id="btnDelete"
                    variant="danger"
                    @click="deleteItem(data.item.index)"
                    >Excluir</b-button
                  >
                </div>
              </template>

              <template #cell(numeroMip)="data">
                <div
                  v-if="
                    data.value === '' ||
                    data.value === 'X' ||
                    data.value === false
                  "
                >
                  <div v-if="data.item.codProcedimento === '001'">
                    <b-form-checkbox
                      v-if="
                        data.item.substPor === '' ||
                        data.item.troca === true ||
                        data.item.codDefeito === '010'
                      "
                      value="X"
                      v-model="data.item.numeroMip"
                    ></b-form-checkbox>
                  </div>
                </div>
                <div v-else>
                  <span
                    ><b>{{ data.value }}</b></span
                  >
                </div>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-container>

      <b-table-simple class="tableTer" striped hover small responsive>
        <b-tbody>
          <b-tr>
            <b-td
              ><b>{{
                `${serverMessages["troca.relatorio.quantidade.total"]} : ${lstArrayItensFiltered.length}`
              }}</b></b-td
            >
            <b-td
              ><b>{{
                `${serverMessages["troca.relatorio.valor.total"]} : ${lstArrayItensFiltered.length > 0 ? lstArrayItensFiltered[0]["valorTotal"] : 0}`
              }}</b></b-td
            >
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
    <b-modal
      ref="modalProduct"
      size="xl"
      hide-footer
      title="Using Component Methods"
    >
      <SelecaoProdutoExterno
        :mainindex="index"
        :refe="referencia"
        caller="Manutencao"
        :referencias="lstReferencias"
      ></SelecaoProdutoExterno>
    </b-modal>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
import { mapState } from "vuex";
import Spinner from "../template/Spinner.vue";
import Dropdown from "vue-simple-search-dropdown";
import JqxListBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlistbox.vue";
//import JqxDateTimeInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxdatetimeinput.vue";
//import JqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";
import SelecaoProdutoExterno from "../commons/SelecaoProdutoExterno.vue";
import { find, map, filter, groupBy, sortBy, reduce, reject } from "underscore";
import numeral from "numeral";
import {
  format,
  addMonths,
  differenceInMonths,
  parseISO,
  differenceInDays,
} from "date-fns";
import { baseApiUrl, showError, showSuccess } from "@/global";
import axios from "axios";
import downloadPdf from "../commons/downloadPdf.vue";
export default {
  name: "ManutencaoTroca",
  mixins:["customSelect"],
  components: {
    PageTitle,
    Spinner,
    Dropdown,
    JqxListBox,
    SelecaoProdutoExterno,
    downloadPdf,
  },
 
  data: function () {
    return {
      dataHoje: null,
      varTest: [],
      wtfordelete:null,
      radioOptions: "A",
      locale: "pt-BR",
      dataReceb: null,
      dataDe: null,
      referencia: null,
      wtSelected: null,
      mip: "",
      valorTotal: null,
      spinner: false,
      dataAte: null,
      selectedEscri: null,
      controlSavetroca:false,
      lstEscritoriosOriginal: [],
      lstArrayItensRetorno: [],
      lstArrayItensRetMip: [],
      lstEscritorios: [],
      lstReferencias: [],
      lstTrocaDisplay: [],
      lstDefeitos: [],
      typeCliente: null,
      lstProcedimentos: [],
      lstQuantCliente: [],
      lstArrayItensFiltered: [],
      lstArrayItensNovos: [],
      lstQuantRep: [],
      lstWtsMongo: [],
      lstMongoSubtit: [],
      lstTrocas: [],
      qtdMongoTroca: 0,
      valorMongoTroca: 0,
      index: 0,
      repsSelecionados: [],
      lstTrocaOptions: [
        { id: "PJ", name: "Pessoa Júridica" },
        { id: "CF", name: "Consumidor Final" },
      ],
      width: 300,
      height: 215,
      fieldsMain: [
        { key: "action", label: "Excluir" },
        { key: "wt", label: "Numero WT" },
        { key: "userName", label: "Representante" , sortable: true},
        { key: "clienteDesc", label: "Cliente" , sortable: true},
        { key: "trocapara", label: "Troca para" , sortable: true},
        { key: "dtEmissaoFormat", label: "Data de Emissão" , sortable: true},
        { key: "dtRecebFormat", label: "Dt.Recebimento" , sortable: true},
        { key: "difDiasReceb", label: "Dias" , sortable: true},
        { key: "dtConclFormat", label: "Conclusão" , sortable: true},
        { key: "difDiasRecebToFin", label: "Dias" , sortable: true},
        { key: "difDias", label: "Total" , sortable: true},
      ],
      fields: [
        { key: "index", label: "Item" },
        { key: "marca", label: "Marca" , sortable: true},
        { key: "referencia", label: "Ref." , sortable: true},
        { key: "cor", label: "Cor" , sortable: true},
        { key: "tamanho", label: "Tam" , sortable: true},
        { key: "copa", label: "Copa" , sortable: true},
        { key: "descMaterial", label: "Descrição" , sortable: true},
        { key: "numeroMip", label: "MIP" , sortable: true},
        { key: "descDefeito", label: "Defeito" , sortable: true},
        { key: "descProc", label: "Procedimento" , sortable: true},
        { key: "dtPrevConclFormat", label: "Data Prev.Conclusão" , sortable: true},
        { key: "dtFinalizacao", label: "Data Conclusão" , sortable: true},
        { key: "quantidade", label: "Qtd." , sortable: true},
        //Retirado 26/08 -- > HABILITAR BOTÃO SUBSTITUIR POR
        //{ key: "substPor", label: "Substituir. por" , sortable: true},
      ],
      fieldsDownload: {
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
        "Data Conclusão": "dtFinalTroca",
        "Qtd.": "quantidade",
        //  "Valor" :         "valorFormat" ,
        "Substituir. por": "substPor",
        SKU: "material",
      },
      downloadFields: {
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
        dtFinalTroca: "Data Conclusão",
        quantidade: "Qtd.",
        //  "valorFormat" : "Valor" ,
        substPor: "Substituir. por",
      },
      dlFields: {
        wt: "Numero WT",
        userName: "Representante",
        clienteDesc: "Cliente",
        trocapara: "Troca para",
        dtEmissaoFormat: "Data de Emissão",
        dtRecebFormat: "Dt.Recebimento",
        difDiasReceb: "Dias",
        dtConclFormat: "Conclusão",
        difDias: "Dias2",
      },
      fieldsDl: {
        "Numero WT": "wt",
        Representante: "userName",
        Cliente: "clienteDesc",
        "Troca para": "'Consumidor Final'",
        "Data de Emissão": "dtEmissaoFormat",
        "Dt.Recebimento": "dtRecebFormat",
        Dias: "difDiasReceb",
        Conclusão: "dtConclFormat",
        Dias2: "difDias",
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
      "newProduct",
    ]),
  },
  watch: {
    newProduct: function () {
      let newLine = {
        ...this.newProduct,
        seq: this.lstArrayItensFiltered.length + 1,
        index: this.lstArrayItensFiltered.length + 1,
        codProcedimento: "001",
        codDefeito: "010",
        quantidade: 1,
        ref: this.newProduct.referencia,
        tam: this.newProduct.tamanho,
        troca: true,
        dtFinalizacao: "",
        dtFinalTroca: "0000-00-00",
      };
      this.lstArrayItensFiltered.push(newLine);
      this.lstArrayItensNovos.push(newLine); // Array para controlar o que é troca
      this.lstArrayItensFiltered.forEach((el) => {
        if (el.index === this.newProduct.mainIndex) {
          el.substPor = newLine.index;
          (el.dtItemFinalFormat = new Date("01-10-2022")),
            (el.dtFinalizacao = format(new Date(), 'yyyyMMdd')),
            (el.dtFinalTroca = format(new Date(), 'yyyyMMdd'));
        }
      });
      this.$refs["modalProduct"].hide();
    },
  },
  methods: {
    toggleModal(wt){
      if(wt)
       this.wtfordelete = wt 
          this.$refs.modalDelete.toggle('modalDelete');
          
    },
    saveTroca() {
      if (this.dataReceb === null || this.dataReceb === "") {
        showError("Necessário indicar a data de recebimento");
        return;
      }
      let newseq = {};
      let seqRecover = {
        _id: this.lstArrayItensFiltered[0].numPedido,
        seqs: [],
      };

      seqRecover =
        this.lstWtsMongo.filter(
          (el) => el._id === this.lstArrayItensFiltered[0].numPedido
        ).length > 0
          ? this.lstWtsMongo.find(
              (el) => el._id === this.lstArrayItensFiltered[0].numPedido
            )
          : { _id: this.lstArrayItensFiltered[0].numPedido, seqs: [] };

      let temp = null;

      this.lstArrayItensNovos.forEach((element) => {
        temp = find(this.lstArrayItensFiltered, (el) => {
          return el.substPor === element.index;
        });

        newseq = {};
        (newseq.sqV = element.index),
          (newseq.sqR = temp.seq),
          (newseq.skuV = element.material),
          (newseq.skuR = temp.material),
          (newseq.prV = element.valor),
          (newseq.prR = temp.valor);

        seqRecover.seqs.push(newseq);
        //seqTmp.push(newseq)
      });

      //seqRecover.seqs.concat(seqTmp)

      //

      this.spinner = true;
      const url = `${baseApiUrl}/pedido/savetroca`;
      axios
        .post(url, {
          PCanal: this.lstArrayItensFiltered[0].canal,
          PCliente: this.wtSelected.cliente,
          PCondPgto: "601",
          PDivisao: "",
          PDtEmissao: this.wtSelected.dtEmissao,
          language: this.language,
          PNfeDev: this.wtSelected.nfedev,
          PNumPedido: this.wtSelected.wt,
          PObs: this.wtSelected.obs,
          PObsSac: this.wtSelected.obsSac,
          PDtReceb: this.dataReceb,
          POrgVda: "1000",
          PRecebedor: "0000114948",
          PSetor: this.lstArrayItensFiltered[0].setor,
          PUserName: this.wtSelected.userName,
          isMant: "S",
          SeqRecover: seqRecover,
          TItem: this.lstArrayItensFiltered.map((element) => {
            return {
              CodDefeito: element.codDefeito,
              CodProcedimento: element.codProcedimento,
              DtFinalizacao: element.dtFinalizacao,
              Material: element.material,
              NumPedido: this.wtSelected.wt,
              NumeroMip: "",
              Quantidade: element.quantidade,
              Seq: element.seq,
              Valor: element.valor,
            };
          }),
        })
        .then((resp) => {
          this.spinner = false;
          if(resp.data.result === 'OK'){

            showSuccess(resp.data.message);
            let arraytm = [];
            arraytm.push({
              numPedido: this.lstArrayItensFiltered[0]["numPedido"],
            });
            this.onSelectWT(this.wtSelected, arraytm);
            this.lstArrayItensNovos = []; //Limpando itens que ja foram gravados

          }else{
            showError(resp.data.message);
          }
          
        })
        .catch(() => {
          showError(this.traduction.internalError);
          this.spinner = false;
        });
    },
    //  async callOthersFunctions(array , pedido){
    //    await this.loadWtsMongo(array)
    //    await this.onSelectWT(pedido)
    //  },
    gerarMip() {
      if (!this.dataReceb) {
        showError("Necessário indicar a data de recebimento");
        return;
      }
      this.spinner = true;
      let controle = 0;
      this.lstArrayItensFiltered.forEach((el) => {
        if (el.numeroMip === "X") {
          controle = 1;
        }
      });

      if (controle === 0) {
        showError(
          "Selecione na coluna MIP os itens desejados para geração do número"
        );
        return;
      }
      if (this.lstArrayItensNovos.length > 0) {
        showError("Necessário gravar a wt antes de gerar a mip");
        return;
      }
      this.spinner = true;
      this.controlSavetroca = true
      const url = `${baseApiUrl}/pedido/gerarmip`;
      axios
        .post(url, {
          PCanal: this.lstArrayItensFiltered[0].canal,
          PCondPgto: "601",
          PCliente: this.wtSelected.cliente,
          PDtEmissao: this.wtSelected.dtEmissao,
          PNumPedido: this.wtSelected.wt,
          PRecebedor: "0000114948",
          PSetor: this.lstArrayItensFiltered[0].setor,
          TItem: map(
            filter(this.lstArrayItensFiltered, (el) => el.numeroMip === "X"),
            (element) => {
              if (element.numeroMip === "X") {
                return {
                  CodDefeito: element.codDefeito,
                  CodProcedimento: element.codProcedimento,
                  DtFinalizacao: element.dtFinalizacao,
                  Material: element.material,
                  NumPedido: this.wtSelected.wt,
                  NumeroMip: "",
                  Quantidade: element.quantidade,
                  Seq: element.seq,
                  Valor: element.valor,
                };
              }
            }
          ),
        })
        .then((resp) => {
          this.spinner = false;
          this.lstArrayItensRetMip = resp.data.trocasRQ;

          this.lstArrayItensRetMip = map(this.lstArrayItensRetMip, (el) => {
            return {
              index: el.seq,
              ...el,
              dtFinalizacao:
                el.dtFinalizacao === "0000-00-00" ? "" : el.dtFinalizacao,
              substPor: find(
                this.lstArrayItensFiltered,
                (element) => element.index === el.seq
              )["substPor"],
            };
          });

          this.lstArrayItensFiltered = this.lstArrayItensRetMip;

          this.lstArrayItensFiltered = sortBy(
            this.lstArrayItensFiltered,
            "index"
          );

          showSuccess(resp.data.message);
          this.spinner = false;
          this.controlSavetroca = false
        })
        .catch(() => {
          showError(this.traduction.internalError);
          this.spinner = false;
          this.controlSavetroca = false
        });
    },
    deleteItem(index) {
      this.lstArrayItensFiltered.forEach((el) => {
        if (el.substPor === index) {
          el.substPor = "";
          el.dtFinalTroca = "0000-00-00";
        }
      });
      this.lstArrayItensFiltered = reject(
        this.lstArrayItensFiltered,
        (e) => e.index === index
      );
      this.lstArrayItensNovos = reject(
        this.lstArrayItensNovos,
        (e) => e.index === index
      );
      this.lstArrayItensFiltered.length < index;
      let controle = 0;
      let arrayTempData = [];
      this.lstArrayItensFiltered.forEach((el) => {
        controle += 1;
        //
        if (el.index !== controle) {
          el.index = controle;
          el.seq = controle;
          arrayTempData.push({ indice: el.index, mainIndex: el.mainIndex });
        }
        //
      });

      this.lstArrayItensFiltered.forEach((el) => {
        let obj = arrayTempData.find(
          (element) => element.mainIndex === el.index
        );
        if (obj) {
          el.substPor = obj.indice;
        }
      });
    },
    onValueChanged: function (event, linha) {
      this.lstArrayItensFiltered.forEach((element) => {
        if (element.index === linha.item.index) {
          element.dtFinalizacao = format(event.args.date, "yyyy-MM-dd");
        }
      });
    },
    onChange() {
      this.$refs.dateConclusao.setDate(new Date(2017, 9, 20));
    },
    onSelectTipo(selection) {
      //
      this.typeCliente = selection.id;
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

        this.$refs.listboxrep.source = arrayFiltered;
      }
      this.spinner = false;
    },
    async loadReferencias() {
      this.spinner = true;
      const url = `${baseApiUrl}/produto/GetRefProduto`;
      await axios
        .post(url, {
          condpagid: "601",
          flgFora: "",
          lista: "03.05.08.11.18.38.90.99",
          pais: "BRASIL",
          tipoOrdem: "",
          canaldistribid: "20",
          canaldistribnome: "Varejo",
          setoratividadeid: "03",
          setoratividadenome: "LIZ",
          language: this.language,
          moeda: "BRL",
        })
        .then((resp) => {
          //Arrays Originais
          this.lstReferencias = resp.data;
          this.spinner = false;
          //this.$store.commit('setShowScreen',true)
        })
        .catch(() => {
          showError(this.traduction.internalError);
          this.spinner = false;
        });
    },
    showModal(item) {
      this.referencia = item.referencia;
      this.index = item.index;
      this.$refs["modalProduct"].show();
    },
    async loadEscritorio() {
      const url = `${baseApiUrl}/pedido/getescritorio`;
      this.spinner = true;
      await axios
        .post(url, {
          language: this.language,
          loginUsuario: this.user.loginUsuario,
        })
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
    clearCustomers() {
      this.$refs.listboxsel.source = [];
    },
    onSelect() {
      if (this.lstEscritoriosOriginal.length > 0) {
        let items = this.$refs.listboxrep.getSelectedItems();
        if (!this.$refs.listboxsel.getItemByValue(items[0].value)) {
          this.$refs.listboxsel.addItem(items[0]);
        }
      }
    },
    onSelect2() {
      let items = this.$refs.listboxsel.getSelectedItems();
      this.$refs.listboxsel.removeItem(items[0].value);
    },
    search() {
      this.lstWtsMongo = [];
      this.lstMongoSubtit = [];

      
      const url = `${baseApiUrl}/pedido/getmanutencaotroca`;

      let result = differenceInMonths(
        new Date(this.dataAte),
        new Date(this.dataDe)
      );
      if (result > 12) {
        showError(this.serverMessages["relatorioCobranca.form.periodo.limit"]);
        return;
      }
      this.spinner = true;
      axios
        .post(url, {
          pAbertas: this.radioOptions,
          pDtAte:
            this.radioOptions !== "A"
              ? this.dataAte
              : format(new Date(), "yyyy-MM-dd"),
          pDtDe: this.radioOptions !== "A" ? this.dataDe : "2000-01-01",
          PNumPedido: this.mip,
          PSetor: "",
          PUser: "",
          TInpDefeitos: [],
          TInpProcedimentos: [],
          TInpRepresentantes: [],
          language: this.language,
        })
        .then((resp) => {
          if (resp.data.result === "OK") {
            this.lstTrocaDisplay = [];
            let arrayTemp = [];
            if(this.$refs.listboxsel.getItems().length > 0){
                this.$refs.listboxsel.getItems().forEach((element) => {
              this.lstTrocas = filter(resp.data.trocasRQ, (el) => {
                return el.userName === element.value;
              });
              this.lstTrocas.forEach((el) => {
                arrayTemp.push(el);
              });
            });
            }else{
              this.lstTrocas = resp.data.trocasRQ
              this.lstTrocas.forEach((el) => {
                arrayTemp.push(el);
              });

            }
            
            //Rotina para buscar registros dos gerentes regionais
            let arraySel = this.$refs.listboxsel.getItems();
            if (arraySel.length === 0) {
              this.lstTrocas = resp.data.trocasRQ.filter((el) => {
                return el.userName === this.user.loginUsuario;
              });
              this.lstTrocas.forEach((el) => {
                arrayTemp.push(el);
              });
             
            }
            this.lstTrocaDisplay = map(
              map(
                groupBy(arrayTemp, (troca) => {
                  return troca.numPedido;
                }),
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
                    quantidade: reduce(
                      value,
                      (vlant, curr) => {
                        return vlant + curr.quantidade;
                      },
                      0
                    ),
                    valorOrigin: reduce(
                      value,
                      (vlr, curr) => {
                        return vlr + curr.valor;
                      },
                      0
                    ),
                    valor: numeral(
                      reduce(
                        value,
                        (vlant, curr) => {
                          return vlant + curr.valor;
                        },
                        0
                      )
                    ).format("$0,0.00"),
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
                  dtEmissaoFormat: format(parseISO(el.dtEmissao), "dd/MM/yyyy"),
                  difDiasReceb:
                    el.dtReceb !== "0000-00-00"
                      ? differenceInDays(
                          new Date(el.dtReceb),
                          new Date(el.dtEmissao)
                        )
                      : 0,
                  //difDias: ( el.dtFinalTroca !== "0000-00-00" ? differenceInDays(new Date(el.dtFinalTroca), new Date(el.dtEmissao) ): 0 ),
                  difDiasRecebToFin:
                    el.dtFinalTroca !== "0000-00-00"
                      ? differenceInDays(
                          new Date(el.dtFinalTroca),
                          new Date(el.dtReceb)
                        )
                      : 0,
                  difDias:
                    el.dtFinalTroca !== "0000-00-00"
                      ? differenceInDays(
                          new Date(el.dtFinalTroca),
                          new Date(el.dtEmissao)
                        )
                      : differenceInDays(new Date(), new Date(el.dtEmissao)),
                  dtConclFormat:
                    el.dtFinalTroca !== "0000-00-00"
                      ? format(parseISO(el.dtFinalTroca), "dd/MM/yyyy")
                      : "",
                  dtRecebFormat:
                    el.dtReceb !== "0000-00-00"
                      ? format(parseISO(el.dtReceb), "dd/MM/yyyy")
                      : "",
                };
              }
            );

            if (this.typeCliente === "CF") {
              this.lstTrocaDisplay = this.lstTrocaDisplay.filter((el) => {
                return el.nfedev === "";
              });
            } else if (this.typeCliente === "PJ") {
              this.lstTrocaDisplay = this.lstTrocaDisplay.filter((el) => {
                return el.nfedev !== "";
              });
            }
            this.lstTrocaDisplay = sortBy(this.lstTrocaDisplay, "wt");
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
          //
        })
        .catch(() => {
          showError(this.traduction.serverError);
          this.spinner = false;
        });
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
          //
          if (this.lstWtsMongo.length > 0) {
            this.qtdMongoTroca = reduce(
              this.lstWtsMongo,
              (vlrAnt, current) => {
                return vlrAnt + current.seqs.length;
              },
              0
            );
            this.valorMongoTroca = reduce(
              this.lstWtsMongo,
              (vlrAnt, current) => {
                return (
                  vlrAnt +
                  reduce(
                    current.seqs,
                    (vlr, curr) => {
                      return vlr + curr.prV;
                    },
                    0
                  )
                );
              },
              0
            );
          }
          this.spinner = false;
        })
        .catch(() => {
          showError(this.traduction.serverError);
          this.spinner = false;
        });
    },
    deleteWT() {
      const url = `${baseApiUrl}/pedido/deletetroca`;
      axios
        .post(url, { wt: this.wtfordelete })
        .then((resp) => {
          if (resp.data.result === "OK") {
            showSuccess(resp.data.message);
          }
          this.spinner = false;

          this.lstTrocaDisplay = reject(
            this.lstTrocaDisplay,
            (ele) => ele.wt === this.wtfordelete
          );
          this.toggleModal()
        })
        .catch(() => {
          showError(this.traduction.serverError);
          this.spinner = false;
        });
    },
    back() {
      this.wtSelected = null;
      this.lstMongoSubtit = [];
      //this.lstWtsMongo = []
    },
    onSelectWT(wt, array) {
      this.wtSelected = wt;
      this.lstArrayItensFiltered = [];
      this.lstArrayItensNovos = [];
      this.lstArrayItensRetMip = [];

      if (array.length > 0) {
        array = array.map((el) => {
          return el.numPedido;
        });
      }

      const url1 = `${baseApiUrl}/pedido/getmanutencaotroca`;
      const url2 = `${baseApiUrl}/mongo/getseqrecover`;
      axios
        .all([
          axios.post(url1, {
            pAbertas: this.radioOptions,
            pDtAte:
              this.radioOptions !== "A"
                ? this.dataAte
                : format(new Date(), "yyyy-MM-dd"),
            pDtDe: this.radioOptions !== "A" ? this.dataDe : "2000-01-01",
            PNumPedido: wt.wt,
            PSetor: "",
            PUser: "",
            TInpDefeitos: [],
            TInpProcedimentos: [],
            TInpRepresentantes: [],
            language: this.language,
          }),
          axios.post(url2, { ids: array }),
        ])
        .then(
          axios.spread((resp, resp2) => {
            if (resp2.data.length > 0) {
              this.lstWtsMongo = resp2.data;

              if (this.lstWtsMongo.length > 0) {
                this.qtdMongoTroca = reduce(
                  this.lstWtsMongo,
                  (vlrAnt, current) => {
                    return vlrAnt + current.seqs.length;
                  },
                  0
                );
                this.valorMongoTroca = reduce(
                  this.lstWtsMongo,
                  (vlrAnt, current) => {
                    return (
                      vlrAnt +
                      reduce(
                        current.seqs,
                        (vlr, curr) => {
                          return vlr + curr.prV;
                        },
                        0
                      )
                    );
                  },
                  0
                );
              }
            }
            this.lstArrayItensFiltered = map(resp.data.trocasRQ, (el) => {
              return {
                index: el.seq,
                dtConclFormat:
                  el.dtFinalTroca !== "0000-00-00"
                    ? format(parseISO(el.dtFinalTroca), "dd/MM/yyyy")
                    : "",
                dtEmissaoFormat: format(parseISO(el.dtEmissao), "dd/MM/yyyy"),
                ...el,
              };
            });
            if (this.lstArrayItensFiltered[0].dtFinalTroca !== "0000-00-00") {
              this.lstTrocaDisplay = reject(
                this.lstTrocaDisplay,
                (el) => el.wt === this.lstArrayItensFiltered[0].numPedido
              );
            }
            this.wtSelected.dtEmissaoFormat =
              this.lstArrayItensFiltered[0]["dtEmissaoFormat"];
            this.wtSelected.dtConclFormat =
              this.lstArrayItensFiltered[0]["dtConclFormat"];
            this.wtSelected.dtFinalTroca =
              this.lstArrayItensFiltered[0]["dtFinalTroca"];

            let arrayFiltrado = filter(
              this.lstWtsMongo,
              (el) => el._id === wt.wt
            );
            let objectMongo = arrayFiltrado[0];

            this.lstArrayItensFiltered = map(
              this.lstArrayItensFiltered,
              (el) => {
                if (objectMongo) {
                  this.lstMongoSubtit = objectMongo.seqs.map(
                    (el) => ` De: -> ${el.skuR} por -> ${el.skuV}`
                  );
                  this.$refs.listboxMongo.clear();
                  this.lstMongoSubtit.forEach((el) => {
                    this.$refs.listboxMongo.addItem(el);
                  });

                  return {
                    index: el.seq,
                    valorTotal: numeral(this.valorMongoTroca).format("$0,0.00"),
                    valorFormat: numeral(el.valor).format("$0,0.00"),
                    dtPrevConclFormat: format(
                      addMonths(parseISO(el.dtEmissao), 1),
                      "dd-MM-yyyy"
                    ),
                    dtItemFinalFormat:
                      el.dtFinalizacao === "0000-00-00"
                        ? null
                        : format(parseISO(el.dtFinalizacao), "MM-dd-yyyy"),
                    difDias:
                      el.dtFinalizacao !== "0000-00-00"
                        ? differenceInDays(
                            new Date(el.dtFinalizacao),
                            new Date(el.dtEmissao)
                          )
                        : differenceInDays(new Date(), new Date(el.dtEmissao)),
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
                    dtFinalizacao:
                      el.dtFinalizacao === "0000-00-00" ? "" : el.dtFinalizacao,
                  };
                } else {
                  return {
                    index: el.seq,
                    marca: el.material.substr(0, 2),
                    ref: el.material.substr(2, 5),
                    cor: el.material.substr(7, 3),
                    tam: el.material.substr(10, 3),
                    copa: el.material.substr(13, 3),
                    // valorTotal: numeral( reduce( this.lstWtsMongo,(vlrAnt, curr) => {return vlrAnt + curr.prV;},0)).format("$0,0.00"),
                    valorTotal: numeral(
                      reduce(
                        this.lstArrayItensFiltered,
                        (vlrAnt, curr) => {
                          return vlrAnt + curr.valor;
                        },
                        0
                      )
                    ).format("$0,0.00"),

                    valorFormat: numeral(el.valor).format("$0,0.00"),
                    dtPrevConclFormat: format(
                      addMonths(parseISO(el.dtEmissao), 1),
                      "dd-MM-yyyy"
                    ),
                    dtItemFinalFormat:
                      el.dtFinalizacao === "0000-00-00"
                        ? null
                        : format(parseISO(el.dtFinalizacao), "dd-MM-yyyy"),
                    difDias:
                      el.dtFinalizacao !== "0000-00-00"
                        ? differenceInDays(
                            new Date(el.dtFinalizacao),
                            new Date(el.dtEmissao)
                          )
                        : differenceInDays(new Date(), new Date(el.dtEmissao)),
                    substPor: "",
                    ...el,
                    dtFinalizacao:
                      el.dtFinalizacao === "0000-00-00" ? "" : el.dtFinalizacao,
                  };
                }
              }
            );
            this.lstArrayItensFiltered = sortBy(
              this.lstArrayItensFiltered,
              "index"
            );
            this.dataReceb =
              this.lstArrayItensFiltered[0].dtReceb === "0000-00-00"
                ? ""
                : this.lstArrayItensFiltered[0].dtReceb;
            this.lstTrocaDisplay.forEach((el) => {
              if (el.wt === this.lstArrayItensFiltered[0]["numPedido"]) {
                el.dtRecebFormat = format(
                  parseISO(this.lstArrayItensFiltered[0]["dtReceb"]),
                  "dd/MM/yyyy"
                );
              }
            });
          })
        );
    },
    async loadDefeitosProcedimentos() {
      const url = `${baseApiUrl}/produto/getdefeitosprocedimentos`;
      await axios
        .get(url)
        .then((resp) => {
          if (resp.data.result === "OK") {
            this.lstDefeitos = resp.data.defeitos.map((el) => {
              return { value: el.codDefeito, text: el.descricao };
            });
            this.lstProcedimentos = resp.data.procedimentos.map((el) => {
              return { value: el.codProcedimento, text: el.descricao };
            });
          }
        })
        .catch(() => {
          showError(this.traduction.serverError);
        });
    },
  },
  async mounted() {
    this.dataHoje = format(new Date(), "yyyy-MM-dd");
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
    await this.loadReferencias();
  },
};
</script>

<style lang="scss" scoped>
.breakpoint{
  display:flex;
  flex-direction:row;
 
}
.card{
  .card-body{ 
        width: 330px;
    padding: 12px;

  }
}
.btnConsultar {
  display: flex;
  justify-content: space-evenly;
}

.tFoot {
  background-color: black;
  color: white;
}
.grid {
  width: 98%;
  font-size: 0.8rem;
}
.tableSeg > table > thead > tr {
  background-color: black;
  color: white;
}
.tableSeg {
  background: #f2f2f2;
  border: 1px solid black;
}
.card-box {
  background-color: white;
  border-radius: 20px;
  box-shadow: 1px 1px 1px #e58b2a;
  padding: 20px;
  margin: 0px 5px;

  .colSplit {
    flex-wrap: wrap;
    color: black;
    background-color: white;
    margin: 0px 10px;
    width: 50%;
    * {
      padding: 5px;
      justify-content: space-between;
    }
  }
}
.btn-aberto {
  max-width: 150px;
  text-align: center;
  border-radius: 5px;
}
.principal {
  display: flex;
  flex-wrap: wrap;
}
.formInicio {
  display: flex;
  .card-body {
    width: auto;
  }
}
.formControl > * {
  flex: 1 10px;
}
#downloadArea {
  display: inline-flex;
}

.dateFinal  {
  width: 160px;
  position:relative !important;
  
}
#datepickerFinal__dialog_{
  position:relative;
}
</style>