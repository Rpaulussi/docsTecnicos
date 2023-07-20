<template>
    <div >
       <PageTitle icon="fa fa-handshake-o " :main=" serverMessages['pedido'] "></PageTitle>


       <b-modal head-variant="dark" ref="modalProduct" id="modalProduct" size="xl" hide-footer title="Produtos para Pedido" no-close-on-backdrop
           no-close-on-esc>
         <template #modal-header>
             <div>
              <h5>Produtos para Pedido</h5>
             </div>
               <div class="pedido-itens">
                   <span class="mr-3" style="color:#00008B"> <span style="color:white"> Skus( Max:420 ) : </span><b style="color:rgb(235, 122, 9);"> {{lstOrdersItens.length}}</b></span>
                   <span class="mr-3" style="color:#00008B"> <span style="color:white"> Quantidade :  </span><b style="color:rgb(235, 122, 9);">{{quantidadeTotal}}</b></span>
                   <span class="mr-3" style="color:#00008B"> <span style="color:white">  Valor total com desconto : </span><b style="color:rgb(235, 122, 9);">{{ `${valorLiquidoDisplay}` }}</b></span>
               </div>
         </template>
          <SelecaoProdutoExterno :cliente="clienteSelected ? clienteSelected.nome : '' " :setor="setorSelected" :listapreco="clienteSelected ? clienteSelected.codListaPrecoCondPagto : ''" :canal="canalDistribuicao" :cond="condPagSelected" :moeda="moeda" :pais="tamanhoSelected ? tamanhoSelected['nome']: '' " caller="Pedido" :referencias="lstReferencias"></SelecaoProdutoExterno>
       </b-modal>

       <b-modal head-variant="dark" ref="modalNovoPed" size="md" @ok="clearFields" title="Novo Pedido">
          <p class="my-4">Deseja digitar um novo pedido ?</p>
       </b-modal>

       <b-modal head-variant="dark" ref="modalRecoverPedido" size="xl" hide-footer style="max-width:800px" >
           <template #modal-header style="background:black; color:white;">
       <!-- Emulate built in modal header close button action -->

       <h5 style="padding:10px; text-align:center;justify-content: center;">Recuperar Pedido</h5>
     </template>
             <b-table striped hover :small="true"  responsive :items="lstCestaFiltered" :fields="fieldsRecover" class="tableUm">
                 <template  #cell(actionRec)="data">
                    <b-button class="fa fa-check-circle" variant="success"  @click="recoverCestaDetail(data.item._id)"></b-button>
                 </template>
                 <template  #cell(actionDel)="data">
                    <b-button class="fa fa-trash" variant="danger"  @click="deleteCestaItem(data.item._id)"></b-button>
                 </template>
             </b-table>
       </b-modal>

       <b-modal head-variant="dark" ref="modalCopy" title="Copiar Pedido"  @ok="checkSetorCustomer">
           <v-select id="cliente" v-model="clienteToCopy" label="nome"   :options="lstClientesCopy" lang="pt-BR" >
                 <template v-slot:no-options="{search, searching}">
                     <template v-if="searching">
                             {{traduction.noresultsfor}} <em>{{ search }}</em>.
                     </template>
                     <template v-else>
                         {{traduction.noresults}}
                     </template>
                 </template>
             </v-select>
       </b-modal>

       <b-modal head-variant="dark" ref="modalSaveCesta" title="Cesta">
         <template #modal-header id="cesta-header">
             <div  class="saveCesta-header">
                 <h4> {{ traduction.cesta }} </h4>
             </div>
         </template>
          <p style="text-align:center;"> <b style="font-size:16px !important">{{ questaoPed }} </b></p>
          <p style="text-align:center; font-size:16px !important; "> {{ questao }}</p>
          <template #modal-footer>
             <b-button class="fa fa-check-circle" variant="success"  @click="afterSave"></b-button>
             <b-button class="fa fa-trash" variant="danger"  @click="closeModalCesta"></b-button>
          </template>
       </b-modal>

       <b-modal head-variant="dark" ref="modalDeleteLine" title="Deletar Pedido" >
          <span> ATENÇÃO! Se excluir o pedido desta linha, ocorrerá o retorno ao pedido original. Prosseguir com a exclusão ? </span>
          <template #modal-footer>
             <b-button class="fa fa-check-circle" variant="success"  @click="confirmDelete"></b-button>
             <b-button class="fa fa-trash" variant="danger"  @click="closeModalDelete"></b-button>
          </template>
       </b-modal>

       <Spinner :state="spinner"></Spinner>



       <b-card class="w-100 mb-2 card-fullWidth oie">
         <div><h5>{{ serverMessages['cadastro.cliente.dadosEmpresa'] }}</h5></div>
          <hr class="my-2">
          <b-row>
              <b-col>
                 <b-form-group label="Cliente:">
                      <v-select class="width-fields width-fields-custom" id="cliente" v-model="clienteSelected" ref="clienteSelected" label="nome"  @input="getCustomerDetails(false)" :options="lstClientes" lang="pt-BR" >
                          <template v-slot:no-options="{search, searching}">
                              <template v-if="searching">
                                      {{traduction.noresultsfor}} <em>{{ search }}</em>.
                              </template>
                              <template v-else>
                                     {{traduction.noresults}}
                              </template>
                          </template>
                      </v-select>
                 </b-form-group>
              </b-col>
              <b-col>
                  <b-form-group :label="traduction.receiver">
                      <v-select  id="recebedor" class="moveTab width-fields width-fields-custom"   v-model="recebedorSelected" label="nome" :options="lstRecebedor" lang="pt-BR" >
                          <template v-slot:no-options="{search, searching}">
                              <template v-if="searching">
                                      {{traduction.noresultsfor}} <em>{{ search }}</em>.
                              </template>
                              <template v-else>
                                     {{traduction.noresults}}
                              </template>
                          </template>
                      </v-select>
                 </b-form-group>
              </b-col>
              <b-col>
                   <b-form-group :label="serverMessages['pedido.cadastro.tipoOrdem']">
                      <v-select class="width-fields" id="tipoordem" v-model="ordertypeSelected" label="nome" @input="mountOrderToSave()" :options="lstTipoOrdens" lang="pt-BR" >
                          <template v-slot:no-options="{search, searching}">
                              <template v-if="searching">
                                      {{traduction.noresultsfor}} <em>{{ search }}</em>.
                              </template>
                              <template v-else>
                                     {{traduction.noresults}}
                              </template>
                          </template>
                      </v-select>
                 </b-form-group>
              </b-col>
              <b-col>
                  <b-form-group :label="serverMessages['troca.cadastro.setorAtividade']">
                      <v-select class="width-fields" id="setorAtividade" @input="callApisforSector" v-model="setorSelected" label="nome" :options="lstSetorAtividade" lang="pt-BR" >
                          <template v-slot:no-options="{search, searching}">
                              <template v-if="searching">
                                      {{traduction.noresultsfor}} <em>{{ search }}</em>.
                              </template>
                              <template v-else>
                                     {{traduction.noresults}}
                              </template>
                          </template>
                      </v-select>
                 </b-form-group>
              </b-col>
          </b-row>
          <b-row>
              <b-col>
                  <b-form-group :label="serverMessages['relatorioFaturamento.detalhes.condicaoPagamento']">
                      <v-select class="width-fields" id="condpag" v-model="condPagSelected" label="nome" @input="mountOrderToSave()" :options="lstCondicoes" lang="pt-BR" >
                          <template v-slot:no-options="{search, searching}">
                              <template v-if="searching">
                                      {{traduction.noresultsfor}} <em>{{ search }}</em>.
                              </template>
                              <template v-else>
                                     {{traduction.noresults}}
                              </template>
                          </template>
                      </v-select>
                 </b-form-group>
              </b-col>
              <b-col>
                  <b-form-group :label="serverMessages['pedido.cadastro.numeroPedido']">
                      <b-form-input v-model="numPedido" placeholder="Digite o pedido" @blur="mountOrderToSave()"></b-form-input>
                 </b-form-group>
              </b-col>
              <b-col>
                  <b-form-group :label="serverMessages['pedido.cadastro.dataEmissao']">
                      <h5>{{dataPedido}}</h5>
                 </b-form-group>
              </b-col>
              <b-col>
                  <b-form-group :label="traduction.sizeConversion">
                      <v-select class="width-fields" id="convtam" v-model="tamanhoSelected" label="nome" @input="mountOrderToSave()" :options="lstPaises" lang="pt-BR" >
                          <template v-slot:no-options="{search, searching}">
                              <template v-if="searching">
                                      {{traduction.noresultsfor}} <em>{{ search }}</em>.
                              </template>
                              <template v-else>
                                     {{traduction.noresults}}
                              </template>
                          </template>
                      </v-select>
                 </b-form-group>
              </b-col>
          </b-row>
          <b-row>
              <b-col>
                  <b-button variant="outline-primary" @click="showDesconto" class="mr-2 btn-outline-success" id="btnDesconto"  >{{ serverMessages['pedido.cadastro.descontoComercial'] }}</b-button>
              </b-col>
          </b-row>
       </b-card>
       <transition name="slide-fade">
         <b-card v-show="showOrNoDesconto" class="mb-2 w-100">
             <div><h5>Descontos</h5></div>
             <hr class="my-2">
             <b-row>
                 <b-col>
                     <b-form-group :label="serverMessages['relatorioFaturamento.rel.descComercial']">
                         <v-select id="condpag" v-model="descontoSelected" label="descricao" @input="calcOrder()" :options="lstDescontos" lang="pt-BR" >
                             <template v-slot:no-options="{search, searching}">
                                 <template v-if="searching">
                                         {{traduction.noresultsfor}} <em>{{ search }}</em>.
                                 </template>
                                 <template v-else>
                                         {{traduction.noresults}}
                                 </template>
                             </template>
                         </v-select>
                     </b-form-group>
                 </b-col>
                 <b-col>
                     <b-form-group :label="serverMessages['pedido.cadastro.financeiro']">
                         <b-form-input type="number"  v-model="descFinanceiro" @change="setTotalDesconto()" placeholder=""></b-form-input>
                     </b-form-group>
                 </b-col>
                 <b-col>
                     <b-form-group :label="serverMessages['pedido.cadastro.descontoExtra.full']">
                         <b-form-input type="number"  v-model="descExtra" @change="setTotalDesconto()" placeholder=""></b-form-input>
                     </b-form-group>
                 </b-col>
                 <b-col>
                     <b-form-group label="Total:">
                         <b-form-input  :readonly="true" v-model="descTotal" placeholder="" @change="mountOrderToSave()"></b-form-input>
                     </b-form-group>
                 </b-col>
             </b-row>
         </b-card>
       </transition>
       <b-card  class="mb-2 w-100 card-fullWidth">
          <div><h5>{{ traduction.aditionalData }}</h5></div>
          <hr class="my-2">
          <b-row>
              <b-col>
                  <b-form-group :label="traduction.consistQuant" style="color:red ">
                      <b-form-input v-model="quantidade" placeholder=""></b-form-input>
                 </b-form-group>
              </b-col>
              <b-col>
                  <b-form-group :label="this.traduction.splitOrder">
                      <div style="display:flex">
                          <v-select class="mr-2" id="divi" v-model="qtdDivMax" label="high" :options="lstQuantDiv" lang="pt-BR" @change="validateSplit()" > </v-select>
                          <b-button class="mr-2" id="btnAplicar" variant="outline-primary" :disabled="disableButtons" @click="doSplitOrder()">{{ traduction.confirm }}</b-button>
                      </div>
                 </b-form-group>
              </b-col>
              <b-col>
                  <b-form-group label="Embalagem:">
                     <v-select class="mr-2" id="divi" v-model="embalagem" label="high" :options="lstEmbalagem" lang="pt-BR" > </v-select>
                 </b-form-group>
              </b-col>
              <b-col>
                  <b-form-group :label="serverMessages['cadastro.cliente.moeda']">
                      <h5>{{clienteSelected ? clienteSelected.moeda : '' }}</h5>
                 </b-form-group>
              </b-col>
              <b-col>
                  <b-form-group :label="serverMessages['pedido.cadastro.dataRemessa']">
                     <b-form-datepicker placeholder="Nenhuma Data Selecionada"    id="example-datepicker" @hidden="mountOrderToSave()" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" v-model="dtRemessa" :min="dtRemessa" :max="dataLimite" :dropup="false" class="mb-2"></b-form-datepicker>
                 </b-form-group>
              </b-col>
          </b-row>
          <b-row v-show="showSplitMain !== true">
              <b-col>
                 <b-form-group :label="serverMessages['troca.cadastro.faturamento']">
                     <b-form-textarea
                     id="textFaturamento"
                     v-model="faturamento"
                     placeholder=""
                     rows= 1
                     max-rows= 1
                     @blur="mountOrderToSave()"
                     ></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col>
                 <b-form-group :label="serverMessages['pedido.cadastro.expedicao']">
                     <b-form-textarea
                     id="textExpedicao"
                     v-model="expedicao"
                     placeholder=""
                     rows=1
                     max-rows=1
                     @blur="mountOrderToSave()"
                     ></b-form-textarea>
                </b-form-group>
              </b-col>
          </b-row>
       </b-card>
       <b-card class="card-flex" v-show="aplicado === 1">
           <div class="button-option-area mt-10">
             <!-- <b-button  v-show="false" variant="success"   class="mr-2" @click="montaEmail('pedidos')"> Enviar via e-mail </b-button> -->
               <b-button :disabled="disableButtons"  class="mr-2 btn-control" id="btnCopy" variant="primary" @click="copyToOther()" > {{ traduction.copyOrder }}</b-button>
               <b-button :disabled="disableButtons" class="mr-2" id="btnRecPedido" variant="warning" @click="showItensCesta()" >{{ traduction.recoverOrder }}</b-button>
               <b-button :disabled="disableButtons" class="mr-2" id="btnGravar" variant="success" @click="savePedidoSap()" >{{ serverMessages['geral.gravar'] }}</b-button>
               <b-button :disabled="disableButtons" class="mr-2" id="btnIncluirProd" variant="primary" @click="showModal()" >{{serverMessages['geral.incluir']}}  {{ serverMessages['pedido.cadastro.excluir'] }}</b-button>
               <b-button :disabled="disableButtons" class="mr-2" id="btnNovoPedido" variant="success" @click="showModalNovo()">{{ serverMessages['pedido.cadastro.novo'] }}</b-button>
               <b-button :disabled="disableButtons" class="mr-2" id="btnExcluir" variant="danger" @click="toggleModal()" >{{ serverMessages['pedido.cadastro.excluir'] }}</b-button>
               <div class="button" ><ImportFile v-show="setorSelected" style="margin-top: 10px;" :canal="canalDistribuicao" :cliente="clienteSelected" :pais="tamanhoSelected" ></ImportFile></div>

               <!-- <input v-on:change="loadFiles($event)" type="file" ref="formFile"  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"  class="mt-3" plain> -->


           </div>
               <div class="button">

                                      <downloadPdf
                                     :items="lstOrdersItens"
                                     :fields="pedidoFields"
                                     :campos="pedidoFields"
                                      > test
                                     </downloadPdf>
                                     <!-- <b-button @click="fnDownloadPdf()" class="btn">TESTE</b-button> -->
                                <b-button  @click.prevent="excelDownload()" class="btnExcel" style="background:transparent !important; border: 1px solid #333 !important; margin-top:12px; max-height:40px;"   >

                                  <export-excel

                                 :title="json_meta"
                                  :data="downloadableTable"
                                  :fields="fieldsPedidos"
                                  :name="`cadastroPedido.xls`"
                                  :footer="json_footer ? json_footer : null"

                                  type="xls"
                                 >


          <img :src="require(`@/assets/excelicon.png`)">
      </export-excel>

                                </b-button>



                            </div>
       </b-card>
       <hr class="my-4">
       <span class="ml-2" v-if="lstOrdersItens.length > 0"><b>Percentual Copa B: {{copaB}}</b></span>
       <b-table striped small responsive simple hover head-variant="dark" foot-clone v-show="lstOrdersItens.length > 0 && !showViewSplit" :items="lstOrdersItens" :fields="fieldsPedido" class="selectedTable tbl" id="tbl-dl" >
             <template  #head(index)>
                 <b-form-checkbox v-model="uncheck1" @change="setItensForDelete()" ></b-form-checkbox>
             </template>
             <template  #cell(index)="data">
                 <b-form-checkbox value="X" v-model="data.item.index" ></b-form-checkbox>
             </template>
             <template  #cell(marca)="data">
                 <span >{{data.value}}</span>
             </template>
             <template  #cell(referencia)="data">
                 <span >{{data.value}}</span>
             </template>
             <template  #cell(cor)="data">
                 <span >{{data.value}}</span>
             </template>
             <template  #cell(tamanho)="data">
                 <span >{{data.value}}</span>
             </template>
             <template  #cell(copa)="data">
                 <span >{{data.value}}</span>
             </template>
             <template  #cell(descricao)="data">
                 <span :style="data.item.precoManual !== false  || ( data.item.descontoPerc !== '' && data.item.descontoPerc !== 0 && data.item.descontoPerc != null) ? 'color:red':''" ><b>{{data.value}}</b></span>
             </template>
             <template  #cell(quantidade)="data">
                <span>{{ data.item.quantidade}}</span>
             </template>
             <template  #cell(descontoPerc)="data">
                 <div v-if="data.value !== 0 && data.value !== ''">
                     <span :style="data.item.descontoPerc !== '' && data.item.descontoPerc !== 0 ? 'color:red' :''" >{{ `${parseFloat(data.item.descontoPerc).toFixed(2).replace('.', ',')}%` }}</span>
                 </div>
                 <div v-else>
                     <span >{{ `${parseFloat(data.item.descontoHeader ? data.item.descontoHeader : 0).toFixed(2).replace('.', ',')}%` }}</span>
                 </div>
             </template>
             <template #cell(preco)="data">
                 <div v-if="data.item.precoManual === false">
                    <span v-if="data.item.quantidade > 0">{{`${parseFloat(data.value).toFixed(2).replace('.', ',')}`}}</span>
                 </div>
                 <div v-else-if="data.item.precoManual !== false">
                    <span v-if="data.item.quantidade > 0"> <span style="color:red"><b>{{`${parseFloat(data.item.precoCalc).toFixed(2).replace('.', ',')}`}}</b></span>{{` / ${parseFloat(data.item.preco).toFixed(2)}`}}</span>
                 </div>

             </template>
             <template  #cell(precoTotal)="data">
                 <div v-if="data.item.descontoPerc !== '' && data.item.descontoPerc !== 0 && data.item.descontoPerc != null">
                     <span style="color:red"><b>{{`${parseFloat(data.value).toFixed(2).replace('.', ',')}`}}</b></span>
                 </div>
                 <span v-else>{{`${parseFloat(data.value).toFixed(2).replace('.', ',')}`}}</span>
             </template>

       </b-table>
       <div class="totais-area" v-show="lstOrdersItens.length > 0 && !showViewSplit">
           <div>
             <b><b-form-group label="Sku´s(max: 420):"   label-size="sm"></b-form-group></b>
             <span>{{lstOrdersItens.length}}</span>
             <!-- <b-form-group :label="lstOrdersItens.length"  label-size="sm"></b-form-group> -->
          </div>
          <div>
             <b><b-form-group label="Quantidade:"   label-size="sm"></b-form-group></b>
             <span>{{quantidadeTotal}}</span>
             <!-- <b-form-group :label="quantidadeTotal"  label-size="sm"></b-form-group> -->
          </div>
          <div>
             <b><b-form-group label="Valor Bruto:"   label-size="sm"></b-form-group></b>
             <span>{{ valorBruto }}</span>
             <!-- <b-form-group :label="valorBruto"  label-size="sm"></b-form-group> -->
          </div>
          <div>
             <b><b-form-group label="Desconto:"   label-size="sm"></b-form-group></b>
             <span>{{ valorDesconto }}</span>
             <!-- <b-form-group :label="valorDesconto"  label-size="sm"></b-form-group> -->
          </div>
          <div>
             <b><b-form-group label="Valor Total com Desconto:"   label-size="sm"></b-form-group></b>
             <span>{{ valorLiquidoDisplay }}</span>
             <!-- <b-form-group :label="valorLiquido"  label-size="sm"></b-form-group> -->
          </div>
       </div>

       <div v-show="showViewSplit === true">

               <b-table class="table-select"  responsive simple small striped hover :items="lstSplitOrders" :fields="fieldsSplit" foot-clone>

                   <template #thead-top>
                     <b-tr>
                     <b-th colspan="6"><span class="sr-only">Name and ID</span></b-th>
                     <b-th variant="secondary">Total Disponivel:</b-th>
                     <b-th variant="primary" colspan="1">{{lstItensAvailable.reduce( (vl , c) => { return vl + c.disp},0)}}</b-th>
                     <b-th  colspan='1'></b-th>
                     <b-th variant="danger">{{lstItensAvailable.reduce( (vl , c) => { return vl + c.precoDisp},0).toFixed(2)}}</b-th>
                     </b-tr>
                  </template>

                   <template #cell(del)="data">
                       <b-button title="Eliminar Item" class="fa fa-trash" style="background-color:#FFDEAD ; color:	#363636" @click="deleteLine(data.item)" ></b-button>
                   </template>

                   <template #cell(et)="data">
                       <div class="form-datePicker" >
                       <b-form-datepicker style="min-width:130px" size="sm" placeholder="Nenhuma Data Selecionada" dropright :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" v-model="data.item.et" :max="dataLimite" class="mb-2 pedido-datePicker" :dropup="false" ></b-form-datepicker>
                       </div>
                   </template>
                   <template #cell(cp_text)="data">
                       <v-select style="max-width: 190px" v-model="data.item.cp_text" label="nome"  :options="lstCondicoes" lang="pt-BR" >
                              <template v-slot:no-options="{search, searching}">
                                  <template v-if="searching">
                                          {{traduction.noresultsfor}} <em>{{ search }}</em>.
                                  </template>
                                  <template v-else>
                                         {{traduction.noresults}}
                                  </template>
                              </template>
                          </v-select>
                   </template>
                   <template #cell(dc_text)="data">
                       <v-select style="max-width: 120px" v-model="data.item.dc_text" label="descricao" :options="lstDescontos" lang="pt-BR" >
                             <template v-slot:no-options="{search, searching}">
                                 <template v-if="searching">
                                         {{traduction.noresultsfor}} <em>{{ search }}</em>.
                                 </template>
                                 <template v-else>
                                         {{traduction.noresults}}
                                 </template>
                             </template>
                         </v-select>
                   </template>
                   <template #cell(pc)="data">
                       <b-form-input  class="fields-width" v-model="data.item.pc" placeholder="Digite o pedido"></b-form-input>
                   </template>
                   <template #cell(desctot)="data">
                       <span>{{data.value.toFixed(2)}}</span>
                   </template>
                   <template #cell(df)="data">
                       <b-form-input type="number" style="min-width:75px" v-model="data.item.df" @change="recalcOrderSplit()" placeholder=""></b-form-input>
                   </template>
                   <template #cell(de)="data">
                       <b-form-input type="number" style="min-width:75px"  v-model="data.item.de" @change="recalcOrderSplit()" placeholder=""></b-form-input>
                   </template>
                   <template #cell(descTotalper)="data">
                       <span>{{ (( Number(data.item.df) + Number(data.item.de) ) - ((data.item.df * data.item.de / 100))).toFixed(2) }}</span>
                   </template>
                   <template  #cell(actionSkus)="data">
                     <b-button title="Incluir / Excluir Itens do Pedido" class="fa fa-th-list" :variant="data.item.index === currentOrder ? 'warning': 'secondary'" @click="showSplit(data)"></b-button>
                   </template>
                   <template  #head(actionSkus)>
                     <b-button title="Visualizar consolidação dos pedidos" class="fa fa-th" variant="success" @click="showConsolidate()"></b-button>
                   </template>
                   <template #foot(qtde)>
                      <span >{{quantSplitItens}}</span>
                   </template>
                   <template #foot(vlbruto)>
                      <span >{{totvlbrutoSplit}}</span>
                   </template>
                   <template #foot(totcomdesc)>
                      <span >{{totvlcomdescSplit}}</span>
                   </template>
                   <template #foot(desctot)>
                      <span >{{totdescSplit}}</span>
                   </template>
                   <template #foot(et)>
                      <span class="text-danger"></span>
                   </template>
                   <template #foot(cp_text)>
                      <span class="text-danger"></span>
                   </template>
                   <template #foot(dc_text)>
                      <span class="text-danger"></span>
                   </template>
                   <template #foot(pc)>
                      <span class="text-danger"></span>
                   </template>
                   <template #foot(df)>
                      <span class="text-danger"></span>
                   </template>
                   <template #foot(de)>
                      <span class="text-danger"></span>
                   </template>
                   <template #foot(descTotalper)>
                      <span class="text-danger">Total em Pedidos:</span>
                   </template>
                   <template #foot(skus)>
                      <span class="text-danger"></span>
                   </template>
                   <template #foot(actionSkus)>
                      <span class="text-danger"></span>
                   </template>

               </b-table>

       </div>
       <hr class="my-2">
       <div class="wrapperCad" v-if="showSplitMain === true" style="display:flex ; justify-content:space-between">
           <div class="tableCad">
               <div class="btnCad">
              <b-button  class="ctnBtn fa fa-share " variant="success" @click="increaseItem()"></b-button>
           </div>

              <b-table responsive head-variant="dark" simple striped small style="" hover :items="lstItensAvailable" :fields="fieldsSplitModel" foot-clone class="selectedTable tbl2" >
                  <template #cell(sel)="data">
                   <b-form-checkbox  v-if="data.item.disp > 0" value="X" v-model="data.item.sel"></b-form-checkbox>
                  </template>
                  <template #cell(id)="data">
                    <span>{{`${data.item.id} - ${data.item.descricao}`}}</span>
                  </template>
                  <template #head(sel)>
                   <b-form-checkbox  value="X" v-model="uncheck"  @change="setAllItensAvailable()"></b-form-checkbox>
                  </template>
                  <template #foot(quantidade)>
                    <span>{{Number(lstItensAvailable.reduce( (vl , c) => { return vl + Number(c.quantidade)},0 ))}}</span>
                  </template>
                  <template #foot(disp)>
                    <span>{{lstItensAvailable.reduce( (vl , c) => { return vl + c.disp},0)}}</span>
                  </template>
                  <template #foot(id)>
                    <span>Totais</span>
                  </template>
                  <template #foot(sel)>
                    <span></span>
                  </template>
              </b-table>

           </div>


           <div class="tableCad">
               <div class="btnCad">
               <b-button  class="ctnBtn fa fa-reply" variant="warning" @click="decreaseItem()" ></b-button>
           </div>
              <b-table responsive style="" striped simple hover small :items="lstItensForOrder" head-variant="dark" :fields="fieldsSplitToDo" foot-clone class="selectedTable tbl3">
                  <template #cell(sel)="data">
                   <b-form-checkbox  value="X" v-model="data.item.sel"></b-form-checkbox>
                  </template>
                  <template #cell(id)="data">
                    <span>{{`${data.item.id} - ${data.item.descricao}`}}</span>
                  </template>
                  <template #head(sel)>
                   <b-form-checkbox v-model="uncheckForOrder" value="X" @change="setAllItens()" ></b-form-checkbox>
                  </template>
                 <template #cell(quantidade)="data">
                   <b-form-input type="number"  v-model="data.item.quantidade" placeholder="" @change="changeQuantItem()"></b-form-input>
                  </template>
                  <template #foot(quantidade)>
                    <span>{{lstItensForOrder.reduce( (vl , c) => { return vl + c.quantidade},0 )}}</span>
                  </template>
                  <template #foot(precoTotal)>
                    <span>{{totSplit}}</span>
                  </template>
                  <template #foot(desc)>
                    <span></span>
                  </template>
                  <template #foot(preco)>
                    <span></span>
                  </template>
                  <template #foot(id)>
                    <span>Totais</span>
                  </template>
                  <template #foot(sel)>
                    <span></span>
                  </template>
              </b-table>

           </div>
       </div>
       <div class="footerBox" v-if="showSplitMain === true">
         <b-row>
              <b-col>
                 <b-form-group label="Faturamento:">
                     <b-form-textarea
                     id="textFaturamento"
                     v-model="splitFaturamento"
                     placeholder=""
                     rows="2"
                     max-rows="3"
                     @blur="changeQuantItem()"
                     ></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col>
                 <b-form-group :label="serverMessages['pedido.cadastro.expedicao']">
                     <b-form-textarea
                     id="textExpedicao"
                     v-model="splitExpedicao"
                     placeholder=""
                     rows="2"
                     max-rows="3"
                     @blur="changeQuantItem()"
                     ></b-form-textarea>
                </b-form-group>
              </b-col>
          </b-row>
       </div>
       <div v-else-if="showConsolidateControl === true">
          <b-table responsive small simple style="width:50vw" striped head-variant="dark" foot-clone hover :items="lstConsolidate" :fields="fieldsConsolidate" class="selectedTable " >
                 <template  #cell(q1)="data">
                   <b-form-input v-if="aplicado > 1 " type="number" onClick="this.select()" v-model="data.item.q1" placeholder="" @change="changeQuantItemConsolid()"></b-form-input>
                   <span  v-else></span>
                  </template>
                  <template  #cell(q2)="data">
                   <b-form-input v-if="aplicado >= 2 " type="number" onClick="this.select()" v-model="data.item.q2" placeholder="" @change="changeQuantItemConsolid()"></b-form-input>
                   <span  v-else></span>
                  </template>
                  <template  #cell(q3)="data">
                   <b-form-input v-if="aplicado >= 3 " type="number" onClick="this.select()" v-model="data.item.q3" placeholder="" @change="changeQuantItemConsolid()"></b-form-input>
                   <span  v-else></span>
                  </template>
                  <template  #cell(q4)="data">
                   <b-form-input v-if="aplicado >= 4 " type="number" onClick="this.select()" v-model="data.item.q4" placeholder="" @change="changeQuantItemConsolid()"></b-form-input>
                   <span  v-else></span>
                  </template>
                  <template  #cell(q5)="data">
                   <b-form-input v-if="aplicado >= 5 " type="number" onClick="this.select()" v-model="data.item.q5" placeholder="" @change="changeQuantItemConsolid()"></b-form-input>
                   <span  v-else></span>
                  </template>
                  <template  #cell(q6)="data">
                   <b-form-input v-if="aplicado >= 6 " type="number" onClick="this.select()" v-model="data.item.q6" placeholder="" @change="changeQuantItemConsolid()"></b-form-input>
                   <span  v-else></span>
                  </template>
                  <template  #cell(q7)="data">
                   <b-form-input v-if="aplicado >= 7 " type="number" onClick="this.select()" v-model="data.item.q7" placeholder="" @change="changeQuantItemConsolid()"></b-form-input>
                   <span  v-else></span>
                  </template>
                  <template  #cell(q8)="data">
                   <b-form-input v-if="aplicado >= 8 " type="number" onClick="this.select()" v-model="data.item.q8" placeholder="" @change="changeQuantItemConsolid()"></b-form-input>
                   <span  v-else></span>
                  </template>
                  <template #cell(id)="data">
                    <span>{{`${data.item.id} - `}} <span><b>{{data.item.descricao}}</b></span></span>
                  </template>
                   <!-- HEAD SHOW CONTROL -->

                  <template v-if="aplicado < 2 " #head(q2)>
                   <span></span>
                  </template>
                  <template v-if="aplicado < 3 " #head(q3)>
                   <span></span>
                  </template>
                  <template v-if="aplicado < 4 " #head(q4)>
                   <span></span>
                  </template>
                  <template v-if="aplicado < 5 " #head(q5)>
                   <span></span>
                  </template>
                  <template v-if="aplicado < 6 " #head(q6)>
                  <span></span>
                  </template>
                  <template v-if="aplicado < 7 " #head(q7)>
                   <span></span>
                  </template>
                  <template v-if="aplicado < 8 " #head(q8)>
                   <span></span>
                  </template>
              </b-table>
       </div>
       <div v-if="lstItensForOrder.length > 0 || this.lstConsolidate.filter(el => el.quantidade !== el.disp).length > 0" style="background-color: #87CEFA ; padding: 15px ; display:flex ; justify-content:center">
           <div>
              <span><b>Ao salvar os pedidos, os skus disponíveis que não forem alocados em pedido(s), serão descartados.</b> </span>
           </div>
           <div>
               <b-button class="ml-2 fa fa-floppy-o" id="btnGravarSplit" variant="primary"  :disabled="disableButtons" @click="prepareToSave()"><b> Salvar</b></b-button>
           </div>

       </div>

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
                 <b-button class="btn btn-success" @click="deleteItens()">{{ traduction['confirm']}}</b-button>
                 <b-button class="btn btn-danger" @click="toggleModal()">{{ traduction['cancel']}}</b-button>
                 </template>
       </b-modal>

    </div>

 </template>

 <script>

 import PageTitle  from '../template/PageTitle.vue'
 //import { Canvg } from 'canvg'
 //import { closeMenu } from '../../mixins/closeMenu.js'
 import downloadPdf from "../commons/downloadPdf.vue";
 import { mapState } from "vuex";
 import numeral from 'numeral'
 import SelecaoProdutoExterno from '../commons/SelecaoProdutoExterno.vue'
 import vSelect from 'vue-select'
 import Spinner from "../template/Spinner.vue";
 import { baseApiUrl, showError , roundNumber , showSuccess } from "@/global";
 import axios from "axios";
 //import { uuid } from 'vue-uuid' // Import uuid
 import _ from "underscore";
 import * as XLSX from 'xlsx'
 import { montaEmail } from '../../mixins/montaEmail.js';
 import html2canvas from "html2canvas";
 import jsPDF from "jspdf";
 import {
   addDays,
   format,
   parseISO,
   differenceInDays,
 } from "date-fns";
