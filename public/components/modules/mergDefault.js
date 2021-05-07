Vue.component('mergDefault', {
    name: "mergDefault",
    //mixins: [nodeMixin],
    data: function () {
        return {
            nodeId: 0,
        }
    },
    mounted() {
        this.nodeId = this.$store.state.selected_node_id
        this.$store.state.edit_event_component = "merg-default-node-event-variables"
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
            this.$store.state.node_component = "merg-default-node-variables"
        },
        getEvents() {
            //console.log(`mergDefault - NERD : ${this.nodeId}`)
            //this.$root.send('REQUEST_ALL_NODE_EVENTS', {'nodeId': this.nodeId})
            this.$store.state.node_component = "merg-default-node-events"
        }
    },
    template: `
      <v-container>
      <h1>mergDefault</h1>
      <v-tabs>
        <v-tab :key="1" @click="getInfo()">Info</v-tab>
        <v-tab :key="4" @click="getParameters()">Parameters</v-tab>
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
        <common-display-json v-bind:info="nodes"></common-display-json>
        <p>{{ JSON.stringify(node) }}</p>
      </v-container>
      </v-container>
    `
})

Vue.component('merg-default-node-variables', {
    name: "merg-default-node-variables",
    //props: ['nodeId'],
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_VARIABLES', {"nodeId": this.nodeId, "variables": this.node.parameters[6], "delay" : 20})
        /*for (let i = 1; i <= this.node.parameters[6]; i++) {
            let time = i*100
            setTimeout(this.getVariable,time,i)
        }*/
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
    },
    /*methods: {
        getVariable: function (parameter) {
            this.$root.send('NVRD', {"nodeId": this.nodeId, "variableId": parameter})
        }
    },*/
    template: `
      <v-container>
      <h3>Node Variables</h3>
      <p>{{ node.variables }}</p>
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
      </v-container>`
})

Vue.component('merg-default-node-events', {
    name: "merg-default-node-events",
    //props: ['editComponent'],
    data: function () {
        return {
            eventDialog: false,
            editedEvent: {event: "0", variables: [], actionId: 1},
            headers: [
                {text: 'Event Name', value: 'eventName'},
                {text: 'Producing Node', value: 'nodeNumber'},
                {text: 'Event/Device Number', value: 'eventNumber'},
                {text: 'Type', value: 'eventType'},
                {text: 'Event Index', value: 'actionId'},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            addNewEventDialog: false,
        }
    },
    methods: {
        editEvent: function (item) {
            console.log(`editEvent(${item.event})`)
            /*for (let i = 1; i <= this.node.parameters[5]; i++) {
                this.$root.send('REQUEST_EVENT_VARIABLE', {"nodeId": this.nodeId, "actionId": item.actionId, "valueId": i})
            }*/
            //this.eventDialog = true
            this.editedEvent = item
            this.$store.state.selected_action_id = item.actionId
            this.$store.state.node_component = this.$store.state.edit_event_component

        },
        deleteEvent: function (event) {
            console.log(`deleteEvent : ${this.node.node} : ${JSON.stringify(event)}`)
            this.$root.send('REMOVE_EVENT', {"nodeId": this.node.node, "eventName": event.event})
        },
        getProducerNodeNumber: function(item) {
          return parseInt(item.event.substr(0,4), 16)
        },
        getEventNumber: function(item) {
          return parseInt(item.event.substr(4,4), 16)
        },
    },
    mounted() {
        if (this.node.EvCount > 0) {
            console.log(`REQUEST_CLEAR_ALL_NODE_EVENTS : ${this.nodeId}`)
            this.$root.send('CLEAR_NODE_EVENTS', {'nodeId': this.nodeId})
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
              <v-toolbar-title>Default Events for {{ node.node }}</v-toolbar-title> 
              <v-divider
                  class="mx-4"
                  inset
                  vertical
              ></v-divider>

              <v-btn color="blue darken-1" @click.stop="addNewEventDialog = true" outlined>Add New Event</v-btn>

              <v-dialog v-model="addNewEventDialog" max-width="300">
              <add-new-event-dialog v-on:close-addNewEventDialog="addNewEventDialog=false"></add-new-event-dialog>

            </v-dialog>
            </v-toolbar>
          </template>
		  
		  
          <template v-slot:item.eventName="{ item }">
            <node-event-variable-display-name v-bind:eventId="item.event"></node-event-variable-display-name>
          </template>
		  
          <template v-slot:item.nodeNumber="{ item }">
            <div>{{ (getProducerNodeNumber(item) == 0) ? "" : getProducerNodeNumber(item) }}</div>
          </template>
                    
          <template v-slot:item.eventNumber="{ item }">
            <div>{{ getEventNumber(item) }}</div>
          </template>
 
          <template v-slot:item.eventType="{ item }">
            <div>{{ (getProducerNodeNumber(item) == 0) ? "Short" : "Long" }}</div>
          </template>
                    
          <template v-slot:item.actions="{ item }">
            <v-btn color="blue darken-1" text @click="editEvent(item)" outlined>Edit</v-btn>
            <v-btn color="blue darken-1" text @click="deleteEvent(item)" outlined>Delete</v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-row v-if="$store.state.debug">
        <common-display-json v-bind:info="$store.state.nodes[this.nodeId].actions"></common-display-json>
        <p>{{ $store.state.nodes[this.nodeId].actions }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-default-node-event-variables', {
    name: "merg-default-node-event-variables",
    //props: ['nodeId', 'actionId'],
    mounted() {
        console.log(`merg-default-node-event-variables mounted : ${this.$store.state.selected_node_id} :: ${this.$store.state.selected_action_id}`)
        this.$root.send('REQUEST_ALL_EVENT_VARIABLES', {
            "nodeId": this.$store.state.selected_node_id,
            "eventIndex": this.$store.state.selected_action_id,
            "variables": this.node.parameters[5],
            "delay":30
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
    template: `
      <v-container>
      <h3>Event Variables</h3>
      <p>Event ID :: {{ $store.state.selected_action_id }}</p>
      <p>{{ $store.state.nodes[this.nodeId].actions[$store.state.selected_action_id] }}</p>
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