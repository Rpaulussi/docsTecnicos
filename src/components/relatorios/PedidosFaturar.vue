<template ref="printMe">
  <div>
    <PageTitle icon="fa fa-shopping-cart" :main="serverMessages['pedidosFaturar']"></PageTitle>
    <Spinner :state="spinner"></Spinner>
    <div class="main">
      <SelecaoConsulta :lstEquipe="lstEquipes" :lstSetorAtividade="lstSetores" :showSetor="true" :mesesPeriodo="1"
        :showOcultarFat="true" :showEquipe="true">
      </SelecaoConsulta>
      <SelecaoLista :title="serverMessages['relatorioFaturar.clientes']" :titlesel="
        serverMessages['relatorioFaturar.clientes'] + traduction.selection
      " class="list-area">
      </SelecaoLista>

    </div>

    <hr class="my-4" />
    <div class="button-area">
      <b-button id="btnConsultar" class="btn" variant="primary" @click="searchOrders()">{{ traduction.search }}
      </b-button>

      <div class="button">

        <downloadPdf :items="
          orderSelected === null || orderSelected === undefined
            ? lstOrdens
            : lstItensOrder
        " :campos="
  orderSelected === null || orderSelected === undefined
    ? dataSelectedFat
    : fieldsHeader
" :fields="
  orderSelected === null || orderSelected === undefined
    ? dataSelectedFat
    : fieldsHeader
" :header="dataSelectedFat">
        </downloadPdf>
        <!-- <b-button class="btnPdf" style="background:transparent;" @click="fnDownloadPdf()"><img :src="require(`@/assets/iconpdf.png`)" /></b-button> -->
        <b-button class="export-options" variant="outline-secondary">
          <export-excel class="btnExcel"
            :title="orderSelected === null || orderSelected === undefined ? json_footer : json_meta" :data="
              orderSelected === null || orderSelected === undefined
                ? downloadTable
                : lstItensOrder
            " :fields="
  orderSelected === null || orderSelected === undefined
    ? fatSelectedData
    : headerFields