import ImportFile from '../commons/ImportFile.vue';
 export default {
    name: "CadastroPedido",
    components: { PageTitle , vSelect ,Spinner, SelecaoProdutoExterno,downloadPdf,ImportFile},
    computed: {
     ...mapState(["serverMessages","language","traduction","user","repSelected","lstOrdersItens","login" ,"hasPMOrDescPerc","saveCesta","lstFitSense","planpedido"]),
    },
    mixins: [montaEmail],
    data: function(){
        return {
          pedidoHeader:{},
          excelImport: null,
          pedidoToSAP:{},
          copaB:0,
          embalagem:'Embalagem Shapewear',
          quantSplitItens:0,
          operationSuccess:true,
          lstFit: [],
          uncheck: null,
          downloadableTable: null,
          uncheck1:null,
          uncheckForOrder:null,
          showViewSplit : false,
          showSplitMain : false,
          showSplitGrid : false,
          splitFaturamento:null,
          splitExpedicao : null,
          spinner:false,
          showOrNoDesconto:null,
          showConsolidateControl :false,
          aplicado: 1,
          deleteItem:null,
          clienteSelected: null ,
          clienteToCopy: null,
          recebedorSelected : null,
          canalDistribuicaoCopy:null,
          ordertypeSelected: null,
          condPagSelected:{id: null , nome: null , flag: ''} ,
          setorSelected:null,
          descontoSelected: {id : null , flag: '', descricao: null, porcentagem : 0},
          tamanhoSelected:null,
          descFinanceiro:'',
          descExtra:'',
          descTotal:0,
          descTotalShow:null,
          dtRemessa:null,
          dataLimite:null,
          quantidade:null,
          totvlbrutoSplit:null,
          totvlcomdescSplit:null,
          totdescSplit:null,
          qtdDivMax: 1,
          canalDistribuicao:null,
          moeda:null,
          numPedido:null,
          faturamento:'',
          totSplit:null,
          expedicao:'',
          disableButtons: false,
          dataPedido:null,
          quantidadeTotal:null,
          valorBruto:null,
          valorDesconto:0,
          valorLiquidoDisplay:null,
          valorLiquido:null,
          valorPrecoManual:null,
          currentOrder:null,
          lstItensToOrder: [],
          lstCesta:[],
          lstSetorAtividadeCopy:[],
          lstRecebedorCopy:[],
          lstCestaFiltered:[],
          lstClientesCopy:[],
          lstCondicoesCopy:[],
          lstDescontosCopy:[],
          lstEmbalagem:["Embalagem Shapewear","Sem embalagem"],
          questao:null,
          lstClientes:[],
          lstSplitOrders:[],
          lstCondicoes:[],
          lstConsolidate:[],
          lstTipoOrdens:[],
          questaoPed: '',
          lstSetorAtividade:[],
          lstRecebedor:[],
          lstReferencias:[],
          lstQuantDiv:["1","2","3","4","5","6","7","8"],
          lstPaises:[],
          lstDescontos:[],
          lstItensAvailable:[],
          lstItensForOrder:[],
          fieldsPedido: [
               {key: 'index' , label: '#', sortable:false},
               {key: 'marca' , label: 'Marca', sortable:false},
               {key: 'referencia' , label: 'Ref.', sortable:false},
               {key: 'cor' , label: 'Cor', sortable:false},
               {key: 'tamanho' , label: 'Tam.', sortable:false},
               {key: 'copa' , label: 'Copa', sortable:false},
               {key: 'descricao' , label: 'Produto' , sortable:false },
               {key: 'descontoPerc' , label: 'Desconto %', sortable:false},
               {key: 'quantidade' , label: 'Quantidade', sortable:false},
               {key: 'preco' , label: 'Valor do Item', sortable:false},
               {key: 'precoTotal' , label: 'Total Item', sortable:false},
             ],
             pedidoFields: {
               'index' : '#',
               'marca' : 'Marca',
               'referencia' : 'Ref.',
               'cor' : 'Cor',
               'tamanho' : 'Tam.',
               'copa' : 'Copa',
               'descricao' : 'Produto'           ,
               'descontoPerc' : 'Desconto %',
               'quantidade' : 'Quantidade',
               'preco' : 'Valor do Item',
               'precoTotal' : 'Total Item',
             },
             fieldsPedidos: {
               '#' : 'index' ,
               'Marca' : 'marca' ,
               'Ref.' : 'referencia' ,
               'Cor' : 'cor' ,
               'Tam.' : 'tamanho' ,
               'Copa' : 'copa' ,
               'Produto'            : 'descricao' ,
               'Desconto %' : 'descontoPerc' ,
               'Quantidade' : 'quantidade' ,
               'Valor do Item' : 'preco' ,
               'Total Item' : 'precoTotal' ,
             },
           fieldsRecover: [
               {key: 'cod' , label: 'Codigo', sortable: true},
               {key: 'cli' , label: 'Cliente', sortable: true},
               {key: 'pc' , label: '#Pedido', sortable: true},
               {key: 'st' , label: 'Setor', sortable: true},
               {key: 'dtEmissaoFormat' , label: 'Emissão', sortable: true},
               {key: 'dtRemessaFormat' , label: 'Remessa'},
               {key: 'qt' , label: 'Quantidade', sortable: true},
               {key: 'vlFormat' , label: 'Valor Total'},
              // {key: 'moeda' , label: 'Moeda', sortable: true},
               {key: 'cp_text' , label: 'Cond.Pag'},
               {key: 'dc_text' , label: 'Desc. Comercial(%)'},
               {key: 'dfFormat' , label: 'Financeiro'},
               {key: 'deFormat' , label: 'Desc. Extra(%)'},
               {key: 'actionRec' , label: ''},
               {key: 'actionDel' , label: ''},
             ],
             file: null,
             fieldsSplit: [
               {key: 'del' , label: ''},
               {key: 'et' , label: 'Data Remessa'},
               {key: 'cp_text' , label: 'Condição Pgto'},
               {key: 'dc_text' , label: 'Desc.Comerc %'},
               {key: 'pc' , label: 'Nº Pedido'},
               {key: 'df' , label: 'Desc.Fin %'},
               {key: 'de' , label: 'Desc.Extra %'},
               {key: 'descTotalper' , label: 'Desc.Total %'   },
               {key: 'qtde' , label: 'Qtde'},
               {key: 'skus' , label: 'Skus'},
               {key: 'vlbruto' , label: 'Vl.Bruto'},
               {key: 'desctot' , label: 'Desc. R$'},
               {key: 'totcomdesc' , label: 'Total c/Desc R$'  },
               {key: 'actionSkus' , label: ''},

             ],
             fieldsSplitModel: [
               {key: 'sel' , label: '', sortable: true},
               {key: 'id' , label: 'Sku/Descrição', sortable: true},
               {key: 'quantidade' , label: 'Qtde', sortable: true},
               {key: 'disp' , label: 'Disp', sortable: true},
             ],
             fieldsConsolidate: [
               {key: 'id' , label: 'Sku/Descrição'},
               {key: 'quantidade' , label: 'Qtde'},
               {key: 'disp' , label: 'Disp'},
               {key: 'q1' , label: 'Q1'},
               {key: 'q2' , label: 'Q2'},
               {key: 'q3' , label: 'Q3'},
               {key: 'q4' , label: 'Q4'},
               {key: 'q5' , label: 'Q5'},
               {key: 'q6' , label: 'Q6'},
               {key: 'q7' , label: 'Q7'},
               {key: 'q8' , label: 'Q8'},
             ],
             fieldsSplitToDo: [
               {key: 'sel' , label: '', sortable: true},
               {key: 'id' , label: 'Sku/Descrição', sortable: true},
               {key: 'quantidade' , label: 'Qtde', sortable: true},
               {key: 'desc' , label: 'Desc%', sortable: true},
               {key: 'preco' , label: 'Valor Item', sortable: true},
               {key: 'precoTotal' , label: 'Valor Total', sortable: true},
             ],
              json_meta : [],
              json_footer : [],
        }
    },
    watch:{

       planpedido: function(){
        this.mountOrderToSave()
       },
       lstOrdersItens: function(){

           if(this.lstOrdersItens.length > 0){

              this.calcOrder()
              //this.uncheck1 = false
              //this.mountOrderToSave()

              //Melhoria para controlar percentual de copa B na digitaçao do pedido - 23/10/2022
              this.copabCheck()
              this.excelDownload()

           }


       },
       descTotal: function(){
           this.calcOrder()
       },
       saveCesta: function(){
         this.calcOrder()
         this.mountOrderToSave()
       }
     },
    methods: {
     loadFiles : function(event){


         //console.log('event', event)

         this.$nextTick(() => {


         this.file = event.target.files ? event.target.files[0] : null;
       if (this.file) {
         const reader = new FileReader();

         reader.onload = (e) => {
           /* Parse data */
           const bstr = e.target.result;
           const wb = XLSX.read(bstr, { type: 'binary' , cellDates: true, dateNF: 'yyyy/mm/dd;@'});
           /* Get first worksheet */
           const wsname = wb.SheetNames[0];
           const ws = wb.Sheets[wsname];
           /* Convert array of arrays */
           /*eslint-disable*/
           const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
           console.log(data)
         }

         reader.readAsBinaryString(this.file);

       } })
   /* data is an ArrayBuffer */

         //console.log('loadFilestest', bytes, workbook)

          /* grab first sheet */



     },
       copabCheck(){
          let qtdSoutiens = _.reduce(this.lstOrdersItens, (memo, num) => { return memo + (this.lstFitSense.includes(num.id.substr(0, 7)) ? Number(num.quantidade) : 0) }, 0)
          let qtdCopaB = _.reduce(this.lstOrdersItens, (memo, num) => {
                           return memo + ((this.lstFitSense.includes(num.id.substr(0, 7)) && num.id.substr(13, 3) === "00B") ? Number(num.quantidade) : 0)
          }, 0)
         this.copaB = numeral(( qtdCopaB / qtdSoutiens )).format('0.00%')
       },
       setItensForDelete(){
         this.lstOrdersItens.forEach(el => {
             if(el.index === ''){
               el.index = 'X'
             }else{
               el.index = ''
             }

         })
       },
       fnDownloadPdf() {
       this.spinner = true;
       window.html2canvas = html2canvas;
       let elem = document.querySelectorAll("#wrapper");

     // console.log('elemhtml2canva', elem)

       let width = window.innerWidth + 288;
       let height = window.innerHeight - 300;


       var doc = new jsPDF("l", "px", [width, height]);
     // console.log('doc' , doc)
       doc.html(elem[0], {
         callback: function (pdf) {
           pdf.save("CadastroPedido.pdf");
         },
       });

       this.spinner = false;
     },
 excelDownload(){
         this.json_meta = new Array
           this.json_footer = new Array
           this.downloadableTable = null


 //         this.downloadableTable = document.getElementById('tbl-dl')
 //         let rows = table.getElementsByTagName("tr");

 //         console.log(table, rows)

 //         for (var i = 0; i < rows.length; i++) {
 //     var cells = rows[i].getElementsByTagName("td");
 //     for (var j = 0; j < cells.length; j++) {
 //         console.log(j)
 //       cells[j].innerHTML = cells[j].innerHTML.replace(/./g, ',');
 //     }
 //   }


    this.downloadableTable = _.map(this.lstOrdersItens, el => {return {...el}})
              this.downloadableTable.forEach( (e) => {
         e.preco = JSON.stringify(e.preco).replace('.' , ',')
         e.precoTotal = JSON.stringify(e.precoTotal).replace('.' , ',')
     })

     let descFin = this.descFinanceiro
     let descExtra = this.descExtra






             this.json_meta.push(`Cliente : ${this.recebedorSelected ? this.recebedorSelected['nome'] : this.clienteSelected['nome']}`)
               this.json_meta.push(`Tipo de Ordem: ${this.ordertypeSelected ? this.ordertypeSelected['nome'] : this.pedidoHeader.to}`  )
             this.json_meta.push(`Setor Atividade: ${this.setorAtividade ? this.setorAtividade['nome'] : this.pedidoHeader.st}`)
             this.json_meta.push(`Condições de Pagamento : ${this.condPagSelected ? this.condPagSelected['nome'] : ''}`)
             this.json_meta.push(`Número do Pedido: ${this.numPedido}`)
             this.json_meta.push(`Data Emissão: ${this.dataPedido ? this.dataPedido : ""}`)
                 this.json_meta.push(`Data desejada Remessa: ${this.dtRemessa ? this.dtRemessa.replaceAll("-", "/").split("/").reverse().join('/') : ""}`)
                 this.json_meta.push(`Desc. Comercial(%) :  ${this.descontoSelected ? this.descontoSelected['descricao'] : "0,00"}`)
                 this.json_meta.push(`Desc. Extra (%) : ${descExtra ? descExtra : "0,00"}`)
                 this.json_meta.push(`Desc. Financeiro (%) : ${descFin ? descFin : "0,00"}`)
                 this.json_meta.push(`Moeda : ${this.moeda ? this.moeda : ''}`)
             this.json_footer.push(`<div style="width:100%; padding:5px; test-align:center"> <b>Qtd Skus: ${this.lstOrdersItens.length ? this.lstOrdersItens.length  : ''}  || Quantidade:  ${this.quantidadeTotal ? this.quantidadeTotal : ''} </b></div>`)
             this.json_footer.push(`<b> Desconto:  ${this.valorDesconto ? this.valorDesconto : ''}  || Valor Total C/ desconto: ${ this.valorLiquidoDisplay ? this.valorLiquidoDisplay : '' } || Valor Bruto: ${this.valorBruto ? this.valorBruto : ''} </b>`)




             // window.open();



             // console.log('tables', this.json_meta, this.json_footer)






     //console.log('excelDownload')


     },
       showItensCesta(){
            this.loadCesta()
            this.$refs['modalRecoverPedido'].show()


       },
       prepareToSave(){
         let controle = 0
         this.lstSplitOrders.forEach(elem => {

             if(elem.pc === ''){
               showError("O numero de pedido é obrigatório para todos os pedidos!")
               controle = 1
               return
             }
             else if (elem.skus === 0){
                 showError("Inclua os skus desejados nos pedidos!")
                 controle = 1
                 return
             }
             else{
               elem._id = ''
             let controleText = elem.cp_text.nome ? elem.cp_text.nome : elem.cp_text
             let controleId = elem.cp_text.id ? elem.cp_text.id : elem.cp

             elem.cp_text = controleText
             elem.cp = controleId

             let controleTextDc = elem.dc_text.descricao ? elem.dc_text.descricao : elem.dc_text
             let controleIdDc = elem.dc_text.id ? elem.dc_text.id : elem.dc

             elem.dc_text = controleTextDc //Erro pedido
             elem.dc = controleIdDc

             elem.et = format(parseISO(elem.et),'yyyyMMdd')
             elem.qt = _.reduce(elem.it , (vl , c) => { return vl + c.quantidade},0)

             delete elem.vlbruto
             }


         })
         let pedidoPai = this.pedidoHeader._id

         this.lstSplitOrders.forEach(elem => {
            if(controle === 0){
               this.savePedidoCesta(elem,0)
            }else{
               elem.et = format(parseISO(elem.et),'yyyy-MM-dd')
            }


         })

         if(controle === 0){
             //implementado em 12/10/2022 - Prevenção para deleção erronea do pedido pai no split de pedidos.
             if(this.operationSuccess === true){
             this.deleteCestaItem(pedidoPai,0)
             this.clearFields()
             this.clearElementsSplit()
             }

         }


       },
       validateSplit(){
          if(this.qtdDivMax > 8){
              this.qtdDivMax = 8

          }
          if(this.qtdDivMax === 0){
              this.qtdDivMax = 1
          }

       },
       confirmDelete(){
           this.lstSplitOrders = _.reject(this.lstSplitOrders, el => { return el.index === this.deleteItem})

             this.aplicado = this.lstSplitOrders.length
             this.qtdDivMax = this.lstSplitOrders.length
             this.recalcOrderSplit()
             this.checkAvailable()
             this.refreshItens()
             this.clearElementsSplit()

             this.$refs['modalDeleteLine'].hide()

       },
       deleteLine(item){

           if(this.lstSplitOrders.length === 2){
             this.$refs['modalDeleteLine'].show()
             this.deleteItem = item.index
           }else{
             this.lstSplitOrders = _.reject(this.lstSplitOrders, el => { return el.index === item.index})
             this.aplicado = this.lstSplitOrders.length
             this.qtdDivMax = this.lstSplitOrders.length
             this.recalcOrderSplit()
             this.checkAvailable()
             this.refreshItens()
           }

       },
       closeModalDelete(){
          this.$refs['modalDeleteLine'].hide()
       },
       setAllItens(){
          this.lstItensForOrder.forEach(el => {
              if(el.sel ===  'X'){
                  el.sel = ''
              }else{
                   el.sel = 'X'
              }
          })


       },
       clearElementsSplit(){
          this.lstSplitOrders = []
          this.aplicado = 1
          this.qtdDivMax = 1
          this.lstItensAvailable = []
          this.lstItensForOrder = []
          this.lstConsolidate = []
          this.showViewSplit = false
          this.showSplitMain = false
          this.showConsolidateControl = false
       },
       setAllItensAvailable(){
          this.lstItensAvailable.forEach(el => {
              if(el.sel ===  'X'){
                  el.sel = ''
              }else{
                   el.sel = 'X'
              }
          })

       },
       afterSave(){
          this.pedidoHeader._id = ''
          this.savePedidoCesta(this.pedidoHeader,0)
          this.numPedido = ''
          this.$refs["modalSaveCesta"].hide('modal-prevent-closing')
       },
       closeModalCesta(){
         this.$refs["modalSaveCesta"].hide('modal-prevent-closing')
         this.clearFields()
       },
       showConsolidate(){
         this.showSplitMain = false
         this.showConsolidateControl = true
         this.mountConsolidate()
       },
       mountConsolidate(){
         this.lstConsolidate = []
         this.lstConsolidate = this.lstItensAvailable

         this.lstConsolidate = this.lstConsolidate.map(el => {
             return{

                 ...el,
                 q1: this.lstSplitOrders[0] ? _.find(this.lstSplitOrders[0].it, elem => { return elem.id === el.id})["quantidade"] : 0,
                 q2: this.lstSplitOrders[1] ? _.find(this.lstSplitOrders[1].it, elem => { return elem.id === el.id})["quantidade"] : 0,
                 q3: this.lstSplitOrders[2] ? _.find(this.lstSplitOrders[2].it, elem => { return elem.id === el.id})["quantidade"] : 0,
                 q4: this.lstSplitOrders[3] ? _.find(this.lstSplitOrders[3].it, elem => { return elem.id === el.id})["quantidade"] : 0,
                 q5: this.lstSplitOrders[4] ? _.find(this.lstSplitOrders[4].it, elem => { return elem.id === el.id})["quantidade"] : 0,
                 q6: this.lstSplitOrders[5] ? _.find(this.lstSplitOrders[5].it, elem => { return elem.id === el.id})["quantidade"] : 0,
                 q7: this.lstSplitOrders[6] ? _.find(this.lstSplitOrders[6].it, elem => { return elem.id === el.id})["quantidade"] : 0,
                 q8: this.lstSplitOrders[7] ? _.find(this.lstSplitOrders[7].it, elem => { return elem.id === el.id})["quantidade"] : 0
             }
         })
       },
       changeQuantItemConsolid(){
          let contador =  0
          this.lstSplitOrders.forEach(el => {
               contador ++
               this.currentOrder = el.index
               this.lstConsolidate.forEach(ele => {
                    if(contador === 1 && ele.q1){
                        el.it.forEach(elem => {
                            if(elem.id == ele.id){
                                //elem.quantidade = Number(ele.q1)
                                if(ele.q1 < 0)
                                    ele.q1 = 0
                                if((Number(ele.q1) <= ele.disp) || Number(ele.q1) <= elem.quantidade){
                                  elem.quantidade = Number(ele.q1)
                                }else{
                                  elem.quantidade += Number(ele.disp)
                                }
                            }
                        })


                    }
                    if(contador === 2 && ele.q2){
                        el.it.forEach(elem => {
                            if(elem.id == ele.id){
                                //elem.quantidade = Number(ele.q2)
                                if(ele.q2 < 0)
                                    ele.q2 = 0
                                if((Number(ele.q2) <= ele.disp) || Number(ele.q2) <= elem.quantidade){
                                  elem.quantidade = Number(ele.q2)
                                }else{
                                  elem.quantidade += Number(ele.disp)
                                }
                            }
                        })

                    }
                    if(contador === 3 && ele.q3){
                        el.it.forEach(elem => {
                            if(elem.id == ele.id){
                                //elem.quantidade = Number(ele.q3)
                                if(ele.q3 < 0)
                                    ele.q3 = 0
                                if((Number(ele.q3) <= ele.disp) || Number(ele.q3) <= elem.quantidade){
                                  elem.quantidade = Number(ele.q3)
                                }else{
                                  elem.quantidade += Number(ele.disp)
                                }
                            }
                        })

                    }
                    if(contador === 4 && ele.q4){
                        el.it.forEach(elem => {
                            if(elem.id == ele.id){
                             //  elem.quantidade = Number(ele.q4)
                             if(ele.q4 < 0)
                                    ele.q4 = 0
                                if((Number(ele.q4) <= ele.disp) || Number(ele.q4) <= elem.quantidade){
                                  elem.quantidade = Number(ele.q4)
                                }else{
                                  elem.quantidade += Number(ele.disp)
                                }
                            }
                        })
                    }
                    if(contador === 5 && ele.q5){
                        el.it.forEach(elem => {
                            if(elem.id == ele.id){
                              //  elem.quantidade = Number(ele.q5)
                              if(ele.q5 < 0)
                                    ele.q5 = 0
                                if((Number(ele.q5) <= ele.disp) || Number(ele.q5) <= elem.quantidade){
                                  elem.quantidade = Number(ele.q5)
                                }else{
                                  elem.quantidade += Number(ele.disp)
                                }
                            }
                        })
                    }
                    if(contador === 6 && ele.q6){
                        el.it.forEach(elem => {
                            if(elem.id == ele.id){
                               // elem.quantidade = Number(ele.q6)
                               if(ele.q6 < 0)
                                    ele.q6 = 0
                                if((Number(ele.q6) <= ele.disp) || Number(ele.q6) <= elem.quantidade){
                                  elem.quantidade = Number(ele.q6)
                                }else{
                                  elem.quantidade += Number(ele.disp)
                                }
                            }
                        })
                    }
                    if(contador === 7 && ele.q7){
                        el.it.forEach(elem => {
                            if(elem.id == ele.id){
                               // elem.quantidade = Number(ele.q7)
                               if(ele.q7 < 0)
                                    ele.q7 = 0
                                if((Number(ele.q7) <= ele.disp) || Number(ele.q7) <= elem.quantidade){
                                  elem.quantidade = Number(ele.q7)
                                }else{
                                  elem.quantidade += Number(ele.disp)
                                }
                            }
                        })
                    }
                    if(contador === 8 && ele.q8){
                        el.it.forEach(elem => {
                            if(elem.id == ele.id){
                               // elem.quantidade = Number(ele.q8)
                               if(ele.q8 < 0)
                                    ele.q8 = 0
                               if((Number(ele.q8) <= ele.disp) || Number(ele.q8) <= elem.quantidade){
                                  elem.quantidade = Number(ele.q8)
                                }else{
                                  elem.quantidade += Number(ele.disp)
                                }
                            }
                        })
                    }
               })
           })

           this.checkAvailable()
           this.recalcOrderSplit()
           this.refreshItens()

       },
       changeQuantItem(){

          this.lstItensForOrder.forEach(el => {
              if(el.quantidade < 0){
                   el.quantidade = 0
              }
          })

          this.lstSplitOrders.forEach(el => {
               if(el.index === this.currentOrder){
                   el.it.forEach(elem =>{

                       let itensOrder = Number(_.find(this.lstItensForOrder,el => { return el.id === elem.id}) ? _.find(this.lstItensForOrder,el => { return el.id === elem.id})["quantidade"]:0)

                       let itensAvailable = Number(_.find(this.lstItensAvailable,el => { return el.id === elem.id}) ?_.find(this.lstItensAvailable,el => { return el.id === elem.id})["disp"]:0)

                       if( ( itensOrder <= itensAvailable ) || itensOrder < elem.quantidade){
                           elem.quantidade = _.find(this.lstItensForOrder,el => { return el.id === elem.id}) ? Number(_.find(this.lstItensForOrder,el => { return el.id === elem.id})["quantidade"] ): 0
                       }else if ( itensAvailable > 0 ){
                           elem.quantidade += itensAvailable
                       }


                   })

                  el.obsexp = this.splitExpedicao
                  el.obsfat = this.splitFaturamento
               }
           })

           this.checkAvailable()
           this.recalcOrderSplit()
           this.refreshItens()

       },
       increaseItem(){
          this.uncheck = ''
           let tmp = this.lstItensAvailable.filter(el => { return el.sel === 'X'})
           if(this.lstItensForOrder.length > 0)
             this.lstItensForOrder.forEach(el => {
                 if(_.find(tmp, ele => { ele.id === el.id})){
                     el.quantidade += Number( _.find(tmp, ele => { ele.id === el.id})["disp"])
                 }
             })

           tmp.forEach(el => {
               let control = _.find(this.lstItensForOrder, ele => { return ele.id === el.id })
               if(!control){
                   this.lstItensForOrder.push({...el , quantidade: el.disp})

               }else{
                    this.lstItensForOrder.forEach(eleme => {
                        if(eleme.id === el.id){
                            eleme.quantidade+=el.disp
                        }
                    })
               }
           })
           this.lstSplitOrders.forEach(el => {
               if(el.index === this.currentOrder){
                   el.it.forEach(elem =>{
                       elem.quantidade = _.find(this.lstItensForOrder, item => { return item.id === elem.id }) ? Number(_.find(this.lstItensForOrder, item => { return item.id === elem.id })["quantidade"]) : 0
                   })
               }
           })


           this.checkAvailable()
           this.refreshItens()
           this.changeQuantItem()
         // this.changeQuantItem()
         // this.refreshItens()
         // this.checkAvailable()

       },
       decreaseItem(){
            this.uncheckForOrder = ''
           let lstControl = this.lstItensForOrder.filter(el => { return el.sel === 'X'})

           this.lstSplitOrders.forEach(el => {
               if(el.index === this.currentOrder){
                   el.it.forEach(elem =>{
                       if(_.find(lstControl, it => { return it.id === elem.id})){
                          elem.quantidade = 0
                       }
                   })
               }
           })
           this.lstItensForOrder= _.reject(this.lstItensForOrder,el => { return el.sel === 'X'})

           this.checkAvailable()
           this.refreshItens()
           this.changeQuantItem()

       },
       showModalNovo(){
           this.$refs["modalNovoPed"].show()
       },
       doSplitOrder(){

         if(this.lstOrdersItens.length === 0){
             return
         }
         if(this.qtdDivMax > 1){
           this.showViewSplit = true

           if(this.qtdDivMax < this.lstSplitOrders.length){

               let valueCopy = this.lstSplitOrders.length

               for(let i = 0 ; i < Number(valueCopy - this.qtdDivMax) ; i++ ){
                 let controlDelete  = _.last(this.lstSplitOrders);
                 this.lstSplitOrders = _.reject(this.lstSplitOrders, el => { return el.index === controlDelete.index})
                 //
               }
               this.aplicado = this.qtdDivMax
                this.showSplitMain = false
                this.recalcOrderSplit()
                this.refreshItens()
                this.checkAvailable()
               return
           }
           else if(this.qtdDivMax >  this.lstSplitOrders.length){

              if(this.lstSplitOrders.length > 0){
                 let arrayControl = []

                 for(let i = 0 ; i < this.qtdDivMax - this.lstSplitOrders.length; i++){
                   arrayControl.push(this.pedidoHeader)
                 }

                 this.lstSplitOrders = this.lstSplitOrders.concat(arrayControl.map(el => {
                     return {
                         ...el,
                         et : format(parseISO(el.et), "yyyy-MM-dd"),
                         sel: '',
                         pc: '',
                         it: _.map(el.it, i => { return { ...i , quantidade : 0 , precoTotal : 0}}),
                         index: Math.floor(Math.random(50) * 100) +  Math.floor(Math.random(50) * 100),
                         skus:0,
                         qt:0,
                         vlbruto: 0,
                         desctot: 0,
                         totcomdesc: 0

                     }
                 }))
              }else{
                 for(let i = 0 ; i < this.qtdDivMax ; i++){
                     this.lstSplitOrders.push(this.pedidoHeader)
                 }
                 this.lstSplitOrders = this.lstSplitOrders.map(el => {
                     return {
                         ...el,
                         et : format(parseISO(el.et), "yyyy-MM-dd"),
                         sel: '',
                         pc: '',
                         it: _.map(el.it, i => { return { ...i , quantidade : 0 , precoTotal : 0}}),
                         index: Math.floor(Math.random(50) * 100) +  Math.floor(Math.random(50) * 100),
                         vlbruto: 0,
                         skus:0,
                         desctot: 0,
                         totcomdesc: 0

                     }
                 })
              }

           }

            this.aplicado = this.qtdDivMax


             this.lstSplitOrders.forEach(el => {
                 el.vlbruto = _.reduce(el.it, (vl, c) => { return vl+c.precoTotal},0)
             })

            this.recalcOrderSplit()
            this.refreshItens()
            this.checkAvailable()


         }
         else{
             this.showViewSplit = false
             this.showConsolidateControl = false
             this.clearElementsSplit()
         }

       },
       showSplit(data){
          this.showSplitMain = true
          this.currentOrder = data.item.index
          this.refreshItens()
          this.checkAvailable()
       },
       refreshItens(){
         this.lstItensForOrder = []
         let tmp = _.find(this.lstSplitOrders, el =>{ return el.index === this.currentOrder})
         if(tmp) {
           this.lstItensForOrder = _.map(_.filter(tmp.it, ele => { return ele.quantidade > 0}), elem => {
               return {
                  sel: '',
                  id: elem.id,
                  descricao: elem.descricao,
                  quantidade: elem.quantidade,
                  desc: elem.descontoPerc > 0 ? elem.descontoPerc : elem.descontoHeader,
                  preco: elem.preco,
                  precoTotal: elem.precoTotal
              }
           })

           this.splitFaturamento = tmp.obsfat
           this.splitExpedicao = tmp.obsexp
         }
         this.totSplit = numeral(this.lstItensForOrder.reduce( (vl , c) => { return vl + c.precoTotal},0)).format('$0,0.00')

         this.totdescSplit = numeral(this.lstSplitOrders.reduce( (vl,c) => { return vl + c.desctot },0)).format('$0,0.00')
         this.totvlcomdescSplit = numeral(this.lstSplitOrders.reduce( (vl,c) => { return vl + c.totcomdesc },0)).format('$0,0.00')
         this.totvlbrutoSplit = numeral(this.lstSplitOrders.reduce( (vl,c) => { return vl + c.vlbruto },0)).format('$0,0.00')

       },
       recalcOrderSplit(){
          this.quantSplitItens = 0

          this.lstSplitOrders.forEach(elemento =>{
             let vlr_bc_pManual  = 0
             let vlr_bc_descItem = 0
             let vlr_bc_descCom  = 0

             let totalcomDescontoItem  = 0
             let totalcomDescontoPrecoManual = 0
             let totalcomDescCom = 0
             elemento.skus = elemento.it.filter(e => e.quantidade > 0).length

              elemento.it.forEach(el =>{
                  if(el.quantidade > 0){
                      this.quantSplitItens+= el.quantidade
                      //Verifica se existe preço manual no item
                      if(el.precoManual){
                        let preco_com_descfinanceiro = roundNumber(el.precoCalc * (1 - elemento.df / 100), 2);
                        el.precoTotal = roundNumber(preco_com_descfinanceiro * el.quantidade, 2)

                        let precoBruto = roundNumber(el.preco * el.quantidade, 2)
                        vlr_bc_pManual+=  precoBruto
                        totalcomDescontoPrecoManual += roundNumber(precoBruto - el.precoTotal,2)
                      }
                     //  // Verifica se existe desconto individual no item
                      else if(el.descontoPerc > 0){

                         let preco_com_descfinanceiro = roundNumber(el.precoCalc * (1 - elemento.df / 100), 2);
                         el.precoTotal  = roundNumber(preco_com_descfinanceiro * el.quantidade, 2)

                         let precoBruto = roundNumber(el.preco * el.quantidade, 2)

                         vlr_bc_descItem=  precoBruto
                         totalcomDescontoItem += el.precoTotal

                      }
                       // Sem desconto no item ---
                      else {
                         let descontoTot = ((Number(elemento.df) + Number(elemento.de) ) - ((elemento.df * elemento.de / 100))).toFixed(2)

                         if(this.hasPMOrDescPerc ===  true ){
                               this.descontoSelected.porcentagem ? this.descontoSelected.porcentagem : 0

                               let precoLiquido = roundNumber(el.preco * (1 - (this.descontoSelected.porcentagem * -1) / 100) * (1 - descontoTot / 100), 2);
                               el.precoTotal  = roundNumber(precoLiquido * el.quantidade, 2)

                               el.descontoHeader = ( (this.descontoSelected.porcentagem * -1 ) * ( 1 - descontoTot / 100)) + Number (descontoTot)

                               vlr_bc_descCom+= roundNumber(el.preco * el.quantidade,2)
                               totalcomDescCom+= el.precoTotal
                         }
                         else{

                            // aplicarDescontoCom = true
                             let precoTotal = roundNumber(el.preco * el.quantidade,2)
                             precoTotal  = roundNumber(precoTotal * (1 - ( this.descontoSelected.porcentagem * -1) / 100 ),2)
                             el.precoTotal = roundNumber(precoTotal * (1 - descontoTot  / 100),2)

                             el.descontoHeader = ( (this.descontoSelected.porcentagem * -1 ) * ( 1 - descontoTot / 100)) + Number (descontoTot)

                             vlr_bc_descCom+= roundNumber(el.preco * el.quantidade,2)
                             totalcomDescCom+= el.precoTotal
                         }


                      }


                 }

              })

              elemento.desctot = roundNumber(vlr_bc_pManual + vlr_bc_descItem + vlr_bc_descCom,2) - roundNumber((vlr_bc_pManual-totalcomDescontoPrecoManual) + totalcomDescontoItem + totalcomDescCom ,2)
              elemento.totcomdesc = roundNumber((vlr_bc_pManual-totalcomDescontoPrecoManual) + totalcomDescontoItem + totalcomDescCom ,2)
              elemento.vlbruto = roundNumber(vlr_bc_pManual + vlr_bc_descItem + vlr_bc_descCom,2)

              elemento.vliq = elemento.totcomdesc

              //this.valorLiquido = roundNumber((vlr_bc_pManual-totalcomDescontoPrecoManual) + totalcomDescontoItem + totalcomDescCom ,2)
          })
          this.refreshItens()


       },
       checkAvailable(){
         this.lstItensAvailable = []
         let arrayTmp = _.map(_.groupBy(_.flatten(_.map(this.lstSplitOrders, el => { return el.it })), (sku) => { return sku.id}),(value,key) => { return {id:key, itens:value}})

         arrayTmp =  arrayTmp.map(el => {
             return {
                 id: el.id,
                 quantidade: _.reduce(el.itens, (vlant , curr) => { return vlant + curr.quantidade},0),
                 preco:_.reduce(el.itens, (vlant , curr) => { return vlant + curr.quantidade * curr.preco},0)
             }
         })

         this.lstOrdersItens.forEach(el => {
             arrayTmp.forEach(ele=> {
                 let acv = 0
                 let acvPreco  = 0
                 if(el.id === ele.id){
                     acv += el.quantidade - ele.quantidade
                     acvPreco += roundNumber(el.preco * el.quantidade - ele.preco,2)
                     this.lstItensAvailable.push({ sel:'', id: el.id , quantidade: el.quantidade , disp: acv , descricao : el.descricao , precoDisp: acvPreco < 0 ? 0 : acvPreco})
                 }
             })
         })

         this.mountConsolidate()
       },
       clearFields(){
          this.clienteCopia = null
          this.clienteSelected = null
          this.ordertypeSelected = null
          this.descontoSelected = {id : null , flag: '', descricao: null, porcentagem : 0}
          this.descFinanceiro = null
          this.descExtra = null
          this.descTotal = null
          this.faturamento = ''
          this.expedicao = ''
          this.numPedido = null
          this.condPagSelected = {id: null , nome: null , flag: ''}
          this.setorSelected = null
           /* eslint-disable */
          this.dtRemessa = format(addDays (new Date(), this.user.lstCoresDiasLimite.dias), "yyyy-MM-dd")
          this.qtdDivMax = 1
          this.quantidade = null
          this.recebedorSelected = null
          this.lstRecebedor = []
          this.lstSetorAtividade = []
          //this.lstDescontos = []
          this.pedidoHeader = {}
          this.pedidoToSAP = {}

          this.$store.commit("setListaRejectOrdersItens",[])
          this.$store.commit("setHasPMOrDescPerc",false)
          this.$store.commit("setTotalQtd",0)
          this.$store.commit("setValorTotal",0)

       },
       setTotalDesconto(){
        //console.log('ntrou desc')
        this.spinner = true
         this.descTotal = null

         // this.descFinanceiro = this.descFinanceiro.toLocaleString("pt-BR", {
         //     // Ajustando casas decimais
         //     minimumFractionDigits: 2,
         //     maximumFractionDigits: 2
         // });
        //
         // let dExtra = this.descExtra === null || this.descExtra === '' ? 0: Number(this.descExtra.replace(',','.'))
         // let dFin   = this.descFinanceiro === null || this.descFinanceiro === '' ? 0: Number(this.descFinanceiro.replace(',','.'))

         let dExtra = this.descExtra === null || this.descExtra === '' ? 0: Number(this.descExtra)
         let dFin   = this.descFinanceiro === null || this.descFinanceiro === '' ? 0: Number(this.descFinanceiro)


         this.descTotal = ((dFin + dExtra ) - ((dFin * dExtra / 100))).toFixed(2)
         //this.descTotalShow = `${(dFin + dExtra ) - ((dFin * dExtra / 100))}`

         this.calcOrder()
       },
       showDesconto(){
         this.showOrNoDesconto = !this.showOrNoDesconto
       },
       savePedidoSap(){

         if(this.quantidade != this.quantidadeTotal){

             showError("Verificar se a quantidade do pedido esta correta !")
             return
         }

         if(this.lstOrdersItens.length > 420){
             showError(" Atenção ..  são permitidos até 420 Skus por pedido !")
             return
         }

         if(!this.numPedido){
             showError(" Número do pedido é obrigatório")
             return
         }

         //Desabilitando os botoes
         this.disableButtons = true

         this.pedidoToSAP = {}
         this.pedidoToSAP.pedrecoverId  = this.pedidoHeader._id

         this.pedidoToSAP.pedidoId = null
         this.pedidoToSAP.cliente = this.clienteSelected.id
         this.pedidoToSAP.recebedor = this.recebedorSelected.id
         this.pedidoToSAP.tipoOrdem = this.ordertypeSelected.id
         this.pedidoToSAP.canalDistribuicao =  null
         this.pedidoToSAP.setorAtividade = this.setorSelected.id
         this.pedidoToSAP.condicaoPagamento = this.condPagSelected.id
         this.pedidoToSAP.idCondicaoPagamentoOutro = null
         this.pedidoToSAP.numeroPedido = this.numPedido
         this.pedidoToSAP.dataEmissao = format(new Date(),'yyyy-MM-dd')
         if(this.embalagem !== 'Sem embalagem'){
             this.expedicao = `${this.embalagem} - ${this.expedicao}`
         }
         this.pedidoToSAP.expedicao =  this.expedicao ? this.expedicao : '',
         this.pedidoToSAP.faturamento = this.faturamento ? this.faturamento : ''

         this.pedidoToSAP.hasPMOrDescPerc = this.hasPMOrDescPerc
         this.pedidoToSAP.dataRemessa = format(parseISO(this.dtRemessa),'yyyy-MM-dd')

         //descontos
         this.pedidoToSAP.vrDescontoFinanceiro = this.descFinanceiro ? this.descFinanceiro : 0
         this.pedidoToSAP.vrDescontoExtra  = this.descExtra ? this.descExtra : 0

         let produtosToSap = this.lstOrdersItens.map(el => { return { ...el }})


         produtosToSap.forEach((el) => {
         el.precoLista = el.preco,
         el.isSpecial = false

         el.descontoPerc = el.descontoPerc === '' ? 0 : el.descontoPerc

         if (el.descontoPerc === undefined || el.descontoPerc === null)
             el.descontoPerc = 0;

         if (el.precoManual === true) {
             var preco_com_descfinanceiro = roundNumber(el.precoCalc * (1 - Number(this.descFinanceiro) / 100), 2);
             el.preco = preco_com_descfinanceiro;
             el.isSpecial = true;

         } else if (el.descontoPerc > 0) {
             //var precoLiquido = roundNumber(el.precoCalc * (1 - el.descontoPerc / 100), 2);
             var precoLiquido = roundNumber(el.preco * (1 - el.descontoPerc / 100), 2);
              preco_com_descfinanceiro = roundNumber(precoLiquido * (1 - Number(this.descFinanceiro) / 100), 2);
             //console.log("descFina",preco_com_descfinanceiro)
             el.preco = preco_com_descfinanceiro;
             el.precoManual = true;
             el.isSpecial = true;

         } else if (this.hasPMOrDescPerc === true) {
             precoLiquido = roundNumber((el.preco * (1 - (this.descontoSelected.porcentagem * -1) / 100)) * (1 - this.descTotal / 100), 2);
             el.preco = precoLiquido;
             el.precoManual = true;

             el.descontoPercItemNormal = 1 - ((1 - (this.descontoSelected.porcentagem * -1) / 100) * (1 - this.descTotal / 100));
         }
         })



         this.pedidoToSAP.produtos = produtosToSap
         this.pedidoToSAP.organizacao = null
         this.pedidoToSAP.moeda = this.moeda
         this.pedidoToSAP.valorLiquido = this.valorLiquido
         this.pedidoToSAP.loginUsuario = this.user.loginUsuario
         this.pedidoToSAP.criador = this.user.loginUsuario
         this.pedidoToSAP.language = this.language
         this.pedidoToSAP.limiteDisponivel = 0
     if(this.hasPMOrDescPerc === true){
         this.pedidoToSAP.descontoComercialPercent = 0;//desconto comercial 0 (zero)
     }
     else{
         this.pedidoToSAP.descontoComercialPercent = this.descontoSelected.porcentagem * -1;
     }
     if(this.hasPMOrDescPerc === true){
         this.pedidoToSAP.descontoComercial = 'AA';//desconto comercial 0 (zero)
     }
     else{
         this.pedidoToSAP.descontoComercial = this.descontoSelected.id;
     }
         this.pedidoToSAP.pdescontoExtra = 0
         this.pedidoToSAP.rep = this.repSelected.high ? this.repSelected.high : this.user.loginUsuario
         this.pedidoToSAP.emailUsuario = this.user.emailUsuario
         this.pedidoToSAP.condPagDesc = this.condPagSelected.nome
         this.pedidoToSAP.clienteNome = this.clienteSelected.nome
         this.pedidoToSAP.rzRep = ""
         this.pedidoToSAP.endereco = ""
         this.pedidoToSAP.cidade = ""
         this.pedidoToSAP.descComOriginal = this.descontoSelected.porcentagem * -1;
         window.scrollTo({ top: 0, behavior: 'smooth' });
         this.spinner = true
         const url = `${baseApiUrl}/pedido/SavePedidoSAP`
             axios.post(url,this.pedidoToSAP)
             .then((resp) =>{
                 if(resp.data.result === 'EXIST'){
                     showError(resp.data.message)
                     //habilitar botoes
                      this.spinner =  false
                      this.disableButtons = false
                     return
                 }
                 if(resp.data.result === 'OK'){


                     this.questaoPed = resp.data.message
                     this.questao = 'Manter os dados para um novo pedido ?'
                     if(this.language === 'E'){

                         this.questao = "Keep the data for a new order ?"
                     }else if(this.language === 'F'){

                         this.questao = "Conserver les données pour une nouvelle demande ?";
                     }else if (this.language === 'S'){

                         this.questao = "Mantener los datos para una nueva orden ?";
                     }

                     this.$refs["modalSaveCesta"].show()

                 } else if (resp.data.result === "ERROR") {
                     showError(resp.data.message);
                     this.expedicao =''
                 }
             this.spinner =  false
             //habilitar os botões
             this.disableButtons = false
         }).catch(() =>{

             showError(this.traduction.internalError)
             this.spinner =  false
             this.disableButtons = false
         });

     },
       calcOrder(){

             let vlr_bc_pManual  = 0
             let vlr_bc_descItem = 0
             let vlr_bc_descCom  = 0

             let totalcomDescontoItem  = 0
             let totalcomDescontoPrecoManual = 0
             let totalcomDescCom = 0

             this.valorDesconto = 0
             this.valorLiquido = 0
             this.valorPrecoManual = 0
             this.valorLiquidoDisplay = ''
             this.quantidadeTotal = 0
             this.valor

             let resp = _.find(this.lstOrdersItens, function (produto) { return  (produto.precoManual === true || produto.descontoPerc > 0); }) === undefined ? false : true;

             this.$store.commit("setHasPMOrDescPerc",resp)

            // let aplicarDescontoCom  = false
             //=== ===============================CALCULO DOS TOTALIZADORES UI ========================================
             this.quantidadeTotal = _.reduce(this.lstOrdersItens, (vlant, current) => { return vlant + parseInt(current.quantidade)},0 )
             //this.valorBruto =    numeral(_.reduce(this.lstOrdersItens, (vlant, current) =>  { return vlant +  (roundNumber( current.quantidade * current.preco,2))},0)).format('$0,0.00')


             this.valorLiquido =  _.reduce(this.lstOrdersItens, (vlant, current) =>  { return vlant +  ((roundNumber(current.quantidade * current.precoCalc,2)) - roundNumber((current.precoCalc * this.descTotal / 100) * current.quantidade,2))},0)
             this.valorPrecoManual = 0
             this.valorDesconto = roundNumber(this.valorPrecoManual + _.reduce(this.lstOrdersItens, (vlant, current) =>  { return vlant +  ( ( roundNumber(current.quantidade * roundNumber(current.preco * current.descontoPerc, 2 ) / 100,2)) + roundNumber((roundNumber(current.precoCalc * this.descTotal,2) ) * current.quantidade  / 100,2) )},0),2)
              // ======================================================================================================

             ///Recalculo dos itens calculado
            // let arrayTemp = this.lstOrdersItens
             this.lstOrdersItens.forEach(el => {
                 if(el.quantidade > 0){
                      //Verifica se existe preço manual no item
                      if(el.precoManual){
                        let preco_com_descfinanceiro = roundNumber(el.precoCalc * (1 - this.descFinanceiro / 100), 2);
                        el.precoTotal = roundNumber(preco_com_descfinanceiro * el.quantidade, 2)

                        let precoBruto = roundNumber(el.preco * el.quantidade, 2)
                        vlr_bc_pManual+=  precoBruto
                        totalcomDescontoPrecoManual += roundNumber(precoBruto - el.precoTotal,2)
                      }
                     //  // Verifica se existe desconto individual no item
                      else if(el.descontoPerc > 0){

                         let preco_com_descfinanceiro = roundNumber(el.precoCalc * (1 - this.descFinanceiro / 100), 2);
                         el.precoTotal  = roundNumber(preco_com_descfinanceiro * el.quantidade, 2)

                         let precoBruto = roundNumber(el.preco * el.quantidade, 2)
                         //console.log("Preco Bruto:",precoBruto)
                         vlr_bc_descItem+=  precoBruto
                         totalcomDescontoItem += el.precoTotal

                      }
                       // Sem desconto no item --- VERIFICAR O CALCULO DESTE ITEM COM O MAURICIO
                      else {

                         if(this.hasPMOrDescPerc ===  true ){
                               this.descontoSelected.porcentagem ? this.descontoSelected.porcentagem : 0

                               let precoLiquido = roundNumber(el.preco * (1 - (this.descontoSelected.porcentagem * -1) / 100) * (1 - this.descTotal / 100), 2);
                               el.precoTotal  = roundNumber(precoLiquido * el.quantidade, 2)

                               el.descontoHeader = ( (this.descontoSelected.porcentagem * -1 ) * ( 1 - this.descTotal / 100)) + Number (this.descTotal)

                               vlr_bc_descCom+= roundNumber(el.preco * el.quantidade,2)
                               totalcomDescCom+= el.precoTotal
                         }
                         else{

                            // aplicarDescontoCom = true
                             let precoTotal = roundNumber(el.preco * el.quantidade,2)
                             precoTotal  = roundNumber(precoTotal * (1 - ( this.descontoSelected.porcentagem * -1) / 100 ),2)
                             el.precoTotal = roundNumber(precoTotal * (1 - this.descTotal  / 100),2)

                             el.descontoHeader = ( (this.descontoSelected.porcentagem * -1 ) * ( 1 - this.descTotal / 100)) + Number (this.descTotal)

                             vlr_bc_descCom+= roundNumber(el.preco * el.quantidade,2)
                             totalcomDescCom+= el.precoTotal
                         }


                      }


                 }

             })
             //Acrescentando valor de desconto comercial para ser mostrado na UI

             this.valorBruto = numeral(vlr_bc_pManual + vlr_bc_descItem + vlr_bc_descCom).format('$0,0.00')
             this.valorLiquidoDisplay = numeral(roundNumber((vlr_bc_pManual-totalcomDescontoPrecoManual) + totalcomDescontoItem + totalcomDescCom ,2)).format('$0,0.00')
             this.valorLiquido = roundNumber((vlr_bc_pManual-totalcomDescontoPrecoManual) + totalcomDescontoItem + totalcomDescCom ,2)
             this.$store.commit("setValorLiquido",this.valorLiquido)

             this.valorDesconto = numeral(roundNumber(vlr_bc_pManual + vlr_bc_descItem + vlr_bc_descCom,2)  - roundNumber((vlr_bc_pManual-totalcomDescontoPrecoManual) + totalcomDescontoItem + totalcomDescCom ,2)).format('$0,0.00')
             // console.log("precoManual",vlr_bc_pManual)
             // console.log("precoDescItem",vlr_bc_descItem)
             // console.log("precoDescCom",vlr_bc_descCom)

             // console.log("calculo",vlr_bc_pManual-totalcomDescontoPrecoManual)
             // console.log("Total Desconto Item",totalcomDescontoItem)
             // console.log("totalcomDescCom",totalcomDescCom)



             // console.log("DESCONTO",this.valorDesconto)
             this.spinner = false
             //console.log('saiu ')
             this.excelDownload();
         },
       mountOrderToSave(){
        //console.log('entrou')
        this.spinner = true
         if(!this.validateFieldsToSave()){
            return
         }
         // -- Checar com Mauricio  --> o if abaixo faz parte do tratamento quando se utiliza o pedido recover copiado para novo cliente (selecionado de uma lista popup)

         // if (this.pedidoHeader._id === undefined)
         // return;

         this.calcOrder()

         this.pedidoHeader.cli = `${this.clienteSelected.id} - ${this.clienteSelected.nome.split('-').length > 1 ? this.clienteSelected.nome.split('-')[1]: this.clienteSelected.nome }`
         this.pedidoHeader.rcb =  this.recebedorSelected.id
         this.pedidoHeader.st  =  this.setorSelected.id
         this.pedidoHeader.to  =  this.ordertypeSelected.nome.split("-")[0].trim()
         this.pedidoHeader.cp  =  this.condPagSelected.id
         this.pedidoHeader.cp_text = this.condPagSelected.nome
         this.pedidoHeader.pais = this.tamanhoSelected.nome
         this.pedidoHeader.pc   = this.numPedido
         this.pedidoHeader.dc   = this.descontoSelected.id
         this.pedidoHeader.dc_text   = this.descontoSelected.descricao
         this.pedidoHeader.moeda = this.moeda
         this.pedidoHeader.obsfat = this.faturamento === null || this.faturamento === undefined ? '': this.faturamento.trim()
         this.pedidoHeader.obsexp = this.expedicao  === null || this.expedicao === undefined ? '' :  this.expedicao.trim()
         this.pedidoHeader.em =  format(new Date(),'yyyyMMdd')
         this.pedidoHeader.fdl = ''
         this.pedidoHeader.vliq = Number( this.valorLiquido )
         this.pedidoHeader.qt = Number (this.quantidadeTotal)
         this.pedidoHeader.skus = Number (this.lstOrdersItens.length)

         if(this.language === 'en'){
            this.pedidoHeader.et = format(parseISO(this.dtRemessa),'yyyyMMdd')
         }else{
            //this.pedidoHeader.et = format(parseISO(this.dtRemessa),'yyyyMMdd')
            let date = new Date(this.dtRemessa)
            this.pedidoHeader.et = format(new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000),'yyyyMMdd')

         }

         this.pedidoHeader.df = this.descFinanceiro === null ? 0 : this.descFinanceiro
         this.pedidoHeader.de = this.descExtra === null ? 0 : this.descExtra

         this.pedidoHeader.loginUsuario = this.user.loginUsuario
         this.pedidoHeader.emailUsuario = this.user.emailOperador
         this.pedidoHeader.rep = this.repSelected.high ? this.repSelected.high : this.user.loginUsuario
         this.pedidoHeader.lang = this.language

         //Atribuindo itens
         if(this.lstOrdersItens.length === 0){
             return
         }
         //console.log("passei")
         this.pedidoHeader.it = this.lstOrdersItens

         this.pedidoHeader.hasPMOrDescPerc = this.hasPMOrDescPerc

         this.savePedidoCesta(this.pedidoHeader,1)
            this.spinner = false
           // console.log('saiu')
       },
       copyToOther(){
          if(this.lstOrdersItens.length > 0){

              this.lstClientesCopy = _.reject(this.lstClientes, el => { return el.id === this.clienteSelected.id})
              this.$refs['modalCopy'].show()
          }
       },
       checkSetorCustomer(bvModalEvent){
          bvModalEvent.preventDefault()
          let isClientCopy = true
          this.getCustomerDetails(isClientCopy)
       },
        validadeNewCustomer(){

           if(_.contains(_.pluck(this.lstSetorAtividadeCopy, "id"),this.pedidoHeader.st)){
              this.setorSelected.id = this.pedidoHeader.st
          } else if(this.pedidoHeader.st != '99'){

              if(_.contains(_.pluck(this.lstSetorAtividadeCopy, "id"),'03')){
                 this.setorSelected = _.find(this.lstSetorAtividadeCopy, el => { return el.id === '03'})
                 //
              }else{

                 //
              }
          }else{
             showError("O Cliente selecionado não possui Setor de Atividade compatível com o do pedido a ser copiado.")
             return
          }

          // Validando condição de novo cliente selecionado para copia
          if(this.lstCondicoesCopy.length === 1){
             this.condPagSelected = this.lstCondicoesCopy[0]
             //
          }
          else{
              let arrayTmp = _.pluck(this.lstCondicoesCopy, "id")
              //
              if(_.contains(arrayTmp, this.pedidoHeader.cp)){
                 this.condPagSelected = _.find(this.lstCondicoesCopy , el => { return el.id === this.pedidoHeader.cp })
              }else{
                  this.lstCondicoes = this.lstCondicoesCopy
                  this.condPagSelected = null
              }
          }

          //Setando dados na UI

           //this.$store.commit("setListaRejectOrdersItens",[])

           this.pedidoHeader = {}
           this.clienteSelected = this.clienteToCopy
           this.canalDistribuicao = this.canalDistribuicaoCopy
           this.numPedido = null
           this.lstRecebedor =  this.lstRecebedorCopy
           this.recebedorSelected =  this.lstRecebedor.length === 1 ? this.lstRecebedor[0] : ''
           this.faturamento = this.pedido

           this.getDescontoComercial()
       },
       showModal(){
         if(this.recebedorSelected === null || this.recebedorSelected === undefined){
               showError("Recebedor da Mercadoria é obrigatório")
               return
           }
           if(this.setorSelected === null || this.setorSelected === undefined){
               showError("Setor de Atividade é obrigatório")
               return
           }
           if(this.numPedido === null || this.numPedido === undefined ){
               showError("Numero de pedido  é obrigatório")
               return
           }
           if(this.descontoSelected === null  || this.descontoSelected === undefined ){
               showError("Desconto comercial é obrigatório")
               return
           }
           if(this.descontoSelected === null){
               showError("Desconto comercial é obrigatório")
               return
           }
           if(this.ordertypeSelected === null || this.ordertypeSelected === undefined){
               showError("Tipo de ordem é obrigatório")
               return
           }
           if(this.condPagSelected=== null || this.condPagSelected === undefined){
               showError("Condição de pagamento é obrigatório")
               return
           }
            if(this.lstReferencias.length === 0){
               this.loadReferencias(0)

           }
           else{


               this.$refs['modalProduct'].toggle('modalProduct')
           }







       },
       toggleModal(){
           this.$refs.modalDelete.toggle('modalDelete');

       },

       deleteItens(){
          let arrayTmp = _.reject(this.lstOrdersItens, el => { return el.index === 'X'})
          this.$store.commit("setListaRejectOrdersItens",arrayTmp)
          this.$refs.modalDelete.hide()
          this.uncheck1 = false

          if(this.lstOrdersItens.length === 0){
              this.deleteCestaItem(this.pedidoHeader._id,1)
              this.quantidadeTotal = 0
              this.valorLiquidoDisplay = 0
          }else if (this.lstOrdersItens.length !== 0) {
               this.$refs['modalProduct'].toggle('modalProduct')
           }


       },
       async loadCustomers(){
             this.spinner = true
             this.$store.commit('setShowOrNo',true)
             const url = `${baseApiUrl}/cliente/repclientes`
              axios.post(url,{
                 language: this.language,
                 loginUsuario: this.user.userType === 'REP' ? this.user.loginUsuario : this.repSelected.high,
                 codrep: ''
             }).then(resp =>{
               this.spinner = false
               this.lstPaises = resp.data.paises
               this.tamanhoSelected = this.lstPaises[0]
               this.lstClientes = resp.data.clientes.map(ele =>{
                    return{
                        ...ele,
                        nome: `${ele.id}-${ele.nome}`
                    }
               })
               this.lstClientesCopy = this.lstClientes
               this.spinner =  false
             }).catch(() =>{

                showError(this.traduction.internalError)
               this.spinner =  false
            });
      },
      validateFieldsToSave(){

          if(!this.clienteSelected ){
           //
            return false
          }
          if(!this.recebedorSelected){
             //
            return false
          }
          if(!this.ordertypeSelected){
               //
            return false
          }
           if(!this.setorSelected){
              //
            return false
          }
          if(!this.condPagSelected){
              //
            return false
          }
          // Incluir validação de numero de pedido para pedidos copiados para outro cliente
          if(!this.descontoSelected){
              //
            return false
          }
          if(!this.canalDistribuicao ){
              //
           return false
          }
          if(!this.tamanhoSelected){
             //
           return false
          }

          return true

      },
      loadCesta(){
        this.spinner = true
        const url = `${baseApiUrl}/mongo/GetListPedidoRecover`
           axios.post(url,{
           loginUsuario: this.user.loginUsuario
           //loginUsuario: this.user.userType === 'REP' ? this.user.loginUsuario : this.repSelected.high,
         }).then(resp =>{
           //Arrays Originais
           this.lstCesta = resp.data
           this.lstCestaFiltered  = _.map(this.lstCesta, el => {
                return {
                    ...el,
                    cod: el.cli.substr(0,10),
                    cli: el.cli.substr(12),
                    dtEmissaoFormat: format(new Date(el.em.substr(0,4) + '-' + el.em.substr(4,2) + '-' + el.em.substr(6,2)), "dd/MM/yyyy"),
                    dtRemessaFormat: new Date(el.et.substr(0,4) + '-' + el.et.substr(4,2) + '-' + el.et.substr(6,2)),
                    vlFormat: numeral(el.vliq).format('$0,0.00'),
                    dfFormat: numeral(el.df / 100).format('0.00%'),
                    deFormat: numeral(el.de / 100).format('0.00%'),
                    actionRec: '',
                    actionDel : '',
                }
           })
           this.lstCestaFiltered.forEach(el => {
             let daterem = new Date(el.dtRemessaFormat)
             el.dtRemessaFormat = format(new Date(daterem.valueOf() + daterem.getTimezoneOffset() * 60 * 1000),"dd/MM/yyyy")
           })
           this.spinner = false
         }).catch(() =>{

             showError(this.traduction.internalError)
             this.spinner = false
         });

      },
      deleteCestaItem(id,param){
        this.spinner = true
        const url = `${baseApiUrl}/mongo/DeletePedidoRecover`
           axios.post(url,{
           _id: id
         }).then(() =>{
           //
           this.spinner = false
           if(param === 1)
             showSuccess("Pedido deletado da cesta com sucesso")
           this.lstCestaFiltered = _.reject(this.lstCestaFiltered, el => { return el._id === id })
         }).catch(() =>{

             showError(this.traduction.internalError)
             this.spinner = false
         });
      },
      recoverCestaDetail(id){
        this.spinner = true
        const url = `${baseApiUrl}/mongo/GetPedidoRecover`
           axios.post(url,{
           _id: id
         }).then(resp =>{
           //Arrays Originais
           //

           this.pedidoHeader = resp.data
           let tmp = _.map(_.filter(this.pedidoHeader.it, el => { return el.quantidade > 0}), ele => { return { ...ele , index: ''}} )

           this.$store.commit("setListaRejectOrdersItens",tmp)
           this.spinner = false

           this.clienteSelected = _.find(this.lstClientes, el => { return el.id === this.pedidoHeader.cli.substr(0,10)})
           this.condPagSelected.id = this.pedidoHeader.cp
           this.condPagSelected.nome = this.pedidoHeader.cp_text
           this.descExtra = Number(this.pedidoHeader.de )
           this.descFinanceiro = Number(this.pedidoHeader.df)
           this.tamanhoSelected = _.find(this.lstPaises , el =>  { return el.nome  === this.pedidoHeader.pais })
           this.dataPedido = format(new Date(), "dd/MM/yyyy");
           this.numPedido  = this.pedidoHeader.pc
           //this.descontoSelected = this.pedidoHeader.dc_text
           this.faturamento = this.pedidoHeader.obsfat
           this.expedicao  = this.pedidoHeader.obsexp


           /* eslint-disable */
           let dtrem  = addDays (new Date(), this.user.lstCoresDiasLimite.dias)
           dtrem = format(new Date(dtrem),"yyyy-MM-dd")

           let dtcesta =new Date(`${this.pedidoHeader.et.substr(0,4)}-${this.pedidoHeader.et.substr(4,2)}-${this.pedidoHeader.et.substr(6,2)}`)

           dtcesta = new Date (dtcesta.valueOf() + dtcesta.getTimezoneOffset() * 60 * 1000)
           dtcesta = format(dtcesta,'yyyy-MM-dd')

           let calc =  differenceInDays(new Date(dtcesta), new Date(dtrem))

           if(calc > 0){
             this.dtRemessa = format(parseISO(this.pedidoHeader.et), "yyyy-MM-dd")
           }
           else{
            /* eslint-disable */
             this.dtRemessa  = format(addDays (new Date(), this.user.lstCoresDiasLimite.dias), "yyyy-MM-dd")
           }

           this.callApis()


           this.$refs['modalRecoverPedido'].hide()
         }).catch(() =>{

             showError(this.traduction.internalError)
             this.spinner = false
         });

         this.$store.commit("setListaRejectItens", _.filter(this.pedidoHeader.it, el => { return el.quantidade > 0}))

      },
      savePedidoCesta(pedido,holdid){
         //implementado 12/10/2022 - Prevenir possivel gap entre salvar pedidos filhos na cesta de pedidos e deletar o pedido pai
        this.operationSuccess = true
        this.spinner = true
        const url = `${baseApiUrl}/mongo/SavePedidoRecover`
           axios.post(url,pedido).then((resp) =>{

           if(resp.data.id){
               if(holdid == 1)
                 this.pedidoHeader._id = resp.data.id
               else
                 this.pedidoHeader._id = ''
           }
           if(resp.data.result === 'ERROR'){
             this.operationSuccess = false
           }
           this.spinner = false
         }).catch(() =>{

             showError(this.traduction.internalError)
             this.spinner = false
             this.operationSuccess = false
         });
      },
      splitOrders(){
          for(let i = 0 ; i < this.qtdDivMax ; i++){
              this.lstSplitOrders.push(this.pedidoHeader)
          }
      },
      callApis(){
          this.clienteCopia = false
          this.getCustomerDetails(false)

      },
      async loadReferencias(p){
        this.spinner = true
        const url = `${baseApiUrl}/produto/GetRefProduto`
           await axios.post(url,{
           condpagid: "601",
           flgFora:'',
           lista: "03.05.08.11.18.38.90.99",
           pais: "BRASIL",
           tipoOrdem: "",
           canaldistribid: "20",
           canaldistribnome: "Varejo",
           setoratividadeid: this.setorSelected.id,
           setoratividadenome: "LIZ",
           language: this.language,
           moeda: "BRL",
         }).then(resp =>{
           //Arrays Originais
           this.lstReferencias = resp.data
           this.spinner = false

           if(p === 0)
              this.$refs['modalProduct'].show()

           //this.$store.commit('setShowScreen',true)
         }).catch(() =>{

             showError(this.traduction.internalError)
             this.spinner = false
         });

      },
      getCustomerDetails(clienteCopia){

          if(!this.clienteSelected.codListaPrecoCondPagto){
              showError("Cliente não possui lista de preço vinculada , verificar com setor de cadastro")
              return
          }
         this.spinner = true

         this.moeda = this.clienteSelected.moeda
          console.log('api call', clienteCopia, this.clienteToCopy?.id, this.clienteSelected?.id)
         const url = `${baseApiUrl}/cliente/getinfotoorder`
             axios.post(url,{
             clienteId: clienteCopia ? this.clienteToCopy.id  : this.clienteSelected.id,
             //condpag: this.clienteSelected.codListaPrecoCondPagto,
             condpag: "60",
             moeda: clienteCopia ? this.clienteToCopy.moeda : this.clienteSelected.moeda,
             language: this.language,
             nome: "",
             setorAtvId:  this.pedidoHeader && !clienteCopia ? this.pedidoHeader.st : null,
             representante: this.user.userType === 'REP' ? this.user.loginUsuario : this.repSelected.high,
             rz:""
         }).then(resp =>{
             this.spinner = false

             if(resp.data.bloqueioCliente === 'B'){
                 showError("Cliente bloqueado , consulte o departamento financeiro")
                 return
             }
             if(clienteCopia){

                this.lstSetorAtividadeCopy = resp.data.listSetorAtividade.map(ele => { return {...ele ,  nome: `${ele.id} - ${ele.nome}` }})
                this.lstCondicoesCopy  = resp.data.lstCondicaoPagamento.map(ele => { return {...ele ,  nome: `${ele.id} - ${ele.nome}` }})
                this.canalDistribuicaoCopy = resp.data.clienteLangRQ.canalDistribuicao
                this.lstRecebedorCopy  = resp.data.lstRecebedor.map(ele => { return {...ele ,  nome: `${ele.id} - ${ele.nome}` }})

                this.validadeNewCustomer()
                this.$refs['modalCopy'].hide()
             }
             else{
                 //
                 this.lstSetorAtividade = resp.data.listSetorAtividade.map(ele => { return {...ele ,  nome: `${ele.id} - ${ele.nome}` }})
                 this.canalDistribuicao = resp.data.clienteLangRQ.canalDistribuicao
                 // this.lstDescontos = _.map(resp.data.descontosComercial ,el =>{
                 //     if(el.flag === 'X')
                 //     {
                 //         return{
                 //                 ...el,
                 //                 descricao: `${el.id}-${numeral(el.porcentagem / 100).format('0.00%')}`

                 //             }
                 //     }

                 // })
                 this.lstDescontos = _.map(_.filter(resp.data.descontosComercial, e => { return e.flag === 'X'}) ,el =>{
                    return{
                         ...el,
                         descricao: `${el.id}-${numeral(el.porcentagem / 100).format('0.00%')}`
                    }
                 })

                 resp.data.listTipoOrdem.forEach(element => {

                     if(resp.data.escritorioVenda.cdAgenciaVendas === '2000'){

                         this.descontoSelected =  _.find(this.lstDescontos,el => { return el.id === 'AA' })
                         if(element.id === 'ZEXP'){
                         this.lstTipoOrdens.push({ id: element.id ,  nome: `${element.id} - ${element.nome}` })
                         }
                         else if (element.id === 'ZEXI'){
                         this.lstTipoOrdens.push({ id: element.id , nome: `${element.id} - ${element.nome}` })
                         }
                     }
                     else{
                         this.descontoSelected =  this.lstDescontos[0]
                         if(element.id === 'ZORB' || element.id === 'ZPRO'){
                         this.lstTipoOrdens.push({ id: element.id , nome: `${element.id} - ${element.nome}` })
                         }

                     }

                     //this.ordertypeSelected = this.lstTipoOrdens[0]
                 });

                 if(resp.data.escritorioVenda.cdAgenciaVendas === '2000'){
                     this.ordertypeSelected = this.lstTipoOrdens[1]
                 }else{
                     this.ordertypeSelected = this.lstTipoOrdens[0]
                 }
                 this.lstCondicoes  = resp.data.lstCondicaoPagamento.map(ele => { return {...ele ,  nome: `${ele.id} - ${ele.nome}` }})
                 this.lstRecebedor  = resp.data.lstRecebedor.map(ele => { return {...ele ,  nome: `${ele.id} - ${ele.nome}` }})

                 this.recebedorSelected =  this.lstRecebedor.length === 1 ? this.lstRecebedor[0] : ''

                 if(this.pedidoHeader)
                   this.setorSelected = _.find(this.lstSetorAtividade, el => { return  el.id === this.pedidoHeader.st })

                 this.setTotalDesconto()
                 //this.calcOrder()
            }
         }).catch(() =>{

             //
             showError(this.traduction.internalError)
             this.spinner =  false
         });
      },
      getDescontoComercial(){
         this.spinner = true
         const url = `${baseApiUrl}/pedido/GetClientDescCom`
             axios.post(url,{
             setorAtividade:  this.setorSelected,
             ordemVendaId: "1000",
             canalDistribuicao: this.canalDistribuicao,
             cliente: this.clienteSelected,
         }).then(resp => {

         //    this.lstDescontos = _.map(resp.data ,el =>{
         //        if(el.flag === 'X')
         //        {
         //            return{
         //                 ...el,
         //                 descricao: `${el.id}-${numeral(el.porcentagem / 100).format('0.00%')}`

         //             }
         //        }

         //    })
             this.lstDescontos = _.map(_.filter(resp.data, e => { return e.flag === 'X'}) ,el =>{
                    return{
                         ...el,
                         descricao: `${el.id}-${numeral(el.porcentagem / 100).format('0.00%')}`
                    }
            })
            //this.lstDescontos = resp.data
            //this.descontoSelected  =  _.find(this.lstDescontos, el => {return el.flag === 'X'})

            this.descontoSelected = this.lstDescontos[0]
            this.spinner = false

            this.mountOrderToSave()
         }).catch((err) =>{
            console.log(err)
            showError(this.traduction.internalError)

            this.spinner =  false
         })
      },
      async callApisforSector(){

         if(this.lstOrdersItens.length > 0){
             let setortmp = _.find(this.lstOrdersItens,  el => {return  el.marca })

             showError("ATENÇÃO! Não é possível alterar o Setor de Atividade do pedido com quantidades maior que 0 (zero).")
             this.setorSelected = _.find(this.lstSetorAtividade, el => { return  el.id === setortmp.marca})
             return
         }
          await this.loadReferencias(1)
          await this.getDescontoComercial()
      }
    },
    beforeDestroy(){
      this.clearFields()
    },
    async mounted(){

        this.dataPedido = format(new Date(), "dd/MM/yyyy");
         /* eslint-disable */
        this.dtRemessa  = format(addDays (new Date(), this.user.lstCoresDiasLimite.dias), "yyyy-MM-dd")

              /* eslint-disable */
        this.dataLimite = `${this.user.lstCoresDiasLimite.limite.substr(0,4)}-${this.user.lstCoresDiasLimite.limite.substr(4,2)}-${this.user.lstCoresDiasLimite.limite.substr(6,2)}`
        await this.loadCustomers()
        //await this.loadReferencias()
 /* eslint-disable */
        await axios.get(`${baseApiUrl}/produto/fitsense`)
         .then(resp => {
             /* eslint-disable */
            // this.lstFit = resp.data.fitSense
             this.$store.commit("setFitSense",resp.data.fitSense)
         })
         .catch(() => {
             /* eslint-disable */
                 this.spinner = !this.spinner
             showError(this.traduction.internalError)

         })

       this.$store.commit("setListaRejectOrdersItens",[])
       this.$store.commit("setHasPMOrDescPerc",false)
    }
 }
 </script>

 <style lang="scss" scoped>
 .width-fields-custom{
    
   
    max-width: none !important;
    width: auto !important;
        
    
}
.__vs-search{
    font-size: 20px !important;
} 
.bottom-row{
     background-color: #ffbba3;
      padding:10px;
 }
 .saveCesta-header{
     width:100%;
     padding:10px;
     text-align:center;
     justify-content:center;
     p {
         font-size:16px !important;
     }
 }
 @media (max-width: 992px){
  .modal{
     .modal-dialog{

         max-width: auto !important;
     }
    }
 }



 .ctnBtn{
     width:100%;
     padding:16px;
 }
 .selectedTable  {

     table{
        height: 630px !important;
        overflow-y:auto;
     }
 }
 .table-select{
     padding:8px 0px;
     min-height: 400px;
     max-height:800px;
     width:100%;
     overflow-x: auto;
     overflow-y: auto;
     display:flex;
     font-size: smaller;



 }
 .card-body{
     width:100% !important;
 }
 .card-flex{
     width:100% !important;
     .card-body{
 display:flex;
 justify-content:space-evenly;

     }


 }
    .slide-fade-enter-active {
         transition: all .3s ease;
     }
     .slide-fade-leave-active {
         transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
     }
     .slide-fade-enter, .slide-fade-leave-to
     /* .slide-fade-leave-active below version 2.1.8 */ {
         transform: translateX(10px);
         opacity: 0;
     }
     .modalBg{
         background-color:black;

     }
     .modalTxtbox{
         padding:20px;

     }
     .imgBg{
     width:100%;
     background:black;
     background-image:url('../../assets/logo.png');
     background-position: left;
     background-repeat:no-repeat;
     background-size:contain;
     height:85px;
 }
 .tableCad{
     max-width: 50vw;
     width: 100%;
     margin:0px 2px
 }

 .footerBox{
     background:#FFBBA3;
     margin: 0px 0px 15px 0px;

 }
 .tableUm{
     font-size: small;
 }



     .button-area{
         display: flex;
         justify-content: center;
     }
     @media(max-width:576px){
         .card-fullWidth, .card-flex{
             align-items:center;
             justify-content: center;
             text-align:center;
         }
     }



     .pedido-itens{
         display: flex;
         justify-content:  space-around;
         padding:8px;

         span{
             b{
 color:white;
             }

         }
     }

     .fields-width{
        min-width: 160px;
     }
     .width-fields{
        max-width: 250px;
        font-size: small;
     }
 </style>
