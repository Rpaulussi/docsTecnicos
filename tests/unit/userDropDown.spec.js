import {  shallowMount } from '@vue/test-utils'
import { UserDropDown } from '@/components/template/UserDropDown.vue'

test('UserDropDown', () => {
    const wrapper = shallowMount(UserDropDown)
    expect(wrapper).toBeTruthy();
} )