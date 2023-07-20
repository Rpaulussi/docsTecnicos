import { SelecaoProdutoExterno } from '@/components/commons/SelecaoProdutoExterno.vue'
import { mount } from '@vue/test-utils';

test('SelecaoProdutoExterno', () => {
    const wrapper = mount(SelecaoProdutoExterno)

    expect(wrapper).toBeTruthy();
})