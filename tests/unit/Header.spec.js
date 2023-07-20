import Header  from '@/components/template/Header'
import { shallowMount } from '@vue/test-utils';

describe('Header.vue Test', () => {
    it('renders message when component is created', () => {
      // render the component
      const wrapper = shallowMount(Header, {
        propsData: {
          title: 'Vue Project'
        }
      })
  
      // check the name of the component
      expect(wrapper.vm.$options.name).toMatch('Header')
  
      // check that the title is rendered
      expect(wrapper.text()).toMatch('Vue Project')
    })
  })