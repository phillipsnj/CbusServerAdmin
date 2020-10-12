Vue.component('merg-cancmd', {
    name: "merg-cancmd",
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
        getUsers: function () {
            this.$store.state.node_component = "merg-cancmd-node-variables-user"
        },
        getOperations: function () {
            this.$store.state.node_component = "merg-cancmd-node-variables-operations"
        },
        getDebugs: function () {
            this.$store.state.node_component = "merg-cancmd-node-variables-debug"
        },
        getSettings: function () {
            this.$store.state.node_component = "merg-cancmd-node-variables-settings"
        }
    },
    template: `
      <v-container>
      <h1>CANCMD</h1>
      <v-tabs>
        <v-tab :key="1" @click="getInfo()">Info</v-tab>
        <v-tab :key="2" @click="getUsers()">User</v-tab>
        <v-tab :key="3" @click="getOperations()">Operations</v-tab>
        <v-tab :key="4" @click="getDebugs()">Debug</v-tab>
        <v-tab :key="5" @click="getSettings()">Settings</v-tab>
        <v-tab-item :key="1"></v-tab-item>
        <v-tab-item :key="2"></v-tab-item>
        <v-tab-item :key="3"></v-tab-item>
        <v-tab-item :key="4"></v-tab-item>
        <v-tab-item :key="5"></v-tab-item>
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

Vue.component('merg-cancmd-node-variables-user', {
    name: "merg-cancmd-node-variables-user",
    //props: ['nodeId'],
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_VARIABLES', {"nodeId": this.nodeId, "start": 2, "variables": 1, "delay": 20})
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
      <v-row>
        <h3>User Settings</h3>
        <v-row v-if="$store.state.debug"><p>{{ node.variables }}</p></v-row>
        <v-row>
          <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="2" bit="0" name="Silent"
                                    text="Set to enable silent mode, the beeper will never sound so you have to look at the LEDs to see if you have a short circuit or other error. This is for those whose railway is within hearing distance of the rest of the family late at night when they are asleep!"></merg-camcmd-variable-bit>
          <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="2" bit="1" name="Permit Steal"
                                    text="Set to enable the steal option"></merg-camcmd-variable-bit>
          <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="2" bit="2" name="Permit Share"
                                    text="Set to enable the share option"></merg-camcmd-variable-bit>
          <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="2" bit="3" name="Permit Event Reset"
                                    text="Set true to allow a taught event to reset the CS"></merg-camcmd-variable-bit>
          <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="2" bit="4" name="Map Event"
                                    text="When set, CBUS event numbers are mapped directly to DCC accessory addresses. This avoids the need to teach every event, but every event on the given node number will cause a DCC accessory command. See also NV11 and NV12."></merg-camcmd-variable-bit>
          <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="2" bit="5" name="Stop on Timeout"
                                    text="When set, if a loco session times out, the train is brought to a stop before the session is released. When not set, the train is dispatched whilst moving."></merg-camcmd-variable-bit>
          <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="2" bit="6" name="Start of Day"
                                    text="Issue an event 1 on startup which can be used as a start of day event. The event is fixed as of version 4, but in version 5 it will be possible for it to be changed by teaching a producer event"></merg-camcmd-variable-bit>
          <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="2" bit="7" name="Enable Shuttles"
                                    text="Enable the DCC shuttles feature. Version 4 has a hard coded 'proof of concept' shuttle which is enabled by this flag."></merg-camcmd-variable-bit>
        </v-row>
        <v-row v-if="$store.state.debug">
          <node-variable v-bind:nodeId="node.node"
                         v-bind:varId="n"
                         v-for="n in 16"
                         :key="n">

          </node-variable>
        </v-row>
        <v-row v-if="$store.state.debug">
          <p>{{ node.variables }}</p>
        </v-row>
      </v-row>
      </v-container>`
})

/*Vue.component('merg-cancmd-node-variables-operations', {
    name: "merg-cancmd-node-variables-operations",
    //props: ['nodeId'],
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_VARIABLES', {"nodeId": this.nodeId, "start": 3, "variables": 1, "delay": 20})
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
      <h3>Operation Settings</h3>
      <p>{{ node.variables }}</p>
      <v-row>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="0"
                                  name="Jumper Control"></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="1"
                                  name="Main Output on board"></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="2"
                                  name="Analogue Detection"></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="3" name="ZTC Mode"></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="4"
                                  name="Track off with stop all"></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="5"
                                  name="Priority Packets"></merg-camcmd-variable-bit>
      </v-row>
      <v-row v-if="$store.state.debug">
        <node-variable v-bind:nodeId="node.node"
                       v-bind:varId="n"
                       v-for="n in 16"
                       :key="n">

        </node-variable>
      </v-row>
      <v-row v-if="$store.state.debug">
        <p>{{ node.variables }}</p>
      </v-row>
      </v-container>`
})*/

