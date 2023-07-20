import { Menu } from './components/template/Menu'
import { mount } from '@vue/test-utils'

test('Menu test', () => {
    const wrapper = mount(Menu)

    expect(wrapper).toBeTruthy();
})