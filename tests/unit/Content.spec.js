import { Content } from './components/template/Content'
import { mount } from '@vue/test-utils'

test('Content', () => {
    const wrapper = mount(Content)

    expect(wrapper).toBeTruthy()
})