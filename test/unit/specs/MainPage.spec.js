import Vue from 'vue'
import MainPage from '@/components/MainPage'

describe('MainPage.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(MainPage)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('#search-box h5').textContent)
      .to.equal('Chcesz wiedzieć czy news, który czytasz jest wiarygodny?')
  })
})
