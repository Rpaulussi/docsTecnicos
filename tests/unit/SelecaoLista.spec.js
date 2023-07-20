import { SelecaoLista } from '@/components/consultas/SelecaoLista.vue'
import { mount } from '@vue/test-utils'

test('SelecaoLista', () => {
    const wrapper = mount(SelecaoLista)

    expect(wrapper).toBeTruthy();
})