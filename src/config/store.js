import Vue from 'vue'
import Vuex from 'vuex'

import { messages } from '@/global'


Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        isMenuVisible: false,
        user:null,
        lstDataIndicadores:{},
        repSelected: {},
        escrSelected: {},
        language: 'P',
        menu:[],
        traduction:[],
        isloadingLogin: true,
        serverMessages: {},
        listClientes:[],
        listRepsFiltered:[],
        showOrNo: false,
        listClientesSel:[],
        listRepsSel:[],
        lstReps:[],
        radioMixOption: "",
        salesTeam: null,
        setorAtividade: null,
        dateDe: null,
        dateAte:null,
        ocultarFaturados: '',
        checkHistorico: null,
        checkDupVencidas: null,
        showScreen:false,
        listProdutosTroca:[],
        commandSave:false,
        newProduct: null,
        lineEmpty: null,
        chartItens:null,
        controlChart: null,
        priceManu: null,
        lstOrdersItens : [],
        showResetPass : false,
        showModals : true,
        showModalProducts: false,
        showAfterLoad: false,
        hasPMOrDescPerc: false,
        qtdTotal:0,
        vlrTotal:0,
        lstTempItensToOrder : [],
        saveCesta:null,
        lstFitSense:[],
        planpedido:null,
        diaHoje: new Date()
    },
    mutations:{
      setModalProduct(state, showModalProducts){
        if(showModalProducts === undefined){
          state.showModalProducts = !state.showModalProducts
      }else{
          state.showModalProducts = !showModalProducts
      }
      },
        toggleMenu(state , isVisible){
         
         
           if(isVisible === undefined){
               state.isMenuVisible = !state.isMenuVisible
           }else{
               state.isMenuVisible = isVisible
           }
        },
        setShowAfterLoad(state, showAfterLoad){
            state.showAfterLoad = showAfterLoad
        },
        setLoadlogin(state , loading){
             state.isloadingLogin = loading
        },
        setUser(state, user){        
            state.user = user    
            if(state.user !== null){
                let operationChild = [] 
                let consultChild = []
                let arrayMenu = []

                for( let i = 1 ; i < 9 ; i++){
                    let menu = state.user.acessoMenu.find(item => item.codMenu === i.toString())
                    if (menu !== undefined && menu !== null){
                      if(menu.valid){
                        operationChild.push(menu)
                      }
                    }
                    
                }
//i !== 14 &&
                for( let i = 9 ; i <= 20 ; i++){
                    if(i !== 20){
                        let menu = state.user.acessoMenu.find(item => item.codMenu === i.toString())
                      if (menu !== undefined && menu !== null){
                        if(menu.valid){
                          consultChild.push(menu)
                        }
                      }
                    }
                    
                }
                
                operationChild = operationChild.map(item => {
                      let objItens = {
                           href : `/${item.menuAction}`,
                           title : item.menuLabel,
                           icon: item.menuIcon
                        }        
                      return objItens   
                })
   
                consultChild = consultChild.map(item => {
                      let objItens = {
                           href : `/${item.menuAction}`,
                           title : item.menuLabel,
                           icon: item.menuIcon
                        }        
                      return objItens   
                })          
                arrayMenu = [
                    {
                        href: '',
                        title: state.user.menuOperacao,
                        icon: 'fa fa-suitcase',
                        child: operationChild
                    },
                   {
                       href: '',
                       title: state.user.menuConsultas,
                       icon: 'fa fa-search',
                       child: consultChild
                   }
                  
                ]
                
                state.menu = arrayMenu 
            }
                
        },
        setResetPass(state, show){
          state.showResetPass = show
          
          
        },
        setlstDataIndicadores(state, list){
          state.lstDataIndicadores = list
        },
        setShowModal(state, show){
          state.showModals = show
        },
        setLanguage(state,language){
            state.language = language
            state.traduction = messages(state.language)
            
        },
        setSelectedRep(state,rep){
           state.repSelected = rep
        },
        setSelectedEsc(state,escr){
          state.escrSelected = escr
        },
        setMessagesUi(state,messages ){
            state.serverMessages = messages
        },
        setShowOrNo(state , show){
            state.showOrNo = show
        },
       
        //Mix produto session
           setCustomers(state , listClientes){
             state.listClientes = listClientes
           },
           setCustomersSel(state , listClientesSel){
             state.listClientesSel = listClientesSel
           },
           setRadioOption(state , radioOption){
             state.radioMixOption = radioOption
           },
           setChooseSalesTeam(state , salesTeam){
             state.salesTeam = salesTeam
           },
           setChooseSetorAtividade(state, setor){
            state.setorAtividade = setor
           },
           setDataDe(state , dt){
             state.dateDe = dt
           },
           setDataAte(state , dt){
             state.dateAte = dt
           },
           setOcultarFaturados(state,checkOcultar){
             state.ocultarFaturados = checkOcultar
           },
           setHistorico(state,checkhist){
            state.checkHistorico = checkhist
           },
           setDupVencidas(state,checkDupVencidas){
            state.checkDupVencidas  = checkDupVencidas
           },
           setRepresentantes(state, reps){
             state.lstReps = reps
           },
           setRepresentantesFil(state, reps){
            state.listRepsFiltered = reps
           },
           setRepsSel(state, reps){
            state.listRepsFiltered = reps
           },
           //Controle para Seleção CadastroPedido de troca e SelecaoProdutoExterno / SelecaoProdutoInterno
              setShowScreen(state, showScreen){
                state.showScreen = showScreen
              },
              setCommandSave(state,command){
                state.commandSave = command
              },
              setListaProdutos(state,list){
                state.listProdutosTroca = state.listProdutosTroca.concat(list)
              },
              setListaRejectItens(state,list){
                state.listProdutosTroca = list
              },
              setEmptyQtdError(state,value){
                state.lineEmpty = value
              },
              // setTotalQtd(state,qtd){
              //   state.qtdTotal = qtd
              // },
              setTotalQtd(state,qtd){
                state.qtdTotal = qtd
              },
              setValorTotal(state,vrl){
                state.vlrTotal = vrl
              },
              setTempItens(state,lst){
                state.lstTempItensToOrder = lst
              },
              setSaveCesta(state,option){
                state.saveCesta = option
              },
          // Controles para Manutenção de troca 
             setNewProduct(state, value){
               state.newProduct = value
             },
          //Controles para DrillDown Charts
           setChooseItem(state, value){
             state.chartItens = value
           },
           setControlChart(state, value){
            state.controlChart = value
          },
           //Controles para Cadastro de Pedidos
           setListOrderItens(state, value){
            state.lstOrdersItens = state.lstOrdersItens.concat(value)
          },
          setListaRejectOrdersItens(state,list){
            state.lstOrdersItens = list
          },
          setManualPrice(state,price){
            state.priceManu = price
          },
          setDescontoExtra(state,price){
            state.descExtra = price
          },
          setDescontoFin(state,price){
            state.descFinan = price
          },
          setHasPMOrDescPerc(state,price){
            state.hasPMOrDescPerc= price
          },
          setValorLiquido(state,price){
            state.valorLiquido= price
          },
          setFitSense(state,lista){
            state.lstFitSense = lista
          },
          setPlanToSave(state,plan){
            state.planpedido = plan
          }
          
    },
    
})