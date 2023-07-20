<template>
  <div>
    <PageTitle icon="fa fa-group" :main="serverMessages['relatorioCliente']" />
    <Spinner :state="spinner" />
    <div class="main">
      <b-container fluid>
        <b-row>
          <b-col>
            <div class="colBcard">
              <b-form-group>
                <ul class="search-area" style="
                    padding: 0;
                    list-style-type: none;
                    display: inline-flex;
                  ">
                  <div class="col" style="width: 100% !important">
                    <li>
                      <b-form-group v-bind:label="
                        serverMessages['relatorioFaturar.periodoDe']
                      " label-for="dataDe" class="space">
                        <b-form-datepicker id="dateDe" size="sm" :dropup="false" :value="this.dateDe"
                          :date-format-options="{
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                          }" />
                      </b-form-group>
                    </li>
                  </div>
                  <div class="col" style="width: 100% !important">
                    <li>
                      <b-form-group v-bind:label="serverMessages['geral.ate']" label-for="dataAte" class="space">
                        <b-form-datepicker id="dateAte" size="sm" :dropup="false" :value="this.dateAte"
                          :date-format-options="{
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                          }" />
                      </b-form-group>
                    </li>
                  </div>
                </ul>
              </b-form-group>

              <div class="box-title">
                <div class="box-one">
                  <span>Status: </span>
                  <b-form-group class="box-checkbox">

                    <JqxComboBox @select="onChange()" ref="comboboxStatus" :source="statusCli" :checkboxes="true"
                      width="240px" />
                  </b-form-group>
                  <span>{{ serverMessages['relatorioComissao.escritorioVendas'] }}</span>
                  <div class="btnClear">
                    <div @click="checkAll('EscVenda')">
                      <a href="#" class="btn-clearJqx">{{
                        serverMessages['trocaEstatistico.relatorio.status.todos']
                      }}</a>
                    </div>
                    <div @click="uncheckAll('EscVenda')">
                      <a href="#" class="btn-clearJqx">{{ serverMessages['troca.consulta.clear.all'] }}</a>
                    </div>
                  </div>
                  <b-form-group v-if="this.lstEscritorioVendas.length > 0" class="box-checkbox">
                    <JqxComboBox ref="comboboxEscVenda" :source="this.lstEscritorioVendas" :checkboxes="true"
                      @checkChange="onChange($event)" style="form-box-select" width="240px" :autoItemsHeight="true" />
                  </b-form-group>
                </div>
                <div class="box-one">
                  <span>{{ serverMessages['consultaRelatorioCliente.credito'] }}</span>
                  <b-form-group>
                    <JqxComboBox ref="comboboxCred" :source="creditoCli" :checkboxes="true" style="form-box-select"
                      width="240px" />
                  </b-form-group>
                  <span>{{ serverMessages['download.representantes'] }}</span>
                  <div class="btnClear">
                    <div @click="checkAll('Reps')">
                      <a class="btn-clearJqx">{{ serverMessages['trocaEstatistico.relatorio.status.todos'] }}</a>
                    </div>
                    <div @click="uncheckAll('Reps')">
                      <a class="btn-clearJqx">{{ serverMessages['troca.consulta.clear.all'] }}</a>
                    </div>
                  </div>
                  <b-form-group v-if="this.lstEscritorioVendas.length > 0" class="box-checkbox">
                    <JqxComboBox ref="comboboxClientes" :source="lstRepresentantes" :checkboxes="true"
                      style="form-box-select" width="240px" />
                  </b-form-group>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
        <hr class="my-4" />

        <div class="download-area" style="display: flex; justify-content: space-around">
          <b-button placeholder="Carregar" @click="loadCli()" variant="primary">{{ serverMessages['geral.enviar']}}
          </b-button>
          <div class="button">
            <downloadPdf :items="lstDownloadTable" :campos="lstDownloadFields">
            </downloadPdf>
            <b-button @click="sortPdf()" class="export-options" variant="outline-secondary">
              <export-excel :data="lstDownloadTable" :fields="lstFieldsDownload" :name="`relatorioClientes.xls`"
                :title="json_meta.length === 0 ? 'Relatório Clientes' : json_meta">
                <img :src="require(`@/assets/excelicon.png`)" />
              </export-excel>
            </b-button>
          </div>
        </div>







        <hr class="my-4" />
        <b-row>
          <b-col cols="12">
            <div v-if="this.showFolders === true">
              <ul class="lista-pastas">
                <li v-for="(i, acc) in this.lstEquipes" :key="acc" style="cursor: pointer">
                  <div class="list-wrapper">
                    <div class="lista-reps">
                      <i @click="loadEscTable(acc, i.rep, i.lstTable)"
                        :class="i.show ? 'fa fa-folder-open-o' : 'fa fa-folder'" :id="acc">
                        <span> {{ i.rep }} </span></i>
                      <span class="counter-cli" :style="
                        i.lstTable.length != '0' ? 'color:green' : 'color:red'
                      ">
                        {{ serverMessages['trocaProduto.totalizar']}} : {{ i.lstTable.length }}
                      </span>
                    </div>
                    <b-table v-if="i.show === true" small responsive simple striped head-variant="dark"
                      :items="i.lstTable" :style="
                        i.show !== true ? 'display:none' : 'display:block'
                      " :fields="lstFields">

                      <template #cell(credito)="data">
                        <div v-if="data.value === 'x' || data.value === 'X'">
                          <span style="color: red">Bloqueado</span>
                        </div>
                        <div v-else>
                          <span style="color: green">Liberado</span>
                        </div>
                      </template>

                      <template #cell(status)="data">
                        <div v-if="data.value === 'X'">
                          <img style="display: block; margin: 0 auto" src="../../assets/ball-red.png" title="" />
                        </div>
                        <div v-else>
                          <img style="display: block; margin: 0 auto" src="../../assets/ball-green.png" title="" />
                        </div>
                      </template>
                      <!-- <template #cell(dtCad)="data">
                        <div v-if="data.value">

                        </div>
                      </template> -->
                    </b-table>
                  </div>
                </li>
              </ul>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
