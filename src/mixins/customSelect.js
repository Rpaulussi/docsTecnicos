
import _ from 'underscore'
import showError from '@/global'
export const customSelect = {
    methods:{
        addDefeito(defeito) {
            console.log('defeito',  defeito)
      const user = _.find(this.lstDefeitos, u => u.text === defeito)
      console.log('addDefeito', this.lstDefeitos, user)
    },
    searchDefeito(e) {
        let defeito =  _.find(this.lstDefeitos, el => {
            return el.text === e.target['value']
        })
        let filteredLista = _.pluck(this.lstDefeitos, 'text')
        let test = filteredLista.includes(e.target['value'])
        // console.log('searchdefeito' , test,  )
        
        console.log(defeito)
      if (test === true) {
        this.addDefeito(e.target['value'])
      } 
    },
    checkDefeitoSelected(event){
        console.log(event)
        let filteredLista = _.pluck(this.lstDefeitos, 'text')
        let test = filteredLista.includes(event.target['value'])

     
        if(!test){
            showError('Erro: Selecione um defeito válido.')
            event.target['value'] = "";
        }else{
                console.log('passou')
        }
    },
    }
}
export default customSelect