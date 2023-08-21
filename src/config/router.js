import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../components/auth/Auth'
import SalesOffice from '../components/salesoffice/SalesOffice'
import PedidosFaturar from '../components/relatorios/PedidosFaturar'
import MixProdutos from '../components/relatorios/MixProdutos'
import RelatorioFaturados from '../components/relatorios/RelatorioFaturados'
import RelatorioCobranca from '../components/relatorios/RelatorioCobranca'
import RelatorioTroca from '../components/relatorios/RelatorioTroca'
import PedidosBloqueados from '../components/relatorios/PedidosBloqueados'
import RelatorioPedidos from '../components/relatorios/RelatorioPedidos'
import RelatorioEstaticTroca from '../components/relatorios/RelatorioEstaticTroca'
import CadastroCliente from '../components/cadastros/CadastroCliente'
import CadastroTroca from '../components/cadastros/CadastroTroca'
import CadastroPedido from '../components/cadastros/CadastroPedido'
import ManutencaoTroca from '../components/cadastros/ManutencaoTroca'
import Home from '../components/home/Home'
import RelatorioClientes from '../components/relatorios/RelatorioClientes'
import RelatorioComissao from '../components/relatorios/RelatorioComissao'



Vue.use(VueRouter)

const routes = [
{
    name:'Home',
    path: '/home',
    component: Home,
    
},
// {
//         path: '/',
//     beforeEnter: (to, from, next) => {
//        if(from.name === '/login'){
//         console.log('loginOn')
//        }
//        else if(to.name === )
//         return { path: '/home' }
//     }

// },

{
    name:'login',
    path: '/login',
    component: Auth,
    meta:{
        publicPage: true
    }
},
{
    name:'Sales Office',
    path: '/SalesOffice',
    component: SalesOffice
},
{
    name:'Pedidos à faturar',
    path: '/pedidofat',
    component: PedidosFaturar
},
{   name:'Mix de Produtos',
    path: '/mixproduto',
    component: MixProdutos,
    
},
{   name:'Faturamento',
    path: '/faturamento',
    component: RelatorioFaturados
},
{   name:'Cobranca',
    path: '/cobranca',
    component: RelatorioCobranca
},
{   name:'Pedidos bloqueados',
    path: '/pedidobloq',
    component: PedidosBloqueados
},
{   name:'Relatório Pedido Trocas',
    path: '/relatpedtroca',
    component: RelatorioTroca
},
{   name:'Cadastro de Trocas',
    path: '/troca',
    component: CadastroTroca
},
{   name:'Relatório Pedidos',
    path: '/relatped',
    component: RelatorioPedidos
},
{   name:'Manutenção Troca',
    path: '/manutroca',
    component: ManutencaoTroca
},
{   name:'Relatório Clientes',
    path: '/relatcli',
    component: RelatorioClientes
},
{   name:'Relatório Comissao',
    path: '/relatcom',
    component: RelatorioComissao
},

{   name:'Estatístico de troca',
    path: '/estatistico', 
    component:  RelatorioEstaticTroca
},
{   name:'Cadastro de Pedido',
    path: '/pedido', 
    component:  CadastroPedido
},
{ 
      name:'Cadastro de Cliente',
    path: '/cliente',
    component: CadastroCliente
},
]

const router = new VueRouter({
    mode:'history',
    routes: routes,
    
   
})

/*
    FUNÇÃO QUE RODA UM POUCO ANTES DE ENTRAR EM CADA PÁGINA,
    CONSTANTES DEFINEM QUAL PATH (PÁG) É PUBLICA OU NÃO
    EVITA POSSIVEIS ERROS E ACESSOS AS PÁGINAS NÃO INDICADAS.
*/

router.beforeEach((to, from, next) => {
    
    // const publicPages = ['/login'];
    // const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('token');
    
  
    if (to.matched.some(record => {record.meta.publicPage})) {
      if(!loggedIn){
        next({path: '/login'})
      }
      else 
        next();
    }
    // else if(authRequired && !loggedIn){
    //     return next('/home')
    // }
    // else {
    //     return next('/login')
    // }
    // else if (authRequired && loggedIn)
    //     {
    //         return next('')
    //     }
  
    next();
  })






export default router
