Vue.use(Vuex)

const store = new Vuex.Store({})

const ComponentA = {
  computed: {
    message: {
      get () {return store.state.a.message},
      set (value) {store.commit('a/set', value)}
    }
  },
  template: `
  <div>
    Hello from component-a
    <input v-model="message"/>
    <p>{{ this.message }}</p>
  </div>`,
  beforeCreate: function() {
    store.registerModule(
    'a',
      {
        namespaced: true,
        state: () => ({
          message: ''
        }),
        mutations: {
          set (state, value) {
            state.message = value
          }
        }
      }
    )
  }
}

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello from Vue!'
  },
  components: {
    'component-a': ComponentA
  },
  store: store
})
