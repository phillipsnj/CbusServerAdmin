Vue.component('node-event-variable', {
    name: "node-event-variable",
    props: ["nodeId", "actionId", "varId", "name"],
    data: () => ({
        rules: [
            value => value >= 0 || 'Cannot be a negative number',
            value => value <= 255 || 'Number to High'
        ],
        label: "",
        variableLocal: 0,
        eventName: ""
    }),
    mounted() {
        console.log(`nodeEventVariable Mounted : ${this.$store.state.nodes[this.nodeId].actions[this.actionId].variables[this.varId]}`)
        this.variableLocal = this.$store.state.nodes[this.nodeId].actions[this.actionId].variables[this.varId]
        this.eventName = this.$store.state.nodes[this.nodeId].actions[this.actionId].event
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Event Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            this.variableLocal = this.$store.state.nodes[this.nodeId].actions[this.actionId].variables[this.varId]
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].actions[this.actionId].variables[this.varId]
        }
    },
    methods: {
        updateEV: function () {
            console.log(`Update Event Variable : ${this.node} : ${this.action}`)
            this.$root.send('EVLRN', {
                "nodeId": this.nodeId,
                "actionId": this.actionId,
                "eventName": this.eventName,
                "eventId": this.varId,
                "eventVal": this.variableLocal
            })
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat>
      <v-text-field
          :label="label"
          v-model="variableLocal"
          outlined
          :rules="rules"
          @change="updateEV"
      >
      </v-text-field>
      </v-card>`
})

Vue.component('node-event-variable-select', {
    name: "node-event-variable-select",
    props: ["nodeId", "actionId", "varId", "name", "items"],
    data: () => ({
        label: "",
        variableLocal: 0,
        eventName: ""
    }),
    mounted() {
        this.variableLocal = this.$store.state.nodes[this.nodeId].actions[this.actionId].variables[this.varId]
        this.eventName = this.$store.state.nodes[this.nodeId].actions[this.actionId].event
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            this.variableLocal = this.$store.state.nodes[this.nodeId].actions[this.actionId].variables[this.varId]
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].actions[this.actionId].variables[this.varId]
        }
    },
    methods: {
        updateEV: function () {
            console.log(`Update Event Variable Select : ${this.nodeId} : ${this.actionId} : ${this.varId} : ${this.variableLocal}`)
            this.$root.send('EVLRN', {
                "nodeId": this.nodeId,
                "actionId": this.actionId,
                "eventName": this.eventName,
                "eventId": this.varId,
                "eventVal": this.variableLocal
            })
        }
    },
    template: `
      <div>
      <v-card class="xs6 md3 pa-3" flat>
        <v-select
            :label="label"
            v-model="variableLocal"
            outlined
            @change="updateEV()"
            :items="items"
        >
        </v-select>
      </v-card>
      </div>`
})

Vue.component('node-event-variable-bit', {
    name: "node-event-variable-bit",
    props: ['node', 'action', 'variable', 'bit', 'name'],
    data: () => ({
        checked: false,
        bitValue: 0,
        bitArray: {0: 1, 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128},
        label: "",
        eventName: ""
    }),
    mounted() {
        console.log(`node-event-variable-bit`)
        this.bitValue = this.bitArray[this.bit]
        this.eventName = this.$store.state.nodes[this.node].actions[this.action].event
        this.checked = this.$store.state.nodes[this.node].actions[this.action].variables[this.variable] & this.bitArray[this.bit] ? true : false
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.variable}`
        }
    },
    watch: {
        variableValue() {
            console.log(` set `)
            //this.checked = this.$store.state.nodes[this.node].variables[this.variable] & this.bitArray[this.bit] ? true : false
        },
        checked() {
            console.log(` Checked `)
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.node].actions[this.action].variables[this.variable]
        }
    },
    methods: {
        updateEV: function () {

            let value = this.$store.state.nodes[this.node].actions[this.action].variables[this.variable]
            console.log(`Old Bit Value : ${value}`)
            if (this.checked) {
                value = value + this.bitArray[this.bit]
            } else {
                value = value - this.bitArray[this.bit]
            }
            //this.$store.state.nodes[this.node].variables[this.variable] = value
            console.log(`updateEV bit ${this.node} : ${this.variable} : ${this.checked}`)
            this.$root.send('EVLRN', {
                "nodeId": this.node,
                "actionId": this.action,
                "eventName": this.eventName,
                "eventId": this.variable,
                "eventVal": value
            })
            //console.log(`New Value : ${value}`)
            //console.log(`Stored : ${this.$store.state.nodes[this.node].actions[this.action].variables[this.variable]}`)
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat>
      <v-checkbox min-width="100"
                  v-model="checked"
                  :label="name"
                  @change="updateEV"
      ></v-checkbox>
      </v-card>`
})

Vue.component('node-event-variable-bit-array', {
    name: "node-event-variable-bit-array",
    props: ["nodeId", "action", "varId", "name"],
    template: `
      <v-card class="xs6 md3 pa-3" flat outlined>
      <div>{{ name }}</div>
      <v-row>
        <node-event-variable-bit v-for="n in [0,1,2,3,5,6,7]"
                                 :key="n"
                                 v-bind:nodeId="nodeId"
                                 v-bind:action="action"
                                 :varId="varId"
                                 :bit="n"
                                 :name="(n+1).toString()">
        </node-event-variable-bit>
      </v-row>
      </v-card>`
})
