Vue.component('merg-canservo8c', {
    name: "merg-canservo8c",
    //mixins: [nodeMixin],
    data: function () {
        return {
            nodeId: 0,
            headers: [
                {text: 'id', value: 'id'},
                {text: 'nodeId', value: 'nodeId'},
                {text: 'eventId', value: 'eventId'},
                {text: 'type', value: 'type'},
                {text: 'status', value: 'status'},
                {text: 'count', value: 'count'}
            ]
        }
    },
    mounted() {
        this.nodeId = this.$store.state.selected_node_id
        this.getInfo()
    },
    computed: {
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        }
    },
    methods: {
        getInfo() {
            this.$store.state.node_component = "nodeInfo"
        },
        getVariables() {
            this.$store.state.node_component = "merg-canservo8c-node-variables"
        },
        getChannels() {
            this.$store.state.node_component = "merg-canservo8c-node-channels"
        },
        getEvents() {
            //console.log(`mergDefault - NERD : ${this.nodeId}`)
            //this.$root.send('REQUEST_ALL_NODE_EVENTS', {'nodeId': this.nodeId})
            this.$store.state.node_component = "merg-canservo8c-node-events"
        }
    },
    template: `
      <v-container>
      <h1>canservo8c</h1>
      <v-tabs>
        <v-tab :key="1" @click="getInfo()">Info</v-tab>
        <v-tab :key="2" @click="getVariables()" v-if="node.flim">Variables</v-tab>
        <v-tab :key="4" @click="getEvents()" v-if="node.EvCount > 0">Events</v-tab>
        <v-tab-item :key="1">
          <!--                    <nodeInfo :nodeId="node.node"></nodeInfo>-->
        </v-tab-item>
        <v-tab-item :key="2">
          <!--<merg-default-node-variables :nodeId="node.node"></merg-default-node-variables>-->
        </v-tab-item>
        <v-tab-item :key="3">
          <!--                    <merg-default-node-events :nodeId="node.node"></merg-default-node-events>-->
        </v-tab-item>
      </v-tabs>
      <v-container v-if="$store.state.debug">
        <p>{{ $store.state.node_component }}</p>
      </v-container>
      <component v-bind:is="$store.state.node_component"></component>
      <v-container v-if="$store.state.debug">
        <p>{{ JSON.stringify(node) }}</p>
      </v-container>
      </v-container>
    `
})

Vue.component('merg-canservo8c-node-variables', {
    name: "merg-canservo8c-node-variables",
    //props: ['nodeId'],
    data: function () {
        return {
            selectedChannel: 1,
            selectedChannelBaseNv: 5,
            IO_channels: [1, 2, 3, 4, 5, 6, 7, 8]
        }
    },
    watch: {
        baseNV: function () {
            for (let i = this.baseNV; i <= this.baseNV + 6; i++) {
                this.$root.send('REQUEST_NODE_VARIABLE', {"nodeId": this.nodeId, "variableId": i})
            }
        }
    },
    mounted() {
        for (let i = 1; i <= this.node.parameters[6]; i++) {
            this.$root.send('REQUEST_NODE_VARIABLE', {"nodeId": this.nodeId, "variableId": i})
        }
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
        baseNV: function () {
            return (((this.selectedChannel || 1) * 4) + 1)
        }
    },
    template: `
      <v-container>
      <h3>Servo {{ selectedChannel }} Variables</h3>
      <v-row>
        <v-card class="xs6 md3 pa-3" flat>
          <v-select
              label="Select IO Channel"
              v-model="selectedChannel"
              :items="IO_channels"
              outlined
          ></v-select>
        </v-card>
      </v-row>
      <v-row>
        <merg-canservo8c-variable-channel v-bind:nodeId="node.node"
                                          v-bind:channelId="selectedChannel">
        </merg-canservo8c-variable-channel>
      </v-row>
      <v-row>
        <node-variable v-bind:nodeId="node.node"
                       v-bind:varId="n"
                       v-for="n in node.parameters[6]"
                       :key="n">

        </node-variable>
      </v-row>

      <v-row v-if="$store.state.debug">
        <p>{{ node.variables }}</p>
      </v-row>
      </v-container>
    `
})

