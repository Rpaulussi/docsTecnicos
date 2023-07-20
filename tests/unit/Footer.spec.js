import { Footer } from './components/template/Footer'
import { mount } from '@vue/test-utils';

test('Footer Test', () => {
    const wrapper = mount(Footer)

    expect(wrapper).toBeTruthy();
})