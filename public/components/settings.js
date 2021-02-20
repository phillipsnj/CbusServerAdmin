Vue.component('settings', {
    name: "settings",
    //props: ['nodeId'],
    data: function () {
        return {
            title: this.$store.state.layout.layoutDetails.title,
            subTitle: this.$store.state.layout.layoutDetails.subTitle,
            nextNodeId: this.$store.state.layout.layoutDetails.nextNodeId
        }
    },
        watch: {
            updateTitle() {
                this.title = this.$store.state.layout.layoutDetails.title
            },
            updateSubTitle() {
                this.subTitle = this.$store.state.layout.layoutDetails.subTitle
            },
            updateNextNodeId() {
                this.nextNodeId = this.$store.state.layout.layoutDetails.nextNodeId
            }
        },
        computed: {
            updateTitle: function() {
                return this.$store.state.layout.layoutDetails.title
            },
            updateSubTitle : function() {
                return this.$store.state.layout.layoutDetails.subTitle
            },
            updateNextNodeId : function() {
                return this.$store.state.layout.layoutDetails.nextNodeId
            }
        },
    methods: {
        update() {
            console.log(`Layout Details ${JSON.stringify(this.$store.state.layoutDetails)}`)
            this.$store.state.layout.layoutDetails.title = this.title
            this.$store.state.layout.layoutDetails.subTitle = this.subTitle
            this.$store.state.layout.layoutDetails.nextNodeId = this.nextNodeId
            console.log(`Layout Details ${JSON.stringify(this.$store.state.layout)}`)
            this.$root.send('UPDATE_LAYOUT_DETAILS', this.$store.state.layout)
            this.editDialog = false
        }
    },
    template: `
        <div>
            <h1>Settings</h1>
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
                  <v-text-field label="Next Node Id"
                                placeholder="Next Node Id"
                                v-model="nextNodeId"
                                @change="update()">
                  </v-text-field>
                  <v-checkbox
                      v-model="$store.state.debug"
                      label="Debug Mode">
                  </v-checkbox>
                  <v-checkbox
                      v-model="$store.state.advanced"
                      label="Advanced Mode">
                  </v-checkbox>
                </v-col>
              </v-row>
              <v-container v-if="$store.state.advanced">
                <v-row>
                  <h2>Advanced Mode</h2>
                </v-row>
              </v-container>
              <v-container v-if="$store.state.debug">
                <v-row>
                  <h2>Debug Mode</h2>
                  <common-display-json v-bind:info="$store.state.layout"></common-display-json>
                </v-row>
                <v-row><p>{{ $store.state.layout }}</p></v-row>
              </v-container>
            </v-container>
        </div>`
})