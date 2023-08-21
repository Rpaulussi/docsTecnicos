<template>
  <div>
    <PageTitle icon="fa fa-users" :main="serverMessages['cliente']"></PageTitle>
    <Spinner required :state="this.spinner" />
    <b-container fluid="sm">
      <b-row class="principal m-0">
        <b-form style="width: 100%" class="card-body formStyle" ref="formCadCli">
          <b-form-group>
            <b-form-row>
              <b-col class="col-12">
                <div>
                  <img src="" alt="" />
                  <h2>{{ serverMessages["cadastro.cliente.dadosEmpresa"] }}</h2>
                </div>
              </b-col>

              <b-col cols="" md="6">
                <b-form-input oninput="this.value = this.value.toUpperCase()"
                  :placeholder="serverMessages['cadastro.cliente.razaoSocial']" maxlength="29" v-model="razaoS" required
                  :disabled="disableFirst" :state="razaoS !== null && razaoS.length > 8 <= 30 ? true : false
                    ">
                </b-form-input>

                <b-form-input oninput="this.value = this.value.toUpperCase()"
                  :placeholder="serverMessages['cadastro.cliente.nomeFantasia']" maxlength="30"
                  v-model="cadastroCliente.nomeFantasia" :disabled="disableFirst" required :state="razaoS !== null && razaoS.length > 8 <= 30 ? true : false
                    ">
                </b-form-input>

                <b-form-input :placeholder="serverMessages['cadastro.cliente.cep']" maxlength="9"
                  oninput="this.value = this.value.toUpperCase()" v-model="validCep" required
                  :state="validCep.length > 6 ? true : false" :disabled="disableFirst">
                </b-form-input>

                <div class="fieldsDivisor">
                  <b-form-input :placeholder="serverMessages['cadastro.cliente.cnpj']" maxlength="20"
                    v-model="cadastroCliente.cnpj" required oninput="this.value = this.value.toUpperCase()"
                    :state="cadastroCliente.cnpj.length >= 14 ? true : false" :disabled="disableFirst">
                  </b-form-input>

                  <b-form-input :placeholder="serverMessages['cadastro.cliente.ie']" maxlength="20"
                    v-model="inscricaoEstadual" type="number" required :state="inscricaoEstadual !== null && inscricaoEstadual.length > 5
                      " :disabled="disableFirst">
                  </b-form-input>
                </div>
              </b-col>

              <b-col cols="12" md="6">
                <b-form-group :label="this.traduction['isAffiliated']" v-slot="{ ariaDescribedby }"
                  style="text-align: center">
                  <b-form-radio-group v-model="franqueadoLizSelected" :options="franqueadoLiz"
                    :aria-describedby="ariaDescribedby" ref="radioOptions"></b-form-radio-group>
                </b-form-group>

                <b-form-select :placeholder="serverMessages['pedido.cadastro.canalDistribuicao']
                  " v-model="franqueadoLizSelected" :options="canalDist" :disabled="disableFirst" maxlength="20"
                  ref="selectOptions">
                </b-form-select>

                <b-form-select placeholder="Boleto Bancário" :disabled="disableFirst" v-model="canalDistRep"
                  :options="boleto" maxlength="20">
                </b-form-select>
              </b-col>

              <b-col cols="12">
                <textarea class="form-control" style="height: 150px; width:100%" oninput="this.value = this.value.toUpperCase()" placeholder="Breve relato sobre.. "
                  :disabled="disableFirst" v-model="cadastroCliente.observacoes" maxlength="250">
              </textarea>
                <span :style="cadastroCliente.length > 250 ? 'color:red' : 'color:green'"> {{ cadastroCliente.observacoes.length }}</span>
              </b-col>
            </b-form-row>
          </b-form-group>
          <b-button class="btnValidar" variant="outline-success" @click="validateFields()">{{
            this.traduction.search
          }}</b-button>
          <div v-if="validacaoComp === true">
            <b-form-group>
              <b-form-row>
                <b-col cols="12">
                  <div>
                    <h2>{{ serverMessages["cadastro.cliente.endereco"] }}</h2>
                  </div>
                </b-col>
                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.endereco"
                    :state="cadastroCliente.endereco.length > 8 ? true : false"
                    :placeholder="serverMessages['cadastro.cliente.endereco']" maxlength="35"
                    oninput="this.value = this.value.toUpperCase()" required>
                  </b-form-input>
                </b-col>
                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.telefone" type="number" required
                    onkeyup="this.value =  this.value.replace(/[^0-9]/g, '')"
                    :state="cadastroCliente.telefone.length > 8 ? true : false"
                    :placeholder="serverMessages['cadastro.cliente.telefone']" maxlength="16"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength).toUpperCase();">
                  </b-form-input>
                </b-col>

                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.numeroEndereco" maxlength="10" required :state="cadastroCliente.numeroEndereco.length > 0 ? true : false
                    " type="text" :placeholder="serverMessages['cadastro.cliente.numero']"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength).toUpperCase();">
                  </b-form-input>
                </b-col>
                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.celular" type="number" required
                    :state="cadastroCliente.celular.length >= 8 ? true : false" :maxlength="16"
                    onkeyup="this.value =  this.value.replace(/[^0-9]/g, '')"
                    :placeholder="serverMessages['cadastro.cliente.celular']"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength).toUpperCase()">
                  </b-form-input>
                </b-col>

                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.complemento" :maxlength="10" :placeholder="serverMessages['cadastro.cliente.complemento']
                    " oninput="this.value = this.value.toUpperCase()">
                  </b-form-input>
                </b-col>
                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.fax" type="number"
                    :placeholder="serverMessages['cadastro.cliente.fax']" :maxlength="16"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">
                  </b-form-input>
                </b-col>

                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.bairro" :placeholder="serverMessages['cadastro.cliente.bairro']"
                    maxlength="40" oninput="this.value = this.value.replace(/(.)\1{4}/g, '').toUpperCase();">
                  </b-form-input>
                </b-col>
                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.caixaPostal" :placeholder="serverMessages['cadastro.cliente.caixaPostal']
                    " maxlength="10"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">
                  </b-form-input>
                </b-col>

                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.cidade" :placeholder="serverMessages['cadastro.cliente.cidade']"
                    maxlength="14" oninput="this.value = this.value.toUpperCase()">
                  </b-form-input>
                </b-col>
                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.email" class="cadEmail"
                    :placeholder="serverMessages['cadastro.cliente.email']" type="email" maxlength="30"
                    style="text-transform:lowercase !important;" required
                    :state="cadastroCliente.email.length !== 0 ? true : false"
                    oninput="this.value = this.value.toLowerCase()">
                  </b-form-input>
                </b-col>
                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.uf" :placeholder="serverMessages['cadastro.cliente.uf']"
                    maxlength="3" oninput="this.value = this.value.toUpperCase()">
                  </b-form-input>
                </b-col>
                <b-col cols="6">
                  <b-form-input v-model="cadastroCliente.emailnfe" type="email" class="cadEmailnfe"
                    style="text-transform: lowercase !important;" :placeholder="this.traduction.emailInvoice"
                    maxlength="30" required oninput="this.value = this.value.toLowerCase()" :state="cadastroCliente.emailnfe.length !== 0 ? true : false
                      ">
                  </b-form-input>
                </b-col>
                <b-col cols="12">
                  <h2>{{ serverMessages["noticia.cadastro.diretores"] }}</h2>
                  <ul class="diretores">
                    <li>
                      <p>{{ serverMessages["cliente.diretoria.nome"] }}</p>
                      <b-form-input :placeholder="serverMessages['cliente.diretoria.nome']" type="text"
                        :state="diretores.length > 5 ? true : false" :maxlength="30" v-model="diretoresData.nome"
                        oninput="this.value = this.value.replace(/(.)\1{4}/g, '').toUpperCase();"></b-form-input>
                    </li>
                    <li>
                      <p>
                        {{ serverMessages["cliente.diretoria.dataNascimento"] }}
                      </p>
                      <b-form-input v-if="dateMin !== null" type="date" :placeholder="serverMessages['cliente.diretoria.dataNascimento']
                        " maxlength="10" :max="dateMax" :min="dateMin" oninput="this.value = this.value.toUpperCase()"
                        v-model="diretoresData.dataNascimento"
                        :state="diretores.length > 1 ? true : false"></b-form-input>
                    </li>
                    <li>
                      <p>{{ serverMessages["cliente.diretoria.cpf"] }}</p>
                      <b-form-input :placeholder="serverMessages['cliente.diretoria.cpf']"
                        :state="diretoresData.length > 1 ? true : false" :maxlength="15" v-model="diretoresData.cpf"
                        oninput="this.value = this.value.toUpperCase()"></b-form-input>
                    </li>
                    <li>
                      <p>
                        {{
                          serverMessages["cliente.diretoria.porcParticipacao"]
                        }}
                      </p>
                      <b-form-input :placeholder="serverMessages['cliente.diretoria.porcParticipacao']
                          " type="number" :maxlength="3" :state="diretores.length > 1 ? true : false"
                        v-model="diretoresData.participacao" @blur="addDiretores()"
                        oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"></b-form-input>
                    </li>
                    <li>
                      <p>Adicionar</p>
                      <div class="btn btn-success" @click="addDiretores()" ref="btnDiretores" id="btnAdd">
                        <i class="fa fa-plus"></i>
                      </div>
                    </li>
                  </ul>
                  <div v-if="diretores.length > 0">
                    <b-table :items="diretores" striped small responsive head-variant="dark" hover class="tableCad">
                      <template #cell(acao)="data">
                        <div @click="removeRep(data, 'diretores')" class="btn btn-danger">
                          <i class="fa fa-close"></i>
                        </div>
                      </template>
                    </b-table>
                  </div>
                </b-col>

                <b-col cols="12">
                  <h2>{{ serverMessages["cadastro.cliente.fornecedores"] }}</h2>
                  <ul class="fornecedores">
                    <li>
                      <p>
                        {{ serverMessages["cadastro.cliente.fornecedores"] }}
                      </p>
                      <b-form-input :placeholder="serverMessages['cadastro.cliente.fornecedores']
                        " :state="fornecedoresData.nome.length > 3 ? true : false" maxlength="34"
                        v-model="fornecedoresData.nome"
                        oninput="this.value = this.value.replace(/(.)\1{4}/g, '').toUpperCase();"></b-form-input>
                    </li>
                    <li>
                      <p>{{ serverMessages["cliente.fornecedor.endereco"] }}</p>
                      <b-form-input :placeholder="serverMessages['cliente.fornecedor.endereco']
                        " maxlength="34" :state="fornecedoresData.endereco.length > 10 ? true : false
    " oninput="this.value = this.value.replace(/(.)\1{4}/g, '').toUpperCase();"
                        v-model="fornecedoresData.endereco"></b-form-input>
                    </li>
                    <li>
                      <p>{{ serverMessages["cliente.fornecedor.cidade"] }}</p>
                      <b-form-input :placeholder="serverMessages['cliente.fornecedor.cidade']
                        " maxlength="24" :state="fornecedoresData.cidade.length >= 3 ? true : false
    " oninput="this.value = this.value.replace(/(.)\1{4}/g, '').toUpperCase();"
                        v-model="fornecedoresData.cidade"></b-form-input>
                    </li>
                    <li>
                      <p>{{ serverMessages["cliente.fornecedor.uf"] }}</p>
                      <b-form-select :placeholder="serverMessages['cliente.fornecedor.uf']" maxlength="3"
                        oninput="this.value = this.value.toUpperCase()"
                        :state="fornecedoresData.uf.length >= 2 ? true : false" v-model="fornecedoresData.uf"
                        :options="ufs">
                      </b-form-select>
                    </li>
                    <li>
                      <p>{{ serverMessages["cliente.fornecedor.telefone"] }}</p>
                      <b-form-input :placeholder="serverMessages['cliente.fornecedor.telefone']
                        " maxlength="16" type="tel" :state="fornecedoresData.telefone.length > 10 ? true : false
    " oninput="this.value.replace(/[^0-9]/g , '')" v-model="fornecedoresData.telefone" @blur="addFornecedores()">
                      </b-form-input>
                    </li>
                    <li>
                      <p>Adicionar</p>
                      <div class="btn btn-success" @click="addFornecedores()" ref="btnFornecedores" id="btnAdd">
                        <i class="fa fa-plus"></i>
                      </div>
                    </li>
                  </ul>
                  <div v-if="fornecedores.length > 0">
                    <b-table :items="fornecedores" striped small responsive head-variant="dark" hover class="tableCad">
                      <template #cell(acao)="data">
                        <div @click="removeRep(data, 'fornecedores')" class="btn btn-danger">
                          <i class="fa fa-close"></i>
                        </div>
                      </template>
                    </b-table>
                  </div>
                </b-col>

                <b-col cols="12">
                  <h2>{{ serverMessages["cadastro.cliente.bancos"] }}</h2>
                  <ul class="bancos">

                    <li>
                      <p style="margin-bottom:8px;">
                        <label for="lstBancos"> Bancos</label>
                      </p>
                      <b-form-input :state="bancosData.numero.length > 0 ? false : true" style="width:223px; height:38px;"
                        type="text" v-model="bancosData.nome" list="lstBancos"></b-form-input>
                      <datalist id="lstBancos">
                        <option v-for="(i, acc) in lstBancos" :key="acc">{{ i.code }} - {{ i.name }}</option>
                      </datalist>

                    </li>

                    <li>
                      <p>{{ this.traduction.bankAg }}</p>
                      <b-form-input v-model="bancosData.agencia" :placeholder="this.traduction.bankAg"
                        :state="bancosData.agencia.length >= 4 ? true : false"
                        oninput="this.value = this.value.replace(/(.)\1{2}/g, '')" minlength="4"
                        maxlength="5"></b-form-input>
                    </li>
                    <li>
                      <p>{{ this.traduction.bankAccount }}</p>
                      <b-form-input v-model="bancosData['cc']" :placeholder="this.traduction.bankAccount"
                        :state="bancosData.cc.length >= 5 ? true : false"
                        oninput="this.value = this.value.replace(/(.)\1{3}/g, '')" maxlength="9"></b-form-input>
                    </li>
                    <li>
                      <p>{{ serverMessages["cliente.fornecedor.telefone"] }}</p>
                      <b-form-input :placeholder="serverMessages['cliente.fornecedor.telefone']
                        " type="tel" :state="bancosData.telefone.length > 10 ? true : false" maxlength="16"
                        oninput="this.value = this.value.replace(/(.)\1{4}/g, '')" v-model="bancosData.telefone"
                        @blur="addBancos()"></b-form-input>
                    </li>
                    <li>
                      <p>Adicionar</p>
                      <div class="btn btn-success" @click="addBancos()" ref="btnBancos" id="btnAdd">
                        <i class="fa fa-plus"></i>
                      </div>
                    </li>
                  </ul>
                  <div v-if="bancos.length > 0">
                    <b-table :items="bancos" striped responsive small head-variant="dark" hover class="tableCad">
                      <template #cell(acao)="data" style="text-align: end">
                        <div>
                          <div @click="removeRep(data, 'bancos')" class="btn btn-danger">
                            <i class="fa fa-close" style="justify-content: flex-end"></i>
                          </div>
                        </div>
                      </template>
                    </b-table>
                  </div>
                </b-col>

                <b-col cols="12">
                  <h2>{{ this.traduction.uploadDocs }}</h2>

                  <b-form-file v-model="anexo" class="formFile" multiple id="form-files" ref="formFile" size="lg"
                    accept=".pdf, .doc, .docx, .gif, .jpeg, .jpg, .png, .rtf, .txt"
                    :placeholder="'Desabilitado / Disabled'" disabled>
                  </b-form-file>
                </b-col>
                <b-col cols="12">
                  <div class="submit-area">
                    <!-- <a href="#" @click="testeFn()" class="btn-warning">TESTE BTN</a> -->
                    <b-button class="btn btn-success" id="btnSubmitForm" @click="onSubmit">{{
                      serverMessages["geral.enviar"]
                    }}</b-button>
                    <b-button @click="cleanFields" class="btn btn-warning">{{
                      serverMessages["pedido.cadastro.limpar"]
                    }}</b-button>
                  </div>
                </b-col>
              </b-form-row>
            </b-form-group>
          </div>
        </b-form>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