Vue.component('merg-canservo8c-node-events', {
    name: "merg-canservo8c-node-events",
    //props: ['nodeId'],
    data: function () {
        return {
            eventDialog: false,
            editedEvent: {event: "0", variables: [], actionId: 1},
            headers: [
                {text: 'Event Name', value: 'event'},
                {text: 'Action ID', value: 'actionId'},
                {text: 'Actions', value: 'actions', sortable: false}
            ]
        }
    },
    methods: {
        editEvent: function (item) {
            console.log(`editEvent(${item.event})`)
            /*for (let i = 1; i <= this.node.parameters[5]; i++) {
                this.$root.send('REVAL', {"nodeId": this.nodeId, "actionId": item.actionId, "valueId": i})
            }*/
            //this.eventDialog = true
            this.editedEvent = item
            this.$store.state.selected_action_id = item.actionId
            this.$store.state.node_component = "merg-canservo8c-node-event-variables"

        },
        deleteEvent: function (event) {
            console.log(`deleteEvent : ${this.node.node} : ${event}`)
            this.$root.send('REMOVE_EVENT', {"nodeId": this.node.node, "eventName": event.event})
        }
    },
    mounted() {
        if (this.node.EvCount > 0) {
            console.log(`REQUEST_ALL_NODE_EVENTS : ${this.nodeId}`)
            this.$root.send('REQUEST_ALL_NODE_EVENTS', {"nodeId": this.nodeId})
        }
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
        eventList: function () {
            return Object.values(this.$store.state.nodes[this.$store.state.selected_node_id].actions)
        }
    },
    template: `
      <v-container>
      <v-card>
        <v-data-table :headers="headers"
                      :items="eventList"
                      :items-per-page="20"
                      class="elevation-1"
                      item-key="id">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Events for {{ node.node }}</v-toolbar-title>
              <v-divider
                  class="mx-4"
                  inset
                  vertical
              ></v-divider>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn color="blue darken-1" text @click="editEvent(item)" outlined>Edit</v-btn>
            <v-btn color="blue darken-1" text @click="deleteEvent(item)" outlined>Delete</v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-row v-if="$store.state.debug">
        <p>{{ $store.state.nodes[this.nodeId].actions }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-canservo8c-node-event-variables', {
    name: "merg-canservo8c-node-event-variables",
    //props: ['nodeId', 'actionId'],
    mounted() {
        console.log(`merg-canservo8c-node-event-variables mounted : ${this.$store.state.selected_node_id} :: ${this.$store.state.selected_action_id}`)
        this.$root.send('REQUEST_ALL_EVENT_VARIABLES', {
            "nodeId": this.$store.state.selected_node_id,
            "eventIndex": this.$store.state.selected_action_id,
            "variables": this.node.parameters[5]
        })
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        actionId: function () {
            return this.$store.state.selected_action_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        }
    },
    methods: {
        updateEV: function (nodeId, eventName, actionId, eventId, eventVal) {
            // eslint-disable-next-line no-console
            console.log(`editEvent(${nodeId},${eventName},${actionId},${eventId},${eventVal}`)
            this.$root.send('UPDATE_EVENT_VARIABLE', {
                "nodeId": this.node.node,
                "eventIndex": actionId,
                "eventName": eventName,
                "eventVariableId": eventId,
                "eventVariableValue": eventVal
            })
        }
    },
    template: `
      <v-container>
      <h3>Event Variables</h3>
      <p>Event ID :: {{ $store.state.selected_action_id }}</p>
      <node-event-variable-bit-array v-bind:nodeId="$store.state.selected_node_id"
                                     v-bind:action="$store.state.selected_action_id"
                                     varId="1"
                                     name="Active">
      </node-event-variable-bit-array>
      <node-event-variable-bit-array v-bind:nodeId="$store.state.selected_node_id"
                                     v-bind:action="$store.state.selected_action_id"
                                     varId="2"
                                     name="Inverted">
      </node-event-variable-bit-array>

      <v-row>
        <node-event-variable v-bind:nodeId="$store.state.selected_node_id"
                             v-bind:actionId="$store.state.selected_action_id"
                             v-bind:varId="n"
                             v-for="n in node.parameters[5]"
                             :key="n">

        </node-event-variable>
      </v-row>
      <v-row v-if="$store.state.debug">
        <p>{{ node.actions[actionId] }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-canservo8c-variable-channel', {
    name: "merg-canservo8c-variable-channel",
    props: ["nodeId", "channelId"],
    data: function () {
        return {
            variableLocal: 0,
            max: 2500,
            min: 0,
            message: ""
        }
    },
    computed: {
        baseNv: function () {
            return (this.channelId * 4) + 1
        },
        onPosition: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id].variables[this.baseNv]
        },
        offPosition: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id].variables[this.baseNv + 1]
        },
        onSpeed: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id].variables[this.baseNv + 2]
        },
        offPosition: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id].variables[this.baseNv + 4]
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
    },
    methods: {
        updateNV: function (varId, value) {
            this.$root.send('UPDATE_NODE_VARIABLE_IN_LEARN_MODE', {
                "nodeId": this.nodeId,
                "variableId": varId,
                "variableValue": value
            })
        }
    },
    template: `

      <!--<v-card class="xs6 md3 pa-3" flat outlined>
        <v-row>
          <div>Channel {{ channelId }} Variable {{ variableValue }} Local {{ variableLocal }}Repeat {{ repeat }} Pulse {{ pulse }}</div>
        </v-row>-->
      <v-container>
      <h3>Servo {{ channelId }} baseNv {{ baseNv }}</h3>
      <merg-canservo8c-slider v-bind:nodeId="nodeId" v-bind:varId="baseNv"
                              name="On Position" max="255" min="0" step="1"></merg-canservo8c-slider>
      <merg-canservo8c-slider v-bind:nodeId="nodeId" v-bind:varId="baseNv+1"
                              name="Off Position" max="255" min="0" step="1"></merg-canservo8c-slider>
      <merg-canservo8c-slider v-bind:nodeId="nodeId" v-bind:varId="baseNv+2"
                              name="On Speed" max="7" min="0" step="1"></merg-canservo8c-slider>
      <merg-canservo8c-slider v-bind:nodeId="nodeId" v-bind:varId="baseNv+3"
                              name="Off Speed" max="7" min="0" step="1"></merg-canservo8c-slider>
      <merg-canservo8c-variable-bit v-bind:nodeId="nodeId" varId="1" v-bind:bit="channelId-1"
                                    name="Cut off"></merg-canservo8c-variable-bit>
      <merg-canservo8c-variable-bit v-bind:nodeId="nodeId" varId="2" v-bind:bit="channelId-1"
                                    name="Off Position on Startup"></merg-canservo8c-variable-bit>
      <merg-canservo8c-variable-bit v-bind:nodeId="nodeId" varId="3" v-bind:bit="channelId-1"
                                    name="Move to Startup Position"></merg-canservo8c-variable-bit>
      <merg-canservo8c-variable-bit v-bind:nodeId="nodeId" varId="4" v-bind:bit="channelId-1"
                                    name="Sequential"></merg-canservo8c-variable-bit>
      </v-container>
      <!--      </v-card>-->
    `
})