" :name="`relatorioFaturar.xls`">
            <img :src="require(`@/assets/excelicon.png`)" />
          </export-excel>

        </b-button>

      </div>
    </div>
    <hr class="my-4" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 p-0">

          <div v-show="false" v-for="(arrays, cont) in lstOrdensAgrup" :key="cont" id="downloadTable">

            <!-- <table v-for="(itn, acc) in arrays.item" :key="acc">
                <tr>
                  <th></th>cliente:
                </tr>
                <tr>
                  <th colspan="2"> Qtd Saldo: {{ arrays.qtdSaldo }} </th>
                  <th colspan="2">Qtd Total: {{ arrays.qtdtot }}</th>
                  <th colspan="2">Valor Total: {{ arrays.vltot }}</th>
                  <th colspan="3">Valor Faturado: {{ arrays.vltotfaturado }}</th>
                  <th colspan="3">Valor Faturar: {{ arrays.vltotfaturar }}</th>
                </tr>
                <body>
                  <td>itn</td>
                </body>
              </table> -->

            <b-table :fields="fieldsDl" :items="arrays.itens" :data="arrays.itens" foot-clone>

              <template #thead-top>
                <b-tr style="background:black; color:white; width:100%;">

                  <b-th colspan="12">Cliente: {{ arrays.nome }} </b-th>

                </b-tr>
                <b-tr style="background:lightsalmon; color:black; width:100%;">
                  <b-th colspan="2"> Qtd Saldo: {{ arrays.qtdtotSaldo }} </b-th>
                  <b-th colspan="2">Qtd Total: {{ arrays.qtdVbak }}</b-th>
                  <b-th colspan="2">Valor Total: {{ arrays.vltot }}</b-th>
                  <b-th colspan="3">Valor Faturado: {{ arrays.vltotfaturado }}</b-th>
                  <b-th colspan="3">Valor Faturar: {{ arrays.vltotfaturar }}</b-th>
                </b-tr>
              </template>

            </b-table>




          </div>

        </div>
      </div>
    </div>
    <div v-if="
      validationOne === true
    " class="header-area">
      <span><b>{{
      `${serverMessages["relatorioFaturar.header"]
          .replace(".::", "")
          .replace("::.", "")}`
      }}</b></span>
    </div>
    <div v-if="
      (lstOrdens.length > 0 && orderSelected === null) ||
      orderSelected === undefined
    " class="header-area2">
      <span><b>{{
      `${serverMessages["relatorioFaturar.equipeVendas"]} : ${salesTeam.name} `
      }}</b></span>
    </div>
    <div v-if="
      (lstOrdens.length > 0 && orderSelected === null) ||
      orderSelected === undefined
    " class="main-class" id="main-class">
      <div v-for="value in lstOrdensAgrup" v-bind:key="value.nome" class="clients-area border border-dark">
        <label class="blackBg" style="background-color: wheat !important" for=""><b>{{
        serverMessages["relatorioFaturar.table.cliente"] }}:</b>
          {{ value.nome }}</label>
        <div class="client-orders-tot" ref="">
          <!-- Detalhe Ordens -->
          <div v-for="item in value.itens" v-bind:key="item.vbeln" class="client-orders border-top border-dark tessst">
            <div ref="printMe">
              <b-container>
                <b-col>
                  <b-row>
                    <b-form-group ref="" label="Ordem de Vendas: " label-size="sm" label-class="font-style">
                    </b-form-group>
                    <a class="link" :style="
                      item.vbeln.substr(0, 3) === '006'
                        ? 'color:red ; font-weight: bold'
                        : ''
                    " label-size="sm" style="cursor: pointer" @click="searchDetails(item.vbeln)">{{ item.vbeln }}</a>
                  </b-row>
                  <b-row>
                    <b-form-group ref="" :label="`${serverMessages['relatorioFaturar.table.pedidoNro']}:`"
                      label-size="sm" label-class="font-style"></b-form-group>
                    <b-form-group ref="" class="labelFatValue" :label="`${item.bstnk}`" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row>
                    <b-form-group ref="" :label="`${serverMessages['relatorioFaturar.table.dataPedido']}:`"
                      label-size="sm" label-class="font-style"></b-form-group>
                    <b-form-group ref="" :label="item.dtPedido" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row>
                    <b-form-group ref="" :label="`${serverMessages['relatorioFaturar.table.dataDesRemessa']}:`"
                      label-size="sm" label-class="font-style"></b-form-group>
                    <b-form-group ref="" :label="item.dtRemessa" label-size="sm"></b-form-group>
                  </b-row>
                </b-col>
              </b-container>
            </div>
            <div>
              <b-container>
                <b-col>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorOrdem']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :label="`${item.valorPedido}`" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorFaturado']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :label="`${item.valorFaturado}`" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorFaturar']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :label="`${item.valorFaturar}`" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.statusGlobal']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :style="item.gbstk === 'X' ? 'color:red' : ''" :label="
                      item.gbstk === 'X'
                        ? serverMessages['relatorioFaturar.table.comBloqCred']
                        : serverMessages['relatorioFaturar.table.semBloqCred']
                    " label-size="sm"></b-form-group>
                  </b-row>
                </b-col>
              </b-container>
            </div>
            <div>
              <b-container>
                <b-col>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.qtdOrdem']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :label="`${item.qtdVbak}`" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.qtdFaturado']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :label="`${item.qtdVbrk}`" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.qtdFaturar']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :label="`${item.qtdSaldo}`" label-size="sm"></b-form-group>
                  </b-row>
                </b-col>
              </b-container>
            </div>
            <div>
              <b-container>
                <b-col>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.condPgto']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :label="item.condPgmt + '-' + item.descCondicao" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.descExtra']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :label="`${item.descontoExtra}`" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row>
                    <b-form-group :label="`${serverMessages['relatorioFaturar.table.descCom']}:`" label-size="sm"
                      label-class="font-style"></b-form-group>
                    <b-form-group :label="`${item.descontoComercial}`" label-size="sm"></b-form-group>
                  </b-row>
                  <b-row v-if="item.descFin">
                    <b-form-group :label="`Desc.Financeiro:`" label-size="sm" label-class="font-style"
                      style="color: red; font-weight: 500"></b-form-group>
                    <b-form-group :label="`${item.descFin}`" label-size="sm" style="color: red; font-weight: 500">
                    </b-form-group>
                  </b-row>
                </b-col>
              </b-container>
            </div>
          </div>
          <!-- Sub Totais -->
          <div class="sub-tot border-top border-dark">
            <b-container fluid>
              <b-row cols="1" cols-sm="2" cols-md="4" cols-lg="6">
                <b-col>
                  <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorTotal']}:`" label-size="sm"
                    label-class="font-style"></b-form-group>
                  <b-form-group :label="value.vltot" label-size="sm"></b-form-group>
                </b-col>
                <b-col>
                  <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorTotalFaturado']}:`"
                    label-size="sm" label-class="font-style"></b-form-group>
                  <b-form-group :label="`${value.vltotfaturado}`" label-size="sm"></b-form-group>
                </b-col>
                <b-col>
                  <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorTotalFaturar']}:`"
                    label-size="sm" label-class="font-style"></b-form-group>
                  <b-form-group :label="`${value.vltotfaturar}`" label-size="sm"></b-form-group>
                </b-col>
                <b-col>
                  <b-form-group :label="`${serverMessages['relatorioFaturar.table.quantidadeTotal']}:`" label-size="sm"
                    label-class="font-style"></b-form-group>
                  <b-form-group :label="`${value.qtdtot}`" label-size="sm"></b-form-group>
                </b-col>
                <b-col>
                  <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorTotalFaturado']}:`"
                    label-size="sm" label-class="font-style"></b-form-group>
                  <b-form-group :label="`${value.qtdFat}`" label-size="sm"></b-form-group>
                </b-col>
                <b-col>
                  <b-form-group :label="`${serverMessages['relatorioFaturar.table.quantidadeTotalFaturar']}:`"
                    label-size="sm" label-class="font-style"></b-form-group>
                  <b-form-group :label="`${value.qtdSaldo}`" label-size="sm"></b-form-group>
                </b-col>
              </b-row>
            </b-container>
          </div>
        </div>
      </div>
      <!-- TOTAL GERAL  -->
      <div :v-if="lstOrdens.lenght > 0" class="sub-totGeral">
        <b-container>
          <b-row cols="1" cols-sm="2" cols-md="4" cols-lg="6">
            <b-col>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorTotalGeral']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${vltotGeral}`" label-size="sm"></b-form-group>
            </b-col>
            <b-col>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorTotalFaturadoGeral']}:`"
                label-size="sm" label-class="font-style"></b-form-group>
              <b-form-group :label="`${vltotFaturado}`" label-size="sm"></b-form-group>
            </b-col>
            <b-col>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorTotalFaturarGeral']}:`"
                label-size="sm" label-class="font-style"></b-form-group>
              <b-form-group :label="`${vltotfaturar}`" label-size="sm"></b-form-group>
            </b-col>
            <b-col>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.quantidadeTotalGeral']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${qtdtotGeral}`" label-size="sm"></b-form-group>
            </b-col>
            <b-col>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.quantidadeTotalFaturadoGeral']}:`"
                label-size="sm" label-class="font-style"></b-form-group>
              <b-form-group :label="`${qtdtotFaturado}`" label-size="sm"></b-form-group>
            </b-col>
            <b-col>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.quantidadeTotalFaturarGeral']}:`"
                label-size="sm" label-class="font-style"></b-form-group>
              <b-form-group :label="`${qtdSaldoGeral}`" label-size="sm"></b-form-group>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
    <!-- Detalhe ao clicar no numero da ordem -->
    <div v-else-if="orderSelected && docFatSelected === null" class="border border-dark" id="main-class">
      <div class="header-det-order" style="padding-bottom: 0px">
        <b-container fluid>
          <b-row>
            <b-col cols="6">
              <b-button id="btnVoltar" variant="dark" @click="back('phaseOne')">{{
                this.traduction.goBack
              }}</b-button>
            </b-col>

            <b-col cols="6" style="padding: 10px 0px">
              <label for=""><b>{{ serverMessages["relatorioFaturar.table.cliente"] }}:</b>
                {{ objOrder.name1 }}</label>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="client-orders tett22 border-top border-dark">
        <div>
          <b-col>
            <b-row ref="">
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.ordemVendas']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${objOrder.vbeln}`" label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.pedidoNro']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${objOrder.bstnk}`" label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.dataPedido']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="objOrder.dtPedido" label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.dataDesRemessa']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="objOrder.dtRemessa" label-size="sm"></b-form-group>
            </b-row>
          </b-col>
        </div>
        <div>
          <b-col sm="">
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorOrdem']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${objOrder.valorPedido}`" label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorFaturado']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${objOrder.valorFaturado}`" label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorFaturar']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${objOrder.valorFaturar}`" label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.statusGlobal']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="
                objOrder.gbstk === 'X'
                  ? serverMessages['relatorioFaturar.table.comBloqCred']
                  : serverMessages['relatorioFaturar.table.semBloqCred']
              " label-size="sm"></b-form-group>
            </b-row>
          </b-col>
        </div>
        <div>
          <b-col>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.qtdOrdem']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${objOrder.qtdVbak}`" label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.qtdFaturado']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${objOrder.qtdVbrk}`" label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.qtdFaturar']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group :label="`${objOrder.qtdSaldo}`" label-size="sm"></b-form-group>
            </b-row>
          </b-col>
        </div>
        <div>
          <b-col>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.condPgto']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group class="labelFatValue" :label="objOrder.condPgmt + '-' + objOrder.descCondicao"
                label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.descExtra']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group class="labelFatValue" :label="`${objOrder.descontoExtra}`" label-size="sm"></b-form-group>
            </b-row>
            <b-row>
              <b-form-group :label="`${serverMessages['relatorioFaturar.table.descCom']}:`" label-size="sm"
                label-class="font-style"></b-form-group>
              <b-form-group class="labelFatValue" :label="`${objOrder.descontoComercial}`" label-size="sm">
              </b-form-group>
            </b-row>
          </b-col>
        </div>
      </div>
      <div>
        <b-table v-if="lstDocFat.length > 0" responsive hover striped :items="lstDocFat" table-variant="warning"
          :fields="fieldsDocFat" small="small">
          <template #cell(vbeln)="data">
            <a class="link_fat" :style="`color:${lstDocFat.find((el) => {
            return el.vbeln === data.value;
          })['color']
            }`" label-size="sm" style="cursor: pointer" @click="searchDetailsFat(data.value)">{{ data.value }}</a>
          </template>
          <template #head(vbeln)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.docFaturamento"]
            }}</span>
          </template>
          <template #head(nf)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.notaFiscal"]
            }}</span>
          </template>
          <template #head(dtfat)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.dataFaturamento"]
            }}</span>
          </template>
          <template #head(tipo)>
            <span>{{ serverMessages["relatorioFaturar.ordem.tipo"] }}</span>
          </template>
          <template #head(vlliq)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.valorLiquido"]
            }}</span>
          </template>
          <template #head(qtd)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.quantidade"]
            }}</span>
          </template>
          <template #head(descCom)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.descComercial"]
            }}</span>
          </template>
          <template #head(descExtra)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.descExtra"]
            }}</span>
          </template>
        </b-table>
        <b-table class="coTable" responsive hover small striped :items="lstItensOrder" :fields="fields">
          <template #cell(vbelnVbrp)="data">
            <a class="link_fat" :style="`color:${lstDocFat.find((el) => {
            return el.vbeln === data.value;
          })
              ? lstDocFat.find((el) => {
                return el.vbeln === data.value;
              })['color']
              : ''
            }`" label-size="sm" style="cursor: pointer" @click="searchDetailsFat(data.value)">{{ data.value }}</a>
          </template>
          <template #head(posnrVbap)>
            <span>{{ serverMessages["relatorioFaturar.ordem.item"] }}</span>
          </template>
          <template #head(matnrVbap)>
            <span>{{ serverMessages["relatorioFaturar.ordem.material"] }}</span>
          </template>
          <template #head(qtdVbap)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.quantidade"]
            }}</span>
          </template>
          <template #head(desconto)>
            <span>{{ traduction.discount }}</span>
          </template>
          <template #head(precoLista)>
            <span>{{ traduction.listPrice }}</span>
          </template>
          <template #head(itemPreco)>
            <span>{{ serverMessages["pedido.cadastro.valor"] }}</span>
          </template>
          <template #head(valorVbap)>
            <span>{{ serverMessages["relatorioFaturar.ordem.valor"] }}</span>
          </template>
          <template #head(qtdVbrp)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.quantidadeFaturada"]
            }}</span>
          </template>
          <template #head(valorVbrp)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.valorFaturado"]
            }}</span>
          </template>
          <template #head(vbelnVbrp)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.docFaturamento"]
            }}</span>
          </template>
          <template #head(recusaVbap)>
            <span>{{
              serverMessages["relatorioFaturar.ordem.motivoRecusa"]
            }}</span>
          </template>
          <template #head(status)>
            <span>{{ serverMessages["relatorioFaturar.ordem.status"] }}</span>
          </template>

          <template #cell(martnrVbap)="data">
            <span v-if="lstMongoItem.length > 0 && lstMongoItem.find((e) => e.sku === data.value)" :style="
          lstMongoItem.find((e) => e.sku === data.value)['isSpecial'] ?
            'color:#FF2A00;font-weight:500'
            : 'null'">{{
    `${data.value.substr(0, 2)} ${data.value.substr(
      2,
      5
    )} ${data.value.substr(7, 3)} ${data.value.substr(
      10,
      3
    )} ${data.value.substr(13, 3)}`
    }}</span>
            <span v-else>{{
            `${data.value.substr(0, 2)} ${data.value.substr(
              2,
              5
            )} ${data.value.substr(7, 3)} ${data.value.substr(
              10,
              3
            )} ${data.value.substr(13, 3)}`
            }}</span>
          </template>
          <template #cell(valorVbap)="data">
            <span v-if="lstMongoItem.length > 0 && lstMongoItem.find((e) => e.sku === data.value)" :style="
          lstMongoItem.find((e) => e.sku === data.value)['isSpecial'] ?
            'color:#FF2A00;font-weight:500'
            : 'display:none;'">{{ data.value }}</span>
            <span v-else>{{ data.value }}</span>
          </template>
          <template #cell(itemPreco)="data">
            <span v-if="lstMongoItem.length > 0 && lstMongoItem.find((e) => e.sku === data.value)" :style="
              lstMongoItem.find((e) => e.sku === data.value)['isSpecial'] ?
                'color:#FF2A00;font-weight:500'
                : 'display:none;'
            ">{{ data.value }}</span>
            <span v-else>{{ data.value }}</span>
          </template>
          <template #cell(desconto)="data">
            <span>{{ data.value === "0,00%" ? "" : data.value }}</span>
          </template>
        </b-table>
      </div>
    </div>
    <!-- Detalhe ao Clicar no Documento de Faturamento -->
    <div v-else-if="docFatSelected" class="border border-dark">
      <div class="header-det-order">
        <b-container>
          <b-row>
            <b-col cols="6">
              <b-button id="btnVoltar" variant="secondary" @click="back('phaseTwoDOCFATSEL')">{{
                this.traduction.goBack
              }}</b-button>
            </b-col>
            <b-col cols="6">
              <label for=""><b>{{ serverMessages["relatorioFaturar.table.cliente"] }}:</b>
                {{ objOrder.name1 }}</label>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div>
        <div class="client-orders border-top border-dark">
          <div>
            <b-col sm="12">
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.ordem.docFaturamento']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="`${docFatSelected.vbeln}`" label-size="sm"></b-form-group>
              </b-row>
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.table.valorFaturado']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="`${docFatSelected.vlliq}`" label-size="sm"></b-form-group>
              </b-row>
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.table.descCom']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="`${docFatSelected.descCom}`" label-size="sm"></b-form-group>
              </b-row>
            </b-col>
          </div>
          <div>
            <b-col sm="12">
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.ordem.notaFiscal']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="`${docFatSelected.nf}`" label-size="sm"></b-form-group>
              </b-row>
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.ordem.quantidade']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="`${docFatSelected.qtd}`" label-size="sm"></b-form-group>
              </b-row>
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.table.descExtra']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="`${docFatSelected.descExtra}`" label-size="sm"></b-form-group>
              </b-row>
            </b-col>
          </div>
          <div>
            <b-col>
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.table.ordemVendas']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="docFatSelected.aubel" label-size="sm"></b-form-group>
              </b-row>
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.ordem.dataFaturamento']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="docFatSelected.dtfat" label-size="sm"></b-form-group>
              </b-row>
            </b-col>
          </div>
          <div>
            <b-col>
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.ordem.tipo']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="docFatSelected.tipo" label-size="sm"></b-form-group>
              </b-row>
              <b-row>
                <b-form-group :label="`${serverMessages['relatorioFaturar.table.condPgto']}:`" label-size="sm"
                  label-class="font-style"></b-form-group>
                <b-form-group :label="docFatSelected.condPag" label-size="sm"></b-form-group>
              </b-row>
            </b-col>
          </div>
        </div>
      </div>
      <b-table class="coTable cotebie2" responsive hover striped simple :items="arrayDocItensFiltered"
        :fields="fieldsItensDocFat" small>
        <template #head(posnrVbap)>
          <span>{{
            serverMessages["relatorioFaturar.docFaturamento.item"]
          }}</span>
        </template>
        <template #head(matnr)>
          <span>{{
            serverMessages["relatorioFaturar.docFaturamento.codigoMaterial"]
          }}</span>
        </template>
        <template #head(arktx)>
          <span>{{
            serverMessages["relatorioFaturar.docFaturamento.denominacao"]
          }}</span>
        </template>
        <template #head(fkimg)>
          <span>{{
            serverMessages["relatorioFaturar.docFaturamento.quantidade"]
          }}</span>
        </template>
        <template #head(netwrItm)>
          <span>{{
            serverMessages["relatorioFaturar.docFaturamento.valor"]
          }}</span>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Spinner from "../template/Spinner.vue";
import SelecaoConsulta from "../consultas/SelecaoConsulta.vue";
import SelecaoLista from "../consultas/SelecaoLista.vue";
import PageTitle from "../template/PageTitle.vue";
import { baseApiUrl, showError } from "@/global";
import { map, groupBy, reduce, uniq, find } from "underscore";
import numeral from "numeral";
import { format, parseISO } from "date-fns";
import axios from "axios";
import downloadPdf from "../commons/downloadPdf.vue";

export default {
  name: "PedidosFaturar",
  components: {
    SelecaoConsulta,
    PageTitle,
    SelecaoLista,
    Spinner,
    downloadPdf
  },
  data: function () {
    return {
      map: {},
      excelReady: false,
      segundaLista: [],
      json_data: [],
      json_footer: [],
      output: [],
      lstOrdens: [],
      lstOrdensAgrup: [],
      orderSelected: null,
      mongoHeader: {},
      docFatSelected: null,
      lstOrdensDet: [],
      lstItensOrder: [],
      lstItensDocFat: [],
      arrayDocItensFiltered: [],
      lstEquipes: [],
      lstSetores: [],
      lstDocFat: [],
      lstMongoItem: [],
      spinner: false,
      objOrder: {},
      validationOne: false,
      validationTwo: false,
      validationThree: false,
      vltotGeral: null,
      vltotFaturado: null,
      vltotfaturar: null,
      qtdtotGeral: null,
      qtdtotFaturado: null,
      downloadTable: [],
      donwloadTableHeader: [],
      qtdSaldoGeral: null,
      link_colors: [
        "#1204B3",
        "#289909",
        "#D609CF",
        "#806304",
        "#D92109",
        "#0CE82C",
        "#D92109",
      ],
      fields: [
        { key: "posnrVbap", label: "Item", sortable: true },
        { key: "martnrVbap", label: "Material", sortable: true },
        { key: "qtdVbap", label: "Qtd", sortable: true },
        { key: "precoLista", label: "Preço Lista", sortable: true },
        { key: "desconto", label: "Desconto %", sortable: true },
        { key: "itemPreco", label: "Valor Item", sortable: true },
        { key: "valorVbap", label: "Vlr. c/ desc", sortable: true },
        { key: "qtdVbrp", label: "Qtd. Fat", sortable: true },
        { key: "valorVbrp", label: "Vlr. Fat", sortable: true },
        { key: "vbelnVbrp", label: "Doc Fat" },
        { key: "recusaVbap", label: "Motivo Recusa", sortable: true },
        { key: "status", label: "Status", sortable: true },
      ],
      fieldsDocFat: [
        { key: "vbeln", label: "Doc.Fat", sortable: true },
        { key: "nf", label: "Nota Fiscal", sortable: true },
        { key: "dtfat", label: "Data do Faturamento", sortable: true },
        { key: "tipo", label: "Tipo", sortable: true },
        { key: "vlliq", label: "Valor Líquido", sortable: true },
        { key: "skus", label: "Sku´s", sortable: true },
        { key: "qtd", label: "Qtd.", sortable: true },
        { key: "descCom", label: "Desconto Comercial", sortable: true },
        { key: "descExtra", label: "Desconto Extra", sortable: true },
      ],
      fieldsDl: [
        { key: "vbeln", label: "Ordem Vendas" },
        { key: "bstnk", label: "Pedido Número" },
        { key: "dtPedido", label: "Data do Pedido" },
        { key: "dtRemessa", label: "dtRemessa" },
        { key: "valorPedido", label: "Valor da Ordem c/ Desc." },
        { key: "valorFaturado", label: "Valor Farturado" },
        { key: "valorFaturar", label: "Valor à Faturar" },
        { key: "qtdVbak", label: "Qtd. Ordem" },
        { key: "qtdVbrk", label: "Qtd. Faturado" },
        { key: "qtdSaldo", label: "Qtd. à Faturar" },
        { key: "condPgmt", label: "Cond. Pagto" },
        { key: "descontoComercial", label: "Desconto Comercial" },
        { key: "descontoExtra", label: "Desconto Extra" },
      ],
      fieldsItensDocFat: [
        { key: "posnr", label: "Item", sortable: true },
        { key: "matnr", label: "Código Material", sortable: true },
        { key: "arktx", label: "Denominação", sortable: true },
        { key: "fkimg", label: "Quantidade", sortable: true },
        { key: "netwrItm", label: "Valor", sortable: true },
      ],
      json_metaAlt: [],
      fieldsHeader: {
        posnrVbap: "Item",
        martnrVbap: "Material",
        qtdVbap: "Qtd",
        precoLista: "Preço Lista",
        desconto: "Desconto %",
        itemPreco: "Valor Item",
        valorVbap: "Vlr. c/ desc",
        qtdVbrp: "Qtd. Fat",
        valorVbrp: "Vlr. Fat",
        vbelnVbrp: "Doc Fat",
        recusaVbap: "Motivo Recusa",
        status: "Status",
      },
      headerFields: {
        Item: "posnrVbap",
        Material: "martnrVbap",
        Qtd: "qtdVbap",
        "Preço Lista": "precoLista",
        "Desconto %": "desconto",
        "Valor Item": "itemPreco",
        "Vlr. c/ desc": "valorVbap",
        "Qtd. Fat": "qtdVbrp",
        "Vlr. Fat": "valorVbrp",
        "Doc Fat": "vbelnVbrp",
        "Motivo Recusa": "recusaVbap",
        Status: "status",
      },
      json_meta: [],
      fatSelectedData: {
        Cliente: "name1",
        "Valor Ordem C/ Desc.": "valorFaturar",
        "Qtd. Ordem": "qtdSaldo",
        "Cond. Pagto": "descCondicao",
        "Pedido Num.": "bstnk",
        "Vlr Faturado": "valorFaturado",
        "Qtd Faturado": "qtdVbrk",
        "Desc. Extra": "descontoExtra",
        "Data Pedidos": "dtPedido",
        "Vlr a Faturar": "valorFaturar",
        "Qtd a Faturar": "qtdTotVbak",
        "Desco. Comerci": "descComerc",
        "Data Des. Remessa": "qtdTotVbak",
        "Status Global": "status",
      },
      dataSelectedFat: {
        name1: "Cliente",
        qtdSaldo: "Qtd. Ordem",
        descCondicao: "Cond. Pagto",
        bstnk: "Pedido Num.",
        valorFaturado: "Vlr Faturado",
        qtdVbrk: "Qtd Faturado",
        descontoExtra: "Desc. Extra",
        dtPedido: "Data Pedidos",
        valorFaturar: "Vlr a Faturar",
        descComerc: "Desco. Comerci",
        qtdTotVbak: "Data Des. Remessa",
        "": "Status Global",
      },

      fieldsDocFatFilter: {
        Item: "posnr",
        "Código Material": "matnr",
        Denominação: "arktx",
        Quantidade: "fkimg",
        Valor: "netwrItm",
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
      "radioMixOption",
      "salesTeam",
      "setorAtividade",
      "dateDe",
      "dateAte",
      "ocultarFaturados",
    ]),
  },
  methods: {

    async loadSalesTeam() {
      this.spinner = true;
      const url = `${baseApiUrl}/cliente/repmarca`;
      /* eslint-disable */
      await axios
        .post(url, {
          language: "P",
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
          this.lstSetores = resp.data.setoresAtividade.map((ele) => {
            return {
              id: ele.id,
              desc: ele.nome,
              name: `${ele.id} - ${ele.nome}`,
            };
          });

          this.spinner = false;
        })
        .catch(() => {
          showError(this.traduction.internalError);
          this.spinner = false;
        });
    },
    fnDownloadPdf() {
      this.spinner = true;
      window.html2canvas = html2canvas;
      let elem = document.querySelectorAll("#main-class");

      let width = window.innerWidth;
      let height = window.innerHeight - 300;

      var doc = new jsPDF("l", "px", [width, height]);

      doc.html(elem[0], {
        callback: function (pdf) {
          pdf.save("PedidosFaturar.pdf");
        },
      });

      this.spinner = false;
    },
    async searchOrders() {
      this.spinner = true;
      if (!this.setorAtividade.id) {
        showError(this.traduction.sectorSelected);
      } else if (!this.salesTeam.id) {
        showError(this.traduction.teamSelected);
      } else {
        this.spinner = true;
        let url = `${baseApiUrl}/pedido/getpedidosfaturar`;

        let clientsCode;
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
        await axios
          .post(url, {
            setorAtividadeId: this.setorAtividade.id,
            equipeVendaId: this.salesTeam.id,
            periodoDe: this.dateDe,
            periodoAte: this.dateAte,
            ocultarFaturados: this.ocultarFaturados,
            language: "P",
            items: clientsCode,
          })
          .then((resp) => {
            this.spinner = true;
            if (resp.data.result === "OK") {
              if (resp.data.relatorio.length === 0) {
                showError("Nenhum registro encontrado para o período");
              }
              url = `${baseApiUrl}/mongo/getordem`;
              //console.log('data relatorio lst ordens', resp.data.relatorio)
              this.lstOrdens = map(resp.data.relatorio, (e) => {
                return {
                  ...e,
                  name1: `${e.kunnr} - ${e.name1}`,
                  valorPedido: numeral(e.valorVbak).format("$0,0.00"),
                  valorFaturado: numeral(e.valorVbrk).format("$0,0.00"),
                  valorFaturar: numeral(e.valorSaldo).format("$0,0.00"),
                  descontoExtra: numeral(e.descExtra / 100).format("0.00%"),
                  descontoComercial: numeral(e.descComerc / 100).format(
                    "0.00%"
                  ),
                  dtPedido: format(parseISO(e.bstdk), "dd-MM-yyyy"),
                  dtRemessa: format(parseISO(e.vdatu), "dd-MM-yyyy"),
                };
              });
              let ovs2search = map(this.lstOrdens, (ov) => {
                return ov.vbeln;
              });
              let mongoJson = {
                ids: ovs2search,
                prj: ["_id", "dc", "df", "de"],
              };

              return axios.post(url, mongoJson);
            } else {
              this.spinner = false;
              showError(this.traduction.noresults);
            }
          })
          .then((resp) => {
            this.mongoHeader = resp.data.ordens;
            this.lstOrdensAgrup = map(
              groupBy(this.lstOrdens, (ordem) => ordem.name1),
              (value, key) => {
                return {
                  nome: key,
                  itens: map(value, (e) => {
                    return {
                      ...e,
                      descFin: find(
                        this.mongoHeader,
                        (el) => el._id === e.vbeln
                      )
                        ? numeral(
                          find(this.mongoHeader, (el) => el._id === e.vbeln)[
                          "df"
                          ] / 100
                        ).format("0.00%")
                        : "",
                      valorPedido: numeral(e.valorVbak).format("$0,0.00"),
                      valorFaturado: numeral(e.valorVbrk).format("$0,0.00"),
                      valorFaturar: numeral(e.valorSaldo).format("$0,0.00"),
                      descontoExtra: numeral(e.descExtra / 100).format("0.00%"),
                      descontoComercial: numeral(e.descComerc / 100).format(
                        "0.00%"
                      ),
                      dtPedido: format(parseISO(e.bstdk), "dd-MM-yyyy"),
                      dtRemessa: format(parseISO(e.vdatu), "dd-MM-yyyy"),
                    };
                  }),
                  vltot: reduce(
                    value,
                    (vlrAnt, curr) => {
                      return (vlrAnt += curr.valorVbak);
                    },
                    0
                  ),
                  vltotfaturado: reduce(
                    value,
                    (vlrAnt, curr) => {
                      return (vlrAnt += curr.valorVbrk);
                    },
                    0
                  ),
                  vltotfaturar: reduce(
                    value,
                    (vlrAnt, curr) => {
                      return (vlrAnt += curr.valorSaldo);
                    },
                    0
                  ),
                  qtdtot: reduce(
                    value,
                    (vlrAnt, curr) => {
                      return (vlrAnt += curr.qtdVbak);
                    },
                    0
                  ),
                  qtdFat: reduce(
                    value,
                    (vlrAnt, curr) => {
                      return (vlrAnt += curr.qtdVbrk);
                    },
                    0
                  ),
                  qtdSaldo: reduce(
                    value,
                    (vlrAnt, curr) => {
                      return (vlrAnt += curr.qtdSaldo);
                    },
                    0
                  ),
                };
              }
            );

            this.vltotGeral = numeral(
              reduce(
                this.lstOrdensAgrup,
                (vlrAnt, curr) => (vlrAnt += curr.vltot),
                0
              )
            ).format("$0,0.00");
            this.vltotFaturado = numeral(
              reduce(
                this.lstOrdensAgrup,
                (vlrAnt, curr) => (vlrAnt += curr.vltotfaturado),
                0
              )
            ).format("$0,0.00");
            this.vltotfaturar = numeral(
              reduce(
                this.lstOrdensAgrup,
                (vlrAnt, curr) => (vlrAnt += curr.vltotfaturar),
                0
              )
            ).format("$0,0.00");
            this.qtdtotGeral = reduce(
              this.lstOrdensAgrup,
              (vlrAnt, curr) => (vlrAnt += curr.qtdtot),
              0
            );
            this.qtdtotFaturado = reduce(
              this.lstOrdensAgrup,
              (vlrAnt, curr) => (vlrAnt += curr.qtdFat),
              0
            );
            this.qtdSaldoGeral = reduce(
              this.lstOrdensAgrup,
              (vlrAnt, curr) => (vlrAnt += curr.qtdSaldo),
              0
            );

            this.lstOrdensAgrup = this.lstOrdensAgrup.map((el) => {
              return {
                nome: el.nome,
                itens: el.itens,
                vltot: numeral(el.vltot).format("$0,0.00"),
                vltotfaturado: numeral(el.vltotfaturado).format("$0,0.00"),
                vltotfaturar: numeral(el.vltotfaturar).format("$0,0.00"),
                qtdtot: el.qtdtot,
                qtdFat: el.qtdFat,
                qtdSaldo: el.qtdSaldo,
              };
            });

            this.spinner = false;
          })
          .catch(() => {
            showError(this.traduction.internalError);
            this.spinner = false;
          });
        this.validationOne = true;
        this.sortPdf();
      }
    },
    sortPdf() {
      this.json_data = this.lstOrdensAgrup.map((el) => {
        return [el];
      });
      this.arrayDocItensFiltered = map(this.lstOrdensAgrup, function (reg) {
        return {
          nome: reg.nome,
          qtdeFaturado: reg.qtdFat,
          qtdeTotal: reg.qtdtot,
          valorTotal: reg.vltot,
          valorTotalFaturado: reg.vltotfaturado,
          valorTotalFaturar: reg.vltotfaturar,
        };
      });
    },
    searchDetails(ordem) {
      // console.log('searchDetails')
      this.spinner = true;
      this.lstMongoItem = [];
      this.orderSelected = ordem;
      let url = `${baseApiUrl}/pedido/getpedidosfaturardetalhe`;

      axios
        .post(url, {
          ordemVenda: this.orderSelected,
          language: "P",
        })
        .then((resp) => {
          if (resp.data.result === "OK") {
            this.objOrder = {};

            this.objOrder = this.lstOrdens.find(
              (e) => e.vbeln === this.orderSelected
            );
            this.lstItensOrder = resp.data.relatorio.relatorio;
            this.lstItensDocFat = resp.data.relatorio.relatorioDocFat;

            url = `${baseApiUrl}/mongo/getordemdetalhe`;

            return axios.post(url, { ov: this.orderSelected });
          } else {
            showError(this.traduction.noresults);
            this.spinner = false;
          }
        })
        .then((resp) => {
          this.lstMongoItem = resp.data.ordem ? resp.data.ordem.it : [];
          //
          let objMongo = null;
          let precoLista = null;
          let desconto = null;
          let itemPreco = null;
          let isSpecial = null;

          this.lstItensOrder = map(this.lstItensOrder, (el) => {
            if (this.lstMongoItem.length > 0) {
              objMongo = find(
                this.lstMongoItem,
                (e) => e.sku === el.martnrVbap
              );
              //console.log('objmongo', objMongo)
              precoLista = objMongo
                ? numeral(objMongo.prList).format("$0,0.00")
                : "";
              itemPreco = objMongo
                ? numeral(objMongo.pr).format("$0,0.00")
                : "";
              desconto = objMongo
                ? numeral(
                  objMongo.isSpecial === true
                    ? objMongo.dsc
                    : objMongo.dscNormal
                ).format("0.00%")
                : "";

              isSpecial = objMongo ? objMongo.isSpecial : false;
            }

            el.valorVbrp = numeral(el.valorVbrp).format("$0,0.00");
            el.valorVbap = numeral(el.valorVbap).format("$0,0.00");

            if (el.status === "Y") {
              el.status =
                this.serverMessages["relatorioFaturar.docFaturamento.Y"];
            } else if (el.status === "N") {
              el.status =
                this.serverMessages["relatorioFaturar.docFaturamento.N"];
            } else if (el.status === "P") {
              el.status =
                this.serverMessages["relatorioFaturar.docFaturamento.P"];
            } else if (el.status === "R") {
              el.status =
                this.serverMessages["relatorioFaturar.docFaturamento.R"];
            }

            return { ...el, desconto, itemPreco, precoLista, isSpecial };
          });
          let arraylocal = [];

          this.lstItensDocFat.forEach((el, index) => {
            arraylocal = el.map((item) => {
              return {
                vbeln: item.vbeln,
                aubel: item.aubel,
                nf: item.xblnr.substr(0, 9),
                dtfat: format(parseISO(item.fkdat), "dd-MM-yyyy"),
                tipo: item.fkart,
                vlliq: numeral(item.netwrTot).format("$0,0.00"),
                skus: el.length,
                qtd: reduce(
                  el,
                  (memo, num) => {
                    return memo + num.fkimg;
                  },
                  0
                ),
                descCom: this.objOrder.descontoComercial,
                descExtra: this.objOrder.descontoExtra,
                condPag: `${this.objOrder.condPgmt} - ${this.objOrder.descCondicao}`,
                color: this.link_colors[index],
              };
            });

            this.spinner = false;
            this.lstDocFat = this.lstDocFat.concat(arraylocal);
          });

          this.lstDocFat = uniq(this.lstDocFat, (x) => x.vbeln);
          this.spinner = false;
        })
        .catch((err) => {
          console.log(err);
          showError(this.traduction.internalError);
          this.spinner = false;
        });
      this.validationOne = false;
    },
    searchDetailsFat(docFat) {
      //console.log('seachDtailsFat')
      this.docFatSelected = this.lstDocFat.find((e) => e.vbeln === docFat);
      this.arrayDocItensFiltered = this.lstItensDocFat.filter((k) =>
        k.every((e) => e.vbeln === this.docFatSelected.vbeln)
      )[0];

    },
    back(e) {
      console.log(e)
      this.json_meta = [];
      if (this.docFatSelected) {
        this.docFatSelected = null;


      } else {
        this.orderSelected = null;
        this.lstDocFat = [];
        this.segundaLista = [];
        this.searchOrders();


      }
    },
    clear() {
      this.orderSelected = null;
      this.docFatSelected = null;
      this.lstDocFat = [];
      this.lstItensOrder = [];
    },
    excelDownload2() {
      //console.log('downlaod2 -  + footer innerText', this.lstOrdensAgrup)
      this.json_footer = []
      this.downloadTable = []

      this.lstOrdensAgrup.forEach((el) => {

        this.downloadTable.push(el.itens);
      });

      //console.log("Download", this.downloadTable);

      this.$nextTick(function () {
        let sel = this.$el.querySelectorAll("#downloadTable")
        //console.log(sel)
        //console.log('sel', sel.innerHTML)
        sel.forEach(el => {
          this.json_footer.push(el.innerHTML)
        })


      })
      // this.json_meta.push(`${this.serverMessages["relatorioFaturar.equipeVendas"]} : ${this.salesTeam ? this.salesTeam.name : ''}`)
    },
    excelDownload3() {
      //console.log('excelDownload3')
      this.$nextTick(function () {


        //console.log('lstDocFat',this.lstDocFat)
        this.downloadTable = [];
        this.json_meta = [];
        this.json_meta.push(`Doc. Fat: ${this.lstDocFat[0].vbeln}`);
        this.json_meta.push(`Valor Faturado: ${this.lstDocFat[0].vlliq}`);
        this.json_meta.push(`Desc. Com: ${this.lstDocFat[0].descCom}`);
        this.json_meta.push(`Nota Fiscal: ${this.lstDocFat[0].nf}`);
        this.json_meta.push(`Qtd: ${this.lstDocFat[0].qtd}`);
        this.json_meta.push(`Desc. Extra: ${this.lstDocFat[0].descExtra}`);
        this.json_meta.push(`Ordem Venda: ${this.lstDocFat[0].aubel}`);
        this.json_meta.push(`Data Faturamento: ${this.lstDocFat[0].dtfat}`);
        this.json_meta.push(`Tipo: ${this.lstDocFat[0].tipo}`);
        this.json_meta.push(`Cond. Pagto.: ${this.lstDocFat[0].condPag}`);
      })
    },
    excelDownload() {

      //console.log('objOrder - download 1')
      this.downloadTable = []
      this.spinner = true;
      this.json_meta = [];
      this.segundaLista = this.lstOrdens.map((s) => {
        let arrayLocal = [];
        //  let jsonmeta = find(this.lstOrdensAgrup, el => {return el === this.orderSelected})
        arrayLocal.push(s.bstdk);
        arrayLocal.push(s.bstnk);
        arrayLocal.push(s.condPgmt);
        arrayLocal.push(s.descComerc);
        arrayLocal.push(s.descCondicao);
        arrayLocal.push(s.descExtra);
        arrayLocal.push(s.descontoComercial);
        arrayLocal.push(s.descontoExtra);
        arrayLocal.push(s.dtPedido);
        arrayLocal.push(s.dtRemessa);
        arrayLocal.push(s.gbstk);
        arrayLocal.push(s.kunnr);
        arrayLocal.push(s.name1);
        arrayLocal.push(s.qtdSaldo);
        arrayLocal.push(s.qtdTotSaldo);
        arrayLocal.push(s.qtdTotVbak);
        arrayLocal.push(s.qtdTotVbrk);
        arrayLocal.push(s.qtdVbak);
        arrayLocal.push(s.qtdVbrk);
        arrayLocal.push(s.statusSepar);
        arrayLocal.push(s.valorFaturado);
        arrayLocal.push(s.valorFaturar);
        arrayLocal.push(s.valorPedido);
        arrayLocal.push(s.valorPerSaldo);
        arrayLocal.push(s.valorPerVbak);
        arrayLocal.push(s.valorPerVbrk);
        arrayLocal.push(s.valorSaldo);
        arrayLocal.push(s.valorVbak);
        arrayLocal.push(s.valorVbrk);
        arrayLocal.push(s.vbeln);
        arrayLocal.push(s.vdatu);
        arrayLocal.push(s.vkgrp);
        arrayLocal.push(s.vkgrpDesc);
        arrayLocal.push(s.waerk);

        this.segundaLista.push(arrayLocal);
      });

      this.$nextTick(function () {

        if (this.objOrder.name1 !== null && this.objOrder.name1 !== undefined && this.objOrder.name1 !== '') {

          this.json_meta.push(`Cliente : ${this.objOrder.name1}`)

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.ordemVendas"]} : ${this.objOrder.vbeln} || ${this.serverMessages["relatorioFaturar.table.pedidoNro"]} : ${this.objOrder.bstnk}`
          );

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.dataDesRemessa"]} : ${this.objOrder.dtRemessa} || ${this.serverMessages["relatorioFaturar.table.valorOrdem"]} : ${this.objOrder.valorPedido}`
          );

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.valorFaturado"]} : ${this.objOrder.valorFaturado} || ${this.serverMessages["relatorioFaturar.table.valorFaturar"]} : ${this.objOrder.valorFaturar}`
          );

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.statusGlobal"]} : ${this.objOrder.gbstk} || ${this.serverMessages["relatorioFaturar.table.qtdOrdem"]} : ${this.objOrder.qtdVbak}`
          );

          this.json_meta.push(
            `Qtd à Faturar : ${this.objOrder.qtdSaldo
            } -- ${this.serverMessages["relatorioFaturar.table.condPgto"]} : ${this.objOrder.condPgmt + "-" + this.objOrder.descCondicao
            }`
          );

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.descExtra"]} : ${this.objOrder.descontoExtra} || ${this.serverMessages["relatorioFaturar.table.descCom"]} : ${this.objOrder.descontoComercial}`
          );
          return
        }
        else {


          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.ordemVendas"]} : ${this.docFatSelected.vbeln} || ${this.serverMessages["relatorioFaturar.table.pedidoNro"]} : ${this.docFatSelected.aubel}`
          );

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.dataDesRemessa"]} : ${this.docFatSelected.dtRemessa} || ${this.serverMessages["relatorioFaturar.table.valorOrdem"]} : ${this.docFatSelected.valorPedido}`
          );

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.valorFaturado"]} : ${this.docFatSelected.valorFaturado} || ${this.serverMessages["relatorioFaturar.table.valorFaturar"]} : ${this.docFatSelected.valorFaturar}`
          );

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.statusGlobal"]} : ${this.docFatSelected.gbstk} || ${this.serverMessages["relatorioFaturar.table.qtdOrdem"]} : ${this.docFatSelected.qtdVbak}`
          );

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.qtdFaturado"]} : ${this.docFatSelected.qtdSaldo
            } || ${this.serverMessages["relatorioFaturar.table.condPgto"]} : ${this.docFatSelected.condPgmt + "-" + this.docFatSelected.descCondicao
            }`
          );

          this.json_meta.push(
            `${this.serverMessages["relatorioFaturar.table.descExtra"]} : ${this.objOrder.descontoExtra} || ${this.serverMessages["relatorioFaturar.table.descCom"]} : ${this.objOrder.descontoComercial}`
          );
        }



      })

      this.excelReady = true;

      this.spinner = false;
    },
  },

  async mounted() {
    await this.loadSalesTeam();
  },
  watch: {
    arrayDocItensFiltered: function () {
      this.excelDownload2();
    },
    lstMongoItem: function () {
      this.excelDownload();
    },
    docFatSelected: function () {
      this.excelDownload3();
    },
  },
  beforeUpdate() {
    if (this.listClientesSel.length === 0) {
      //this.clear();
    }
  },

  beforeDestroy() {
    this.lstOrdens = [];
    this.lstOrdensAgrups = [];
    this.orderSelected = null;

    this.$store.commit("setCustomers", []);
    this.$store.commit("setCustomersSel", []);
    this.$store.commit("setChooseSalesTeam", null);
    this.$store.commit("setOcultarFaturados", null);
  },
  beforeMount() {
    this.$store.commit("setShowOrNo", false);
  },
};
</script>

<style lang="scss">
.btnPdf {

  margin-top: 12px;

}

.btnPdf:hover {
  box-shadow: 2px 2px #333;
}

.main {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.main-class {
  background-color: white;
}

.header-area {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
  padding: 10px 0px;
}

.header-area2 {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
  //padding: 10px 0px;
  border: 1px solid black;
}

.client-orders {
  display: flex;
  justify-content: space-around;
  padding: 8px 0px;
  background-color: whitesmoke;
}

.sub-tot {
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-around;
  padding: 5px;
  font-weight: 600;
}

.sub-tot .subtot-itens {
  padding-bottom: 0px;
}

.sub-totGeral {
  background-color: #ffbba3;
  border: 1px solid black;
  font-weight: 600;
}

.linha {
  border: none;
  height: 1px;
  /* Set the hr color */
  /* color: #333; old IE */
  background-color: #333;
  /* Modern Browsers */
}

.link {
  font-size: 0.9rem;
}

.link:hover {
  text-decoration: underline;
  color: rgb(16, 22, 187);
}

.link:active {
  text-decoration: none;
}

.link_fat {
  text-decoration: none;
}

.link_fat:hover {
  text-decoration: underline;
  color: rgb(16, 22, 187);
}

.link_fat:active {
  text-decoration: none;
}

.font-style {
  font-weight: bold;
}

.header-det-order {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}

.header-det-order,
.clients-area>label {
  width: 100%;
  text-align: center;
  justify-content: center;
  background-color: #e58b2a;
  color: black;
  margin: 0;
  padding: 10px 0px;
  font-weight: 600;
}

.coTable {
  background-color: whitesmoke;
}

.coTable>table>thead {
  background-color: black;
  color: white;
}

.header-det-order {
  div.col {
    justify-content: flex-end;
  }
}

.btn-area {
  justify-content: space-around !important;
}
</style>