//import { closeMenu } from "../../mixins/closeMenu";
//import SelecaoLista from  '../consultas/SelecaoLista.vue'
import { baseApiUrl } from "@/global";
import { map, flatten, uniq, difference, filter, sortBy } from "underscore";
import axios from "axios";
import Spinner from "../template/Spinner.vue";
import { mapState } from "vuex";
import { format, addMonths } from "date-fns";
//import vSelect from "vue-select";
//import JqxListBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlistbox.vue";
import JqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";
import downloadPdf from "../commons/downloadPdf.vue";

export default {
  name: "RelatorioClientes",
  components: { PageTitle, JqxComboBox, Spinner, downloadPdf },
  computed: {
    ...mapState(["user", "traduction", "salesTeam", "serverMessages"]),
  },
  data() {
    return {
      //mixins: [closeMenu],
      lstRepsMatriz: {},
      show: false,
      showFolders: false,
      spinner: false,
      showFiltered: false,
      lstCliAll: {},
      clientesFiltered: {},
      repsSelected: [],
      lstClienteByEsc: [],
      lstFilterReps: [],
      lstEscritorioVendas: [],
      lstRelatCli: {},
      lstLoadEscVenda: [],
      lstRepresentantes: [],
      lstEquipes: [],
      clientsDisabled: [],
      openedReps: [],
      lstDownloadTable: [],
      lstTable: {},
      showExpandTable: false,
      dateDe: null,
      dateAte: null,
      showSelected: true,
      statusCli: ["01 - Ativos", "02 - Inativos"],
      creditoCli: ["01 - Liberado", "02 - Bloqueado"],
      lstClientesApi: [],
      lstFields: [
        { key: "kunnr", label: "Cliente", sortable: true },
        { key: "name1", label: "Razão Social", sortable: true },
        { key: "stras", label: "Endereço", sortable: true },
        { key: "homeCity", label: "Bairro", sortable: true },
        { key: "ort01", label: "Cidade", sortable: true },
        { key: "regio", label: "UF", sortable: true },
        { key: "pstlz", label: "CEP", sortable: true },
        { key: "stcd1", label: "CNPJ", sortable: true },
        { key: "stcd3", label: "IE", sortable: true },
        { key: "telf1", label: "Telefone", sortable: true },
        { key: "smtpAddr", label: "E-mail", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "credito", label: "Crédito", sortable: true },
        { key: "dtCad", label: "Data Cadastro", sortable: true },
      ],
      lstFieldsDownload: {
        Cliente: "kunnr",
        "Razão Social": "name1",
        Endereço: "stras",
        Bairro: "homeCity",
        Cidade: "ort01",
        UF: "regio",
        CEP: "pstlz",
        CNPJ: "stcd1",
        IE: "stcd3",
        Telefone: "telf1",
        "E-mail": "smtpAddr",
        Status: "status",
        Crédito: "credito",
        DataCadastro: "dtCad",
      },
      lstDownloadFields: {
        kunnr: "Cliente",
        name1: "Razão Social",
        stras: "Endereço",
        homeCity: "Bairro",
        ort01: "Cidade",
        regio: "UF",
        pstlz: "CEP",
        stcd1: "CNPJ",
        stcd3: "IE",
        telf1: "Telefone",
        smtpAddr: "E-mail",
        status: "Status",
        credito: "Crédito",
        dtCad: "DataCadastro",
      },
      json_meta: [],
    };
  },
  methods: {
    sortPdf() {
      //let clientes = this.$refs.comboboxClientes.getCheckedItems();
      //  let credito = this.$refs.comboboxCred.getCheckedItems();
      //   let escVendas = this.$refs.comboboxEscVenda.getCheckedItems();
      //   let status = this.$refs.comboboxStatus.getCheckedItems();

      //   //console.log(credito, escVendas, status, 'clientes')
      //   this.json_meta.push)
    },
    async loadRep() {
      const url = `${baseApiUrl}/pedido/getescritorio`;
      await axios
        .post(url, {
          /* eslint-disable */
          language: this.user.language,
          loginUsuario: this.user.loginUsuario,
        })
        .then((resp) => {
          this.lstRelatCli = resp.data;

          this.lstLoadEscVenda = flatten(resp.data.escritorioVendas);
          this.lstEscritorioVendas = map(
            JSON.parse(JSON.stringify(this.lstLoadEscVenda)),
            function (el) {
              return `${el.id} - ${el["descricao"]}`;
            }
          );
          this.clientesFiltered = map(this.lstLoadEscVenda, (el) => {
            return {
              idRep: el.id,
              representantes: map(flatten(el.representantes, 1), (ele) => {
                return {
                  escId: el.id,
                  repName: ele.id,
                  repId: ele.grpVendedores,
                  repRazao: ele.nome,
                };
              }),
            };
          });

          let reps = map(this.clientesFiltered, (el) => {
            return el.representantes;
          });
          reps = flatten(reps, 1);
          this.lstRepresentantes = map(reps, (ele) => {
            return `${ele.repId} - ${ele.repRazao}`;
          });

          this.lstRepresentantes = map(reps, (ele) => {
            return `${ele.escId} - ${ele.repRazao}`;
          });
        })
        .catch((err) => {
          alert(err);
        });
      this.$refs.comboboxClientes.source = uniq(this.lstRepresentantes);
      this.$refs.comboboxEscVenda.checkAll();
      this.$refs.comboboxClientes.checkAll();
      this.$refs.comboboxStatus.checkAll();
      this.$refs.comboboxCred.checkAll();

      this.lstRepsMatriz = map(this.lstLoadEscVenda, function (values, keys) {
        return {
          singleId: keys,
          id: values.id,
          groupIds: uniq(
            map(
              map(values.representantes, (el) => {
                return el;
              }),
              (elem) => elem.grpVendedores
            )
          ),
          reps: values.representantes.map((el) => {
            return `${el.grpVendedores} - ${el.nome}`;
          }),
          nameGroupIds: uniq(
            map(
              map(values.representantes, (el) => {
                return el;
              }),
              (elem) => elem.nome
            )
          ),
        };
      });
    },
    checkAll(name) {
      if (name === "EscVenda") {
        this.$refs.comboboxEscVenda.checkAll();
        this.$refs.comboboxClientes.checkAll()
      } else if (name === "Reps") {
        this.$refs.comboboxClientes.checkAll();
      }
    },
    uncheckAll(name) {
      if (name === "EscVenda") {
        this.$refs.comboboxEscVenda.uncheckAll();
        this.$refs.comboboxClientes.uncheckAll();
        this.$refs.comboboxEscVenda.uncheckItem();
      } else if (name === "Reps") {
        this.$refs.comboboxClientes.uncheckAll();
        let selected = this.$refs.comboboxClientes.getCheckedItems();
        this.$refs.comboboxClientes.uncheckItem(selected.val);
      }
    },

    onChange(event) {

      let selected = event.args.value.substr(0, 4)
      let allEscs = map(this.lstRepresentantes, el => {
        return el.substr(0, 4)
      })
      allEscs = uniq(allEscs)


      if (event.args.checked === false) {
        this.lstRepresentantes.forEach((ele) => {
          if (ele.substr(0, 4) === selected)
            this.$refs.comboboxClientes.uncheckItem(ele);
          this.$refs.comboboxClientes.disableItem(ele)
        })
      }
      else {
        this.lstRepresentantes.forEach((ele) => {
          if (ele.substr(0, 4) === selected) {
            this.$refs.comboboxClientes.enableItem(ele)
            this.$refs.comboboxClientes.checkItem(ele)
          }
        })
      }


      //checkedEscs recebe os items checados do combobox de Escritorio de Vendas
      let checkedEscs = this.$refs.comboboxEscVenda.getCheckedItems()



    },

    async loadCli() {
      this.lstEquipes = [];
      this.spinner = !this.spinner;
      let getStatus = this.$refs.comboboxStatus.getCheckedItems();
      let getCred = this.$refs.comboboxCred.getCheckedItems();

      this.lstFilterReps = [];
      const url = `${baseApiUrl}/cliente/getrelatclientes`;

      let checked = this.$refs.comboboxEscVenda.getCheckedItems();
      let result = difference(checked, this.lstEscritorioVendas);
      result = map(result, (el) => el["originalItem"].substr(0, 4));

      result.forEach((el) => {
        this.lstFilterReps.push(
          this.lstRepsMatriz.filter((ele) => {
            if (ele.id === el) {
              this.repsSelected.push(ele["reps"]);
              return ele.groupIds;
            }
          })
        );
      });

      this.lstEquipes = map(this.repsSelected, (el) => {
        return el;
      });
      this.lstEquipes = flatten(this.lstEquipes, 4);
      this.lstEquipes = map(this.lstEquipes, (ele) => {
        return { rep: ele, show: false };
      });

      this.lstFilterReps = map(flatten(this.lstFilterReps, 3), (el) => {
        return el["groupIds"];
      });

      let var22 = map(this.lstFilterReps, (el) => {
        return el;
      });

      this.lstFilterReps = [];
      this.lstFilterReps.push(flatten(var22, 2));
      await axios
        .post(url, {
          periodoBegin: this.dateDe,
          periodoEnd: this.dateAte,
          listEquipeVenda: this.lstFilterReps[0],
        })
        .then((resp) => {
          this.lstCliAll = Array.from(resp.data["relatClientes"]);
          let apiresp = resp.data.relatClientes;

          let respApi = map(this.lstCliAll, (ele) => {
            return {
              rep: ele.vkgrp,
              repName: ele.vkgrpDesc,
              details: ele,
            };
          });

          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return ele.vkgrp === el.replace(/[^0-9]/g, '').substr(0, 3);
              }),

              show: false,
            };
          });

          this.spinner = false;
        })

        .catch((err) => {
          this.spinner = false;
        });

      //Case caso seja indentificado que a lista Status foi alterada
      if (getStatus.length < 2 && getCred.length === 2) {
        let status = this.$refs.comboboxStatus.val();

        if (status.substr(0, 2) === "02") {
          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return ele.status === "" && ele.vkgrp === el.substr(0, 3);
              }),

              show: false,
            };
          });
        } else {
          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return ele.status === "X" && ele.vkgrp === el.substr(0, 3);
              }),

              show: false,
            };
          });
        }
      } else if (getStatus.length === 2 && getCred.length < 2) {
        /*Fim if status alterado
            inicio da Condicional Status Alterado
          */
        let cred = this.$refs.comboboxCred.val();

        if (cred.substr(0, 2) === "01") {
          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return ele.credito === "X" && ele.vkgrp === el.substr(0, 3);
              }),

              show: false,
            };
          });
        } else {
          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return ele.credito === "" && ele.vkgrp === el.substr(0, 3);
              }).sort(),
              show: false,
            };

          });

          this.lstEquipes.forEach(elem => {
            elem.lstTable = sortBy(elem, 'name1')

          })
          console.log(this.lstEquipes)

        }
      } else if (getStatus.length < 2 && getCred.length < 2) {
        let cred = this.$refs.comboboxCred.val();
        let status = this.$refs.comboboxStatus.val();

        if (status.substr(0, 2) === "02" && cred.substr(0, 2) === "01") {
          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return (
                  ele.credito === "X" &&
                  ele.status === "" &&
                  ele.vkgrp === el.substr(0, 3)
                );
              }),

              show: false,
            };
          });
        } else if (status.substr(0, 2) === "01" && cred.substr(0, 2) === "02") {
          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return (
                  ele.credito === "" &&
                  ele.status === "X" &&
                  ele.vkgrp === el.substr(0, 3)
                );
              }),

              show: false,
            };
          });
        } else if (status.substr(0, 2) === "02" && cred.substr(0, 2) === "01") {
          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return (
                  ele.credito === "X" &&
                  ele.status === "" &&
                  ele.vkgrp === el.substr(0, 3)
                );
              }),

              show: false,
            };
          });
        } else if (status.substr(0, 2) === "01" && cred.substr(0, 2) === "01") {
          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return (
                  ele.credito === "X" &&
                  ele.status === "X" &&
                  ele.vkgrp === el.substr(0, 3)
                );
              }),

              show: false,
            };
          });
        } else if (cred.substr(0, 2) === "02" && status.substr(0, 2)) {
          this.lstEquipes = map(flatten(this.repsSelected, 2), (el, acc) => {
            return {
              id: acc,
              rep: el,
              lstTable: filter(this.lstCliAll, (ele) => {
                return (
                  ele.credito === "" &&
                  ele.status === "" &&
                  ele.vkgrp === el.substr(0, 3)
                );
              }),

              show: false,
            };
          });

        }
      }
      this.showFolders = !this.showFolders;
    },

    loadEscTable(index, item, lstTable) {
      this.json_meta.push(item)
      this.spinner = true;
      const url = `${baseApiUrl}/cliente/GetRelatCliAdicional`;

      axios
        .post(url, {
          periodoBegin: this.dateDe,
          periodoEnd: this.dateAte,
          listEquipeVenda: [item.substr(0, 3)],
        })
        .then((resp) => {
          let apiresp = JSON.parse(JSON.stringify(resp.data.relatClientes));
          this.lstClientesApi = apiresp.t_OUT_CLIENTE;
          this.lstClientesApi.forEach(function (el) {
            lstTable.map(function (ele) {
              if (ele.kunnr === el.kunnr) {
                ele.status = null;
                if (el.vL_COMPRAS === 0) {
                  ele.status = "X";
                } else {
                  ele.status = "";
                }

                // REGRA do stauts? ele.status = el.vL_COMPRAS;
                ele.dtCad = el.dT_CAD.split("-").reverse().join("-");
              }
              return el;
            });
          });
          this.spinner = false;
        })
        .catch((err) => {
          showError(err);
        });

      let selected = {};

      this.lstDownloadTable.push(lstTable);
      this.lstDownloadTable = flatten(this.lstDownloadTable, 1);

      let deselect = this.lstEquipes.map((el, i) => {
        if (index === i) {
          el.show = !el.show;
          selected = el.rep;
          el.lstTable = sortBy(lstTable, 'name1');

          this.openedReps.push(selected.substr(0, 3));
          return el;
        }
      });

      deselect = filter(deselect, (el) => {
        return el != undefined;
      });

      selected = Array.from(selected);

      this.openedReps = map(uniq(this.openedReps), (el) => {
        return el;
      });

      if (this.openedReps.length === 1) {
        this.lstTable = filter(this.lstCliAll, (el) => {
          return el.vkgrp === this.openedReps[0];
        });
      } else {
        //
        // this.clientesSelected = map(this.lstCliAll, function (ele) {
        //   if (
        //     ele.vkgrp ===
        //     each(selected, (elem) => {
        //       return elem;
        //     })
        //   ) {
        //     this.lstEquipes["lstTable"].push(ele);
        //     return ele;
        //   }
        // });
      }
    },
  },
  async created() {
    await this.loadRep();
    this.$store.commit('toggleMenu')
  },

  beforeMount() {
    this.dateDe = format(addMonths(new Date(), -12), "yyyy-MM-dd");
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
  },
};
</script>

