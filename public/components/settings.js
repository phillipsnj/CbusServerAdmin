Vue.component('settings', {
    name: "settings",
    //props: ['nodeId'],
    data: function () {
        return {
            title: this.$store.state.layout.layoutDetails.title,
            subTitle: this.$store.state.layout.layoutDetails.subTitle
        }
    },
        watch: {
            updateTitle() {
                this.title = this.$store.state.layout.layoutDetails.title
            },
            updateSubTitle() {
                this.subTitle = this.$store.state.layout.layoutDetails.subTitle
            }
        },
        computed: {
            updateTitle: function() {
                return this.$store.state.layout.layoutDetails.title
            },
            updateSubTitle : function() {
                return this.$store.state.layout.layoutDetails.subTitle
            }
        },
    methods: {
        update() {
            console.log(`Layout Details ${JSON.stringify(this.$store.state.layoutDetails)}`)
            this.$store.state.layout.layoutDetails.title = this.title
            this.$store.state.layout.layoutDetails.subTitle = this.subTitle
            console.log(`Layout Details ${JSON.stringify(this.$store.state.layout)}`)
            this.$root.send('UPDATE_LAYOUT_DETAILS', this.$store.state.layout)
            this.editDialog = false
        }
    },
    template: `
        <div>
            <h1>Node Info {{ nodeId }}</h1>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field label="Title"
                                placeholder="Title"
                                v-model="title"
                                @change="update()">
                  </v-text-field>
                  <v-text-field label="Sub Title"
                                placeholder="Sub Title"
                                v-model="subTitle"
                                @change="update()">
                  </v-text-field>
                  <v-checkbox
                      v-model="$store.state.debug"
                      label="Debug Mode">
                  </v-checkbox>
                </v-col>
              </v-row>
              <v-container v-if="$store.state.debug">
                <v-row>
                  <h2>Debug Mode</h2>
                </v-row>
                <v-row><p>{{ $store.state.layout }}</p></v-row>
              </v-container>
            </v-container>
        </div>`
})