Vue.component('merg-canmio', {
    name: "merg-canmio",
    data: function () {
        return {
            nodeId: 0,
        }
    },
    mounted() {
        this.nodeId = this.$store.state.selected_node_id
        let delay = 20
        for (let i = 16; i <= 121; i = i + 7) {
            setTimeout(() => {
                this.$root.send('REQUEST_NODE_VARIABLE', {
                    "nodeId": this.$store.state.selected_node_id,
                    "variableId": i
                })
            }, delay)
            delay += 100
        }
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
        getParameters() {
            this.$store.state.node_component = "nodeParameters"
        },
        getVariables() {
            this.$store.state.node_component = "merg-canmio-node-variables"
        },
        getIOChannels() {
            this.$store.state.node_component = "merg-canmio-node-channels"
        },
        getEvents() {
            console.log(`merg-canmio - getEvents : ${this.nodeId}`)
            this.$root.send('CLEAR_NODE_EVENTS', {'nodeId': this.nodeId})
            console.log(`REQUEST_ALL_NODE_EVENTS : ${this.nodeId}`)
            this.$root.send('REQUEST_ALL_NODE_EVENTS', {"nodeId": this.nodeId})
            this.update_event_actions()
            this.update_happening_actions()
            this.$store.state.node_component = "merg-canmio-node-events"
        },
        update_event_actions: function () {
            console.log(`CANMIO : Update_event_actions`)
            this.event_actions = []
            let x = 1
            let y = 8
            this.event_actions.push({"value": 0, "text": "Do Nothing"})
            this.event_actions.push({"value": 1, "text": "Start of Day"})
            this.event_actions.push({"value": 2, "text": "Wait 0.5"})
            this.event_actions.push({"value": 3, "text": "Wait 1"})
            this.event_actions.push({"value": 4, "text": "Wait 2"})
            this.event_actions.push({"value": 5, "text": "Wait 5"})
            for (let i = 16; i <= 121; i = i + 7) { //Get Channel Types

                if (this.node.variables[i] == 1) {
                    //output = {"id":y, "name":"Ch-" + x +" Changed"}
                    this.event_actions.push({"value": y, "text": `Ch-${x} Change`})
                    this.event_actions.push({"value": y + 1, "text": `Ch-${x} ON`})
                    this.event_actions.push({"value": y + 2, "text": `Ch-${x} OFF`})
                    this.event_actions.push({"value": y + 3, "text": `Ch-${x} Flash`})
                    this.event_actions.push({"value": y + 4, "text": `Ch-${x} !Changed`})
                } else if (this.node.variables[i] == 2) {
                    this.event_actions.push({"value": y, "text": `Ch-${x} Change`})
                    this.event_actions.push({"value": y + 1, "text": `Ch-${x} ON`})
                    this.event_actions.push({"value": y + 2, "text": `Ch-${x} OFF`})
                } else if (this.node.variables[i] == 3) {
                    this.event_actions.push({"value": y, "text": `Ch-${x} Change`})
                    this.event_actions.push({"value": y + 1, "text": `Ch-${x} ON`})
                    this.event_actions.push({"value": y + 2, "text": `Ch-${x} OFF`})
                } else if (this.node.variables[i] == 4) {
                    this.event_actions.push({"value": y, "text": `Ch-${x} AT1`})
                    if (this.node.variables[i + 2] > 1) {
                        this.event_actions.push({"value": y + 1, "text": `Ch-${x} AT2`})
                    }
                    if (this.node.variables[i + 2] > 2) {
                        this.event_actions.push({"value": y + 2, "text": `Ch-${x} AT3`})
                    }
                    if (this.node.variables[i + 2] > 3) {
                        this.event_actions.push({"value": y + 3, "text": `Ch-${x} AT4`})
                    }
                }
                x = x + 1
                y = y + 5
            }
            this.$store.state.canmio_event_actions = this.event_actions
        },
        update_happening_actions: function () {
            console.log(`CANMIO : Update_happening_actions : ${this.nodeId} :: ${this.eventId}`)
            this.happening_actions = {}
            let x = 1
            let y = 8
            let id = 0
            this.happening_actions[0] = ""
            this.happening_actions[1] = "Produced Startup Event"
            for (let i = 16; i <= 121; i = i + 7) { //Get Channel Types

                if (this.node.variables[i] == 1) {
                    //output = {"id":y, "name":"Ch-" + x +" Changed"}
                    this.happening_actions[y] = `Ch-${x} Changed`
                } else if (this.node.variables[i] == 0) {
                    this.happening_actions[y] = `Ch-${x} Changed`
                    this.happening_actions[y + 1] = `Ch-${x} TWO_ON`
                } else if (this.node.variables[i] == 2) {
                    this.happening_actions[y] = `Ch-${x} Reached Off`
                    this.happening_actions[y + 1] = `Ch-${x} Reached Mid`
                    this.happening_actions[y + 2] = `Ch-${x} Reached On`
                } else if (this.node.variables[i] == 3) {
                    this.happening_actions[y] = `Ch-${x} Changed`
                } else if (this.node.variables[i] == 4) {
                    this.happening_actions[y] = `Ch-${x} AT1`
                    if (this.node.variables[i + 2] > 1) {
                        this.happening_actions[y + 1] = `Ch-${x} AT2`
                    }
                    if (this.node.variables[i + 2] > 2) {
                        this.happening_actions[y + 2] = `Ch-${x} AT3`
                    }
                    if (this.node.variables[i + 2] > 3) {
                        this.happening_actions[y + 3] = `Ch-${x} AT4`
                    }
                }
                x = x + 1
                y = y + 4
            }
            this.$store.state.canmio_happening_actions = this.happening_actions
        }
    },
    template: `
      <v-container>
      <h1>mergCANMIO</h1>
      <v-tabs>
        <v-tab :key="1" @click="getInfo()">Info</v-tab>
        <v-tab :key="4" @click="getParameters()">Parameters</v-tab>
        <v-tab :key="2" @click="getVariables()">Variables</v-tab>
        <v-tab :key="5" @click="getIOChannels()">IO Channels</v-tab>
        <v-tab :key="3" @click="getEvents()">Stored Events</v-tab>
        <v-tab-item :key="1">
          <!--<nodeInfo :nodeId="node.node"></nodeInfo>-->
        </v-tab-item>
        <v-tab-item :key="2">
          <!--<merg-canmio-node-variables :nodeId="node.node"></merg-canmio-node-variables>-->
        </v-tab-item>
        <v-tab-item :key="5">
          <!--<merg-canmio-node-channels :nodeId="node.node"></merg-canmio-node-channels>-->
        </v-tab-item>
        <v-tab-item :key="3">
          <!--<merg-canmio-node-events :nodeId="node.node" :happening_actions="happening_actions"></merg-canmio-node-events>-->
        </v-tab-item>
      </v-tabs>
      <component v-bind:is="$store.state.node_component"></component>
      <p v-if="$store.state.debug">{{ JSON.stringify(node) }}</p>
      </v-container>
    `
})