Vue.component('merg-canservo8c-variable-bit', {
    name: "merg-canservo8c-variable-bit",
    props: ["nodeId", "varId", "bit", "name"],
    data: () => ({
        label: "",
        checked: false,
        bitValue: 0,
        bitArray: {0: 1, 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128}
    }),
    mounted() {
        this.bitValue = this.bitArray[this.bit]
        this.checked = this.$store.state.nodes[this.nodeId].variables[this.varId] & this.bitArray[this.bit] ? true : false
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            console.log(` set `)
            this.checked = this.$store.state.nodes[this.nodeId].variables[this.varId] & this.bitArray[this.bit] ? true : false
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function () {
            let value = this.$store.state.nodes[this.nodeId].variables[this.varId]
            if (this.checked) {
                value = value + this.bitArray[this.bit]
            } else {
                value = value - this.bitArray[this.bit]
            }
            this.$root.send('UPDATE_NODE_VARIABLE_IN_LEARN_MODE', {
                "nodeId": this.nodeId,
                "variableId": this.varId,
                "variableValue": value
            })
            console.log(`Stored : ${this.$store.state.nodes[this.nodeId].variables[this.varId]}`)
        }
    },
    template: `
      <v-checkbox min-width="100"
                  v-model="checked"
                  :label="name"
                  @change="updateNV"
      ></v-checkbox>`
})

Vue.component('merg-canservo8c-slider', {
    name: "merg-canservo8c-slider",
    props: ["nodeId", "varId", "name", "max", "min", "step"],
    data: () => ({
        rules: [
            value => value >= this.min || 'Cannot be a negative number',
            value => value <= this.max || 'Number to High'
        ],
        label: "",
        variableLocal: 0
    }),
    mounted() {
        this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function (position) {
            this.$root.send('UPDATE_NODE_VARIABLE_IN_LEARN_MODE', {
                "nodeId": this.nodeId,
                "variableId": this.varId,
                "variableValue": position
            })
        }
    },
    template: `
      <v-container>
      
      <v-slider
          v-model="variableLocal"
          class="align-center"
          :max="max"
          :min="min"
          :step="step"
          hide-details
          @change="updateNV(variableLocal)"
      >

        <template v-slot:prepend>
          <v-text-field
              :label="label"
              readonly
              :value=variableLocal>
          </v-text-field>
          <v-icon color="blue" @click="updateNV(variableLocal-1)">
            remove
          </v-icon>
        </template>
        <template v-slot:append>
          <v-icon color="blue" @click="updateNV(variableLocal+1)">
            add
          </v-icon>
        </template>
      </v-slider>
      </v-container>`
})