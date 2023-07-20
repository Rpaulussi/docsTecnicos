import { SelecaoConsulta } from '@/components/consultas/SelecaoConsulta.vue'
import { mount } from '@vue/test-utils'

test('SelecaoConsulta', () => {
    const wrapper = mount(SelecaoConsulta)

    expect(wrapper).toBeTruthy();
})