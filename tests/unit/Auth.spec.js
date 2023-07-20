import  { mount } from '@vue/test-utils'
import { Auth } from '@/components/auth/Auth'


//primeiro argumento = descricao
//segundo argumento do test = 

describe('Auth.vue testing', () => {
it('renderizou corretamente', ()=> {
    const wrapper = mount(Auth)
    

    expect(wrapper).exists();
})
   
    // const wrapper = mount(Auth)
    // const input = wrapper.find('input')
    // expect(input.trigger('click'))
    
    
})
 
 





// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message'
//     const wrapper = shallowMount(HelloWorld, {
//       propsData: { msg }
//     })
//     expect(wrapper.text()).toMatch(msg)
//   })
// })
