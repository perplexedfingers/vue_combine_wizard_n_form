Vue.use(Vuex)
Vue.use(vueNcform, { extComponents: ncformStdComps});
// window.$http = Vue.prototype.$http = axios;

const store = new Vuex.Store({})

const ComponentA = {
  methods: {
    submit() {
      store.commit('form1/set', {...this.tab1data, ...this.tab2data})
    },
    tab1validate() {
      return new Promise((resolve, reject) => {
        this.$ncformValidate('tab1').then(data => {
          if (data.result) {
            const numberShowsDOMHides = document.querySelector('label[title="numberShows"]').parentNode
              .style.display === "none"
            if (numberShowsDOMHides) {
              delete this.tab1data.numberShows
            }

            let yo = JSON.parse(JSON.stringify(this.tab2schema))
            if (yo.properties.hideFromHaha.ui) {
              yo.properties.hideFromHaha.ui.hidden = this.mama === "haha"
            } else {
              yo.properties.hideFromHaha.ui = {hidden: this.mama === "haha"}
            }
            this.tab2schema = yo

            resolve(true)
          } else {
            reject('blah')
          }
        });
      })
    },
    tab2validate() {
      return new Promise((resolve, reject) => {
        this.$ncformValidate('tab2').then(data => {
          if (data.result) {
            const hideFromHAHDOMEHides = document.querySelector('label[title="hideFromHaha"]').parentNode
              .style.display === "none"
            if (hideFromHAHDOMEHides) {
              delete this.tab2data.hideFromHaha
            }

            resolve(true)
          } else {
            reject('blah')
          }
        });
      })
    },
    genReview(prevIndex, nextIndex) {
      if (nextIndex + 1 === this.$refs.catchMe.tabs.length) {
        let yo = {
          type: 'object',
          properties: {
            ...JSON.parse(JSON.stringify(this.tab1schema.properties)),
            ...JSON.parse(JSON.stringify(this.tab2schema.properties)),
          }
        }
        const generateReviewItem = (reviewTabSchema, tabData) => {
          Object.entries(tabData).forEach(([key, value]) => {
            reviewTabSchema.properties[key].value = value
            if (reviewTabSchema.properties[key].ui) {
              reviewTabSchema.properties[key].ui.disabled = true
            } else {
              reviewTabSchema.properties[key].ui = {disabled: true}
            }
          })
        }
        this.tabsData.forEach(tabData => generateReviewItem(yo, tabData))
        this.tab3schema = yo
      }
    },
  },
  computed: {
    mama() {return this.tab1data.name},
    tabsData() {return [this.tab1data, this.tab2data]}
  },
  data() {
    return {
      tab1schema: {
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
              hidden: 'dx: !Number.isNaN(Number.parseFloat( {{$root.name}} )) && !Number.isNaN( {{$root.name}} )'
            }
          }
        }
      },
      tab2schema: {
        type: 'object',
        properties: {
          hideFromHaha: {
            type: 'string',
            rules: {
              required: {
                value: true
              }
            }
          },
          blah: {
            type: 'boolean',
            ui: {
              hidden: false
            }
          }
        },
      },
      tab3schema: {
        type: 'object',
        properties: {}
      },
      tab1data: {},
      tab2data: {},
    }
  },
  template: `
  <div>
    <form-wizard ref="catchMe" @on-complete="submit" @on-change="genReview">
      <tab-content title="Personal details" lazy=true :beforeChange="tab1validate">
        <ncform
          :form-schema="tab1schema"
          form-name="tab1"
          v-model.lazy="tab1data"
        >
        </ncform>
      </tab-content>

      <tab-content title="Additional Info" lazy=true :beforeChange="tab2validate">
        <ncform
          :form-schema="tab2schema"
          form-name="tab2"
          v-model="tab2data"
        >
        </ncform>
      </tab-content>

      <tab-content title="Feed me" lazy=true :beforeChange="()=>true">
        <ncform
          :form-schema="tab3schema"
          form-name="tab3"
        >
        </ncform>
      </tab-content>
    </form-wizard>

    Final data
    {{this.$store.state.form1.message}}
    Final data
  </div>`,
  beforeCreate: function() {
    store.registerModule(
    'form1',
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
