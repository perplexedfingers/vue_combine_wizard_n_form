Vue.use(Vuex)
Vue.use(vueNcform, { extComponents: ncformStdComps});
// window.$http = Vue.prototype.$http = axios;

const store = new Vuex.Store({})

const ComponentA = {
  computed: {
    message: {
      get () {return store.state.a.message},
      set (value) {store.commit('a/set', value)}
    }
  },
  methods: {
    submit() {
      return new Promise((resolve, reject) => {
        this.$ncformValidate('your-form-name').then(data => {
          if (data.result) {
            const numberShowsDOM = document.querySelector('label[title="numberShows"]')
            const numberShowsDOMHides = numberShowsDOM.parentNode.style.display === "none"
            if (numberShowsDOMHides) {
              delete this.$data.putDataHere.numberShows
            }
            store.commit('a/set', this.$data.putDataHere)
            resolve(true)
          } else {
            reject('blah')
          }
        });
      })
    }
  },
  data() {
    return {
      formSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            rules: {
              required: {
                value: true
              }
            }
          },
          numberShows: {
            type: 'boolean',
            ui: {
              hidden: 'dx: !Number.isNaN(Number.parseFloat( {{$root.name}} ))'
            }
          }
        }
      },
      putDataHere: {}
    }
  },
  template: `
  <div>
    <form-wizard ref="catchMe">
      <tab-content title="Personal details" lazy=true :beforeChange="submit">
        <ncform
          :form-schema="formSchema"
          form-name="your-form-name"
          v-model="putDataHere"
          >
        </ncform>
      </tab-content>
      <tab-content title="Additional Info" lazy=true>
        My second tab content
      </tab-content>
    </form-wizard>

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