import { mapState } from "vuex";
import { cnpj, cpf } from "cpf-cnpj-validator";
import Spinner from "../template/Spinner.vue";
import { filter, map } from "underscore";
//import { format } from "date-fns";
import axios from "axios";
import { showError, showSuccess } from "@/global";
import { baseApiUrl } from "../../global";

const ie = require("inscricaoestadual");
export default {
  name: "CadastroCliente",
  components: { PageTitle, Spinner },
  computed: {
    ...mapState([
      "serverMessages",
      "language",
      "traduction",
      "user",
      "Spinner",
      "isMenuVisible",
    ]),
  },
  data() {
    return {
      errors: {},
      dateMin: new Date(),
      dateMax: null,
      disableFirst: false,
      diretoresFields: [
        "Nome",
        "DataNascimento",
        "CPF",
        "Participacao",
        "Adicionar",
      ],
      ufs: [
        "AL",
        "BA",
        "CE",
        "MA",
        "PB",
        "PE",
        "PI",
        "RN",
        "SE",
        "DF",
        "GO",
        "MS",
        "MT",
        "AC",
        "AM",
        "AP",
        "PA",
        "RO",
        "RR",
        "TO",
        "ES",
        "MG",
        "RJ",
        "SP",
        "PR",
        "RS",
        "SC",
      ],
      maxSize: 0,
      fornecedoresFields: [
        "Fornecedor",
        "Endereco",
        "Cidade",
        "UF",
        "Telefone",
        "Adicionar",
      ],
      bancosFields: [
        {
          "Numero": "numero",
          "Banco": "nome",
          "Agencia": "agencia",
          "Telefone": "telefone",
          "Acao": "acao"

        }],
      canalDist: [
        { text: "70 - Franquia", value: "0" },
        { text: "20 - Varejo", value: "1" },
      ],
      franqueadoLiz: [
        { text: "Sim", value: "0" },
        { text: "Não", value: "1" },
      ],
      boleto: [
        { value: "0", text: "Sem Opção" },
        { value: "1", text: "Bradesco" },
        { value: "2", text: "Banco Safra" },
        { value: "3", text: "Banco do Brasil" },
        { value: "4", text: "Itaú" },
        { value: "5", text: "Santander" },
      ],
      diretoresAcc: 0,
      diretoresPorcentagemMax: [],
      fornecedoresAcc: 0,
      bancosAcc: 0,
      razaoS: null,
      cnpj: null,
      inscricaoEstadual: null,
      spinner: false,
      canalDistSelected: "0",
      franqueadoLizSelected: "1",
      canalDistRep: "0",
      validCep: "",
      validacaoComp: false,
      lstBancos: [],
      diretoresData: {
        nome: "",
        dataNascimento: "",
        cpf: "",
        participacao: "",
        acao: "",
      },
      fornecedoresData: {
        nome: "",
        endereco: "",
        cidade: "",
        uf: "",
        telefone: "",
        acao: "",
      },
      bancosData: {
        numero: "",
        nome: "",
        agencia: "",
        cc: "",
        telefone: "",
        acao: "",
      },
      testeArray: [],
      //preencher moeda, canaldistribuicaoid, Representante(nome), boletobancarioid,
      cadastroCliente: {
        nome: "",
        nomeFantasia: "",
        representante: "",
        cnpj: "",
        inscricaoEstadual: "",
        moeda: "BRL",
        boletobancarioid: "",
        canaldistribuicaoid: "",
        observacoes: "",
        cep: "",
        endereco: "",
        numeroEndereco: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        telefone: "",
        celular: "",
        fax: "",
        caixaPostal: "",
        email: "",
        emailnfe: "",
        diretores: [],
        fornecedores: [],
        bancos: [],
      },
      diretores: [],
      fornecedores: [],
      bancos: [],
      anexo: null,
      lstApiCall: [],
    };
  },

  methods: {
    onSubmit(el) {
      el.preventDefault();

      this.cadastroCliente.telefone = this.cadastroCliente.telefone.replace(
        /[^0-9]/g,
        ""
      );
      this.cadastroCliente.celular = this.cadastroCliente.celular.replace(
        /[^0-9]/g,
        ""
      );

      //console.log("tel regex", this.cadastroCliente.telefone);

      this.bancos = map(this.bancos, (el, acc) => {
        return {
          cc: el.cc,
          id: acc,
          nome: el.nome,
          numero: el.numero,
          agencia: el.agencia,
          telefone: el.telefone,
          uf: this.cadastroCliente.uf,
          acao: "",
        };
      });
      this.cadastroCliente.diretores = map(this.diretores, (el) => {
        return el;
      });
      this.cadastroCliente.fornecedores = map(this.fornecedores, (el) => {
        return el;
      });
      this.cadastroCliente.bancos = map(this.bancos, (el) => {
        return el;
      });
      this.cadastroCliente.representante = this.user.loginUsuario;

      let boletoText = filter(this.boleto, (el) => {
        return el.value === this.canalDistSelected;
      });

      this.cadastroCliente.boletobancarioid = boletoText[0].text;
      if (this.franqueadoLizSelected === "0") {
        this.cadastroCliente.canaldistribuicaoid = "70";
      } else if (this.franqueadoLizSelected === "1") {
        this.cadastroCliente.canaldistribuicaoid = "20";
      }

      /**
       *
       * Verificar os arquivos que foram feitos upload - se o tamanho de cada um excede 4mb
       * Caso não exceda, testa se existem menos de 10 arquivos, e entra em uma codicional
       * para iniciar a gravação do cliente   ---- falta montar regra para receber estes arquivos *
       *
       * Funcionando porem desabilitado até atualização do backend/sap para receber estes arquivos1
       */

      // let formFiles = this.$refs.formFile.files;

      // let singleFilesTest = filter(formFiles, el => {return el.size <= 4096000})

      // if(singleFilesTest.length === formFiles.length && singleFilesTest.length <= 10){

      let sumAll = 0;

      this.diretoresPorcentagemMax.forEach((el) => {
        sumAll = sumAll + Number(el);
      });
      // console.log('seumall', sumAll)
      // console.log('emails', this.cadastroCliente.email, this.cadastroCliente.emailnfe)
      if (
        sumAll <= 100 &&
        this.razaoS?.length > 0 &&
        this.razaoS !== "" &&
        this.diretoresAcc <= 4 &&
        this.fornecedoresAcc > 0 &&
        this.fornecedoresAcc <= 4 &&
        this.bancosAcc <= 4 &&
        this.cadastroCliente.email.length > 0 &&
        this.cadastroCliente.emailnfe.length > 0 &&
        this.cadastroCliente.telefone.length > 0 &&
        this.cadastroCliente.endereco.length > 0 &&
        this.cadastroCliente.endereco !== ''
      ) {
        //console.log(this.cadastroCliente)
        const url = `${baseApiUrl}/cliente/SaveCustomer`;
        axios
          .post(url, this.cadastroCliente)
          .then((success) => {
            if (success.data.result === "ERROR") {
              showError(success.data.message);
              return;
            }

            showSuccess(success.data.message);
            this.$refs.formCadCli.submit();
            //setInterval(() => { this.$router.push({ path: 'home' })}, 3500)
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (
          this.diretoresAcc === 0 ||
          this.fornecedoresAcc === 0
        ) {
          showError(
            "Erro: Entre no mínimo 1 e máximo 3 diretores, fornecedores e bancos"
          );
          let vmola = document.querySelectorAll('#btnAdd');
          vmola.forEach(e => { e.classList.add('notSelected') })
          // console.log('vmaola', vmola)
        } else if (
          this.cadastroCliente.email.length === 0 &&
          this.cadastroCliente.emailnfe.length === 0
        ) {
          showError("Erro: E-mail deve ser preenchido.");
        } else if (this.cadastroCliente.telefone.length === 0) {
          showError("Erro: Telefone deve ser preenchido.");
        } else if (
          this.cadastroCliente.endereco.length === 0 ||
          this.cadastroCliente.numeroEndereco.length === 0
        ) {
          showError("Erro: Endereço deve ser preenchido.");
        } else if (this.cadastroCliente.razaoS === "") {
          showError("Erro: Razão Social deve ser preenchido.");
        } else {
          showError("Erro ao salvar: Verifique os dados e tente novamente.");
        }
        this.$refs.formFile.reset();
      }

      //}
      //  // else{
      //     showError('A Quantidade ou Tamanho dos arquivos excedeu o limite - max 4mb por arquivo ou 10 arquivos ou 20mb total')
      //     this.$refs.formFile.reset();

      //   }
    },

    removeRep(data, name) {
      if (name === "diretores" && this.diretoresAcc >= 0) {
        this.diretores.splice(data.index, 1);
        this.diretoresPorcentagemMax.splice(data.index, 1);
        this.diretoresAcc = this.diretoresAcc - 1;
      } else if (name === "fornecedores" && this.fornecedoresAcc >= 0) {
        this.fornecedores.splice(data.index, 1);
        this.fornecedoreAcc = this.fornecedoreAcc - 1;
      } else if (name === "bancos" && this.bancosAcc >= 0) {
        this.bancos.splice(data.index, 1);
        this.bancosAcc = this.bancosAcc - 1;
      }
    },

    validateFields() {



      //nsole.log('language', this.user.language)
      this.cadastroCliente.cnpj = this.cadastroCliente.cnpj.replace(
        /[^0-9]/g,
        ""
      );
      this.validCep = this.validCep.replace(/[^0-9]/g, "");
      this.inscricaoEstadual = this.inscricaoEstadual.replace(/[^0-9]/g, '');

      console.log('ie', this.inscricaoEstadual)

      let nomeRepeat = new RegExp(/(.)\1{5}/g);

      let testName = nomeRepeat.test(this.razaoS);

      //verifica a validade do numero do cnpj
      let test = cnpj.isValid(this.cadastroCliente.cnpj);
      let testeIe = ie(this.inscricaoEstadual, '')
      console.log('testIe', testeIe, typeof testeIe, this.cadastroCliente.uf)


      console.log(test, testName, testeIe, this.razaoS, 'testeeeeeeee')


      if (
        testeIe === false ||
        this.razaoS === "" ||
        this.razaoS === undefined ||
        this.razaoS === null ||
        this.cadastroCliente.cnpj === "" ||
        this.cadastroCliente.cnpj === null ||
        this.cadastroCliente.cnpj === undefined
      ) {
        //console.log("entrouif");
        this.validacaoComp = false;
        showError(this.serverMessages.cliente["cadastro.cnpj.obrigatorio"]);
        if (this.razaoS === null || this.razaoS === undefined || this.razaoS === "")
          showError(this.serverMessages["cliente.cadastro.nome.obrigatorio"]);
        else if (!this.validCep)
          showError(this.serverMessages["cliente.cadastro.cep.obrigatorio"]);

        else if (testeIe === false)
          showError('Inscrição Estadual Inválida.')
        else if (
          this.cadastroCliente.cnpj === "" ||
          this.cadastroCliente.cnpj === null ||
          this.cadastroCliente.cnpj === undefined

        )
          showError(this.serverMessages["cliente.cadastro.cnpj.obrigatorio"]);
        else if (testName === false) showError("Nome inválido");
        else if (testeIe === false) showError('Inscricao Estadual Inválida.')

      } else if (test === true && testName === false && testeIe !== false && testeIe !== false && this.razaoS !== null && this.razaoS !== undefined && this.razaoS !== "") {



        this.validacaoComp = true;
        this.disableFirst = true;
      }

      //api para consulta e validação do cep
      const url = `https://viacep.com.br/ws/${this.validCep}/json/`;
      //api com a lista de bancos
      const urlBco = `https://brasilapi.com.br/api/banks/v1`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.testeArray = data;
          this.cadastroCliente.endereco = data.logradouro
            .toUpperCase()
            .substr(0, 34);
          this.cadastroCliente.cidade = data.localidade.toUpperCase();
          this.cadastroCliente.uf = data.uf.toUpperCase();
          this.cadastroCliente.bairro = data.bairro.toUpperCase();
          this.cadastroCliente.cep = data.cep.toUpperCase();
          this.cadastroCliente.nome = this.razaoS.toUpperCase();
          this.cadastroCliente.inscricaoEstadual = this.inscricaoEstadual;
        })
        .catch((err) => {
          console.log(err);
        });





      axios
        .get(urlBco)
        .then((resp) => {
          // console.log('respApiBancos', resp)
          this.lstBancos = filter(resp.data, (el) => {
            if (el.code !== null) {
              return `${el.code} - ${el.name}`;
            }
          });
        })
        .catch((err) => {
          showError(err);
        });

      //('testes', test, testName, this.razaoS, !this.razaoS)


    },

    cleanFields() {
      //console.log(el)

      this.$refs.formCadCli.reset();

    },

    carregaIdade() {
      let ano = JSON.stringify(this.dateMin.getFullYear());
      let anoNovo = ano - 18;
      this.dateMax = `${anoNovo}-0${this.dateMin.getMonth()}-0${this.dateMin.getDay()}`;
      let newDateMin = `${ano - 100}-0${this.dateMin.getMonth()}-0${this.dateMin.getDay()}`;
      this.dateMin = JSON.stringify(newDateMin);
      this.dateMin = this.dateMin.replaceAll('"', "");

      this.$store.state.isMenuVisible = true;
    },
    addDiretores() {

      let cpfValid = cpf.isValid(this.diretoresData.cpf);
      if (

        cpfValid === true &&
        this.diretoresAcc > 0 <= 4 &&
        this.diretoresData.nome !== "" &&
        this.diretoresData.participacao !== "" &&
        this.diretoresData.nome.length > 5
      ) {
        this.diretoresData.dataNascimento = this.diretoresData.dataNascimento
          .split("-")
          .reverse()
          .join("-");
        this.diretores.push(JSON.parse(JSON.stringify(this.diretoresData)));
        //console.log(this.diretores, "diretores");
        this.diretoresPorcentagemMax.push(this.diretoresData["participacao"]);
        this.diretoresData.nome = "";
        this.diretoresData.dataNascimento = "";
        this.diretoresData.cpf = "";
        this.diretoresData.participacao = "";
        this.diretoresAcc = this.diretoresAcc + 1;
      } else if (cpfValid === false) {
        showError("Erro Diretores: CPF Informado não é válido.");
      } else if (this.diretoresAcc >= 4) {
        showError("Erro Diretores: Insira no máximo 3 diretores.");
      } else if (
        this.diretoresData.nome === "" ||
        this.diretoresData.nome === null ||
        this.diretoresData.nome === undefined
      ) {
        showError("Erro Diretores: Nome do fornecedor não informado.");
      } else if (
        this.diretoresData.participacao === "" ||
        this.diretoresData.participacao === null ||
        this.diretoresData.participacao === undefined ||
        this.diretoresData.participacao === 0
      ) {
        showError("Erro Diretores: Participação deve ser informado. (0-100)");
      }
    },
    addFornecedores() {


      // console.log('truthtest', truthTest, truthTest2, truthTest3)
      this.fornecedoresData.telefone = this.fornecedoresData.telefone.replace(
        /[^0-9]/g,
        ""
      );


      if (
        this.fornecedoresAcc <= 2 &&

        this.fornecedoresData.nome?.length > 2 &&
        this.fornecedoresData.telefone?.length > 2) {
        this.fornecedores.push(
          JSON.parse(JSON.stringify(this.fornecedoresData))
        );
        this.fornecedoresData.nome = "";

        this.fornecedoresData.cidade = "";
        this.fornecedoresData.telefone = "";
        this.fornecedoresAcc = this.fornecedoresAcc + 1;
      } else if (
        this.fornecedoresData.nome?.length === 0
      ) {
        showError("Erro Fornecedores: Nome inválido, verifique se o nome digitado corretamente.");
      } else if (this.fornecedoreAcc >= 4) {
        showError(
          "Erro Fornecedores: Limite máximo de fornecedores.\nDigite no máximo 3 fornecedores."
        );
      }
      else showError("Erro Fornecedores: Revise as informações e tente novamente.")
    },
    addBancos() {

      let testRepeat2 = new RegExp(/(.)\1{3}/g);
      let testAg = testRepeat2.test(this.bancosData.agencia)
      let testCc = testRepeat2.test(this.bancosData.cc)

      console.log(testAg, testCc)
      this.bancosData.numero = this.bancosData.nome.replace(/[^0-9]/g, "");
      this.bancosData.nome = this.bancosData.nome.replace(/[^a-zA-Z]/g, "");
      this.bancosData.telefone = this.bancosData.telefone.replace(
        /[^0-9]/g,
        ""
      );

      this.bancosData.cc = this.bancosData.cc.replace(/[^0-9]/g, "");
      this.bancosData.nome = this.bancosData.nome.substr(0, 16);


      // console.log(this.bancosData)
      this.bancos.push(JSON.parse(JSON.stringify(this.bancosData)));
      this.bancosData.banco = "";
      this.bancosData.agencia = "";
      this.bancosData.telefone = "";
      this.bancosData.cc = "";
      this.bancosData.nome = "";
      this.bancosAcc = this.bancosAcc + 1;


    },
  },
  mounted() {
    this.carregaIdade();
  },
};
</script>

