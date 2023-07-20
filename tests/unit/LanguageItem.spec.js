import { LanguageItem } from '@/components/language/languageItem.vue'
import { mount } from '@vue/test-utils'

test('LanguageItem', () => {
    const wrapper = mount(LanguageItem)

    expect(wrapper).toBeTruthy();
})