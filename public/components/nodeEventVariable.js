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
            this.$root.send('UPDATE_EVENT_VARIABLE', {
                "nodeId": this.nodeId,
                "eventIndex": this.actionId,
                "eventName": this.eventName,
                "eventVariableId": this.varId,
                "eventVariableValue": this.variableLocal
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
        label: "Unknown",
        variableLocal: 0,
        eventName: ""
    }),
    mounted() {
        this.variableLocal = this.$store.state.nodes[this.nodeId].actions[this.actionId].variables[this.varId]
        this.eventName = this.$store.state.nodes[this.nodeId].actions[this.actionId].event
        if (this.name !== undefined) {
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
            this.$root.send('UPDATE_EVENT_VARIABLE', {
                "nodeId": this.nodeId,
                "eventIndex": this.actionId,
                "eventName": this.eventName,
                "eventVariableId": this.varId,
                "eventVariableValue": this.variableLocal
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
            console.log(`Set ${this.bitValue} ${this.bit}`)
            this.checked = this.$store.state.nodes[this.node].actions[this.action].variables[this.variable] & this.bitArray[this.bit] ? true : false
        },
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
            console.log(`updateEV bit ${this.node} : ${this.variable} : ${this.checked} : ${this.bit}`)
            this.$root.send('UPDATE_EVENT_VARIABLE', {
                "nodeId": this.node,
                "eventIndex": this.action,
                "eventName": this.eventName,
                "eventVariableId": this.variable,
                "eventVariableValue": value
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
      <v-card class="xs6 md3 pa-3" flat>
      <div>{{ name }}</div>
      <v-row>
        <node-event-variable-bit v-for="n in [0,1,2,3,4,5,6,7]"
                                 :key="n"
                                 v-bind:node="nodeId"
                                 v-bind:action="action"
                                 :variable="varId"
                                 :bit="n"
                                 :name="(n+1).toString()">
        </node-event-variable-bit>
      </v-row>
      </v-card>`
})

Vue.component('node-event-variable-bit-array2', {
    name: "node-event-variable-bit-array2",
    props: ["nodeId", "action", "varId", "name","offset"],
    template: `
      <v-card class="xs6 md3 pa-3" flat>
<!--      <div>{{ name }}</div>-->
      <v-row>
        <node-event-variable-bit v-for="n in [0,1,2,3,4,5,6,7]"
                                 :key="n"
                                 v-bind:node="nodeId"
                                 v-bind:action="action"
                                 :variable="varId"
                                 :bit="n"
                                 :name="(n+1+parseInt(offset,10)).toString()">
        </node-event-variable-bit>
      </v-row>
      </v-card>`
})

Vue.component('node-event-variable-display-name', {
    name: "node-event-variable-display-name",
    props: ["eventId"],
    methods : {
        getEventName(id) {
            console.log(`getEventName : ${id} : ${this.eventId}`)
            if (id in this.$store.state.layout.eventDetails) {
                return this.$store.state.layout.eventDetails[id].name
            } else {
                return id
            }
        },
        getEventColour(id) {
            console.log(`getEventColour : ${id} : ${this.eventId}`)
            if (id in this.$store.state.layout.eventDetails) {
                return this.$store.state.layout.eventDetails[id].colour + "--text"
            } else {
                return "black--text"
            }
        },
    },
    template: `<div :class="getEventColour(eventId)">{{ getEventName(eventId) }}</div>`
})
