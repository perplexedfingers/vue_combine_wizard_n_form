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
    <br/>
    Hello from component-a
    <br/>
    <input v-model="message"/>
    <p>{{ this.message }}</p>
  </div>`,
  created: function() {
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
