Vue.component('merg-canace8c', {
    name: "merg-canace8c",
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
            this.$store.state.node_component = "merg-canace8c-node-variables"
        },
        getEvents() {
            console.log(`mergDefault - NERD : ${this.nodeId}`)
            this.$root.send('NERD', {'nodeId': this.nodeId})
            this.$store.state.node_component = "merg-canace8c-node-events"
        }
    },
    template: `
      <v-container>
      <h1>CANACE8C</h1>
      <v-tabs>
        <v-tab :key="1" @click="getInfo()">Info</v-tab>
        <v-tab :key="2" @click="getVariables()" v-if="node.flim">Variables</v-tab>
        <v-tab :key="3" @click="getEvents()" v-if="node.EvCount > 0">Events</v-tab>
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

Vue.component('merg-canace8c-node-variables', {
    name: "merg-canace8c-node-variables",
    //props: ['nodeId'],
    mounted() {
        for (let i = 1; i <= this.node.parameters[6]; i++) {
            this.$root.send('NVRD', {"nodeId": this.nodeId, "variableId": i})
        }
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
    },
    template: `
      <v-container>
      <h3>Node Variables</h3>
      <!--<node-variable-bit-array v-bind:nodeId="node.node" varId="3" name="Delay"></node-variable-bit-array>-->
      <merg-canace8c-variable-channel v-bind:nodeId="node.node" v-bind:channelId="n" v-for="n in [0,1,2,3,4,5,6,7]" :key="n"></merg-canace8c-variable-channel>
      <!--<v-row v-for="n in [0,1,2,3]" :key="n">
        <v-card class="xs6 md3 pa-3" flat>
          <p>
            Input
          </p>
        </v-card>
        
        <node-variable-bit v-bind:nodeId="node.node"
                           varId="1"
                           :bit="n"
                           name="On Only">
        </node-variable-bit>
        <node-variable-bit v-bind:nodeId="node.node"
                           varId="2"
                           :bit="n"
                           name="Inverted">
        </node-variable-bit>
        <node-variable-bit v-bind:nodeId="node.node"
                           varId="3"
                           :bit="n"
                           name="Delay">
        </node-variable-bit>
        <node-variable-bit v-bind:nodeId="node.node"
                           varId="6"
                           :bit="n"
                           name="Toggle">
        </node-variable-bit>
        <node-variable-bit v-bind:nodeId="node.node"
                           varId="8"
                           :bit="n"
                           name="Disable SOD">
        </node-variable-bit>
      </v-row>-->
      <v-row>
        <node-variable v-bind:nodeId="node.node"
                       varId="4"
                       name="On Delay">

        </node-variable>
        <node-variable v-bind:nodeId="node.node"
                       varId="5"
                       name="Off Delay">

        </node-variable>
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

Vue.component('merg-canace8c-node-events', {
    name: "merg-canace8c-node-events",
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
            for (let i = 1; i <= this.node.parameters[5]; i++) {
                this.$root.send('REVAL', {"nodeId": this.nodeId, "actionId": item.actionId, "valueId": i})
            }
            //this.eventDialog = true
            this.editedEvent = item
            this.$store.state.selected_action_id = item.actionId
            this.$store.state.node_component = "merg-canace8c-node-event-variables"

        },
        deleteEvent: function (event) {
            console.log(`deleteEvent : ${this.node.node} : ${event}`)
            this.$root.send('EVULN', {"nodeId": this.node.node, "eventName": event})
        }
    },
    mounted() {
        if (this.node.EvCount > 0) {
            console.log(`NERD : ${this.nodeId}`)
            this.$root.send('NERD', {"nodeId": this.nodeId})
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

Vue.component('merg-canace8c-node-event-variables', {
    name: "merg-canace8c-node-event-variables",
    //props: ['nodeId', 'actionId'],
    mounted() {
        console.log(`merg-canace8c-node-event-variables mounted : ${this.$store.state.selected_node_id} :: ${this.$store.state.selected_action_id}`)
        for (let i = 1; i <= this.node.parameters[5]; i++) {
            this.$root.send('REVAL', {
                "nodeId": this.$store.state.selected_node_id,
                "actionId": this.$store.state.selected_action_id,
                "valueId": i
            })
        }
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
            this.$root.send('EVLRN', {
                "nodeId": this.node.node,
                "actionId": actionId,
                "eventName": eventName,
                "eventId": eventId,
                "eventVal": eventVal
            })
        }
    },
    template: `
      <v-container>
      <h3>Event Variables</h3>
      <p>Event ID :: {{ $store.state.selected_action_id }}</p>
      <!--<p>{{ $store.state.nodes[this.$store.state.selected_node_id].actions[$store.state.selected_action_id] }}</p>-->
      <v-card outlined>
        <v-card-title>Startup Options</v-card-title>
        <v-card-text>
          <v-radio-group v-model="node.actions[actionId].variables[1]" :mandatory="true"
                         @change="updateEV(node.node,
                                   node.actions[actionId].event,
                                   node.actions[actionId].actionId,
                                   3,
                                   parseInt(node.actions[actionId].variables[1]))">
            <v-radio label="SOD" :value="0"></v-radio>
            <v-radio label="Route" :value="1"></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>
      <v-row>
        <node-event-variable-bit v-bind:node="$store.state.selected_node_id"
                                 v-bind:action="$store.state.selected_action_id"
                                 variable="1"
                                 bit="0"
                                 name="0">
        </node-event-variable-bit>
      </v-row>
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

Vue.component('merg-canace8c-variable-channel', {
    name: "merg-canace8c-variable-channel",
    props: ["nodeId", "channelId"],
    template: `
      <v-row>
      <v-card class="xs6 md3 pa-3" flat outlined>
        <div>Channel {{ channelId }}</div>
        <v-row>
          <node-variable-bit v-bind:nodeId="nodeId"
                             :varId="1"
                             v-bind:bit="channelId"
                             name="On Only">
          </node-variable-bit>
          <node-variable-bit v-bind:nodeId="nodeId"
                             :varId="2"
                             v-bind:bit="channelId"
                             name="Inverted">
          </node-variable-bit>
          <node-variable-bit v-bind:nodeId="nodeId"
                             :varId="3"
                             v-bind:bit="channelId"
                             name="Delay">
          </node-variable-bit>
          <node-variable-bit v-bind:nodeId="nodeId"
                             :varId="6"
                             v-bind:bit="channelId"
                             name="Toggle">
          </node-variable-bit>
          <node-variable-bit v-bind:nodeId="nodeId"
                             :varId="8"
                             v-bind:bit="channelId"
                             name="SOD">
          </node-variable-bit>
        </v-row>
      </v-card>
      </v-row>`
})