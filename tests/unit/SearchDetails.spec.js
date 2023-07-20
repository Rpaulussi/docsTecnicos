import { SearchDetails } from '@/components/template/SearchDetails.vue'
import { mount } from '@vue/test-utils';


test('UserInfo', () =>{
    const wrapper = mount(SearchDetails)

    expect(wrapper).toBeTruthy();
})