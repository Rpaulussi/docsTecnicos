import axios from "axios";
import { baseApiUrl } from "../global";
import { mapState } from "vuex";

 
export var montaEmail = {
    computed: {
        ...mapState(['diaHoje'])
    },
    methods: {

        async montaEmail(caller) {
             console.log('chamador', caller);

            // console.log('generateDownload')


            let g = document.querySelector(".selectedTable").innerHTML;



            console.log('g' , g )

        
            let h = document.querySelector(".calcTotal");
            console.log('h', h);
           let i = h.innerHTML;

        //    let diaHojeBr = format(new Date, 'dd/MM/yyyy')




            

            await this.$nextTick(function () {

                


                let url = `${baseApiUrl}/pedido/sendTableMail`
                let imgUrl = `https://scontent.frao1-2.fna.fbcdn.net/v/t39.30808-6/244642796_4778093265548584_4786097109182621002_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeHAPmKC-abfLN6n8vIlgf2hZ5NEcffe79Znk0Rx997v1kXbi0qulBsnfsTKD6neC7_PXugUuIuRwF1CDzh_twG_&_nc_ohc=OR_lXsORemcAX-ykFTg&_nc_ht=scontent.frao1-2.fna&oh=00_AfDHTW9VjOV20W8rqxPoHzBwvKqq3N1xDVed-6UE_eyeAw&oe=63F8AEEF` 
                let tableHtml = `<table id="tableTitulo"  width="1080" bgcolor="#f3f3f3" style="display:block;  border: 1px solid grey; padding:0px; margin: 0px; background-color:black; color:white;">
                
                
                <tr width="1080" >

                
                <td width="1080"  >
                
                
				<h3 style="padding:10px; color:black; background:#f57424; margin-bottom: 0 ;text-transform:capitalize; width:100%; text-align:center; font-family:monospace; font-size:18px;">CMR Ind. e Com. Ltda - Espelho de pedidos.</h3>
				<div style="display:block">
                <div class="img" style="float:left">
                
                <img style="margin-top:5px;" src="${imgUrl}" alt="$liz_logo" width="137" href="https://liz.com.br">
                </div>

                <div class="data" style="float:center;">
                <p style="flex-direction:center; margin-top:0; justify-content:center; padding:5px; text-align:center; color:white; align-items:center; text-transform:uppercase; font-family:monospace; font-size:18px; float:center; "> Olá,abaixo estão as informações do pedido:  ${this.numPedido}<br> Data da geração do documento: ${this.diaHoje}
                </p>
                <pre><p align="center" width="1080" valign="center"  bgcolor="#442f2d" style=" margin-bottom: 0; height:50px;  background-color:#442f2d; color: white; padding:10px 0px; border:1px solid black; font-size: 18px;">Prezado cliente,Este e-mail é um espelho de pedidos<br>não representa que o pedido foi efetuado e que seus valores estão atualizados.</p></pre> 
                 </div>
			    </td>
                </tr>
                </div>
                </table>
                <table id="tableTitle" style="width:fit-content;" width="1080"  bgcolor="#edd9d4" cellspacing="0" cellpadding="0" border="0" >
                <tr style="width:fit-content;">
             
                 <td width="1080 cellspacing="0" cellpadding="0" border="0" style="  padding: 0; margin: 0 ; display:block; float:left">
                  <ul style="list-style-type:none; list-style:none ; width:100%; display:block; left:-50px;">
                  <p style="list-style-type:none; font-family:sans-serif; font-size:16px;"> Cliente: <b style="font-weight:bold;"> ${this.clienteSelected.nome}  </b></p> 
                  <p style="list-style-type:none; font-family:sans-serif; font-size:16px;"> Recebedor: <b style="font-weight:bold;"> ${this.recebedorSelected.nome}</b> </p>
                  <p style="list-style-type:none; font-family:sans-serif; font-size:16px;"> Tipo Order: <b style="font-weight:bold;"> ${this.ordertypeSelected.nome}  </b></p> 
                  <p style="list-style-type:none; font-family:sans-serif; font-size:16px;"> Setor Atividade: <b style="font-weight:bold;"> ${this.setorSelected.nome}</b></p>
                  <p style="list-style-type:none; font-family:sans-serif; font-size:16px;"> Condição de Pagto: <b style="font-weight:bold;"> ${this.condPagSelected.nome}  </b></p> 
                  <p style="list-style-type:none; font-family:sans-serif; font-size:16px;"> Nº Pedido: <b style="font-weight:bold;"> ${this.numPedido}</b> </p>
                  <p style="list-style-type:none; font-family:sans-serif; font-size:16px;"> Data Emissão: <b style="font-weight:bold;"> ${this.condPagSelected.nome}  </b></p> 
                  <p style="list-style-type:none; font-family:sans-serif; font-size:16px;"> Conversão Tamanho: <b style="font-weight:bold;"> ${this.tamanhoSelected.nome}</b></p>
                  </ul>

                  </td>

               

                  </tr>
                </table>
                <table style="border: 1px solid #FFFFFF" bgcolor="#FFFAF0" cellspacing="0" cellpadding="0" border="0" width="1080" style="font-family:sans-serif; font-size:18px;"> <tr>
             ` + g +  `</tr>   <tr style="width:100%; padding:0px 10px; border: 1px solid black">
             <div width="1080" style="max-width:1080px">`+ i +`</div>
             </tr></table>`;

                let mailCliente = this.clienteSelected.email !== null ? this.clienteSelected.email : '#### Cliente sem e-mail Cadastrado ####';
                let mailRep = this.user.emailOperador ? this.user.emailOperador : '#### Representante sem e-mail cadastrado. ####';

                console.log('mailist', mailCliente, mailRep, this.user)
                // console.log('arg1', tableHtml, typeof tableHtml)
                axios.post(url, { HtmlTable: tableHtml,
                                 mailList: ['rickmadru@yahoo.com', 'ricardo.paulussi@gmail.com']})
                    .then(el => {
                        console.log(el)
                    }).catch((err) => {
                        console.log(err)
                    })


                        let h = window.open('');
                        h.document.write(tableHtml)
                       
                       
               
            })
        }
    },
};