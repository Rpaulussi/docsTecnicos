import {  mount } from '@vue/test-utils'
import { PageTitle } from '../../src/components/template/PageTitle.vue'


test('PageTitle', () => {
    const wrapper = mount(PageTitle)
  
      expect(wrapper).toBeTruthy();
  
  } )