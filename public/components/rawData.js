Vue.component('raw-data', {
    name: "raw-data",
    //props: ['events'],
    data: () => ({}),
    computed: {
        nodes: function () {
            return this.$store.state.nodes
        },
        events() {
            return this.$store.state.events
        },
        cbusErrors() {
            return this.$store.state.cbusErrors
        },
        cbusNoSupport() {
            return this.$store.state.cbusNoSupport
        },
        layoutDetails() {
            return this.$store.state.layout
        },
        dccSessions() {
            return this.$store.state.dccSessions
        }
    },
    template: `
      <div>
      <v-tabs>
        <v-tab :key="1">
          Nodes
        </v-tab>
        <v-tab :key="2">
          Events
        </v-tab>
        <v-tab :key="3">
          Cbus Errors
        </v-tab>
        <v-tab :key="4">
          DCC Errors
        </v-tab>
        <v-tab :key="5">
          Layout
        </v-tab>
        <v-tab :key="6">
          No Support
        </v-tab>
        <v-tab :key="7">
          Dcc Sessions
        </v-tab>
        <v-tab-item :key="1">
          <v-card flat>
            <v-card-text>
              <common-display-json v-bind:info="nodes"></common-display-json>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="2">
          <v-card flat>
            <v-col cols="12">
              <v-row v-for="event in events">
                <v-card-text>
                  <common-display-json v-bind:info="event"></common-display-json>
                </v-card-text>
              </v-row>
            </v-col>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="3">
          <v-card flat>
            <v-card-text>
              <common-display-json :info="cbusErrors"></common-display-json>
              {{ cbusErrors }}
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="4">
          <v-card flat>
            <v-card-text> todo</v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="5">
          <v-card flat>
            <v-card-text>
              <common-display-json :info="layoutDetails"></common-display-json>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="6">
          <v-card flat>
            <v-card-text>
              <common-display-json :info="cbusNoSupport"></common-display-json>
              {{ cbusNoSupport }}
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="7">
          <v-card flat>
            <v-card-text>
              <common-display-json :info="dccSessions"></common-display-json>
              {{ dccSessions }}
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
      </div>

    `
})