Vue.component('merg-canmio-node-variables', {
    name: "merg-canmio-node-variables",
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_VARIABLES', {"nodeId": this.nodeId, "variables": 23, "delay": 50})

    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.nodeId]
        },
    },
    template: `
      <v-container>
      <h3>Node Variables</h3>
      <v-row>
        <node-variable v-bind:nodeId="node.node" varId="1" name="Produced Startup Delay"></node-variable>
        <node-variable v-bind:nodeId="node.node" varId="2" name="HB Delay"></node-variable>
        <node-variable v-bind:nodeId="node.node" varId="3" name="Servo Speed"></node-variable>
        <node-variable v-bind:nodeId="node.node" varId="4" name="PORTB Pull-ups Enable"></node-variable>
      </v-row>
      <v-row v-if="$store.state.debug">
        <p>{{ node.variables }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-node-channels', {
    name: "merg-canmio-node-channels",
    data: function () {
        return {
            selectedChannel: 1,
            selectedChannelBaseNv: 16,
            IO_channels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            event_actions: [],
            //happening_actions: [],
            NV_types1: [
                {"id": 0, "name": "Input"},
                {"id": 1, "name": "Output"},
                {"id": 2, "name": "Servo"},
                {"id": 3, "name": "Bounce"},
                {"id": 4, "name": "Multi"},
            ],
            NV_types2: [
                {"id": 0, "name": "Input"},
                {"id": 1, "name": "Output"},
                {"id": 2, "name": "Servo"},
                {"id": 3, "name": "Bounce"},
                {"id": 4, "name": "Multi"},
                {"id": 5, "name": "Analogue"},
                {"id": 6, "name": "Magnet"}
            ]
        }
    },
    mounted() {
        for (let i = 16; i <= 121; i = i + 7) {
            setTimeout(() => {
                this.$root.send('REQUEST_NODE_VARIABLE', {"nodeId": this.nodeId, "variableId": i, "delay": 30})
            })
        }
    },
    watch: {
        baseNV: function () {
            this.$root.send('REQUEST_ALL_NODE_VARIABLES', {
                "nodeId": this.nodeId,
                "start": this.baseNV,
                "variables": 7,
                "delay": 20
            })
        }
    },
    computed: {
        happening_actions: function () {
            return this.$store.state.canmio_happening_actions
        },
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.nodeId]
        },
        baseNV: function () {
            return (((this.selectedChannel || 1) * 7) + 9)
        },
        nvTypes: function () {
            console.log(`Selected Channel ${this.selectedChannel}`)
            //this.$root.send('REQUEST_ALL_NODE_VARIABLES', {"nodeId": this.nodeId, "start":this.baseNV, "variables": 1, "delay" : 20})
            //this.$root.send('NVRD', {"nodeId": this.nodeId, "variableId": this.baseNV})
            if (this.selectedChannel < 9) {
                return this.NV_types1
            } else {
                return this.NV_types2
            }
        }
    },
    methods: {
        updateChannelType: function () {
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId": this.baseNV,
                "variableValue": this.node.variables[this.baseNV]
            })
            this.$root.send('REQUEST_ALL_NODE_VARIABLES', {
                "nodeId": this.nodeId,
                "start": this.baseNV,
                "variables": 6,
                "delay": 20
            })
        }
    },
    template: `
      <v-container>
      <h3>Node Variables</h3>
      <v-row>
        <p>Selected Channel : {{ selectedChannel }}</p>
        <p>Base Channel Variable : {{ baseNV }}</p>
      </v-row>
      <v-row>
        <v-card class="xs6 md3 pa-3" flat>
          <v-select
              label="Select IO Channel"
              v-model="selectedChannel"
              :items="IO_channels"
              outlined
          ></v-select>
        </v-card>
        <v-card class="xs6 md3 pa-3" flat>
          <v-select
              v-model="node.variables[baseNV]"
              label="Channel Type"
              :items="nvTypes"
              item-text="name"
              item-value="id"
              outlined
              @change="updateChannelType()">
          </v-select>
        </v-card>
        <merg-canmio-channel-input v-bind:nodeId="node.node" v-bind:baseNv="baseNV"
                                   v-show="node.variables[baseNV]==0"></merg-canmio-channel-input>
        <merg-canmio-channel-output v-bind:nodeId="node.node" v-bind:baseNv="baseNV"
                                    v-show="node.variables[baseNV]==1"></merg-canmio-channel-output>
        <merg-canmio-channel-servo v-bind:nodeId="node.node" v-bind:baseNv="baseNV"
                                   v-show="node.variables[baseNV]==2"></merg-canmio-channel-servo>
        <merg-canmio-channel-bounce v-bind:nodeId="node.node" v-bind:baseNv="baseNV"
                                    v-show="node.variables[baseNV]==3"></merg-canmio-channel-bounce>
        <merg-canmio-channel-multi v-bind:nodeId="node.node" v-bind:baseNv="baseNV"
                                   v-show="node.variables[baseNV]==4"></merg-canmio-channel-multi>
        <merg-canmio-channel-analogue v-bind:nodeId="node.node" v-bind:baseNv="baseNV"
                                      v-show="node.variables[baseNV]==5"></merg-canmio-channel-analogue>
        <merg-canmio-channel-magnet v-bind:nodeId="node.node" v-bind:baseNv="baseNV"
                                    v-show="node.variables[baseNV]==6"></merg-canmio-channel-magnet>
        <node-variable v-bind:nodeId="node.node" v-bind:varId="baseNV"
                       name="Selected Base Variable"></node-variable>
      </v-row>
      <v-row v-if="$store.state.debug">
        <p>{{ node.variables }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-node-events', {
    name: "merg-canmio-node-events",
    data: function () {
        return {
            eventDialog: false,
            editedEvent: {event: "0", variables: [], actionId: 1},
            headers: [
                {text: 'Event Name', value: 'event'},
                {text: 'Happening', value: 'actionId'},
                {text: 'Event Index', value: 'eventIndex'},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            addNewEventDialog: false,
        }
    },
    methods: {
        editEvent: function (item) {
            console.log(`editEvent(${item.actionId})`)
            this.$root.send('REQUEST_ALL_EVENT_VARIABLES', {
                "nodeId": this.nodeId,
                "eventIndex": item.actionId,
                "variables": 20,
                "delay": 30
            })
            this.editedEvent = item
            this.$store.state.selected_action_id = item.actionId
            this.$store.state.node_component = "merg-canmio-node-event-variables"

        },
        deleteEvent: function (event) {
            console.log(`REMOVE_EVENT : ${this.node.node} : ${event}`)
            this.$root.send('REMOVE_EVENT', {"nodeId": this.node.node, "eventName": event.event})
        }
    },
    mounted() {
        console.log(`merg-canmio-node-events - mounted: ${this.nodeId} `)
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.nodeId]
        },
        eventList: function () {
            return Object.values(this.$store.state.nodes[this.nodeId].actions)
        },
        happening_actions: function () {
            return this.$store.state.canmio_happening_actions
        }
    },
    template: `
      <v-container>
      <v-data-table :headers="headers"
                    :items="eventList"
                    :items-per-page="20"
                    class="elevation-1"
                    item-key="id">
        <template v-slot:top>
          <v-toolbar flat>
            <v-btn color="blue darken-1" @click.stop="addNewEventDialog = true" outlined>Add New Event</v-btn>

            <v-dialog v-model="addNewEventDialog" max-width="300">
              <add-new-event-dialog
                  v-on:close-addNewEventDialog="addNewEventDialog=false"
                  eventVariableIndex="2"
                  eventVariableValue="2">
              </add-new-event-dialog>
            </v-dialog>

            <v-spacer></v-spacer>
            <v-dialog v-model="eventDialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="headline">Edit Event</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <merg-canmio-node-event-variables
                          v-bind:nodeId="nodeId"
                          v-bind:actionId="editedEvent.actionId">
                      </merg-canmio-node-event-variables>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:item.actionId="{ item }">
          {{ item.variables[1] }} :: {{ happening_actions[item.variables[1]] }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn color="blue darken-1" text @click="editEvent(item)" outlined>Edit</v-btn>
          <v-btn color="blue darken-1" text @click="deleteEvent(item)" outlined>Delete</v-btn>
        </template>

      </v-data-table>
      <v-row v-if="$store.state.debug">
        <p>{{ happening_actions }}</p>
        <p>{{ Object.values(this.$store.state.nodes[this.nodeId].actions) }}</p>

        <p>{{ $store.state.nodes[this.nodeId].actions }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-node-event-variables', {
    name: "merg-canmio-node-event-variables",
    data: function () {
        return {
            eventActions: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20]
        }
    },
    mounted() {
        console.log(`merg-canmio-node-event-variables mounted : ${this.nodeId} :: ${this.actionId}`)
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        actionId: function () {
            return this.$store.state.selected_action_id
        },
        node: function () {
            return this.$store.state.nodes[this.nodeId]
        },
        event_actions: function () {
            return this.$store.state.canmio_event_actions
        },
        happening_actions: function () {
            return this.$store.state.canmio_happening_actions
        },
        numberEventVariables: function () {
            if (this.node.actions[this.actionId].variables[0] < 19) {
                return this.node.actions[this.actionId].variables[0] + 2
            } else {
                return 20
            }
        }
    },
    methods: {},
    template: `
      <v-container>
      <v-row>
        <h3>Event Variables</h3>
        <p>{{ node.actions[actionId].variables.length }}</p>
        <p>{{ node.actions[actionId] }}</p>
        <h3>Happening :: {{ happening_actions[node.actions[actionId].variables[1]] }}</h3>
        <v-col cols="12">
          <v-row v-for="n in eventActions">
            <merg-canmio-event-variable-select v-bind:nodeId="nodeId"
                                               v-bind:actionId="actionId"
                                               v-bind:varId="n"
                                               :name="'Action-'+n"
                                               :items="$store.state.canmio_event_actions"
                                               dense>
            </merg-canmio-event-variable-select>
          </v-row>
        </v-col>
        <p>{{ event_actions }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-event-variable-select', {
    name: "merg-canmio-variable-select",
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
            this.$root.send('REQUEST_ALL_EVENT_VARIABLES', {
                "nodeId": this.nodeId,
                "eventIndex": this.actionId,
                // "variables": this.$store.state.nodes[this.nodeId].actions[item.actionId].variables[0],
                "variables": 20,
                "delay": 30
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

Vue.component('merg-canmio-channel-input', {
    name: "merg-canmio-channel-input",
    props: ['nodeId', "baseNv"],
    mounted() {
        console.log(`merg-canmio-channel-input mounted : ${this.nodeId} :: ${this.baseNv}`)
    },
    created() {
        console.log(`merg-canmio-channel-input created : ${this.nodeId} :: ${this.baseNv}`)
    },
    template: `
      <v-container>
      <p>Base NV : {{ baseNv }}</p>
      <v-row>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="0"
                           name="Trigger Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="3"
                           name="Disable OFF"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="4"
                           name="Toggle"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="6"
                           name="Event Inverted"></node-variable-bit>
      </v-row>
      <v-row>
        <node-variable v-bind:nodeId="nodeId" :varId="baseNv+2"
                       name="On Delay"></node-variable>
        <node-variable v-bind:nodeId="nodeId" :varId="baseNv+3"
                       name="Off Delay"></node-variable>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-channel-output', {
    name: "merg-canmio-channel-output",
    props: ['nodeId', "baseNv"],
    mounted() {
        console.log(`merg-canmio-channel-output mounted : ${this.nodeId} :: ${this.baseNv}`)
    },
    template: `
      <v-container>
      <p>Base NV : {{ baseNv }}</p>
      <v-row>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="0"
                           name="Trigger Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="2"
                           name="Startup"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="3"
                           name="Disable OFF"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="5"
                           name="Action Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="6"
                           name="Event Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="7"
                           name="Action Expedited"></node-variable-bit>
      </v-row>
      <v-row>
        <node-variable v-bind:nodeId="nodeId" :varId="baseNv+2"
                       name="Pulse Duration"></node-variable>
        <node-variable v-bind:nodeId="nodeId" :varId="baseNv+3"
                       name="Flash Period"></node-variable>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-channel-servo', {
    name: "merg-canmio-channel-servo",
    props: ['nodeId', "baseNv"],
    mounted() {
        console.log(`merg-canmio-channel-servo mounted : ${this.nodeId} :: ${this.baseNv}`)
    },
    template: `
      <v-container>
      <p>Base NV : {{ baseNv }}</p>
      <v-row>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="0"
                           name="Trigger Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="1"
                           name="Cutoff"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="2"
                           name="Startup"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="5"
                           name="Action Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="6"
                           name="Event Inverted"></node-variable-bit>
      </v-row>
      <v-row>
        <node-variable-slider v-bind:nodeId="nodeId" :varId="baseNv+2"
                              name="Off Position"></node-variable-slider>
        <node-variable-slider v-bind:nodeId="nodeId" :varId="baseNv+3"
                              name="On Position"></node-variable-slider>
        <node-variable v-bind:nodeId="nodeId" :varId="baseNv+4"
                       name="OFF to ON Speed"></node-variable>
        <node-variable v-bind:nodeId="nodeId" :varId="baseNv+5"
                       name="ON to OFF Speed"></node-variable>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-channel-bounce', {
    name: "merg-canmio-channel-bounce",
    props: ['nodeId', "baseNv"],
    mounted() {
        console.log(`merg-canmio-channel-bounce mounted : ${this.nodeId} :: ${this.baseNv}`)
    },
    template: `
      <v-container>
      <p>Base NV : {{ baseNv }}</p>
      <v-row>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="0"
                           name="Trigger Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="1"
                           name="Cutoff"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="2"
                           name="Startup"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="5"
                           name="Action Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="6"
                           name="Event Inverted"></node-variable-bit>
      </v-row>
      <v-row>
        <node-variable-slider v-bind:nodeId="nodeId" :varId="baseNv+2"
                              name="Off Position"></node-variable-slider>
        <node-variable-slider v-bind:nodeId="nodeId" :varId="baseNv+3"
                              name="On Position"></node-variable-slider>
        <node-variable v-bind:nodeId="nodeId" :varId="baseNv+4"
                       name="Bounce Coefficient"></node-variable>
        <node-variable v-bind:nodeId="nodeId" :varId="baseNv+5"
                       name="Pull Speed"></node-variable>
        <node-variable v-bind:nodeId="nodeId" :varId="baseNv+6"
                       name="Pull Pause"></node-variable>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-channel-multi', {
    name: "merg-canmio-channel-multi",
    props: ['nodeId', "baseNv"],
    mounted() {
        console.log(`merg-canmio-channel-multi mounted : ${this.nodeId} :: ${this.baseNv}`)
    },
    template: `
      <v-container>
      <p>Base NV : {{ baseNv }}</p>
      <v-row>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="0"
                           name="Trigger Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="1"
                           name="Cutoff"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="2"
                           name="Startup"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="5"
                           name="Action Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="6"
                           name="Event Inverted"></node-variable-bit>
      </v-row>
      <v-row>
        <node-variable-select v-bind:nodeId="nodeId" :varId="baseNv+2"
                              name="Number of Positions" :items="[1,2,3,4]"></node-variable-select>
        <node-variable-slider v-bind:nodeId="nodeId" :varId="baseNv+3"
                              name="Position 1"></node-variable-slider>
        <node-variable-slider v-bind:nodeId="nodeId" :varId="baseNv+4"
                              v-if="this.$store.state.nodes[this.nodeId].variables[baseNv+2] > 1"
                              name="Position 2"></node-variable-slider>
        <node-variable-slider v-bind:nodeId="nodeId" :varId="baseNv+5"
                              v-if="this.$store.state.nodes[this.nodeId].variables[baseNv+2] > 2"
                              name="Position 3"></node-variable-slider>
        <node-variable-slider v-bind:nodeId="nodeId" :varId="baseNv+6"
                              v-if="this.$store.state.nodes[this.nodeId].variables[baseNv+2] > 3"
                              name="Position 4"></node-variable-slider>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-channel-analogue', {
    name: "merg-canmio-channel-analogue",
    props: ['nodeId', "baseNv"],
    mounted() {
        console.log(`merg-canmio-channel-analogue mounted : ${this.nodeId} :: ${this.baseNv}`)
    },
    template: `
      <v-container>
      <p>Base NV : {{ baseNv }}</p>
      <v-row>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="0"
                           name="Trigger Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="5"
                           name="Action Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="6"
                           name="Event Inverted"></node-variable-bit>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-channel-magnet', {
    name: "merg-canmio-channel-magnet",
    props: ['nodeId', "baseNv"],
    mounted() {
        console.log(`merg-canmio-channel-magnet mounted : ${this.nodeId} :: ${this.baseNv}`)
    },
    template: `
      <v-container>
      <p>Base NV : {{ baseNv }}</p>
      <v-row>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="0"
                           name="Trigger Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="5"
                           name="Action Inverted"></node-variable-bit>
        <node-variable-bit v-bind:nodeId="nodeId" :varId="baseNv+1" bit="6"
                           name="Event Inverted"></node-variable-bit>
      </v-row>
      </v-container>`
})

Vue.component('merg-canmio-display-happening', {
    name: "merg-canmio-display-happening",
    props: ['nodeId', 'eventId'],
    data: function () {
        return {
            happening_actions: {}
        }
    },
    mounted() {
        console.log(`merg-canmio-display-happening : ${this.nodeId} :: ${this.eventId}`)
        this.update_happening_actions()
    },
    computed: {
        node: function () {
            return this.$store.state.nodes[this.nodeId]
        },
        happening: function () {
            return this.$store.state.nodes[this.nodeId].actions[this.eventId].variables[1]
        }
    },
    methods: {
        update_happening_actions: function () {
            console.log(`CANMIO : Update_happening_actions : ${this.nodeId} :: ${this.eventId}`)
            this.happening_actions = {}
            let x = 1
            let y = 8
            let id = 0
            this.happening_actions[0] = "No Happening"
            this.happening_actions[1] = "Produced Startup Event"
            for (let i = 16; i <= 121; i = i + 7) { //Get Channel Types

                if (this.node.variables[i] == 1) {
                    //output = {"id":y, "name":"Ch-" + x +" Changed"}
                    this.happening_actions[y] = `Ch-${x} Changed`
                } else if (this.node.variables[i] == 0) {
                    this.happening_actions[y] = `Ch-${x} Changed`
                    id = y + 1
                    this.happening_actions[y + 1] = `Ch-${x} TWO_ON`
                } else if (this.node.variables[i] == 2) {
                    this.happening_actions[y] = `Ch-${x} Reached Off`
                    id = y + 1
                    this.happening_actions[y + 1] = `Ch-${x} Reached Mid`
                    id = y + 2
                    this.happening_actions[y + 2] = `Ch-${x} Reached On`
                } else if (this.node.variables[i] == 3) {
                    this.happening_actions[y] = `Ch-${x} Changed`
                } else if (this.node.variables[i] == 4) {
                    this.happening_actions[y] = `Ch-${x} AT1`
                    if (this.node.variables[i + 2] > 1) {
                        id = y + 1
                        this.happening_actions[y + 1] = `Ch-${x} AT2`
                    }
                    if (this.node.variables[i + 2] > 2) {
                        id = y + 2
                        this.happening_actions[y + 2] = `Ch-${x} AT3`
                    }
                    if (this.node.variables[i + 2] > 3) {
                        id = y + 3
                        this.happening_actions[y + 3] = `Ch-${x} AT4`
                    }
                }
                x = x + 1
                y = y + 4
            }
        }
    },
    template: `
      <div> {{ happening }} :: {{ happening_actions[happening] }}</div>
      <!--        <div> {{ happening_actions[0] }}</div>-->
      <!--        <div> No Happening </div>-->
    `
})