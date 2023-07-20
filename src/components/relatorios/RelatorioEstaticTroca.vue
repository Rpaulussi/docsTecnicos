<template>
  <div>
    <div>
      <div>
        <PageTitle
          icon="fa fa-bar-chart "
          :link="'estatistico'"
          :main="serverMessages.relatorioEstatisticoTroca"
        ></PageTitle>
      </div>
      <div>
        <Spinner :state="spinner"> </Spinner>
      </div>
      <b-container fluid>
        <b-row>
          <b-col>
            <div class="estatTrocaWrapper">
              <b-card class="cl-date">
                <b-form-group
                  v-bind:label="serverMessages['relatorioFaturar.periodoDe']"
                  label-for="dataDe"
                  class="space"
                >
                  <!-- <b-form-datepicker
                    id="dataDe"
                    v-model="dataDe"
                    class="mb-2 date-area"
                    :locale="locale"
                    v-bind="labels[locale] || {}"  
                    :date-format-options="{
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                    }"
                    >
                </b-form-datepicker> -->
                  <vue-monthly-picker
                    v-model="dataDe"
                    :monthLabels="months"
                    placeHolder="Selecione"
                    locale="pt-BR"
                  >
                  </vue-monthly-picker>
                </b-form-group>

                <b-form-group
                  v-bind:label="serverMessages['geral.ate']"
                  label-for="dataAte"
                  class="space"
                >
                  <!-- <b-form-datepicker
                    id="dataAte"
                    v-model="dataAte"
                    class="mb-2 date-area"
                    :locale="locale"
                    v-bind="labels[locale] || {}"
                    :date-format-options="{
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                    }"
                ></b-form-datepicker> -->
                  <vue-monthly-picker
                    v-model="dataAte"
                    placeHolder="Selecione"
                    :monthLabels="months"
                  >
                  </vue-monthly-picker>
                </b-form-group>
                <b-form-group style="margin-top: 36px">
                  <b-button
                    id="btnConsultar"
                    variant="primary"
                    @click="searchTrocas()"
                    >{{ traduction.search }}</b-button
                  >
                </b-form-group>
              </b-card>

              <b-collapse
                class="collapseMenu"
                :visible="lstTrocasOriginal.length > 0 ? true : false"
                id="collapse-1"
              >
                <div>
                  <b-card class="chart-card">
                    <b-row>
                      <b-col>
                        <b-form-group
                          :label="
                            serverMessages['pedido.cadastro.setorAtividade']
                          "
                        >
                          <JqxComboBox
                            ref="comboSetor"
                            :width="300"
                            :height="25"
                            :multiSelect="true"
                            :checkboxes="true"
                            displayMember="descr"
                            valueMember="id"
                          >
                          </JqxComboBox>
                        </b-form-group>
                      </b-col>
                      <b-col>
                        <b-form-group
                          :label="
                            serverMessages['consultaRelatorioCliente.status']
                          "
                        >
                          <JqxComboBox
                            ref="comboStatus"
                            :width="300"
                            :height="25"
                            :multiSelect="true"
                            :checkboxes="true"
                            displayMember="text"
                            valueMember="id"
                            :source="lstStatus"
                            :selectedIndex="0"
                          >
                          </JqxComboBox>
                        </b-form-group>
                      </b-col>
                      <b-col>
                        <b-form-group :label="this.traduction.origin">
                          <JqxComboBox
                            ref="comboOrigem"
                            :width="300"
                            :height="25"
                            :multiSelect="true"
                            :checkboxes="true"
                            displayMember="text"
                            valueMember="id"
                            :source="lstOrigens"
                            :selectedIndex="0"
                          >
                          </JqxComboBox>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <b-form-group
                          :label="
                            serverMessages[
                              'trocaEstatistico.relatorio.escritorio'
                            ]
                          "
                        >
                          <div
                            style="display: flex; justify-content: flex-start"
                          >
                            <div
                              @click="checkAll()"
                              class="mr-3 mb-1"
                              style="
                                border-radius: 8px;
                                background-color: black;
                                padding: 0px 5px 0px 5px;
                                cursor: pointer;
                              "
                            >
                              <span style="color: white; font-weight: bold">{{
                                serverMessages[
                                  "trocaEstatistico.relatorio.status.todos"
                                ]
                              }}</span>
                            </div>
                            <div
                              @click="unCheckAll()"
                              class="mr-3 mb-1"
                              style="
                                border-radius: 8px;
                                background-color: black;
                                padding: 0px 5px 0px 5px;
                                cursor: pointer;
                              "
                            >
                              <span style="color: white; font-weight: bold">{{
                                serverMessages["troca.consulta.clear.all"]
                              }}</span>
                            </div>
                          </div>

                          <JqxComboBox
                            ref="comboEscr"
                            :width="300"
                            :height="25"
                            :multiSelect="true"
                            :checkboxes="true"
                            @checkChange="onCheckChange($event)"
                            displayMember="name"
                            valueMember="id"
                          >
                          </JqxComboBox>
                        </b-form-group>
                      </b-col>
                      <b-col>
                        <b-form-group
                          :label="
                            serverMessages['escritorioVendas.representantes']
                          "
                        >
                          <div
                            style="display: flex; justify-content: flex-start"
                          >
                            <div
                              @click="checkAllRep()"
                              class="mr-3 mb-1"
                              style="
                                border-radius: 8px;
                                background-color: black;
                                padding: 0px 5px 0px 5px;
                                cursor: pointer;
                              "
                            >
                              <span style="color: white; font-weight: bold">{{
                                serverMessages[
                                  "trocaEstatistico.relatorio.status.todos"
                                ]
                              }}</span>
                            </div>
                            <div
                              @click="unCheckAllRep()"
                              class="mr-3 mb-1"
                              style="
                                border-radius: 8px;
                                background-color: black;
                                padding: 0px 5px 0px 5px;
                                cursor: pointer;
                              "
                            >
                              <span style="color: white; font-weight: bold">{{
                                serverMessages["troca.consulta.clear.all"]
                              }}</span>
                            </div>
                          </div>
                          <JqxComboBox
                            ref="comboReps"
                            :width="300"
                            :height="25"
                            :multiSelect="true"
                            :checkboxes="true"
                            displayMember="nome"
                            valueMember="id"
                            :source="lstReps"
                            :selectedIndex="0"
                          >
                          </JqxComboBox>
                        </b-form-group>
                      </b-col>
                      <b-col style="margin-top: 43px"> </b-col>
                    </b-row>
                  </b-card>
                </div>
              </b-collapse>
            </div>
          </b-col>
        </b-row>
        <b-row v-show="true" style="margin-top:50px;">
          <b-col>
            <!-- <b-table
              :items="lstEscritoriosOriginal"
              id="lstEscritoriosOriginal">
  
              </b-table> -->
          </b-col>
        </b-row>
      </b-container>

      <hr class="my-2" v-show="lstTrocasOriginal.length > 0" />
      <div class="button button-area" v-show="lstTrocasOriginal.length > 0">
        <!-- <b-button @click="xlsxExport();">Export Xlsx</b-button> -->

        <b-button
          id="btnCarregar"
          variant="primary"
          @click="carregarFiltro()"
          >{{ this.traduction.loadFilters }}</b-button
        >

        <b-button class="btnPdf" @click="fnDownloadPdf()">
          <img :src="require(`@/assets/iconpdf.png`)" />
        </b-button>

        <b-button
          @click="
            tablesToExcel(
              [
                'defeitosGrupoDl',
                'EscVendasDl',
                'repsDl',
                'clientesDl',
                'procedimentosDl',
                'lstQtdItens',
                'lstDefFiltered',
                'lstRefs',
                'defeitosGeralDl',
                'refsGeralDl',
              ],
              [
                'Defeitos por Grupo',
                'Escritorio Vendas',
                'Rnk Representantes',
                'Rnk Clientes',
                'Rnk Procedimentos',
                'Pcs SACxPcs Faturadas',
                'Rnk Defeitos por Mês',
                'Rnk Referências por Mês',
                'Rnk Defeito Geral',
                'Rnk Referências Geral',
              ],
              'RelatEstatTroca.xls',
              'Excel'
            )
          "
          class="export-options"
          variant="outline-secondary"
        >
          <img :src="require(`@/assets/excelicon.png`)" />
        </b-button>
      </div>
      <hr class="my-2" v-show="lstTrocasOriginal.length > 0" />
      <b-container fluid ref="printMe">
        <b-row>
          <b-col
            cols="12"
            class="relatEstatTrocaTeste p-0 printMe"
            style="background: #100c2a"
          >
            <b-collapse
              :visible="arrayToChartRefs.length > 1 ? true : false"
              id="collapse-4"
            >
              <div v-if="lstRefs.length > 0" class="header-area">
                <span
                  ><h3>
                    <b>{{
                      serverMessages[
                        "trocaEstatistico.relatorio.defeito.header"
                      ]
                    }}</b>
                  </h3></span
                >
              </div>

              <div>
                <v-chart
                  autoresize
                  v-show="control === 0"
                  id="chartDefeito"
                  class="chart"
                  @click="showInfoDef"
                  :option="optionDef1"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="control === 1"
                  id="chartDef2"
                  class="chart"
                  @click="showInfoDef2"
                  :option="optionDef2"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="control === 2"
                  id="chartDef3"
                  class="chart"
                  @click="showInfoDef3"
                  :option="optionDef3"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="control === 3"
                  id="chartDef4"
                  class="chart"
                  :option="optionDef4"
                >
                </v-chart>

                <div
                  style="display: flex; justify-content: center"
                  v-show="control > 0"
                >
                  <button class="btn btn-dark" @click="returnChart()">
                    Voltar para Grafico Anterior
                  </button>
                </div>
              </div>
            </b-collapse>
            <b-collapse
              :visible="arrayToChartRefs.length > 1 ? true : false"
              id="collapse-4"
            >
              <div v-if="lstRefs.length > 0" class="header-area">
                <span
                  ><h3>
                    <b>{{ serverMessages["trocaProduto.referencia"] }}</b>
                  </h3></span
                >
              </div>
              <div>
                <v-chart
                  autoresize
                  v-show="controlRef === 0"
                  id="chartRef"
                  class="chart"
                  @click="showInfoRef"
                  :option="optionRef"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlRef === 1"
                  id="chartRef2"
                  class="chart"
                  @click="showInfoRef2"
                  :option="optionRef2"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlRef === 2"
                  id="chartRef3"
                  class="chart"
                  @click="showInfoRef3"
                  :option="optionRef3"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlRef === 3"
                  id="chartRef4"
                  class="chart"
                  :option="optionRef4"
                >
                </v-chart>
                <div
                  style="display: flex; justify-content: center"
                  v-show="controlRef > 0"
                >
                  <button class="btn btn-dark" @click="returnChartRef()">
                    Voltar para Grafico Anterior
                  </button>
                </div>
              </div>
            </b-collapse>
            <b-collapse
              :visible="arrayToChartRefs.length > 1 ? true : false"
              id="collapse-4"
            >
              <div v-if="lstRefs.length > 0" class="header-area">
                <span
                  ><h3>
                    <b>{{ serverMessages["relatorioFaturar.clientes"] }}</b>
                  </h3></span
                >
              </div>
              <div>
                <v-chart
                  autoresize
                  v-show="controlCli === 0"
                  id="chartCli"
                  class="chart"
                  @click="showInfoCli"
                  :option="optionCli"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlCli === 1"
                  id="chartCli2"
                  class="chart"
                  @click="showInfoCli2"
                  :option="optionCli2"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlCli === 2"
                  id="chartCli3"
                  class="chart"
                  @click="showInfoCli3"
                  :option="optionCli3"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlCli === 3"
                  id="chartCli4"
                  class="chart"
                  :option="optionCli4"
                >
                </v-chart>
                <div
                  style="display: flex; justify-content: center"
                  v-show="controlCli > 0"
                >
                  <button class="btn btn-dark" @click="returnChartCli()">
                    Voltar para Grafico Anterior
                  </button>
                </div>
              </div>
            </b-collapse>
            <b-collapse
              :visible="arrayToChartRefs.length > 1 ? true : false"
              id="collapse-4"
            >
              <div v-if="lstRefs.length > 0" class="header-area">
                <span
                  ><h3>
                    <b>{{
                      serverMessages["escritorioVendas.representantes"]
                    }}</b>
                  </h3></span
                >
              </div>
              <div>
                <v-chart
                  autoresize
                  v-show="controlRep === 0"
                  id="chartRep"
                  class="chart"
                  @click="showInfoRep"
                  :option="optionRep"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlRep === 1"
                  id="chartRep2"
                  class="chart"
                  @click="showInfoRep2"
                  :option="optionRep2"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlRep === 2"
                  id="chartRep3"
                  class="chart"
                  @click="showInfoRep3"
                  :option="optionRep3"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlRep === 3"
                  id="chartRep4"
                  class="chart"
                  @click="showInfoRep4"
                  :option="optionRep4"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlRep === 4"
                  id="chartRep5"
                  class="chart"
                  :option="optionRep5"
                >
                </v-chart>
                <div
                  style="display: flex; justify-content: center"
                  v-show="controlRep > 0"
                >
                  <button class="btn btn-dark" @click="returnChartRep()">
                    Voltar para Grafico Anterior
                  </button>
                </div>
              </div>
            </b-collapse>
            <b-collapse
              :visible="arrayToChartRefs.length > 1 ? true : false"
              id="collapse-4"
            >
              <div v-if="lstRefs.length > 0" class="header-area">
                <span
                  ><h3>
                    <b>{{ serverMessages["relatorioFaturar.equipeVendas"] }}</b>
                  </h3></span
                >
              </div>
              <div>
                <v-chart
                  autoresize
                  v-show="controlEsc === 0"
                  id="chartEscr"
                  class="chart"
                  @click="showInfoEsc"
                  :option="optionEscr"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlEsc === 1"
                  id="chartEscr2"
                  class="chart"
                  @click="showInfoEsc2"
                  :option="optionEscr2"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlEsc === 2"
                  id="chartEscr3"
                  class="chart"
                  @click="showInfoEsc3"
                  :option="optionEscr3"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlEsc === 3"
                  id="chartEscr4"
                  class="chart"
                  @click="showInfoEsc4"
                  :option="optionEscr4"
                >
                </v-chart>
                <v-chart
                  autoresize
                  v-show="controlEsc === 4"
                  id="chartEscr5"
                  class="chart"
                  :option="optionEscr5"
                >
                </v-chart>
                <div
                  style="display: flex; justify-content: center"
                  v-show="controlEsc > 0"
                >
                  <button class="btn btn-dark" @click="returnChartEsc()">
                    Voltar para Grafico Anterior
                  </button>
                </div>
              </div>
            </b-collapse>
            <b-collapse
              :visible="arrayToChartRefs.length > 1 ? true : false"
              id="collapse-4"
            >
              <div v-if="lstRefs.length > 0" class="header-area">
                <span
                  ><h3>
                    <b>{{
                      serverMessages[
                        "trocaEstatistico.relatorio.procedimentos.procedimento"
                      ]
                    }}</b>
                  </h3></span
                >
              </div>
              <div>
                <v-chart
                  autoresize
                  id="chartProc"
                  class="chart"
                  :option="optionProc"
                >
                </v-chart>
              </div>
            </b-collapse>
          </b-col>
        </b-row>
      </b-container>
      <b-collapse
        :visible="lstDefFiltered.length > 0 ? true : false"
        id="collapse-2"
        class="tableNova"
      >
        <div v-if="lstTrocasOriginal.length > 0" class="header-area">
          <!-- <span><b>{{`Estatistica de Trocas  -  ${dataDe.substr(8,2)}/${dataDe.substr(5,2)}/${dataDe.substr(0,4)} - ${dataAte.substr(8,2)}/${dataAte.substr(5,2)}/${dataAte.substr(0,4)}`}}</b></span> -->

          <span
            ><b>{{ this.traduction.exchangeStats }}</b></span
          >
        </div>
        <div v-if="lstTrocasOriginal.length > 0" class="header-area2">
          <span class="title-table"
            ><b>{{ `Peças SAC x Peças Faturadas` }} </b></span
          >
        </div>
        <div>
          <b-table
            responsive
            small
            striped
            id="lstQtdItens"
            :items="lstQtdItens"
            :fields="fields"
            class="pecasSacxFaturadas table-limited lstQtdItens"
          >
            <template #cell(total)="data">
              <b>{{ data.value }}</b>
            </template>
            <template #cell(descricao)="data">
              <b>{{ data.value }}</b>
            </template>
          </b-table>
          <div class="button-area">
            <b-button class="export-options" variant="outline-secondary">
              <export-excel
                @click.prevent="manageData()"
                :data="lstQtdItens"
                :title="`Peças SAC x Peças Faturadas`"
                :name="`SACxFAT.xls`"
              >
                <img :src="require(`@/assets/excelicon.png`)" />
              </export-excel>
            </b-button>
          </div>
        </div>
      </b-collapse>
      <hr class="my-4" v-show="lstDefFiltered.length > 0" />
      <b-collapse
        :visible="lstDefFiltered.length > 0 ? true : false"
        id="collapse-2"
        class="defeitosRnk"
      >
        <div v-if="lstDefFiltered.length > 0" class="header-area">
          <span
            ><b>{{
              this.traduction.rankingBy +
                serverMessages["trocaEstatistico.relatorio.defeito.header"]
            }}</b></span
          >
        </div>
        <div>
          <b-table
            responsive
            small
            striped
            id="lstDefFiltered"
            :items="lstDefFiltered"
            :fields="lstFieldsDef"
            class="table-limited lstDefFiltered"
          >
            <template #cell(descDefeito)="data">
              <b>{{ data.value }}</b>
            </template>
            <template #cell(total)="data">
              <b>{{ data.value }}</b>
            </template>
            <template #cell(media)="data">
              <b>{{ data.value }}</b>
            </template>
            <template #cell(percGeral)="data">
              <b>{{ data.value }}</b>
            </template>
          </b-table>

          <div class="button-area">
            <b-button class="export-options" variant="outline-secondary">
              <export-excel
                :data="lstDefFiltered"
                :title="`Ranking por Defeitos`"
                :name="`RNKxDEF.xls`"
              >
                <img :src="require(`@/assets/excelicon.png`)" />
              </export-excel>
            </b-button>
          </div>
        </div>
      </b-collapse>
      <hr class="my-4" v-show="lstRefs.length > 0" />
      <b-collapse
        :visible="lstRefs.length > 0 ? true : false"
        id="collapse-2"
        class="tableOpt"
      >
        <div v-if="lstRefs.length > 0" class="header-area">
          <span
            ><b>{{
              this.traduction.rankingBy +
                serverMessages["trocaEstatistico.relatorio.defeito.header"] +
                serverMessages["trocaProduto.referencia"]
            }}</b></span
          >
        </div>
        <div class="tableDownload">
          <b-table
            striped
            id="lstRefs"
            :items="lstRefs"
            :fields="lstFieldsRef"
            class="table-limited lstRefs"
            simple
            small
            responsive
          >
            <template #cell(referencia)="data">
              <b>{{ data.value }}</b>
            </template>
            <template #cell(total)="data">
              <b>{{ data.value }}</b>
            </template>
            <template #cell(media)="data">
              <b>{{ data.value }}</b>
            </template>
            <template #cell(percGeral)="data">
              <b>{{ data.value }}</b>
            </template>
          </b-table>

          <!-- TABELAS tabelas tables testes DE TESTES  COM V-SHOW -->

          <div v-if="testePass" v-show="false">
            <h2>DefeitosGrupo</h2>
            <b-table :items="arrayDefAcumulado" id="defeitosGrupoDl"></b-table>

            <b-table-simple id="defeitosGrupoDl">
              <div>
                <thead>
                  <tr>
                    <th
                      v-for="(el, acc) in this.fieldsEscVendasDl[0]"
                      :key="acc"
                    >
                      {{ el }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(eleme, acc) in this.arrayDefAcumulado" :key="acc">
                    <td v-for="el in eleme" :key="el">{{ el }}</td>
                  </tr>
                </tbody>
              </div>
            </b-table-simple>

            <h2>Escritorios vendas</h2>

            <b-table-simple
              v-show="true"
              :items="escVendasDl"
              :fields="fieldsEscVendasDl"
              id="EscVendasDl"
            >
              <b-thead>
                <b-tr>
                  <b-td>
                    <span
                      >Relatório Estatístico de Trocas / Ranking Escritório de
                      Vendas --
                      <b>
                        Período : {{ dataDe["_i"] }} Até : {{ dataDe["_i"] }}
                      </b></span
                    >
                  </b-td>
                  <b-td>
                    <span>Setor Atividade: {{ headerObj.setorAtividade }}</span>
                  </b-td>
                  <b-td>
                    <span>Status: {{ headerObj.status }}</span>
                  </b-td>
                  <b-td>
                    <span>Origem: {{ headerObj.origem }}</span>
                  </b-td>
                  <b-td>
                    <span
                      >Escritório Vendas: {{ headerObj.setorAtividade }}</span
                    >
                  </b-td>
                  <b-td>
                    <span>Representantes: {{ headerObj.setorAtividade }}</span>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-th> Ranking</b-th>
                  <b-th> Escritório de Vendas </b-th>
                  <b-th> Quantidade </b-th>
                  <b-th> Porcentagem Qtd </b-th>
                  <b-th> Valor </b-th>
                  <b-th> Porcentagem Valor </b-th>
                </b-tr>
              </b-thead>
              <b-tbody v-for="(key, acc) in this.escVendasDl" :key="acc">
                <b-tr>
                  <b-th>{{ acc }}</b-th>
                  <b-th>{{ key.escritorios }}</b-th>
                  <b-th>{{ key.quantidade }}</b-th>
                  <b-th>{{ key.porcentagemQtd }}</b-th>
                  <b-th>{{ key.valor }}</b-th>
                  <b-th>{{ key.porcentagemValor }}</b-th>
                </b-tr>
              </b-tbody>
            </b-table-simple>

            <h2>representantes Table</h2>
            <b-table-simple v-show="true" :items="repsDl" id="repsDl">
              <b-thead>
                <b-tr>
                  <b-td>
                    <span
                      >Relatório Estatístico de Trocas / Ranking Representantes
                      --
                      <b>
                        Período : {{ dataDe["_i"] }} Até : {{ dataDe["_i"] }}
                      </b></span
                    >
                  </b-td>
                  <b-td>
                    <span>Setor Atividade: {{ headerObj.setorAtividade }}</span>
                  </b-td>
                  <b-td>
                    <span>Status: {{ headerObj.status }}</span>
                  </b-td>
                  <b-td>
                    <span>Origem: {{ headerObj.origem }}</span>
                  </b-td>
                  <b-td>
                    <span
                      >Escritório Vendas: {{ headerObj.setorAtividade }}</span
                    >
                  </b-td>
                  <b-td>
                    <span>Representantes: {{ headerObj.setorAtividade }}</span>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-th> Ranking</b-th>
                  <b-th> Representante </b-th>
                  <b-th> Quantidade </b-th>
                  <b-th> Porcentagem Qtd </b-th>
                  <b-th> Valor </b-th>
                  <b-th> Porcentagem Valor </b-th>
                </b-tr>
              </b-thead>
              <b-tbody v-for="(key, acc) in this.repsDl" :key="acc">
                <b-tr>
                  <b-th>{{ acc }}</b-th>
                  <b-th>{{ key.representante }}</b-th>
                  <b-th>{{ key.quantidade }}</b-th>
                  <b-th>{{ key.qtdPorcentagem }}</b-th>
                  <b-th>{{ key.valor }}</b-th>
                  <b-th>{{ key.valorPorcentagem }}</b-th>
                </b-tr>
              </b-tbody>
            </b-table-simple>

            <h2>Clientes</h2>
            <b-table-simple v-show="true" :items="clientesDl" id="clientesDl">
              <b-thead>
                <b-tr>
                  <b-td>
                    <span
                      >Relatório Estatístico de Trocas / Ranking Escritório de
                      Vendas --
                      <b>
                        Período : {{ dataDe["_i"] }} Até : {{ dataDe["_i"] }}
                      </b></span
                    >
                  </b-td>
                  <b-td>
                    <span>Setor Atividade: {{ headerObj.setorAtividade }}</span>
                  </b-td>
                  <b-td>
                    <span>Status: {{ headerObj.status }}</span>
                  </b-td>
                  <b-td>
                    <span>Origem: {{ headerObj.origem }}</span>
                  </b-td>
                  <b-td>
                    <span
                      >Escritório Vendas: {{ headerObj.setorAtividade }}</span
                    >
                  </b-td>
                  <b-td>
                    <span>Representantes: {{ headerObj.setorAtividade }}</span>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-th> Ranking </b-th>
                  <b-th> Cod. Cliente </b-th>
                  <b-th> Clientes </b-th>
                  <b-th> Quantidade </b-th>
                  <b-th> Porcentagem Qtd </b-th>
                  <b-th> Valor </b-th>
                  <b-th> Porcentagem Valor </b-th>
                </b-tr>
              </b-thead>
              <b-tbody v-for="(key, acc) in this.clientesDl" :key="acc">
                <b-tr>
                  <b-th>{{ acc }}</b-th>
                  <b-th>{{ key.codCli[0] }}</b-th>
                  <b-th>{{ key.clientes }}</b-th>
                  <b-th>{{ key.quantidade }}</b-th>
                  <b-th>{{ key.porcentagemQtd }}</b-th>
                  <b-th>{{ key.valor }}</b-th>
                  <b-th>{{ key.porcentagemValor }}</b-th>
                </b-tr>
              </b-tbody>
            </b-table-simple>

            <h2>Procedimentos</h2>
            <b-table-simple
              :items="procedimentosDl"
              v-show="true"
              id="procedimentosDl"
            >
              <b-thead>
                <b-tr>
                  <b-td>
                    <span
                      >Relatório Estatístico de Trocas / Ranking Procedimentos
                      --
                      <b>
                        Período : {{ dataDe["_i"] }} Até : {{ dataDe["_i"] }}
                      </b></span
                    >
                  </b-td>
                  <b-td>
                    <span>Setor Atividade: {{ headerObj.setorAtividade }}</span>
                  </b-td>
                  <b-td>
                    <span>Status: {{ headerObj.status }}</span>
                  </b-td>
                  <b-td>
                    <span>Origem: {{ headerObj.origem }}</span>
                  </b-td>
                  <b-td>
                    <span
                      >Escritório Vendas: {{ headerObj.setorAtividade }}</span
                    >
                  </b-td>
                  <b-td>
                    <span>Representantes: {{ headerObj.setorAtividade }}</span>
                  </b-td>
                </b-tr>
                <b-tr>
                  <b-th> Ranking</b-th>
                  <b-th> Procedimento</b-th>
                  <b-th>Ref. Procedimento</b-th>
                  <b-th> Quantidade </b-th>
                  <b-th> Porcentagem Qtd </b-th>
                </b-tr>
              </b-thead>
              <b-tbody v-for="(key, acc) in this.procedimentosDl" :key="acc">
                <b-tr>
                  <b-th>{{ acc }}</b-th>
                  <b-th>{{ key.procedimentos }}</b-th>
                  <b-th>{{ key.codProc[0] }}</b-th>
                  <b-th>{{ key.quantidade }}</b-th>
                  <b-th>{{ key.porcentagemQtd }}</b-th>
                </b-tr>
              </b-tbody>
            </b-table-simple>

            <h2>Defeitos Geral</h2>

            <b-table :items="defeitosGeralDl" id="defeitosGeralDl">
              <template #thead-top>
                <b-tr>
                  <b-td>
                    <span
                      >Relatório Estatístico de Trocas / Ranking Defeitos Geral
                      --
                      <b>
                        Período : {{ dataDe["_i"] }} Até : {{ dataDe["_i"] }}
                      </b></span
                    >
                  </b-td>
                  <b-td>
                    <span>Setor Atividade: {{ headerObj.setorAtividade }}</span>
                  </b-td>
                </b-tr>
              </template>
              <template #thead>
                <b-tr>
                  <b-th>Defeito</b-th>
                  <b-th>Quantidade</b-th>
                  <b-th>Quantidade %</b-th>
                  <b-th>Valor</b-th>
                  <b-th>Valor %</b-th>
                </b-tr>
              </template>

              <template #cell(qtdPorcentagem)="data">
                {{ data.value.toFixed(2) }}
              </template>
            </b-table>

            <h2>RefsGeral DL</h2>

            <table id="refsGeralDl">
              <thead>
                <tr>
                  <th>Dt. Receb</th>
                  <th>Dt. Conclusão</th>
                  <th>Numero WT</th>
                  <th>Escritório</th>
                  <th>Cliente</th>
                  <th>Rep.</th>
                  <th>Cod. Cliente</th>
                  <th>Referencia</th>
                  <th>Defeito</th>
                  <th>Qtd</th>
                  <th>Procedimento</th>

                  <th>Valor Individual</th>
                  <th>Porc Valor (%)</th>
                  <th>Porc. Qtd (%)</th>
                </tr>
              </thead>
              <tbody v-for="(i, acc) in referenciasGeral" :key="acc">
                <tr v-for="(e, acc2) in i.registros" :key="acc2">
                  <td>{{ e.dtReceb }}</td>
                  <td>{{ e.dtFinalizacao }}</td>
                  <td>{{ e.numPedido }}</td>
                  <td>{{ e.escritorio }}</td>
                  <td>{{ e.clienteDesc }}</td>
                  <td> {{ e.userName }} </td>
                  <td>{{ e.cliente }}</td>
                  <td>{{ e.referencia }}</td>
                  <td>{{ e.descDefeito }}</td>
                  <td>{{ e.quantidade }}</td>
                  <td>{{ e.descProc }}</td>

                  <td>{{ e.valor }}</td>
                  <td>{{ i.valorPorc }}</td>
                  <td>{{ i.qtdPorcentagem }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="button-area">
            
            <b-button class="export-options" variant="outline-secondary">
              <export-excel
                :data="lstRefs"
                :title="`Ranking por Defeitos Referência`"
                :name="`DEFxREF.xls`"
              >
                <img :src="require(`@/assets/excelicon.png`)" />
              </export-excel>
            </b-button>
           
          </div>
        </div>
      </b-collapse>

      <hr class="my-4" v-show="lstRefs.length > 0" />
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { mapState } from "vuex";
//import ExportExcelSheetVueJs from "export-excel-sheet-vue-js";
//import { format, addMonths} from "date-fns";
import { baseApiUrl, showError } from "@/global";
import Spinner from "../template/Spinner.vue";
import axios from "axios";
import _ from "underscore";
import JqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";
import VueMonthlyPicker from "vue-monthly-picker";
//import downloadPdf from '../commons/downloadPdf.vue';
//import { format, parseISO } from "date-fns";
//import downloadPdfVue from '../commons/downloadPdf.vue';
import * as XLSX from "xlsx";
import { use } from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
} from "echarts/charts";
use([CanvasRenderer]);
use([SVGRenderer]);
// import {
//     UniversalTransition,
//     LabelLayout
// } from './export/features';
import {
  GridComponent,
  PolarComponent,
  GeoComponent,
  SingleAxisComponent,
  ParallelComponent,
  CalendarComponent,
  GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  AxisPointerComponent,
  BrushComponent,
  TitleComponent,
  TimelineComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  LegendComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,
  AriaComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components";

import VChart, { THEME_KEY } from "vue-echarts";

//import { tablesToExcel } from "../../mixins/exportToExcel.js";

use([
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
  GridComponent,
  PolarComponent,
  GeoComponent,
  SingleAxisComponent,
  ParallelComponent,
  CalendarComponent,
  GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  AxisPointerComponent,
  BrushComponent,
  TitleComponent,
  TimelineComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  LegendComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,
  AriaComponent,
  DatasetComponent,
  TransformComponent,

  //tablesToExcel
]);

export default {
  name: "RelatorioEstaticTroca",
  components: { PageTitle, Spinner, JqxComboBox, VChart, VueMonthlyPicker },
  computed: {
    ...mapState(["serverMessages", "language", "traduction", "user"]),
  },
  provide: {
    [THEME_KEY]: "dark",
  },
  data: function() {
    return {
      output: null,
      locale: "pt-BR",
      months: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      fieldsDef: [
        {
          0: "Tecido",
          1: "Arco",
          2: "Bojo",
          3: "Elástico",
          4: "Alça",
          5: "Fecho",
          6: "Substituição de Produtos",
          7: "Acessórios",
          8: "Etiqueta",
          9: "Silicone",
        },
      ],
      //tablesToExcel: tablesToExcel,
      control: 0,
      controlRef: 0,
      controlCli: 0,
      controlRep: 0,
      controlEsc: 0,
      spinner: false,
      dataDe: null,
      defeitoControl: null,
      referenciaControl: null,
      referenciaControl2: null,
      clienteControl: null,
      clienteControl2: null,
      repControl: null,
      repControl2: null,
      reoControl3: null,
      escControl: null,
      escControl2: null,
      escControl3: null,
      dataAte: null,
      //Area de declaração dos arrays originais API
      lstTrocasOriginal: [],
      transitionArray: [],
      lstQtdFatOriginal: [],
      lstProcedimentos: [],
      copylstTrocaOriginal: [],
      lstDefeitos: [],
      lstDefFiltered: [],
      arrayDefAcumulado: [],
      lstRefs: [],
      lstEscritoriosOriginal: [],
      lstEscritorios: [],
      fieldsQtdFat: [],
      lstQtdItens: [],
      lstSetores: [],
      lstFieldsDef: [],
      lstReps: [],
      lstStatus: [
        { id: "A", text: "Wts em Aberto" },
        { id: "T", text: "Wts Finalizadas" },
      ],
      lstOrigens: [
        { id: "PF", text: "Consumidor Final" },
        { id: "PJ", text: "Pessoa Jurídica" },
      ],

      //Declaração controle de idiomas Date Picker
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
      testeTable: null,
      testePass: false,
      headerObj: {},
      defeitosGrupoDl: null,
      escVendasDl: null,
      testeFields: [{}],
      fieldsEscVendasDl: [
        {
          Ranking: "ranking",
          Grupo: "grupo",
          Qtd: "quantidade",
          "% Qtd": "porcentagemQtd",
          Valor: "valor",
          "% Valor": "porcentagemValor",
        },
      ],
      repsDl: null,
      clientesDl: null,
      procedimentosDl: null,
      defeitosGeralDl: null,
      refsGeralDl: [],
      referenciasGeral: null,
      fields: [],
      lstFieldsRef: [],
      arrayProcedimentos: [],
      arrayClientes: [],
      jsonDados: [],
      arrayDefeitos: [],
      arrayRepresentantes: [],
      arrayEscritorios: [],
      arrayToChartRefs: [["Referencia", "Quantidade"]],
      chartOptions: {
        chart: {
          title: "Company Performance",
          subtitle: "Sales, Expenses, and Profit: 2014-2017",
        },
      },
      chartEvents: {
        select: () => {},
      },
      // Grafico de Defeitos
      optionDef1: {
        title: { text: "Indicadores de Defeitos Agrupados", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionDef2: {
        title: { text: "Indicadores de Defeitos Detalhado", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionDef3: {
        title: {
          text: "Indicadores de Referencias por Defeitos",
          left: "center",
        },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionDef4: {
        title: { text: "Indicadores de Clientes por Defeitos", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },

      // Grafico de Procedimentos
      optionProc: {
        title: { text: "Indicadores Procedimentos", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },

      // Grafico de Referencias
      optionRef: {
        title: { text: "Indicadores Referências", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        dataZoom: [
          { type: "inside", start: 0, end: 10 },
          { start: 0, end: 10 },
        ],
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionRef2: {
        title: { text: "Defeitos", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionRef3: {
        title: { text: "Defeitos detalhados", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionRef4: {
        title: { text: "Clientes", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },

      // Grafico de Clientes
      optionCli: {
        title: { text: "Indicadores Clientes", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        dataZoom: [
          { type: "inside", start: 0, end: 10 },
          { start: 0, end: 10 },
        ],
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionCli2: {
        title: { text: "Defeitos", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionCli3: {
        title: { text: "Defeitos detalhados", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionCli4: {
        title: { text: "Referencias", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        dataZoom: [
          { type: "inside", start: 0, end: 10 },
          { start: 0, end: 10 },
        ],
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },

      // Grafico de Reoresentantes
      optionRep: {
        title: { text: "Indicadores Representantes", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        dataZoom: [
          { type: "inside", start: 0, end: 10 },
          { start: 0, end: 10 },
        ],
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionRep2: {
        title: { text: "Defeitos", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionRep3: {
        title: { text: "Defeitos detalhados", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionRep4: {
        title: { text: "Referencias", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        dataZoom: [
          { type: "inside", start: 0, end: 10 },
          { start: 0, end: 10 },
        ],
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionRep5: {
        title: { text: "Clientes", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },

      // Grafico de Reoresentantes
      optionEscr: {
        title: { text: "Indicadores Escritorio", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        dataZoom: [
          { type: "inside", start: 0, end: 10 },
          { start: 0, end: 10 },
        ],
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionEscr2: {
        title: { text: "Defeitos", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionEscr3: {
        title: { text: "Defeitos detalhados", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionEscr4: {
        title: { text: "Referencias", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        dataZoom: [
          { type: "inside", start: 0, end: 10 },
          { start: 0, end: 10 },
        ],
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
      optionEscr5: {
        title: { text: "Clientes", left: "center" },
        visualMap: { color: ["#65B581", "#FFCE34", "#FD665F"] },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      },
    };
  },
  methods: {
    xlsxExport() {
      this.json_body = document.getElementById("refsGeralDl");
      // console.log(XLSX);
      // console.log(this.json_body);

      var workbook = XLSX.utils.table_to_book(this.json_body);

      // Process Data (add a new row)
      var ws = workbook.Sheets["RefsGeral"];
      XLSX.utils.sheet_add_aoa(ws, [["Created " + new Date().toISOString()]], {
        origin: -1,
      });

      // Package and Release Data (`writeFile` tries to write and save an XLSB file)
      XLSX.writeFile(workbook, "RelatorioEstatRefs.xlsx");
    },
    tablesToExcel: (function() /* eslint-disable no-mixed-spaces-and-tabs */
    {
      var uri = "data:application/vnd.ms-excel;base64,",
        tmplWorkbookXML =
          '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
          '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>CMR IND COMÉRCIO</Author><Created>{created}</Created></DocumentProperties>' +
          "<Styles>" +
          '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>' +
          '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>' +
          "</Styles>" +
          "{worksheets}</Workbook>",
        tmplWorksheetXML =
          '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>',
        tmplCellXML =
          '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>',
        base64 = function(s) {
          return window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function(s, c) {
          return s.replace(/{(\w+)}/g, function(m, p) {
            return c[p];
          });
        };
      return function(tables, wsnames, wbname, appname) {
        var ctx = "";
        var workbookXML = "";
        var worksheetsXML = "";
        var rowsXML = "";

        for (var i = 0; i < tables.length; i++) {
          if (!tables[i].nodeType)
            tables[i] = document.getElementById(tables[i]);
          for (var j = 0; j < tables[i].rows.length; j++) {
            rowsXML += "<Row>";
            for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
              var dataType = tables[i].rows[j].cells[k].getAttribute(
                "data-type"
              );
              var dataStyle = tables[i].rows[j].cells[k].getAttribute(
                "data-style"
              );
              var dataValue = tables[i].rows[j].cells[k].getAttribute(
                "data-value"
              );
              dataValue = dataValue
                ? dataValue
                : tables[i].rows[j].cells[k].innerHTML;
              var dataFormula = tables[i].rows[j].cells[k].getAttribute(
                "data-formula"
              );
              dataFormula = dataFormula
                ? dataFormula
                : appname == "Calc" && dataType == "DateTime"
                ? dataValue
                : null;
              ctx = {
                attributeStyleID:
                  dataStyle == "Currency" || dataStyle == "Date"
                    ? ' ss:StyleID="' + dataStyle + '"'
                    : "",
                nameType:
                  dataType == "Number" ||
                  dataType == "DateTime" ||
                  dataType == "Boolean" ||
                  dataType == "Error"
                    ? dataType
                    : "String",
                data: dataFormula ? "" : dataValue,
                attributeFormula: dataFormula
                  ? ' ss:Formula="' + dataFormula + '"'
                  : "",
              };
              rowsXML += format(tmplCellXML, ctx);
            }
            rowsXML += "</Row>";
          }
          ctx = { rows: rowsXML, nameWS: wsnames[i] || "Sheet" + i };
          worksheetsXML += format(tmplWorksheetXML, ctx);
          rowsXML = "";
        }

        ctx = { created: new Date().getTime(), worksheets: worksheetsXML };
        workbookXML = format(tmplWorkbookXML, ctx);
        console.log(workbookXML);
        var link = document.createElement("A");
        link.href = uri + base64(workbookXML);
        link.download = wbname || "Workbook.xls";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      /* eslint-disable no-mixed-spaces-and-tabs */
    })(),

    manageData() {
   
      //Montar tabelas exatamente como o aparencia desejada do download de excel,
      //pois o script pega as informações da tabela montada e gera o arquivo
      // ou seja tabela === download
      // Valortotal x porcentagem = valoratual x 100

      this.headerObj.setorAtividade = this.$refs.comboSetor.getCheckedItems();
      if (this.headerObj.setorAtividade.length === this.lstSetores.length) {
        this.headerObj.setorAtividade = "TODOS";
      } else {
        this.headerObj.setorAtividade = `${this.setorAtividade.length} de ${this.lstSetores.length}`;
      }
      let objStatus = this.$refs.comboStatus.getCheckedItems();
      if (!objStatus.label) {
        
        console.log('objstatus', objStatus, objStatus[0].label)
        console.log(objStatus)
        this.headerObj.status = objStatus[0].label;
      }

      this.headerObj.origem = this.$refs.comboOrigem.getCheckedItems();
      if (this.headerObj.origem.length === 2) {
        this.headerObj.origem = "TODOS";
      }
      this.headerObj.escVendas = this.$refs.comboEscr.getCheckedItems();
      if (this.headerObj.escVendas.length === this.lstEscritorios.length) {
        this.headerObj.escVendas = "TODOS";
      }
      this.headerObj.reps = this.$refs.comboReps.getCheckedItems();
      if (this.headerObj.reps.length === this.lstReps.length) {
        this.headerObj.reps = "TODOS";
      }

      //console.log('header alltables', this.headerObj)

      /* TOTAIS ARRAYDEFEITOS */

      let qtdDefTotais = null;
      let valorDefTotais = null;

      this.arrayDefeitos.forEach((el) => {
        qtdDefTotais += _.reduce(
          el.registros,
          (current, ele) => {
            return current + ele.valor;
          },
          0
        );
        valorDefTotais += _.reduce(
          el.registros,
          (current, ele) => {
            return current + ele.quantidade;
          },
          0
        );
      });

      //let defeitosGrupo = this.arrayDefeitos
      console.log("Realizando Download", valorDefTotais, qtdDefTotais);
      //  defeitosGrupo.forEach((el, acc) => {
      //   _.extend(el, { nome: el.registros[acc].descDefeito , valor: _.reduce(el.registros, (current, elem)=> {return current + elem.valor}, 0), quantidade:  _.reduce(el.registros, (current, elem) => {return current + elem.quantidade}, 0), qtdPorcentagem: parseFloat(((_.reduce(el.registros, (current, elem) => {return current + elem.quantidade}, 0))*100/qtdDefTotais)).toFixed(2) , valorPorcentagem: parseFloat(((_.reduce(el.registros, (current, elem)=> {return current + elem.valor}, 0))*100)/valorDefTotais).toFixed(2), })
      //   })
      //let qtdDefTotais = _.reduce(this.lstTrocasOriginal)

      let defeitosGrupo = _.map(
        _.groupBy(this.lstTrocasOriginal, (el) => {
          return el.descDefeito;
        }),
        (value, key) => {
          return {
            ranking: key.replace(/[^0-9.]/g, ""),
            name1: key,
            valor: _.reduce(
              value,
              (current, elem) => {
                return current + elem.valor;
              },
              0
            ),
            quantidade: _.reduce(
              value,
              (current, ele) => {
                return current + ele.quantidade;
              },
              0
            ),
          };
        }
      );

      /*Totais Defeitos Grupo */
      let defeitosTotaisQtd = _.reduce(
        defeitosGrupo,
        (current, elem) => {
          return current + elem.quantidade;
        },
        0
      );
      let defeitosTotaisVlr = _.reduce(
        defeitosGrupo,
        (current, elem) => {
          return current + elem.valor;
        },
        0
      );
      //console.log("defs totais", defeitosTotaisQtd, defeitosTotaisVlr);
      defeitosGrupo.forEach((el) => {
        el.valor = parseFloat(el.valor).toFixed(2);
        _.extend(el, {
          valorPorcentagem: parseFloat(
            (el.valor * 100) / defeitosTotaisVlr
          ).toFixed(2),
          qtdPorcentagem: parseFloat(
            (el.quantidade * 100) / defeitosTotaisQtd
          ).toFixed(2),
        });
      });

      defeitosGrupo.forEach((el) => {
        delete el.registros;
        return el;
      });
      this.defeitosGrupoDl = _.sortBy(defeitosGrupo, "valor");
      this.defeitosGrupoDl = this.defeitosGrupoDl.reverse();
     // console.log("defeitosGrupo", this.defeitosGrupoDl);

      /* Escritorio Vendas Grupo */

      let escritoriosTotais = _.reduce(
        this.lstTrocasOriginal,
        (current, elem) => {
          return current + elem.quantidade;
        },
        0
      );
      let escritoriosTotaisVlr = _.reduce(
        this.lstTrocasOriginal,
        (current, elem) => {
          return current + elem.valor;
        },
        0
      );
      //console.log(escritoriosTotais, escritoriosTotaisVlr);
      let escritoriosGrupo = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.escritorio;
        }),
        (value, key) => {
          return {
            escritorios: key,
            quantidade: _.reduce(
              value,
              (current, elem) => {
                return current + elem.quantidade;
              },
              0
            ),
            valor: _.reduce(
              value,
              (current, elem) => {
                return current + elem.valor;
              },
              0
            ),
          };
        }
      );
      this.escVendasDl = _.sortBy(escritoriosGrupo, "quantidade");
      this.escVendasDl.forEach((el) => {
        el.valor = parseFloat(el.valor).toFixed(2);
        _.extend(el, {
          porcentagemQtd: parseFloat(
            (el.quantidade * 100) / escritoriosTotais
          ).toFixed(2),
          porcentagemValor: parseFloat(
            (el.valor * 100) / escritoriosTotaisVlr
          ).toFixed(2),
        });
      });

      //console.log("escritorios Grupo - ok calcular totais", escritoriosGrupo);

      /* Clientes Grupo */

      let clientesGrupo = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.clienteDesc;
        }),
        (value, key) => {
          return {
            codCli: _.map(value, (e) => {
              return e.cliente;
            }),
            quantidade: _.reduce(
              value,
              (current, elem) => {
                return current + elem.quantidade;
              },
              0
            ),
            valor: _.reduce(
              value,
              (current, elem) => {
                return current + elem.valor;
              },
              0
            ),
            clientes: key,
            registros: value,
          };
        }
      );

      clientesGrupo.forEach((el) => {
        el.valor = parseFloat(el.valor).toFixed(2);
        el.codCli = _.uniq(JSON.parse(JSON.stringify(el.codCli)));

        _.extend(el, {
          porcentagemQtd: parseFloat(
            (el.quantidade * 100) / escritoriosTotais
          ).toFixed(2),
          porcentagemValor: parseFloat(
            (el.valor * 100) / escritoriosTotaisVlr
          ).toFixed(2),
        });
      });

      clientesGrupo.forEach((el) => {
        delete el.registros;
        return el;
      });

      this.clientesDl = _.sortBy(clientesGrupo, "quantidade");
      this.clientesDl.reverse();
      // console.log(
      //   "clientesGrupo - ok sort by e calcular totais",
      //   clientesGrupo
      // );

      /* Procedimentos Grupo */
      let procedimentosGrupo = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.descProc;
        }),
        (value, key) => {
          return {
            codProc: _.map(value, (e) => {
              return e.codProcedimento;
            }),
            quantidade: _.reduce(
              value,
              (current, elem) => {
                return current + elem.quantidade;
              },
              0
            ),
            valor: _.reduce(
              value,
              (current, elem) => {
                return current + elem.valor;
              },
              0
            ),
            procedimentos: key,
            registros: value,
            totais: parseFloat(
              _.reduce(
                value,
                (current, ele) => {
                  {
                    return current + ele.valor * ele.quantidade;
                  }
                },
                0
              )
            ).toFixed(2),
          };
        }
      );

     // console.log(procedimentosGrupo);

      /* Totais Procedimentos Grupo */
      let vlrTotalProcedimentos = _.reduce(
        procedimentosGrupo,
        (current, el) => {
          return current + el.valor;
        },
        0
      ).toFixed(2);
      let qntTotalProcedimentos = _.reduce(
        procedimentosGrupo,
        (current, el) => {
          return current + el.quantidade;
        },
        0
      ).toFixed(2);

      // console.log(
      //   "totaisProcedimentos",
      //   vlrTotalProcedimentos,
      //   qntTotalProcedimentos
      // );

      procedimentosGrupo.forEach((el) => {
        el.valor = parseFloat(el.valor).toFixed(2);
        el.codProc = _.uniq(el.codProc);
        //console.log("forEach proc", el);
        _.extend(el, {
          porcentagemQtd: parseFloat(
            (el.quantidade * 100) / qntTotalProcedimentos
          ).toFixed(2),
          porcentagemValor: parseFloat(
            (el.valor * 100) / vlrTotalProcedimentos
          ).toFixed(2),
        });
      });
      procedimentosGrupo.forEach((el) => {
        delete el.registros;
        return el;
      });
      this.procedimentosDl = _.sortBy(procedimentosGrupo, "quantidade");
      this.procedimentosDl.reverse();
      // console.log(
      //   "procedimentoGrupo- ok  calcular porcentagem",
      //   procedimentosGrupo
      // );

      /* Referencias Grupo */
      /*eslint-disable*/
      let referenciasGrupo = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.referencia;
        }),
        (value, key) => {
          return {
            referencia: key,
            registros: value,
            totais: _.reduce(
              value,
              (current, ele) => {
                {
                  return current + ele.valor * ele.quantidade;
                }
              },
              0
            ),
          };
        }
      );

      console.log("referenciasGrupo - ok calcular totais", referenciasGrupo);

      /* Representantes Grupo */

      let representantesGrupo = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.userName;
        }),
        (value, key) => {
          return {
            representante: key,
            registros: value,
            quantidade: _.reduce(
              value,
              (current, elem) => {
                return current + elem.quantidade;
              },
              0
            ),
            valor: _.reduce(
              value,
              (current, elem) => {
                return current + elem.valor;
              },
              0
            ),
          };
        }
      );

      let repsTotais = _.reduce(
        representantesGrupo,
        (current, elem) => {
          return current + elem.quantidade;
        },
        0
      );
      let repsTotaisVlr = _.reduce(
        representantesGrupo,
        (current, elem) => {
          return current + elem.valor;
        },
        0
      );

      representantesGrupo.forEach((el) => {
        el.valor = el.valor.toFixed(2);
        _.extend(el, {
          qtdPorcentagem: parseFloat(
            (el.quantidade * 100) / repsTotais
          ).toFixed(2),
          valorPorcentagem: parseFloat(
            (el.valor * 100) / repsTotaisVlr
          ).toFixed(2),
        });
      });

      representantesGrupo.forEach((el) => {
        delete el.registros;
        return el;
      });
      this.repsDl = _.sortBy(representantesGrupo, "quantidade");
      this.repsDl.reverse();
      // console.log(
      //   "representantesGrp -ok nomes mais totais",
      //   representantesGrupo
      // );

      /* Defeitos Geral Grupo */
      let defeitosGeralGrupo = this.arrayDefAcumulado;

      let defGeralTotais = _.reduce(
        defeitosGeralGrupo,
        (current, elem) => {
          return current + elem.quantidade;
        },
        0
      );

      defeitosGeralGrupo.forEach((elem) => {
        elem.valores = _.filter(this.lstTrocasOriginal, (eleme) => {
          return eleme.descDefeito === elem.defeito;
        });
        _.extend(elem, {
          quantidadePorc: parseFloat(
            (elem.quantidade * 100) / defGeralTotais
          ).toFixed(2),
          valoresInd: _.reduce(
            elem.valores,
            (current, element) => {
              return element.valor + current;
            },
            0
          ).toFixed(2),
          nome: _.find(elem.registros, (eleme) => {
            return eleme.referencia;
          }),
        });
      });

      /* Totais Defeitos Geral Grupo */
      let defGeralTotal = _.reduce(
        defeitosGeralGrupo,
        (current, e) => {
          return parseFloat(e.valoresInd) + current;
        },
        0
      ).toFixed(2);
      //console.log("dd", defGeralTotal, defGeralTotais, "defGeralTotais");
      defeitosGeralGrupo.forEach((el) => {
        el.valorPorcentagem = parseFloat(
          (el.valoresInd * 100) / defGeralTotal
        ).toFixed(2);
        delete el.subitens;
        delete el.valores;
        return el;
      });
      this.defeitosGeralDl = _.sortBy(defeitosGeralGrupo, "defeito").reverse();

      //console.log("defeitosGeral", defeitosGeralGrupo, this.defeitosGeralDl);

      /* Referencias Geral Grupo */
      this.referenciasGeral = [];
      this.referenciasGeral = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.descDefeito;
        }),
        (value, key) => {
          return {
            defeito: key,
            registros: value,
            quantidade: _.reduce(
              value,
              (current, elem) => {
                return current + elem.quantidade;
              },
              0
            ),
            valor: parseFloat(
              _.reduce(
                value,
                (current, elem) => {
                  return current + elem.valor;
                },
                0
              )
            ).toFixed(2),
          };
        }
      );
      console.log("refsGeralGrupo", this.referenciasGeral);
      let qtdGeralGrupo = _.reduce(
        this.referenciasGeral,
        (current, el) => {
          return current + parseFloat(el.quantidade);
        },
        0
      );
      let vlrGeralGrupo = _.reduce(
        this.referenciasGeral,
        (current, el) => {
          return current + parseFloat(el.valor);
        },
        0
      );

      this.referenciasGeral.forEach((ele) => {
        _.extend(ele, {
          qtdPorcentagem: parseFloat(
            (ele.quantidade * 100) / qtdGeralGrupo
          ).toFixed(2),
          valorPorc: parseFloat((ele.valor * 100) / vlrGeralGrupo).toFixed(2),
        });
      });

      let newRefsGeral = _.groupBy(this.referenciasGeral, "quantidade");
      // console.log(
      //   "gerais refGeralGrupo",
      //   qtdGeralGrupo,
      //   vlrGeralGrupo,
      //   this.referenciasGeral,
      //   newRefsGeral
      // );

      //console.log(this.referenciasGeral, "itemtable");

      /* defeitos geral todos  */

      this.spinner = false
    },
    fnDownloadPdf() {
      this.spinner = true;
      window.html2canvas = html2canvas;
      let elem = this.$el.querySelectorAll(".printMe");

      let width = window.innerWidth - 288;
      let height = window.innerHeight - 200;

      var doc = new jsPDF("l", "px", [width, height]);

      doc.html(elem[0], {
        callback: function(pdf) {
          pdf.save("RelatorioEstatisticoTrocaCompleto.pdf");
        },
      });

      this.spinner = false;
    },
    clearData() {
      //#region Limpar options
      // Grafico de Defeitos
      (this.optionDef1 = {
        title: { text: "Indicadores de Defeitos Agrupados", left: "center" },
        xAxis: { data: [] },
        yAxis: { type: "value" },
        series: [{ data: [], type: "bar" }],
        tooltip: { trigger: "item", formatter: "" },
      }),
        (this.optionDef2 = {
          title: { text: "Indicadores de Defeitos Detalhado", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionDef3 = {
          title: {
            text: "Indicadores de Referencias por Defeitos",
            left: "center",
          },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionDef4 = {
          title: {
            text: "Indicadores de Clientes por Defeitos",
            left: "center",
          },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        // Grafico de Procedimentos
        (this.optionProc = {
          title: { text: "Indicadores Procedimentos", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        // Grafico de Referencias
        (this.optionRef = {
          title: { text: "Indicadores Referências", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          dataZoom: [
            { type: "inside", start: 0, end: 10 },
            { start: 0, end: 10 },
          ],
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionRef2 = {
          title: { text: "Defeitos", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionRef3 = {
          title: { text: "Defeitos detalhados", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionRef4 = {
          title: { text: "Clientes", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        // Grafico de Clientes
        (this.optionCli = {
          title: { text: "Indicadores Clientes", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          dataZoom: [
            { type: "inside", start: 0, end: 10 },
            { start: 0, end: 10 },
          ],
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionCli2 = {
          title: { text: "Defeitos", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionCli3 = {
          title: { text: "Defeitos detalhados", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionCli4 = {
          title: { text: "Referencias", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          dataZoom: [
            { type: "inside", start: 0, end: 10 },
            { start: 0, end: 10 },
          ],
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        // Grafico de Reoresentantes
        (this.optionRep = {
          title: { text: "Indicadores Representantes", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          dataZoom: [
            { type: "inside", start: 0, end: 10 },
            { start: 0, end: 10 },
          ],
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionRep2 = {
          title: { text: "Defeitos", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionRep3 = {
          title: { text: "Defeitos detalhados", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionRep4 = {
          title: { text: "Referencias", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          dataZoom: [
            { type: "inside", start: 0, end: 10 },
            { start: 0, end: 10 },
          ],
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionRep5 = {
          title: { text: "Clientes", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        // Grafico de Reoresentantes
        (this.optionEscr = {
          title: { text: "Indicadores Escritorio", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          dataZoom: [
            { type: "inside", start: 0, end: 10 },
            { start: 0, end: 10 },
          ],
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionEscr2 = {
          title: { text: "Defeitos", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionEscr3 = {
          title: { text: "Defeitos detalhados", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionEscr4 = {
          title: { text: "Referencias", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          dataZoom: [
            { type: "inside", start: 0, end: 10 },
            { start: 0, end: 10 },
          ],
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        }),
        (this.optionEscr5 = {
          title: { text: "Clientes", left: "center" },
          xAxis: { data: [] },
          yAxis: { type: "value" },
          series: [{ data: [], type: "bar" }],
          tooltip: { trigger: "item", formatter: "" },
        });
      //#endregion
    },
    checkAll() {
      this.$refs.comboEscr.checkAll();
    },
    unCheckAll() {
      this.$refs.comboEscr.uncheckAll();
    },
    checkAllRep() {
      this.$refs.comboReps.checkAll();
    },
    unCheckAllRep() {
      this.$refs.comboReps.uncheckAll();
    },
    //Buscando dados de troca dentro do período informado.
    searchTrocas() {
      if (this.dataDe === null || this.dataAte === null) {
        showError("Selecione um período válido");
        return;
      }
      this.arrayToChartRefs = [];
      this.lstDefFiltered = [];
      this.lstQtdItens = [];
      this.lstFieldsDef = [];
      this.lstFieldsRef = [];
      this.fields = [];
      this.lstRefs = [];
      this.spinner = true;

      const data1 =
        this.dataAte._i.substr(5).length === 1
          ? this.dataAte._i.replace("/", "-0") + "-31"
          : this.dataAte._i.replace("/", "-") + "-31";
      const data2 =
        this.dataDe._i.substr(5).length === 1
          ? this.dataDe._i.replace("/", "-0") + "-01"
          : this.dataDe._i.replace("/", "-") + "-01";
      this.spinner = true;
      const url = `${baseApiUrl}/pedido/getmanutencaotroca`;
      axios
        .post(url, {
          pAbertas: "T",
          pDtAte: data1,
          pDtDe: data2,
          PNumPedido: "",
          PSetor: "",
          PUser: "",
          TInpDefeitos: [],
          TInpProcedimentos: [],
          TInpRepresentantes: [],
          language: this.language,
        })
        .then((resp) => {
          if (resp.data.result === "OK") {
            this.lstTrocasOriginal = resp.data.trocasRQ;

            this.lstTrocasOriginal = this.lstTrocasOriginal.map((el) => {
              return {
                ...el,
                escritorio: _.find(this.lstReps, (ele) => {
                  return ele.id === el.userName;
                })
                  ? _.find(this.lstReps, (ele) => {
                      return ele.id === el.userName;
                    })["descEscr"]
                  : "Não identificado",
              };
            });

            this.copylstTrocaOriginal = this.lstTrocasOriginal;

            this.spinner = false;
            this.trataDados();
            this.getQtdFaturada();
          }
        })
        .catch(() => {
          showError(this.traduction.serverError);
          this.spinner = false;
        });
    },
    //Buscando Consolidado de quantidade faturada
    getQtdFaturada() {
      const data1 =
        this.dataAte._i.substr(5).length === 1
          ? this.dataAte._i.replace("/", "0")
          : this.dataAte._i.replace("/", "");
      const data2 =
        this.dataDe._i.substr(5).length === 1
          ? this.dataDe._i.replace("/", "0")
          : this.dataDe._i.replace("/", "");
      //
      const url = `${baseApiUrl}/cliente/GetQuantidadeFaturada`;
      axios
        .post(url, {
          mesanoini: data2,
          mesanofim: data1,
        })
        .then((resp) => {
          if (resp.data.result === "OK") {
            //console.log("resp", resp);
            this.lstQtdFatOriginal = resp.data.quantidadeFaturada;
            let psac = _.sortBy(
              _.map(
                _.groupBy(this.lstTrocasOriginal, function(tr) {
                  return tr.dtEmissao.substr(0, 7);
                }),
                function(values, key) {
                  return {
                    mesAno: key.substr(0, 4) + key.substr(5, 2),
                    qtd: _.reduce(
                      values,
                      function(memo, tr) {
                        return memo + tr.quantidade;
                      },
                      0
                    ),
                  };
                }
              ),
              function(ob) {
                return ob.mesAno;
              }
            );

            this.fieldsQtdFat = _.sortBy(
              _.uniq(_.pluck(_.union(psac, this.lstQtdFatOriginal), "mesAno")),
              function(rg) {
                return rg;
              }
            );

            this.fieldsQtdFat.forEach((el) => {
              let objSac = _.find(psac, (e) => {
                return e.mesAno === el;
              });
              let qtdSac = objSac ? objSac.qtd : 0;

              let objFat = _.find(this.lstQtdFatOriginal, (e) => {
                return e.mesAno === el;
              });
              let qtdFat = objFat ? objFat.qtd : 0;

              let strucTable = {};
              strucTable.mesAno = el;
              strucTable.qtdFat = qtdFat;
              strucTable.qtdSac = qtdSac;
              strucTable.percDef = qtdFat > 0 ? (qtdSac / qtdFat) * 100 : 0;
              this.lstQtdItens.push(strucTable);
            });

            let objTemp = this.transformLines(
              this.dataDe._i.replace("/", ""),
              this.dataAte._i.replace("/", ""),
              this.lstQtdItens
            );
            this.lstQtdItens = objTemp.listItens;
            this.fields = objTemp.listHeaders;
            //
          }
        })
        .catch(() => {
          showError(this.traduction.serverError);
          this.spinner = false;
        });
    },
    //Buscando lista de Defeitos e Procedimentos para serem usados posterioremente nos gráficos
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
    //Buscando escritório de vendas e suas respectivas equipes para montagem dos filtros iniciais em tela
    async loadEscritorio() {
      const url = `${baseApiUrl}/pedido/getescritorio`;
      this.spinner = true;
      await axios
        .post(url, {
          language: this.language,
          loginUsuario: this.user.loginUsuario,
        })
        .then((resp) => {
          //adaptar relatório clientes a partir desse then
          this.lstEscritoriosOriginal = resp.data.escritorioVendas;
          this.lstEscritorios = resp.data.escritorioVendas.map((el) => {
            return {
              id: el.id,
              name: `${el.id} - ${el.descricao}`,
            };
          });

          this.lstEscritoriosOriginal.forEach((el) => {
            this.lstReps = this.lstReps.concat(
              el.representantes.map((ele) => {
                return {
                  id: ele.id,
                  escr: el.id,
                  descEscr: el.descricao,
                  grupo: ele.grpVendedores,
                  nome: ele.nome,
                };
              })
            );
          });
        })
        .catch(() => {
          showError(this.traduction.serverError);
        });
      this.spinner = false;
    },
    trataDados() {
      //Tratando dados para combo setor de atividade
      this.lstSetores = _.map(this.lstTrocasOriginal, (el) => {
        return {
          id: el.setor,
          descr: el.setorDesc,
        };
      });
      this.lstSetores = _.uniq(this.lstSetores, (el) => el.id);
      this.$refs.comboSetor.source = this.lstSetores;
      this.$refs.comboReps.source = this.lstReps;

      // console.log(
      //   "teste fitler",
      //   _.filter(this.lstTrocasOriginal, (e) => {
      //     return e["setor"] === "11";
      //   })
      // );
      //Tratando dados para combo Escritorio de Vendas

      this.$refs.comboEscr.source = this.lstEscritorios;

      this.$refs.comboEscr.checkAll();
      this.$refs.comboSetor.checkAll();
      this.$refs.comboStatus.checkAll();
      this.$refs.comboOrigem.checkAll();
      this.$refs.comboReps.checkAll();
    },
    //#region  Eventos para Grafico de Defeitos
    showInfoDef(eventInfo) {
      this.control = 1;

      this.optionDef2.xAxis.data = [];
      this.optionDef2.series[0].data = [];
      this.transitionArray = _.find(this.arrayDefAcumulado, (el) => {
        return el.defeito === eventInfo.name;
      })["subitens"];

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Defeitos
      this.transitionArray.forEach((element) => {
        this.optionDef2.xAxis.data.push(element.defeito);
        this.optionDef2.series[0].data.push(element.quantidade);
      });
    },
    showInfoDef2(eventInfo) {
      this.control = 2;
      this.defeitoControl = eventInfo.name;
      this.optionDef3.xAxis.data = [];
      this.optionDef3.series[0].data = [];
      //this.transitionArray = _.find(this.arrayDefAcumulado, el => { return el.defeito === eventInfo.name})["subitens"]

      this.arrayDefAcumulado.forEach((el) => {
        el.subitens.forEach((ele) => {
          if (ele.defeito === eventInfo.name) {
            this.transitionArray = ele.subitens;
          }
        });
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Defeitos
      this.transitionArray.forEach((element) => {
        this.optionDef3.xAxis.data.push(element.referencia);
        this.optionDef3.series[0].data.push(element.quantidade);
      });
    },
    showInfoDef3(eventInfo) {
      this.control = 3;

      this.optionDef4.xAxis.data = [];
      this.optionDef4.series[0].data = [];

      this.arrayDefAcumulado.forEach((el) => {
        // def

        el.subitens.forEach((ele) => {
          // sub def
          if (ele.defeito === this.defeitoControl) {
            ele.subitens.forEach((elem) => {
              //referencia

              if (elem.referencia === eventInfo.name)
                this.transitionArray = elem.subitens;
            });
          }
        });
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Defeitos
      this.transitionArray.forEach((element) => {
        this.optionDef4.xAxis.data.push(element.cliente);
        this.optionDef4.series[0].data.push(element.quantidade);
      });
    },
    //#endregion
    //#region  Eventos para Grafico de Referencias
    showInfoRef(eventInfo) {
      // console.log('eventinfo', eventInfo)
      this.controlRef = 1;
      this.referenciaControl2 = eventInfo.name;

      this.optionRef2.xAxis.data = [];
      this.optionRef2.series[0].data = [];
      this.transitionArray = _.find(this.arrayToChartRefs, (el) => {
        return el.referencia === eventInfo.name;
      })["itens"];

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias
      this.transitionArray.forEach((element) => {
        this.optionRef2.xAxis.data.push(element.defeito);
        this.optionRef2.series[0].data.push(element.quantidade);
      });
    },
    showInfoRef2(eventInfo) {
      this.controlRef = 2;
      this.referenciaControl = eventInfo.name;

      this.optionRef3.xAxis.data = [];
      this.optionRef3.series[0].data = [];

      this.arrayToChartRefs.forEach((ele) => {
        if (ele.referencia === this.referenciaControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === eventInfo.name) {
              this.transitionArray = elem.registros;
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados
      this.transitionArray.forEach((element) => {
        this.optionRef3.xAxis.data.push(element.defeito);
        this.optionRef3.series[0].data.push(element.quantidade);
      });
    },
    showInfoRef3(eventInfo) {
      this.controlRef = 3;

      this.optionRef4.xAxis.data = [];
      this.optionRef4.series[0].data = [];

      this.arrayToChartRefs.forEach((ele) => {
        if (ele.referencia === this.referenciaControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === this.referenciaControl) {
              elem.registros.forEach((eleme) => {
                if (eleme.defeito === eventInfo.name)
                  this.transitionArray = eleme.registros;
              });
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados --> Clientes
      this.transitionArray.forEach((element) => {
        this.optionRef4.xAxis.data.push(element.cliente);
        this.optionRef4.series[0].data.push(element.quantidade);
      });
    },
    //#endregion
    //#region  Eventos para Grafico de Clientes
    showInfoCli(eventInfo) {
      this.controlCli = 1;
      this.clienteControl2 = eventInfo.name;

      this.optionCli2.xAxis.data = [];
      this.optionCli2.series[0].data = [];
      this.transitionArray = _.find(this.arrayClientes, (el) => {
        return el.cliente === eventInfo.name;
      })["itens"];

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias
      this.transitionArray.forEach((element) => {
        this.optionCli2.xAxis.data.push(element.defeito);
        this.optionCli2.series[0].data.push(element.quantidade);
      });
    },
    showInfoCli2(eventInfo) {
      this.controlCli = 2;
      this.clienteControl = eventInfo.name;

      this.optionCli3.xAxis.data = [];
      this.optionCli3.series[0].data = [];

      this.arrayClientes.forEach((ele) => {
        if (ele.cliente === this.clienteControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === eventInfo.name) {
              this.transitionArray = elem.registros;
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados
      this.transitionArray.forEach((element) => {
        this.optionCli3.xAxis.data.push(element.defeito);
        this.optionCli3.series[0].data.push(element.quantidade);
      });
    },
    showInfoCli3(eventInfo) {
      this.controlCli = 3;

      this.optionCli4.xAxis.data = [];
      this.optionCli4.series[0].data = [];

      this.arrayClientes.forEach((ele) => {
        if (ele.cliente === this.clienteControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === this.clienteControl) {
              elem.registros.forEach((eleme) => {
                if (eleme.defeito === eventInfo.name)
                  this.transitionArray = eleme.registros;
              });
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados --> Clientes
      this.transitionArray.forEach((element) => {
        this.optionCli4.xAxis.data.push(element.referencia);
        this.optionCli4.series[0].data.push(element.quantidade);
      });
    },
    //#endregion
    //#region  Eventos para Grafico de Representantes
    showInfoRep(eventInfo) {
      this.controlRep = 1;
      this.repControl2 = eventInfo.name;

      this.optionRep2.xAxis.data = [];
      this.optionRep2.series[0].data = [];
      this.transitionArray = _.find(this.arrayRepresentantes, (el) => {
        return el.representante === eventInfo.name;
      })["itens"];

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();

      this.transitionArray.forEach((element) => {
        this.optionRep2.xAxis.data.push(element.defeito);
        this.optionRep2.series[0].data.push(element.quantidade);
      });
    },
    showInfoRep2(eventInfo) {
      this.controlRep = 2;
      this.repControl = eventInfo.name;

      this.optionRep3.xAxis.data = [];
      this.optionRep3.series[0].data = [];

      this.arrayRepresentantes.forEach((ele) => {
        if (ele.representante === this.repControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === eventInfo.name) {
              this.transitionArray = elem.registros;
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados
      this.transitionArray.forEach((element) => {
        this.optionRep3.xAxis.data.push(element.defeito);
        this.optionRep3.series[0].data.push(element.quantidade);
      });
    },
    showInfoRep3(eventInfo) {
      this.controlRep = 3;
      this.repControl3 = eventInfo.name;

      this.optionRep4.xAxis.data = [];
      this.optionRep4.series[0].data = [];

      this.arrayRepresentantes.forEach((ele) => {
        if (ele.representante === this.repControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === this.repControl) {
              elem.registros.forEach((eleme) => {
                if (eleme.defeito === eventInfo.name)
                  this.transitionArray = eleme.registros;
              });
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados --> Clientes
      this.transitionArray.forEach((element) => {
        this.optionRep4.xAxis.data.push(element.referencia);
        this.optionRep4.series[0].data.push(element.quantidade);
      });
    },
    showInfoRep4(eventInfo) {
      //
      this.controlRep = 4;

      this.optionRep5.xAxis.data = [];
      this.optionRep5.series[0].data = [];

      this.arrayRepresentantes.forEach((ele) => {
        if (ele.representante === this.repControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === this.repControl) {
              elem.registros.forEach((eleme) => {
                if (eleme.defeito === this.repControl3) {
                  eleme.registros.forEach((e) => {
                    if (e.referencia === eventInfo.name) {
                      this.transitionArray = e.registros;
                    }
                  });
                }
              });
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados --> Clientes
      this.transitionArray.forEach((element) => {
        this.optionRep5.xAxis.data.push(element.cliente);
        this.optionRep5.series[0].data.push(element.quantidade);
      });
    },
    //#endregion
    //#region  Eventos para Grafico de Escritório de Vendas
    showInfoEsc(eventInfo) {
      this.controlEsc = 1;
      this.escControl2 = eventInfo.name;

      this.optionEscr2.xAxis.data = [];
      this.optionEscr2.series[0].data = [];
      this.transitionArray = _.find(this.arrayEscritorios, (el) => {
        return el.escritorio === eventInfo.name;
      })["itens"];

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();

      this.transitionArray.forEach((element) => {
        this.optionEscr2.xAxis.data.push(element.defeito);
        this.optionEscr2.series[0].data.push(element.quantidade);
      });
    },
    showInfoEsc2(eventInfo) {
      this.controlEsc = 2;
      this.escControl = eventInfo.name;

      this.optionEscr3.xAxis.data = [];
      this.optionEscr3.series[0].data = [];

      this.arrayEscritorios.forEach((ele) => {
        if (ele.escritorio === this.escControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === eventInfo.name) {
              this.transitionArray = elem.registros;
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados
      this.transitionArray.forEach((element) => {
        this.optionEscr3.xAxis.data.push(element.defeito);
        this.optionEscr3.series[0].data.push(element.quantidade);
      });
    },
    showInfoEsc3(eventInfo) {
      this.controlEsc = 3;
      this.escControl3 = eventInfo.name;

      this.optionEscr4.xAxis.data = [];
      this.optionEscr4.series[0].data = [];

      this.arrayEscritorios.forEach((ele) => {
        if (ele.escritorio === this.escControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === this.escControl) {
              elem.registros.forEach((eleme) => {
                if (eleme.defeito === eventInfo.name)
                  this.transitionArray = eleme.registros;
              });
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados --> Clientes
      this.transitionArray.forEach((element) => {
        this.optionEscr4.xAxis.data.push(element.referencia);
        this.optionEscr4.series[0].data.push(element.quantidade);
      });
    },
    showInfoEsc4(eventInfo) {
      //
      this.controlEsc = 4;

      this.optionEscr5.xAxis.data = [];
      this.optionEscr5.series[0].data = [];

      this.arrayEscritorios.forEach((ele) => {
        if (ele.escritorio === this.escControl2) {
          ele.itens.forEach((elem) => {
            if (elem.defeito === this.escControl) {
              elem.registros.forEach((eleme) => {
                if (eleme.defeito === this.escControl3) {
                  eleme.registros.forEach((e) => {
                    if (e.referencia === eventInfo.name) {
                      this.transitionArray = e.registros;
                    }
                  });
                }
              });
            }
          });
        }
      });

      this.transitionArray = _.sortBy(this.transitionArray, "quantidade");
      this.transitionArray.reverse();
      //Dados Array Filhos Referencias --> Defeitos agrupados --> Clientes
      this.transitionArray.forEach((element) => {
        this.optionEscr5.xAxis.data.push(element.cliente);
        this.optionEscr5.series[0].data.push(element.quantidade);
      });
    },
    //#endregion
    returnChart() {
      if (this.control !== 0) this.control -= 1;
    },
    returnChartRef() {
      if (this.controlRef !== 0) this.controlRef -= 1;
    },
    returnChartCli() {
      if (this.controlCli !== 0) this.controlCli -= 1;
    },
    returnChartRep() {
      if (this.controlRep !== 0) this.controlRep -= 1;
    },
    returnChartEsc() {
      if (this.controlEsc !== 0) this.controlEsc -= 1;
    },
    //Tratar Checked do escritorio de vendas
    onCheckChange(event) {
      if (event.args.checked === false) {
        this.lstReps.forEach((el) => {
          if (el.escr === event.args.value) {
            this.$refs.comboReps.uncheckItem(el.id);
            this.$refs.comboReps.disableItem(el.id);
          }
        });
      } else {
        this.lstReps.forEach((el) => {
          if (el.escr === event.args.value) {
            /* eslint-disable */
            this.$refs.comboReps.enableItem(el.id);
            /* eslint-disable */
            this.$refs.comboReps.checkItem(el.id);
          }
        });
      }
    },
    carregarFiltro() {
      (this.lstRefs = []), (this.lstDefFiltered = []), (this.spinner = true);
      const arraytemp = this.$refs.comboEscr.getCheckedItems();
      const arraytemp2 = this.$refs.comboReps.getCheckedItems();
      if (arraytemp.length === 0 || arraytemp2.length === 0) {
        showError("É necessário selecionar escritórios e representantes");
        return;
      }
      this.clearData();
      this.lstTrocasOriginal = this.copylstTrocaOriginal;
      let arrayOriginalFiltrado = [];

      _.each(this.$refs.comboEscr.getCheckedItems(), (el) => {
        arrayOriginalFiltrado = arrayOriginalFiltrado.concat(
          this.lstTrocasOriginal.filter((ele) => {
            return ele.escritorio === el.label.substr(7);
          })
        );
      });

      this.lstTrocasOriginal = arrayOriginalFiltrado;

      arrayOriginalFiltrado = [];

      _.each(this.$refs.comboReps.getCheckedItems(), (el) => {
        arrayOriginalFiltrado = arrayOriginalFiltrado.concat(
          this.lstTrocasOriginal.filter((ele) => {
            return ele.userName === el.value;
          })
        );
      });

      this.lstTrocasOriginal = arrayOriginalFiltrado;

      arrayOriginalFiltrado = [];

      _.each(this.$refs.comboSetor.getCheckedItems(), (el) => {
        arrayOriginalFiltrado = arrayOriginalFiltrado.concat(
          this.lstTrocasOriginal.filter((ele) => {
            return ele.setor === el.value;
          })
        );
      });

      this.lstTrocasOriginal = arrayOriginalFiltrado;

      arrayOriginalFiltrado = [];

      _.each(this.$refs.comboStatus.getCheckedItems(), (el) => {
        if (el.value === "T") {
          arrayOriginalFiltrado = arrayOriginalFiltrado.concat(
            this.lstTrocasOriginal.filter((ele) => {
              return ele.dtFinalTroca !== "0000-00-00";
            })
          );
        } else {
          arrayOriginalFiltrado = arrayOriginalFiltrado.concat(
            this.lstTrocasOriginal.filter((ele) => {
              return ele.dtFinalTroca === "0000-00-00";
            })
          );
        }
      });
      this.lstTrocasOriginal = arrayOriginalFiltrado;

      //

      arrayOriginalFiltrado = [];

      _.each(this.$refs.comboOrigem.getCheckedItems(), (el) => {
        if (el.value === "PF") {
          arrayOriginalFiltrado = arrayOriginalFiltrado.concat(
            this.lstTrocasOriginal.filter((ele) => {
              return ele.nfedev === "";
            })
          );
        } else {
          arrayOriginalFiltrado = arrayOriginalFiltrado.concat(
            this.lstTrocasOriginal.filter((ele) => {
              return ele.nfedev !== "";
            })
          );
        }
      });
      this.lstTrocasOriginal = arrayOriginalFiltrado;
      //
      //

      let mesesHeaders = this.getHeaderMeses(
        this.dataDe._i.replace("/", ""),
        this.dataAte._i.replace("/", "")
      );
      let objHeader = {};
      //Tratando dados de Defeitos

      let defeitosmensal = _.sortBy(
        _.map(
          _.groupBy(this.lstTrocasOriginal, function(tr) {
            return tr.dtEmissao.substr(0, 7) + tr.descDefeito;
          }),
          function(values, key) {
            return {
              mesAno: key.substr(0, 4) + key.substr(5, 2),
              descDefeito: key.substr(7),
              qtd: _.reduce(
                values,
                function(memo, tr) {
                  return memo + tr.quantidade;
                },
                0
              ),
            };
          }
        ),
        function(oc) {
          return oc.mesAno;
        }
      );

      defeitosmensal = _.map(
        _.groupBy(defeitosmensal, (mxprod) => {
          return mxprod.descDefeito;
        }),
        (value, key) => {
          return { descDefeito: key, meses: value };
        }
      );

      let qtdTotalDefGeral = _.reduce(
        _.flatten(_.pluck(defeitosmensal, "meses")),
        (vlant, current) => {
          return vlant + current.qtd;
        },
        0
      );
      objHeader = {};
      objHeader.key = "descDefeito";
      objHeader.label = "Defeito";
      this.lstFieldsDef.push(objHeader);

      mesesHeaders.forEach((el) => {
        let objHeader = {};
        objHeader.key = el.mesano;
        objHeader.label = el.header;
        this.lstFieldsDef.push(objHeader);
      });

      objHeader = {};
      objHeader.key = "total";
      objHeader.label = "Total";
      this.lstFieldsDef.push(objHeader);
      objHeader = {};
      objHeader.key = "media";
      objHeader.label = "Média";
      this.lstFieldsDef.push(objHeader);

      objHeader = {};
      objHeader.key = "percGeral";
      objHeader.label = "%";
      this.lstFieldsDef.push(objHeader);

      _.each(defeitosmensal, (element) => {
        let objRef = {};
        objRef.descDefeito = element.descDefeito;
        mesesHeaders.forEach((ele) => {
          objRef[ele.mesano.toString()] = _.find(element.meses, (el) => {
            return el.mesAno === ele.mesano;
          })
            ? _.find(element.meses, (el) => {
                return el.mesAno === ele.mesano;
              })["qtd"]
            : "0";
        });
        objRef.total = _.reduce(
          element.meses,
          (vlant, current) => {
            return vlant + current.qtd;
          },
          0
        );
        objRef.media =
          (
            _.reduce(
              element.meses,
              (vlant, current) => {
                return vlant + current.qtd;
              },
              0
            ) / element.meses.length
          ).toFixed(2) + "%";
        objRef.percGeral =
          ((objRef.total / qtdTotalDefGeral) * 100).toFixed(2) + "%";
        this.lstDefFiltered.push(objRef);
      });

      // this.lstDefFiltered = _.reject(this.lstDefFiltered, el => { return el.qtd === 0})
      this.lstDefFiltered = _.sortBy(this.lstDefFiltered, "total");
      this.lstDefFiltered.reverse();

      //Tratando dados de Referencias
      objHeader = {};
      objHeader.key = "referencia";
      objHeader.label = "Referência";
      this.lstFieldsRef.push(objHeader);

      mesesHeaders.forEach((el) => {
        let objHeader = {};
        objHeader.key = el.mesano;
        objHeader.label = el.header;
        this.lstFieldsRef.push(objHeader);
      });

      objHeader = {};
      objHeader.key = "total";
      objHeader.label = "Total";
      this.lstFieldsRef.push(objHeader);

      objHeader = {};
      objHeader.key = "media";
      objHeader.label = "Média";
      this.lstFieldsRef.push(objHeader);

      objHeader = {};
      objHeader.key = "percGeral";
      objHeader.label = "%";
      this.lstFieldsRef.push(objHeader);

      let referenciamensal = _.sortBy(
        _.map(
          _.groupBy(this.lstTrocasOriginal, function(tr) {
            return tr.dtEmissao.substr(0, 7) + tr.referencia;
          }),
          function(values, key) {
            return {
              mesAno: key.substr(0, 4) + key.substr(5, 2),
              referencia: key.substr(7),
              qtd: _.reduce(
                values,
                function(memo, tr) {
                  return memo + tr.quantidade;
                },
                0
              ),
              itens: values,
            };
          }
        ),
        function(oc) {
          return oc.mesAno;
        }
      );

      referenciamensal = _.map(
        _.groupBy(referenciamensal, (mxprod) => {
          return mxprod.referencia;
        }),
        (value, key) => {
          return { referencia: key, meses: value };
        }
      );

      let qtdTotalGeral = _.reduce(
        _.flatten(_.pluck(referenciamensal, "meses")),
        (vlant, current) => {
          return vlant + current.qtd;
        },
        0
      );
      _.each(referenciamensal, (element) => {
        let objRef = {};
        objRef.referencia = element.referencia;
        mesesHeaders.forEach((ele) => {
          objRef[ele.mesano.toString()] = _.find(element.meses, (el) => {
            return el.mesAno === ele.mesano;
          })
            ? _.find(element.meses, (el) => {
                return el.mesAno === ele.mesano;
              })["qtd"]
            : "0";
        });
        objRef.total = _.reduce(
          element.meses,
          (vlant, current) => {
            return vlant + current.qtd;
          },
          0
        );
        objRef.media =
          (
            _.reduce(
              element.meses,
              (vlant, current) => {
                return vlant + current.qtd;
              },
              0
            ) / element.meses.length
          ).toFixed(2) + "%";
        objRef.percGeral =
          ((objRef.total / qtdTotalGeral) * 100).toFixed(2) + "%";
        this.lstRefs.push(objRef);
      });

      this.lstRefs = _.sortBy(this.lstRefs, "total");
      this.lstRefs.reverse();

      //=================================================== Tratando dados para Graficos ================================================================

      //Tratando dados para grafico de Referencias

      this.arrayToChartRefs = _.map(
        _.groupBy(this.lstTrocasOriginal, "referencia"),
        (value, key) => {
          return { referencia: key, itens: value };
        }
      );

      let arrayRefTmp = this.arrayToChartRefs.map((ref) => {
        return {
          referencia: ref.referencia,
          quantidade: _.reduce(
            ref.itens,
            (vlant, current) => {
              return vlant + current.quantidade;
            },
            0
          ),
          itens: _.map(
            _.groupBy(ref.itens, (item) => {
              return item.descDefeito
                .substr(0, item.descDefeito.indexOf(" "))
                .split(".")[0];
            }),
            (item, key) => {
              return {
                defeito: _.find(this.lstDefeitos, (ele) => {
                  return (
                    ele.text.substr(0, ele.text.indexOf(" ")).split(".")[0] ===
                    key
                  );
                })["text"],
                quantidade: _.reduce(
                  item,
                  (vlant, current) => {
                    return vlant + current.quantidade;
                  },
                  0
                ),
                registros: _.map(
                  _.groupBy(item, (mxprod) => {
                    return mxprod.descDefeito;
                  }),
                  (value, key) => {
                    return {
                      defeito: key,
                      quantidade: _.reduce(
                        value,
                        (vlant, current) => {
                          return vlant + current.quantidade;
                        },
                        0
                      ),
                      registros: _.map(
                        _.groupBy(value, "clienteDesc"),
                        (value, key) => {
                          return {
                            cliente: key,
                            quantidade: _.reduce(
                              value,
                              (vlant, current) => {
                                return vlant + current.quantidade;
                              },
                              0
                            ),
                          };
                        }
                      ),
                    };
                  }
                ),
              };
            }
          ),
        };
      });

      arrayRefTmp = _.sortBy(arrayRefTmp, "quantidade");
      arrayRefTmp.reverse();

      this.arrayToChartRefs = arrayRefTmp;

      //Dados Array Principal
      this.arrayToChartRefs.forEach((element) => {
        this.optionRef.xAxis.data.push(element.referencia);
        this.optionRef.series[0].data.push(element.quantidade);
      });

      let array = [];
      array = array.concat(
        referenciamensal.map((el) => {
          return {
            referencia: el.referencia,
            quantidade: _.reduce(
              el.meses,
              (vlant, current) => {
                return vlant + current.qtd;
              },
              0
            ),
          };
        })
      );

      array = _.sortBy(array, "quantidade");
      array.reverse();

      //Tratando dados para grafico de procedimentos

      this.arrayProcedimentos = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.descProc;
        }),
        (value, key) => {
          return { procedimento: key, registros: value };
        }
      );
      let arrayProcAcumulado = this.arrayProcedimentos.map((el) => {
        return {
          procedimento: el.procedimento,
          quantidade: _.reduce(
            el.registros,
            (vlant, current) => {
              return vlant + current.quantidade;
            },
            0
          ),
        };
      });

      //Dados Array Principal
      arrayProcAcumulado.forEach((element) => {
        this.optionProc.xAxis.data.push(element.procedimento);
        this.optionProc.series[0].data.push(element.quantidade);
      });

      //Tratando dados para grafico de defeitos
      this.lstTrocasOriginal = _.sortBy(this.lstTrocasOriginal, "descDefeito");
      this.arrayDefeitos = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.descDefeito
            .substr(0, mxprod.descDefeito.indexOf(" "))
            .split(".")[0];
        }),
        (value, key) => {
          return { defeito: key, registros: value };
        }
      );

      this.arrayDefAcumulado = this.arrayDefeitos.map((el) => {
        return {
          defeito: _.find(this.lstDefeitos, (ele) => {
            return (
              ele.text.substr(0, ele.text.indexOf(" ")).split(".")[0] ===
              el.defeito
            );
          })["text"],
          quantidade: _.reduce(
            el.registros,
            (vlant, current) => {
              return vlant + current.quantidade;
            },
            0
          ),
          subitens: _.map(
            _.groupBy(el.registros, (mxprod) => {
              return mxprod.descDefeito;
            }),
            (value, key) => {
              return {
                defeito: key,
                quantidade: _.reduce(
                  value,
                  (vlant, current) => {
                    return vlant + current.quantidade;
                  },
                  0
                ),
                subitens: _.map(
                  _.groupBy(value, (ref) => {
                    return ref.referencia;
                  }),
                  (valueref, key) => {
                    return {
                      referencia: key,
                      quantidade: _.reduce(
                        valueref,
                        (vlant, current) => {
                          return vlant + current.quantidade;
                        },
                        0
                      ),
                      subitens: _.map(
                        _.groupBy(valueref, (cliente) => {
                          return cliente.clienteDesc;
                        }),
                        (clienteRef, key) => {
                          return {
                            cliente: key,
                            quantidade: _.reduce(
                              clienteRef,
                              (vlant, current) => {
                                return vlant + current.quantidade;
                              },
                              0
                            ),
                          };
                        }
                      ),
                    };
                  }
                ),
              };
            }
          ),
        };
      });
      this.arrayDefAcumulado = _.sortBy(this.arrayDefAcumulado, "quantidade");
      this.arrayDefAcumulado.reverse();

      //Dados Array Principal
      this.arrayDefAcumulado.forEach((element) => {
        this.optionDef1.xAxis.data.push(element.defeito);
        this.optionDef1.series[0].data.push(element.quantidade);
      });

      this.transitionArray = this.arrayDefAcumulado;

      //this.arrayDefeitos = this.arrayDefeitos.slice(0,10)

      //Tratando dados para grafico de Clientes

      this.arrayClientes = _.map(
        _.groupBy(this.lstTrocasOriginal, "clienteDesc"),
        (value, key) => {
          return { cliente: key, itens: value };
        }
      );
      let arrayCliAcumulado = this.arrayClientes.map((cliente) => {
        return {
          cliente: cliente.cliente,
          quantidade: _.reduce(
            cliente.itens,
            (vlant, current) => {
              return vlant + current.quantidade;
            },
            0
          ),
          itens: _.map(
            _.groupBy(cliente.itens, (item) => {
              return item.descDefeito
                .substr(0, item.descDefeito.indexOf(" "))
                .split(".")[0];
            }),
            (item, key) => {
              return {
                defeito: _.find(this.lstDefeitos, (ele) => {
                  return (
                    ele.text.substr(0, ele.text.indexOf(" ")).split(".")[0] ===
                    key
                  );
                })["text"],
                quantidade: _.reduce(
                  item,
                  (vlant, current) => {
                    return vlant + current.quantidade;
                  },
                  0
                ),
                registros: _.map(
                  _.groupBy(item, (mxprod) => {
                    return mxprod.descDefeito;
                  }),
                  (value, key) => {
                    return {
                      defeito: key,
                      quantidade: _.reduce(
                        value,
                        (vlant, current) => {
                          return vlant + current.quantidade;
                        },
                        0
                      ),
                      registros: _.map(
                        _.groupBy(value, "referencia"),
                        (value, key) => {
                          return {
                            referencia: key,
                            quantidade: _.reduce(
                              value,
                              (vlant, current) => {
                                return vlant + current.quantidade;
                              },
                              0
                            ),
                          };
                        }
                      ),
                    };
                  }
                ),
              };
            }
          ),
        };
      });
      arrayCliAcumulado = _.sortBy(arrayCliAcumulado, "quantidade");
      arrayCliAcumulado.reverse();

      //Dados Array Principal
      arrayCliAcumulado.forEach((element) => {
        this.optionCli.xAxis.data.push(element.cliente);
        this.optionCli.series[0].data.push(element.quantidade);
      });

      this.arrayClientes = arrayCliAcumulado;

      //Tratando dados para grafico de Representantes

      this.arrayRepresentantes = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.userName;
        }),
        (value, key) => {
          return { representante: key, registros: value };
        }
      );
      let arrayRepAcumulado = this.arrayRepresentantes.map((el) => {
        return {
          representante: el.representante,
          quantidade: _.reduce(
            el.registros,
            (vlant, current) => {
              return vlant + current.quantidade;
            },
            0
          ),
          itens: _.map(
            _.groupBy(el.registros, (item) => {
              return item.descDefeito
                .substr(0, item.descDefeito.indexOf(" "))
                .split(".")[0];
            }),
            (item, key) => {
              return {
                defeito: _.find(this.lstDefeitos, (ele) => {
                  return (
                    ele.text.substr(0, ele.text.indexOf(" ")).split(".")[0] ===
                    key
                  );
                })["text"],
                quantidade: _.reduce(
                  item,
                  (vlant, current) => {
                    return vlant + current.quantidade;
                  },
                  0
                ),
                registros: _.map(
                  _.groupBy(item, (mxprod) => {
                    return mxprod.descDefeito;
                  }),
                  (value, key) => {
                    return {
                      defeito: key,
                      quantidade: _.reduce(
                        value,
                        (vlant, current) => {
                          return vlant + current.quantidade;
                        },
                        0
                      ),
                      registros: _.map(
                        _.groupBy(value, "referencia"),
                        (value, key) => {
                          return {
                            referencia: key,
                            quantidade: _.reduce(
                              value,
                              (vlant, current) => {
                                return vlant + current.quantidade;
                              },
                              0
                            ),
                            registros: _.map(
                              _.groupBy(value, (mxprod) => {
                                return mxprod.clienteDesc;
                              }),
                              (value, key) => {
                                return {
                                  cliente: key,
                                  quantidade: _.reduce(
                                    value,
                                    (vlant, current) => {
                                      return vlant + current.quantidade;
                                    },
                                    0
                                  ),
                                };
                              }
                            ),
                          };
                        }
                      ),
                    };
                  }
                ),
              };
            }
          ),
        };
      });

      arrayRepAcumulado = _.sortBy(arrayRepAcumulado, "quantidade");
      arrayRepAcumulado.reverse();

      //Dados Array Principal
      arrayRepAcumulado.forEach((element) => {
        this.optionRep.xAxis.data.push(element.representante);
        this.optionRep.series[0].data.push(element.quantidade);
      });

      this.arrayRepresentantes = arrayRepAcumulado;

      //Tratando dados para grafico de Escritório de Vendas

      this.arrayEscritorios = _.map(
        _.groupBy(this.lstTrocasOriginal, (mxprod) => {
          return mxprod.escritorio;
        }),
        (value, key) => {
          return { escritorio: key, registros: value };
        }
      );
      let arrayEscAcumulado = this.arrayEscritorios.map((el) => {
        return {
          escritorio: el.escritorio,
          quantidade: _.reduce(
            el.registros,
            (vlant, current) => {
              return vlant + current.quantidade;
            },
            0
          ),
          itens: _.map(
            _.groupBy(el.registros, (item) => {
              return item.descDefeito
                .substr(0, item.descDefeito.indexOf(" "))
                .split(".")[0];
            }),
            (item, key) => {
              return {
                defeito: _.find(this.lstDefeitos, (ele) => {
                  return (
                    ele.text.substr(0, ele.text.indexOf(" ")).split(".")[0] ===
                    key
                  );
                })["text"],
                quantidade: _.reduce(
                  item,
                  (vlant, current) => {
                    return vlant + current.quantidade;
                  },
                  0
                ),
                registros: _.map(
                  _.groupBy(item, (mxprod) => {
                    return mxprod.descDefeito;
                  }),
                  (value, key) => {
                    return {
                      defeito: key,
                      quantidade: _.reduce(
                        value,
                        (vlant, current) => {
                          return vlant + current.quantidade;
                        },
                        0
                      ),
                      registros: _.map(
                        _.groupBy(value, "referencia"),
                        (value, key) => {
                          return {
                            referencia: key,
                            quantidade: _.reduce(
                              value,
                              (vlant, current) => {
                                return vlant + current.quantidade;
                              },
                              0
                            ),
                            registros: _.map(
                              _.groupBy(value, (mxprod) => {
                                return mxprod.clienteDesc;
                              }),
                              (value, key) => {
                                return {
                                  cliente: key,
                                  quantidade: _.reduce(
                                    value,
                                    (vlant, current) => {
                                      return vlant + current.quantidade;
                                    },
                                    0
                                  ),
                                };
                              }
                            ),
                          };
                        }
                      ),
                    };
                  }
                ),
              };
            }
          ),
        };
      });

      arrayEscAcumulado = _.sortBy(arrayEscAcumulado, "quantidade");
      arrayEscAcumulado.reverse();

      //Dados Array Principal
      arrayEscAcumulado.forEach((element) => {
        this.optionEscr.xAxis.data.push(element.escritorio);
        this.optionEscr.series[0].data.push(element.quantidade);
      });

      this.arrayEscritorios = arrayEscAcumulado;
      this.testePass = true;
      this.spinner = false;
    },
    nomeMes(numMes, fullname) {
      let meses =
        "Janeiro  FevereiroMarço    Abril    Maio     Junho    Julho    Agosto   Setembro Outubro  Novembro Dezembro";
      return fullname
        ? meses.substr(9 * numMes - 9, 9).trim()
        : meses
            .substr(9 * numMes - 9, 9)
            .substr(0, 3)
            .trim();
    },
    getHeaderMeses(maI, maF) {
      const mesIni = parseInt(maI.toString().substr(4), 10);
      const mesFim = parseInt(maF.toString().substr(4), 10);
      const anoIni = parseInt(maI.toString().substr(0, 4), 10);
      const anoFim = parseInt(maF.toString().substr(0, 4), 10);
      const ma = [];
      const years = [];

      for (let ano1 = anoIni; ano1 <= anoFim; ano1++) {
        years.push(ano1);
      }

      years.forEach((ano) => {
        if (ano === anoIni && anoFim === ano) {
          for (let mes = mesIni; mes <= mesFim; mes++) {
            let reg = {};
            reg.mesano = anoIni.toString() + mes.toString().padStart(2, 0);
            reg.header = this.nomeMes(mes) + "/" + anoIni.toString();
            ma.push(reg);
          }
        } else if (ano === anoIni && anoFim > ano) {
          for (let mes = mesIni; mes <= 12; mes++) {
            let reg = {};
            reg.mesano = ano.toString() + mes.toString().padStart(2, 0);
            reg.header = this.nomeMes(mes) + "/" + ano.toString();
            ma.push(reg);
          }
        } else if (ano > anoIni && anoFim > ano) {
          for (let mes = 1; mes <= 12; mes++) {
            let reg = {};
            reg.mesano = ano.toString() + mes.toString().padStart(2, 0);
            reg.header = this.nomeMes(mes) + "/" + ano.toString();
            ma.push(reg);
          }
        } else if (ano > anoIni && anoFim === ano) {
          for (let mes = 1; mes <= mesFim; mes++) {
            let reg = {};
            reg.mesano = ano.toString() + mes.toString().padStart(2, 0);
            reg.header = this.nomeMes(mes) + "/" + ano.toString();
            ma.push(reg);
          }
        }
      });

      return ma;
    },
    transformLines(pIni, pFim, qtdfats) {
      let mesesHeaders = this.getHeaderMeses(pIni, pFim);
      // let mesesanos = _.pluck(qtdfats, "mesAno")
      let qtdsFat = _.pluck(qtdfats, "qtdFat");
      let qtdsSac = _.pluck(qtdfats, "qtdSac");
      let percs = _.pluck(qtdfats, "percDef");
      let total_sac = 0;
      let total_fat = 0;

      let listQtdFat = [];
      let listHeader = [];

      for (let i = 0; i < 4; i++) {
        let objFat = {};
        let objHeader = {};

        if (i === 0) {
          objHeader.key = "descricao";
          objHeader.label = "";
          listHeader.push(objHeader);

          for (let j = 0; j <= mesesHeaders.length - 1; j++) {
            let objHeader = {};
            //objFat["mes"+j.toString()] = mesesHeaders[j].header
            objHeader.key = "mes" + j.toString();
            objHeader.label = mesesHeaders[j].header;
            listHeader.push(objHeader);
          }
          objHeader = {};
          objHeader.key = "total";
          objHeader.label = "Total";
          listHeader.push(objHeader);

          //objFat.total = "Total"
        } else if (i === 1) {
          objFat.descricao = "Peças SAC";
          for (let j = 0; j <= mesesHeaders.length - 1; j++) {
            objFat["mes" + j.toString()] = qtdsSac[j] ? qtdsSac[j] : "";
          }
          total_sac = _.reduce(
            qtdsSac,
            function(acc, r) {
              return acc + r;
            },
            0
          );
          objFat.total = total_sac;
        } else if (i === 2) {
          objFat.descricao = "Peças Faturadas";
          for (let j = 0; j <= mesesHeaders.length - 1; j++) {
            objFat["mes" + j.toString()] = qtdsFat[j] ? qtdsFat[j] : "";
            //
          }
          total_fat = _.reduce(
            qtdsFat,
            function(acc, r) {
              return acc + r;
            },
            0
          );
          objFat.total = total_fat;
        } else if (i === 3) {
          objFat.descricao = "% Defeitos";
          for (let j = 0; j <= mesesHeaders.length - 1; j++) {
            objFat["mes" + j.toString()] = percs[j]
              ? percs[j].toFixed(2) + "%"
              : "";
          }
          objFat.total =
            total_fat === 0
              ? 0
              : ((total_sac / total_fat) * 100).toFixed(2) + "%";
        }
        //
        if (i > 0) listQtdFat.push(objFat);
      }

      return { listItens: listQtdFat, listHeaders: listHeader };
    },
  },
  async mounted() {
    //    this.dataDe  = format(addMonths(new Date(), -1), "yyyy-MM");
    //    this.dataAte = format(new Date(), "yyyy-MM");

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
  async beforeUpdate() {
    await this.manageData();
  },
};
</script>

<style lang="scss" scoped>
$xl: 1920px;
$lg: 1280px;
$sm: 900px;
$xsm: 460px;
$sizeChart: $xl;
.formControl > * {
  flex: 1 10px;
}
* >>> table {
  max-height: 600px !important;
  overflow-y: hidden !important;
}
table {
  max-height: 600px !important;
  overflow-y: hidden !important;
}
.table-limited {
  max-height: 550px !important;
  min-height: 1px;
}

.button-area {
  background-color: white;
  border-radius: 25px;
  box-shadow: 1px 1px 1px 1px #e58b2a;
  padding: 15px 0px;
}
.cl-date {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 0px 5px 0px 0px;
}
.space {
  margin-right: 15px;
}
.btnPdf {
  background: white;
}
.date-area {
  min-width: 150px;
}
.title-table {
  font-size: 1.8rem;
}
.totalQtdFat {
  text-align: end;
}
//    .chart-area-1{
//     max-width: 100%;
//    }

.chart {
  height: 400px;
  width: 93vw;
}
@media (max-width: 767px) {
  .chart-card {
    margin: 0;
    .card-body {
      margin: 2px 0px;
      display: flex;
      flex-direction: column;
      width: 100%;
      text-align: center;
      justify-content: center;
      align-items: center;
      align-content: center;

      .row {
        padding: 20px 0px;
      }
    }
    * {
      margin: 0px 5px;
    }
  }
}
.chart-card {
  .card-body {
    display: flex;
    width: 100%;
    min-height: 285px;
    max-width: 780px;
    .row {
      padding: 20px 0px;
    }
  }
  * {
    margin: 0px 5px;
  }
}
.relatEstatTrocaTeste,
canvas {
  overflow-x: auto;
  width: 100%;
}
.estatTrocaWrapper {
  margin-top: 15px;
  display: flex;
}
</style>