<style scoped>
.menuRelatCli>>>button {
  background-color: white;
  border: 1px solid #333;
  color: #333;
}

.search-area {
  padding: 0;
  width: 100%;
}

.colBcard {
  padding: 20px 0px;
  box-shadow: 1px 1px 1px 1px #e58b2a;
  padding: 15px;
  background-color: white;
  border-radius: 25px;
  max-width: 550px;
}

@media (max-width: 650px) {
  .colBcard {
    max-width: 550px;
    padding: 5px;
  }
}

.box-checkbox>>>div {
  display: flex;
  margin: 0px 5px;
}

.table-wrapper {
  display: none;
}

.lista-pastas {
  max-height: 800px;
  overflow: auto;
  list-style-type: none;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 1px 1px 1px 1px #e58b2a;
}

.list-wrapper {
  border-bottom: 1px solid black;
  margin: 5px;
}

.list-wrapper::after {
  padding-left: 10px;
}

.fa-folder-open-o {
  margin: 10px 5px;
  color: green;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-decoration: underline;
}

.lista-reps {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.counter-cli {
  font-weight: 500;
}

.clearForm {
  display: flex;
  justify-content: space-between;
}

.box-title {
  display: flex;
  justify-content: space-between;
  text-align: center;
  align-items: center;
}

.box-one {
  flex-basis: 50%;
}

.box-one>>>a {
  background-color: #000000;
  color: white;
  border-radius: 5px;
  margin-left: 2px;
  padding: 2px;
  border: 1px solid black;
}

  .btn-clearJqx:hover {
    color: blue;
    cursor: pointer;
    background-color: #e58b2a;
  }

  .btnClear {
    display: flex;
    margin: 5px 0px;
  }
</style>