<style scoped lang="scss">
v-select {
  max-width: 200px !important;
}

input:focus-within {
  color: red;
}

.formStyle {
  padding: 10px 20px;
  box-shadow: 1px 1px 1px 1px #e58b2a;
  max-width: 100%;
}

h2 {
  text-transform: uppercase;
  padding: 15px 0px;
  // background: linear-gradient(to right, #eb7a09, #dda152);
  background: #897167;
  color: white;


  margin: 20px 0px 0px 0px;
  text-align: center;
  border: 1px solid black;
}

.btn-fa {
  margin: 3px;
}

.notSelected {
  box-shadow: 0px 0px 20px darkorange;
}

.diretores,
.fornecedores,
.bancos {
  display: flex;
  padding: 0;
  list-style-type: none;
  justify-content: space-between;
  box-shadow: 1px 1px 1px 1px #e58b2a;

  padding: 15px;
}

@media (max-width: 767px) {

  .diretores,
  .fornecedores,
  .bancos {
    display: flex;
    flex-direction: column;
  }

  .formStyle {
    margin: 5px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}

.submit-area {
  margin: 20px 0px;
  display: flex;
  width: 100%;
  justify-content: space-around;
}

label.custom-file-label::after {
  position: relative;
  width: 100%;
  height: 400px;
}

.fieldsDivisor {
  width: 100%;

  b-form-input {
    width: 50%;
  }

  display: inline-flex;
  justify-content: center;
  text-align: center;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
