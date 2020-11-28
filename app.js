Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  store: store
})
