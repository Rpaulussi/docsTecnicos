import { SelecaoProdutoItens } from '@/components/commons/SelecaoProdutoItens.vue'
import { mount } from '@vue/test-utils';

test('SelecaoProdutoItens', () => {
        const wrapper = mount(SelecaoProdutoItens)

        expect(wrapper).toBeTruthy();
        
})