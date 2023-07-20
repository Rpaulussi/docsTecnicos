import { Language } from '@/components/language/language.vue'
import { mount } from '@vue/test-utils'

test('Language Comp', () =>{
    const wrapper = mount(Language)
    
    expect(wrapper).toBeTruthy();
})