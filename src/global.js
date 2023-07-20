import Vue from 'vue'

export const baseApiUrl = "http://localhost:56895/api" 

//export const baseApiUrl = "https://portaldepedidos.liz.com.br/api"

export function showError(e){
    if(e && e.response && e.response.data){
        Vue.toasted.global.defaultError({msg: e.response.data})
    }else if( typeof e ===  'string'){
        Vue.toasted.global.defaultError({msg:e})
    }else{
        Vue.toasted.global.defaultError()
    }
}

export function showSuccess(e){
    if(e && e.response && e.response.data){
        Vue.toasted.global.defaultSuccess({msg: e.response.data})
    }else if( typeof e ===  'string'){
        Vue.toasted.global.defaultSuccess({msg:e})
    }else{
        Vue.toasted.global.defaultSuccess()
    }
}

export function messages(current){
  
    let langOptions =[]

    langOptions = [
        {
            lng:'P',
            goBack: 'Voltar',
            numOv: 'Nº OV',
            numPed: 'Nº Pedido',
            usuario: 'Usuário',
            senha: 'Senha',
            entrar: 'Entrar',
            loginEmpty: 'Informe Login e Senha',
            loginError: 'Usuário ou senha inválidos',
            internalError: 'Erro interno de servidor , contate o administrator',
            noresultsfor: 'Sem resultados para',
            noresults: 'Nenhum registro encontrado',
            clearSelection: 'Limpar Seleção',
            logout: 'Sair',
            mixFaturado: 'Exibir Mix Faturados',
            mixVendas: 'Exibir Mix Vendas',
            choose: 'Escolha uma opção',
            selection: ' Selecionados',
            lookingFor: 'Procurar por ...',
            customer: "Cliente",
            ranking: "Visualizar Ranking por",
            sortBy : "Classificar Ranking Por",
            rankingBy: "Ranking por",
            search: 'Consultar',
            teamSelected: "Selecione uma Equipe",
            sectorSelected:"Selecione um setor",
            discount: "Desconto %",
            listPrice: "Preço Lista",
            errorPass: "Senha atual e a nova senha devem ser diferentes",
            errorPassRequired : "Todos os campos devem ser preenchidos",
            isAffiliated : 'Cliente Afiliado Liz ?',
            emailInvoice: 'E-mail Nota Fiscal',
            bankAg: 'Agência',
            bankAccount: 'Conta Corrente',
            uploadDocs: 'Anexar Documentos',
            totalSelected : 'Total Selecionado',
            totalTitleSelected: 'Total de Titulos Selecionados',
            totalBilled: 'Total Pago',
            totalBloq: 'Quantidade de Pedidos Bloqueados',
            receiver: 'Recebedor',
            sizeConversion: 'Conversão de Tamanho',
            aditionalData: 'Dados Adicionais',
            consistQuant: 'Consistir Quantidade',
            splitOrder: 'Dividir Pedido em',
            faturamento: 'Faturamento',
            copyOrder: 'Copiar Pedido',
            recoverOrder: 'Recuperar Pedido',
            exchangeTo: 'Troca para',
            mainData: 'Dados Principais',
            concluded: 'Concluídas',
            generate: 'Gerar',
            origin: 'Origem',
            loadFilters: 'Carregar Filtros',
            exchangeStats: 'Estatísticas de Trocas',
            confirm: 'Confirmar',
            cancel: 'Cancelar',
            delItnSel: 'Deletar Itens',
            fatHeader: 'Consulta de Faturamento',
            cesta: 'Cesta',
            welcomeMsg: 'Seja bem vindo ao novo CMR WEB!',
            dataprev: 'Dt.Prevista',
            description: 'Descrição',
            welcomeMsg2: 'Continuamos desenvolvendo novas soluções para melhor atender suas necessidades.\nContato para Bugs e Feedbacks:'
            

        },
        {
            lng:'E',
            goBack: 'Back',
            numOv: 'Nº OV',
            numPed: 'Nº Order',
            usuario: 'User',
            senha: 'Password',
            entrar: 'Signin',
            loginEmpty: "Enter Login and Password",
            loginError: 'wrong username or password',
            lookingFor: 'Search for ...',
            internalError: 'Internal server error , contact the system administrator',
            noresultsfor: 'No results for',
            noresults:'No records found',
            clearSelection: 'Clear Selection',
            logout: 'Logout',
            mixFaturado: 'Show Mix Billed',
            mixVendas: 'Show Mix Sales',
            choose: 'Please select an option',
            selection: ' Selected',
            customer: "Customer",
            ranking: "View Ranking by",
            sortBy : "Sort Ranking By",
            rankingBy: "Ranking by",
            search: 'Search',
            teamSelected: "Select a team ",
            sectorSelected:"Select a sector ",
            discount: "Discount %",
            listPrice: "List Price",
            errorPass: 'New password must be different than the old password',
            errorPassRequired: 'You must enter all fields',
            isAffiliated : 'Customer affiliated Liz ?',
            emailInvoice: 'Invoice E-mail',
            bankAg: 'Bank Branch',
            bankAccount: 'Bank Current Account',
            uploadDocs: 'Attach Documents',
            totalSelected : 'Selected Total',
            totalTitleSelected: 'Total selected titles',
            totalBilled: 'Total Payed',
            totalBloq: 'Quantity of Blocked Orders',
            receiver: 'Receiver',
            sizeConversion: 'Size Conversion',
            aditionalData: 'Additional Data',
            consistQuant: 'Consist Quantity',
            splitOrder: 'Split Order in',
            faturamento: 'Invoicing',
            copyOrder: 'Copy Order',
            recoverOrder: 'Recover Order',
            exchangeTo: 'Exchange to',
            mainData: 'Main Data',
            concluded: 'Completed',
            generate: 'Generate',
            origin: 'Origin',
            loadFilters: 'Load Filters',
            changeStats: 'Exchange Statistics',
            confirm: 'Confirm',
            cancel: 'Cancel',
            delItnSel: 'Delete Itens',
            fatHeader: 'Billing Inquiry',
            cesta: 'Basket',
            dataprev: 'Data Prev.Conclusao',
            description: 'Description',
            welcomeMsg: 'Welcome to the Brand new CMR WEB !',
            welcomeMsg2: 'Feel free to message us about bugs and improvements.'
            


        },
        {
            lng:'F',
            goBack: 'Retourner',
            numOv: 'Nº OV',
            numPed: 'Nº Commande',
            usuario: 'Usager',
            senha: 'Mot de passe',
            entrar: 'Accès',
            loginEmpty: "Entrez votre nom d'utilisateur et votre mot de passe",
            loginError: "mauvais nom d'utilisateur ou mot de passe",
            internalError: "Erreur de serveur interne , contactez l'administrateur",
            noresultsfor: 'aucun résultat pour',
            noresults:'Aucun enregistrement trouvé',
            clearSelection: 'Sélection claire',
            logout: 'Se déconnecter',
            mixFaturado: 'Afficher Mix Factur',
            mixVendas: 'Afficher Mix Ventes',
            choose: 'Please select an option',
            selection: ' Sélectionné',
            lookingFor: 'Rechercher...',
            customer: "Client",
            ranking: "Voir Classement par",
            sortBy : "Trier par Classement",
            rankingBy: "Classement par",
            search: 'Consulter',
            teamSelected:"Sélectionner une équipe",
            sectorSelected:"Sélectionnez un secteur d'activité",
            discount: "Remise %",
            listPrice: "Prix d 'origine",
            errorPass: 'Le mot de passe actuel et le nouveau mot de passe doivent être différents',
            errorPassRequired: 'Tous les champs doivent être remplis',
            isAffiliated : 'Liz, cliente franchisée ?',
            emailInvoice: 'E-mail de facturation',
            bankAg: 'Agence Bancaire',
            bankAccount: 'Compte courant',
            uploadDocs: 'Joindre un Document',
            totalSelected : 'Total des sélections',
            totalTitleSelected: 'Total des titres sélectionnés',
            totalBilled: 'Pago totale',
            totalBloq: 'Quantité de Commandes Bloquées',
            receiver: 'Receveur',
            sizeConversion: 'Conversion de Taille',
            aditionalData: 'Donnée supplémentaire',
            consistQuant: 'Se Compose de Quantité',
            splitOrder: 'Commande fractionnée en',
            faturamento: 'Facturation',
            copyOrder: 'Commande de Copie',
            recoverOrder: 'Récupérer la Commande',
            exchangeTo: 'Basculer Vers',
            mainData: 'Donnée Principale',
            concluded: 'Terminé',
            generate: 'Produire',
            origin: 'La source',
            loadFilters: 'Charger les Filtres',
            changeStats: 'Statistiques Commerciales',
            confirm: 'Confirmer',
            cancel: 'Annuler',
            delItnSel: 'Supprimer des éléments',
            fatHeader: 'Demande de facturation',
            cesta: 'Corbeille',
            dataprev: 'Data Prev.Conclusao',
            description: 'Descrição',
            welcomeMsg: 'Bienvenue sur le nouveau CMR WEB',
            welcomeMsg2: "N'hésitez pas à nous envoyer des messages sur les bugs et les améliorations"
            

        },
        {
            lng:'S',
            goBack: 'Para Volver',
            numOv: 'Nº OV',
            numPed: 'Nº Orden de compra',
            usuario: 'Usuario',
            senha: 'Contraseña',
            entrar: 'Acceso',
            loginEmpty: "Ingrese nombre de usuario y contraseña",
            loginError: 'Nombre de usuario o contraseña incorrectos',
            internalError: 'Error interno del servidor, comuníquese con el administrador',
            noresultsfor: 'no hay resultados para',
            noresults:'No se encontraron registros',
            clearSelection: 'Selección clara',
            logout: 'cerrar sesión',
            mixFaturado: 'Ver Mix Facturados',
            mixVendas: 'Ver Mix Ventas',
            choose: 'Please select an option',
            selection: ' Seleccionados',
            lookingFor: 'Buscar...',
            customer: "Client",
            ranking: "Ver Ranking por",
            sortBy : "Clasificar Ranking por",
            rankingBy:"Ranking por",
            search: 'Consultar',
            teamSelected:"Seleccionar un equipo",
            sectorSelected:"Seleccione un sector",
            discount: "Descuento %",
            listPrice: "Precio Original",
            errorPass : 'La contraseña actual y la nueva contraseña deben ser diferentes',
            errorPassRequired : 'Todos los campos deben ser llenados',
            isAffiliated : '¿Cliente de franquicia Liz?',
            emailInvoice: 'Correo electrónico de la factura',
            bankAg: 'Sucursal bancaria',
            bankAccount: 'Cuenta Corriente' ,
            uploadDocs: 'Documento Adjunto',
            totalSelected : 'Total de seleccionados',
            totalTitleSelected: 'Total de títulos seleccionados' ,
            totalBilled: 'Pago total',
            totalBloq: 'Cantidad de Pedidos Bloqueados',
            receiver: 'Receptor',
            sizeConversion: 'Conversión de Tamaño',
            aditionalData: 'Datos adicionales',
            consistQuant: 'Consistir en Cantidad',
            splitOrder: 'Dividir pedido en',
            faturamento: 'Facturación',
            copyOrder: 'Orden de Copia',
            recoverOrder: 'Recuperar Orden',
            exchangeTo: 'Cambiar a',
            mainData: 'Datos principales',
            concluded: 'Terminado',
            generate: 'Generar',
            origin: 'Fuente',
            loadFilters: 'Cargar Filtros',
            changeStats: 'Estadísticas Comerciales',
            confirm: 'Confirmar',
            cancel: 'Cancelar',
            delItnSel: 'Eliminar objetos',
            fatHeader: 'Consulta de facturación',
            cesta: 'Cesta',
            dataprev: 'Data Prev.Conclusao',
            description: 'Descrição',
            welcomeMsg: 'Bienvenida a la nueva web de CMR',
            welcomeMsg2: 'No dude en enviarnos un mensaje sobre errores y mejoras.'
            

        }
    ]

    return langOptions.find(element => element.lng === current)

}

export default { baseApiUrl  , showError , messages , showSuccess,}
 export function roundNumber(value, decimals) {
	var p = Math.pow(10, decimals);
	return Math.round(value * p) / p;
}