Vue.component('merg-cancmd-node-variables-operations', {
    name: "merg-cancmd-node-variables-operations",
    //props: ['nodeId'],
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_VARIABLES', {"nodeId": this.nodeId, "start": 3, "variables": 1, "delay": 20})
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
      <h3>Operation Settings</h3>
      <v-row v-if="$store.state.debug"><p>{{ node.variables }}</p></v-row>
      <v-row>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="0"
                                  name="Jumper Control"
                                  text="For command stations that have a jumper to set which outputs are used for the main and programming tracks, such as cancmd J7, set this bit to enable jumper control of the outputs. When this bit is 0, the output selection is controlled by the flag bits in this NV. This bit has no effect on command stations that have fixed output selection, such as canbc. "></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="1"
                                  name="Main Output on board"
                                  text="When jumper control is disabled, this flag controls the output selection. When set, the main layout is the on board DCC output, when clear, the main layout is the booster output."></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="2"
                                  name="Analogue Detection"
                                  text="On some hardware, such as canbc, analogue measurement of the main output current is an option. Set this bit to use analogue main current detection, When clear, digital overload detection will be used. This option has no effect on hardware that has a fixed overload detection mechanism, such as cancmd."></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="3" name="ZTC Mode"
                                  text="Set this flag to use ZTC timing on the programming track."></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="3" bit="4"
                                  name="Track off with stop all"
                                  text="When set, the track power will be turned off after a stop all command is executed"></merg-camcmd-variable-bit>
      </v-row>
      <v-row v-if="$store.state.debug">
        <node-variable v-bind:nodeId="node.node"
                       v-bind:varId="n"
                       v-for="n in 16"
                       :key="n">

        </node-variable>
      </v-row>
      <v-row v-if="$store.state.debug">
        <p>{{ node.variables }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-cancmd-node-variables-debug', {
    name: "merg-cancmd-node-variables-debug",
    //props: ['nodeId'],
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_VARIABLES', {"nodeId": this.nodeId, "start": 4, "variables": 1, "delay": 20})
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
      <h3>Debug Settings</h3>
      <v-row v-if="$store.state.debug"><p>{{ node.variables }}</p></v-row>
      <v-row>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="4" bit="0"
                                  name="Priority Packets"
                                  text="When there is a change of speed or function setting, a DCC packet is sent immediately, rather than waiting for the next refresh cycle. Set this option to echo these priority packets to CBUS. "></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="4" bit="1"
                                  name="Refresh Speed Packets"
                                  text="The speed of each active session is regularly refreshed. Set this option to echo these speed refresh packets to CBUS."></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="4" bit="2"
                                  name="Refresh Function Packets"
                                  text="The function settings of each active session are regularly refreshed. Set this option to echo these function refresh packets to CBUS. "></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="4" bit="3"
                                  name="Service Mode Packets"
                                  text="Set this flag to echo all programming track service mode packets to CBUS."></merg-camcmd-variable-bit>
        <merg-camcmd-variable-bit v-bind:nodeId="nodeId" varId="4" bit="4"
                                  name="SAccessory Packets"
                                  text="Set this flag to echo all accessory control packets to CBUS."></merg-camcmd-variable-bit>
      </v-row>
      <v-row v-if="$store.state.debug">
        <node-variable v-bind:nodeId="node.node"
                       v-bind:varId="n"
                       v-for="n in 16"
                       :key="n">

        </node-variable>
      </v-row>
      <v-row v-if="$store.state.debug">
        <p>{{ node.variables }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-cancmd-node-variables-settings', {
    name: "merg-cancmd-node-variables-settings",
    //props: ['nodeId'],
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_VARIABLES', {"nodeId": this.nodeId, "start": 5, "variables": 12, "delay": 20})
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
      <h3>Debug Settings</h3>
      <v-row v-if="$store.state.debug"><p>{{ node.variables }}</p></v-row>
      <v-row>
        <node-variable2 v-bind:nodeId="nodeId" varId="5" name="Walkabout Timeout"
                        text="Values can be set up to 255 Seconds, 0 will disable timeout completely."></node-variable2>
        <node-variable2 v-bind:nodeId="nodeId" varId="6" name="Main Current Limit"
                        text="Current limit for the main track. WARNING - Changing this value to low may cause false overload detection alarms or hardware damage."></node-variable2>
        <node-variable2 v-bind:nodeId="nodeId" varId="7" name="Service Current Limit"
                        text="Current limit for the programming track. WARNING - Changing this value to low may cause false overload detection alarms or hardware damage."></node-variable2>
        <node-variable2 v-bind:nodeId="nodeId" varId="8" name="Current Multiplier"
                        text="This is the value that the raw A->D conversion value should be multiplied to give milliAmps. This factor is used when the command station reports current consumption using CBUS event+data packets. WARNING - Changing this value to low may cause false overload detection alarms or hardware damage."></node-variable2>
        <node-variable2 v-bind:nodeId="nodeId" varId="9" name="Increase for ACK pulses"
                       text="This is the increase in current (raw A->D value) that must be detected to receive an ACK pulse during service track programming. Software which allows this value to be changed should warn the user that setting a value too low may cause erratic CV reading and programming, setting a value too high may stop CV reading and programming from working at all on the programming track., so this should only be altered by those who know what they are doing."></node-variable2>
        <node-variable2 v-bind:nodeId="nodeId" varId="10" name="Shoot through delay"
                       text="For command stations that use discrete FETs in their driver stage, such as canbc, this is a delay
count between positive and negative pulses on the DCC track to avoid shoot through. The effect of
the delay count will depend on the clock rate of the hardware.
On a PIC18 running at 32MHz (8MHz resonator), shoot through delay will be 500nS times the
value in this NV. The default value is 8, giving a shoot through delay of 4uS.
On hardware that does not use discrete FETs, this value will have no effect.
Software which allows this value to be changed should warn the user that setting a value too low
may cause overheating and hardware damage. Setting a value too high may cause locos to not
respond to the DCC commands.
This value should only be altered by those who know what they are doing, and really needs to be
done with an oscilloscope monitoring the waveform.
It has been made tunable so that it can be changed if different FETs are used, or substituted."></node-variable2>
        <node-variable-dual v-bind:nodeId="nodeId" varId1="11" varId2="12" name="Mapped Node"></node-variable-dual>
        <node-variable2 v-bind:nodeId="nodeId" varId="13" name="Send Current Interval" text="If this value is non-zero, the command station will send a CBUS ACON2 event 1, with the
command station node id, at regular intervals. The 2 data bytes of the ACON2 event contain the
number of milliAmps being drawn from the main track output.
The value of this NV is the number of seconds between these reports.
Note that if the main track output is a booster, then these events will not contain meaningful data
because the commands station has no way of knowing how much current is being drawn from any
booster(s) in the system. There is an idea in gestation to allow for an input on the cancmd which
routes to a spare A->D pin on the PIC which can be connected to a booster current monitor output.
The ACON2 event 1 can be changed by teaching a producer event, long or short. In the latter case,
an ASON2 event is sent instead."></node-variable2>
        <node-variable2 v-bind:nodeId="nodeId" varId="14" name="SOD Delay" text="Default value: 0
If the start of day flag, in the user flags NV2, is set, then the command station will send a CBUS
ACON event 0 after the initial startup delay of 2 seconds, plus the delay in this NV14. The delay in
NV14 is half second increments, allowing an additional delay of 0.5 seconds to a little over 2
minutes.
The event to be sent as start of day can be changed by teaching a producer event."></node-variable2>
        <node-variable2 v-bind:nodeId="nodeId" varId="15" name="Shuttle Honk Delay" 
                       text="The counting interval between whistles or honks during shuttle operations (ie: it will whistle or
honk every n iterations of the shuttle) "></node-variable2>
        <node-variable2 v-bind:nodeId="nodeId" varId="16" name="Maximum Speed" text="Maximum speed setting. This acts as a speed limiter, and overrides any cab speed above this value.
It is a DCC speed value, 1 to 127. Any number above that will have no effect and the default is 130.
This feature is useful ideal when the kids come to play, but also useful to make things happen
slowly when debugging automation, such as debugging JMRI dispatcher operations so trains cannot
run away at full speed when you get it wrong."></node-variable2>
      </v-row>
      <v-row v-if="$store.state.debug">
        <node-variable v-bind:nodeId="node.node"
                       v-bind:varId="n"
                       v-for="n in 16"
                       :key="n">

        </node-variable>
      </v-row>
      <v-row v-if="$store.state.debug">
        <p>{{ node.variables }}</p>
      </v-row>
      </v-container>`
})

Vue.component('merg-cancmd-node-events', {
    name: "merg-cancmd-node-events",
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
                this.$root.send('REQUEST_EVENT_VARIABLE', {"nodeId": this.nodeId, "actionId": item.actionId, "valueId": i})
            }*/
            //this.eventDialog = true
            this.editedEvent = item
            this.$store.state.selected_action_id = item.actionId
            this.$store.state.node_component = "merg-default-node-event-variables"

        },
        deleteEvent: function (event) {
            console.log(`deleteEvent : ${this.node.node} : ${JSON.stringify(event)}`)
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

Vue.component('merg-cancmd-node-event-variables', {
    name: "merg-cancmd-node-event-variables",
    //props: ['nodeId', 'actionId'],
    mounted() {
        console.log(`merg-cancmd-node-event-variables mounted : ${this.$store.state.selected_node_id} :: ${this.$store.state.selected_action_id}`)
        this.$root.send('REQUEST_ALL_EVENT_VARIABLES', {
            "nodeId": this.$store.state.selected_node_id,
            "eventIndex": this.$store.state.selected_action_id,
            "variables": this.node.parameters[5],
            "delay": 30
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

Vue.component("merg-camcmd-variable-bit", {
    name: "merg-camcmd-variable-bit",
    props: ['nodeId', 'varId', 'bit', 'name', 'text'],
    template: `
      <v-container fluid>
      <v-row>
        <v-col cols="3" align="start" justify="start">
          <node-variable-bit v-bind:nodeId="nodeId" v-bind:varId="varId" v-bind:bit="bit"
                             v-bind:name="name"></node-variable-bit>
        </v-col>
        <v-col align="start" justify="start" class="mx-0" cols="8">
          <div align="start" justify="start" class="grey--text ml-4">{{ this.text }}</div>

        </v-col>
      </v-row>
      </v-container>
    `
})