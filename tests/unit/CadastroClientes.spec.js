import { createLocalVue, shallowMount } from '@vue/test-utils';
import CadastroCliente from '../../src/components/cadastros/cadastroCliente';
import { Vuex } from 'vuex'


import { mapState } from "vuex";





const localVue = createLocalVue();
localVue.use(Vuex);




describe('CadastroCliente', () => {
    let store;
    let state;
  
    beforeEach(() => {
      state = {
        serverMessages: 'Some server messages',
        language: 'en',
        traduction: 'Translation',
        user: { name: 'John Doe', role: 'admin' },
        Spinner: true,
        isMenuVisible: false
        // ... other state properties
      };
  
      store = new Vuex.Store({
        state
        // ... other store options
      });
    });

    it('displays the user name', () => {
        const wrapper = shallowMount(CadastroCliente, {
          store,
          localVue
        });
      
        const computedState = mapState([
          'user'
          // ... other state properties used in the component
        ]);
      
        // Access the computed property
        const { name } = computedState.user.call(wrapper.vm);
      
        // Assertions or test logic
        expect(wrapper.find('.user-name').text()).toBe(name);
      });



// describe('RegistrationPage', () => {
//     let store;
//     let state;

 
        
//     it('displays a registration form', () => {
//       const wrapper = shallowMount(CadastroCliente);


//       wrapper.setData({razaoS: 'RAZAO TESTE JEST'});
//       wrapper.setData({inscricaoEstadual: '829908610424'});
//       wrapper.vm.$set(wrapper.vm.cadastroCliente, 'telefone', '11971017599')
//       wrapper.vm.$set(wrapper.vm.cadastroCliente, 'cnpj', '36890100000188')

//    // Write your assertions here
//     });
//     let validacaoUm = validacaoComp;;
//     expect(validacaoUm.exists()).toBe(true)
    
  
 
 })