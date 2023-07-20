 import { UserInfo } from '@/components/template/UserInfo.vue'
 import { mount } from '@vue/test-utils'

 test('User Info', () => {
     const wrapper = mount(UserInfo)

     expect(wrapper).toBeTruthy();
 })