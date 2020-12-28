Vue.component('events', {
        name: "events",
        //props: ['events'],
        data: function () {
            return {
                search: '',
                expanded: [],
                headers: [
                    {text: 'Event Name', value: 'EventName'},
                    {text: 'Group', value: 'group'},
                    {text: 'NodeId', value: 'nodeId'},
                    {text: 'EventId', value: 'eventId'},
                    {text: 'Type', value: 'type'},
                    {text: 'Status', value: 'status'},
                    {text: 'Count', value: 'count'},
                    {text: '', value: 'data-table-expand'}
                ],
                dialog: false,
                editDialog: false,
                sendEventDialog: false,
                teachDialog: false,
                editedIndex: -1,
                editedEvent: {
                    name: '',
                    colour: ''
                },
                selectedNode: '',
                SelectedEventNode: '',
                teachEventStatus: false,
                teachEventOutput: 'Select a Node',
                displayEventList: []
            }
        },
        watch: {
            eventList: function () {
                this.displayEventList = []
                for (let i in this.eventList) {
                    console.log(`Update Display List ${i}`)
                    if (this.$store.state.layout.eventDetails[this.eventList[i].id]) {
                        this.eventList[i].name = this.$store.state.layout.eventDetails[this.eventList[i].id].name
                        this.eventList[i].colour = this.$store.state.layout.eventDetails[this.eventList[i].id].colour
                        this.eventList[i].group = this.$store.state.layout.eventDetails[this.eventList[i].id].group
                    }
                }
            }
        },
        computed: {
            nodes: function () {
                return Object.values(this.$store.state.nodes)
            },
            eventList: function () {
                return Object.values(this.$store.state.events)
            }
        },
        methods: {
            nodeList(eventId) {
                let output = []
                for (let node in this.$store.state.nodes) {
                    //console.log(`nodeList ${eventId} :: ${node} :: ${this.$store.state.nodes[node].EvCount} :: ${JSON.stringify(this.$store.state.nodes[node].actions)}`)
                    if (this.$store.state.nodes[node].EvCount > 0) {
                        for (let event in this.$store.state.nodes[node].actions) {
                            if (this.$store.state.nodes[node].actions[event].event == eventId) {
                                //console.log(`NL Push ${node} :: ${this.$store.state.nodes[node].actions[event].event}`)
                                output.push(node)
                            }
                        }
                    }
                }
                return output
            },
            displayEventId(event) {
                if (event.id in this.$store.state.layout.eventDetails) {
                    return this.$store.state.layout.eventDetails[event.id].name
                }
            },
            getEventName(id) {
                if (id in this.$store.state.layout.eventDetails) {
                    return this.$store.state.layout.eventDetails[id].name
                } else {
                    return id
                }
            },
            getEventColour(id) {
                if (id in this.$store.state.layout.eventDetails) {
                    return this.$store.state.layout.eventDetails[id].colour + "--text"
                } else {
                    return "black--text"
                }
            },
            getEventColourName(id) {
                if (id in this.$store.state.layout.eventDetails) {
                    return this.$store.state.layout.eventDetails[id].colour
                } else {
                    return "black"
                }
            },
            sendEvent(nodeId, eventId, type, action) {
                console.log(`sendEvent ${type} : ${nodeId} : ${eventId} : ${action}`)
                if (action == 'On') {
                    this.$root.send('ACCESSORY_LONG_ON', {"nodeId": nodeId, "eventId": eventId})
                } else {
                    this.$root.send('ACCESSORY_LONG_OFF', {"nodeId": nodeId, "eventId": eventId})
                }
            },
            editEvent(item) {
                //let Event = Object.assign({}, item)
                console.log(`Edit Event ${item.id}`)
                //this.editedEvent = Object.assign({}, item)
                if (!this.$store.state.layout.eventDetails[item.id]) {
                    console.log(`Event Details Do not exist ${item.id}`)
                    this.$store.state.layout.eventDetails[item.id] = {}
                    this.$store.state.layout.eventDetails[item.id].name = `NodeId : ${item.nodeId} Event : ${item.eventId}`
                    this.$store.state.layout.eventDetails[item.id].colour = "black"
                    this.$store.state.layout.eventDetails[item.id].group = ""
                }
                this.editedEvent = item
                //this.editedEvent["name"] = this.getEventName(item.id)
                //this.editedEvent["colour"] = this.getEventColourName(item.id)*/
                this.editDialog = true
            },
            teachEvent(item) {
                this.editedEvent = Object.assign({}, item)
                this.teachDialog = true
            },
            close() {
                this.dialog = false
            },
            update(Event) {
                console.log(`Event Details ${JSON.stringify(this.$store.state.eventDetails)}`)
                this.$store.state.layout.eventDetails[Event.id] = {}
                this.$store.state.layout.eventDetails[Event.id].name = Event.name
                this.$store.state.layout.eventDetails[Event.id].colour = this.editedEvent.colour
                console.log(`Layout Details ${JSON.stringify(this.$store.state.layout)}`)
                this.$root.send('UPDATE_LAYOUT_DETAILS', this.$store.state.layout)
                this.editDialog = false
            },
        },
        template: `
          <div>
          <v-data-table :headers="headers"
                        :items="this.$store.state.events"
                        item-key="id"
                        class="elevation-1"
                        :single-expand="true"
                        :expanded.sync="expanded"
                        show-expand
                        :search="search">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Events Table</v-toolbar-title>
                <v-spacer></v-spacer>
				<v-btn color="blue darken-1" @click.stop="sendEventDialog = true" outlined>Send Event</v-btn>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-dialog v-model="editDialog" max-width="500px">
                  <events-event-edit :eventId="editedEvent.id" :status="editedEvent.status"
                                     v-on:close-dialog="editDialog=false"></events-event-edit>
                </v-dialog>
                <v-dialog v-model="teachDialog" max-width="500px">
                  <events-teach-event :editedEvent="editedEvent"
                                      v-on:close-dialog="teachDialog=false"></events-teach-event>
                </v-dialog>
				
				<v-dialog v-model="sendEventDialog" max-width="500">
					<send-event-dialog v-on:close-sendEventDialog="sendEventDialog=false"></send-event-dialog>
				</v-dialog>

              </v-toolbar>
            </template>
            <template v-slot:items="props">
              <td>{{ props.item.id }}</td>
              <td>{{ props.item.nodeId }}</td>
              <td>{{ props.item.eventId }}</td>
              <td>{{ props.item.type }}</td>
              <td>{{ props.item.count }}</td>
            </template>
            <template v-slot:item.EventName="{ item }">
              <!--                    <displayEventName :id="item.id"></displayEventName>-->
              <div :class="getEventColour(item.id)">{{ getEventName(item.id) }}</div>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip color="green" dark v-if="item.status=='on'">On</v-chip>
              <v-chip color="red" dark v-else>Off</v-chip>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                Actions {{ item.name }}
                <v-btn color="blue darken-1" text @click="editEvent(item)">Edit</v-btn>
                <v-btn color="blue darken-1" text @click="teachEvent(item)">Teach</v-btn>
                <v-btn color="blue darken-1" text
                       @click="sendEvent(item.nodeId, item.eventId, item.type, 'On')">
                  On
                </v-btn>
                <v-btn color="blue darken-1" text
                       @click="sendEvent(item.nodeId, item.eventId, item.type, 'Off')">
                  Off
                </v-btn>
                <!--            {{ nodeList(item.id) }}-->
              </td>
            </template>

          </v-data-table>
          <v-container v-if="$store.state.debug">
            <h3>Events</h3>
            <div v-for="event in this.$store.state.events" :key="event.id">
              <p>{{ JSON.stringify(event) }}</p>
            </div>
          </v-container>
          </div>
        `
    }
)

Vue.component('events-event-edit', {
    name: "events-event-edit",
    props: ['eventId', 'status'],
    data: function () {
        return {
            editedEvent: {}
        }
    },
    mounted() {
        this.editedEvent = this.$store.state.layout.eventDetails[this.eventId]
    },
    computed: {
        nodeId: function () {
            return parseInt(this.event.substr(0, 4), 16);
        },
        event: function () {
            return parseInt(this.event.substr(4, 4), 16);
        }
    },
    methods: {
        update() {
            console.log(`Event Initial Details ${JSON.stringify(this.$store.state.layout.eventDetails[this.eventId])}`)
            this.$store.state.layout.eventDetails[this.eventId] = {}
            this.$store.state.layout.eventDetails[this.eventId].name = this.editedEvent.name
            this.$store.state.layout.eventDetails[this.eventId].colour = this.editedEvent.colour
            this.$store.state.layout.eventDetails[this.eventId].group = this.editedEvent.group
            console.log(`Event Final Details ${JSON.stringify(this.$store.state.layout.eventDetails[this.eventId])}`)
            this.$root.send('REFRESH_EVENTS')
            this.$root.send('UPDATE_LAYOUT_DETAILS', this.$store.state.layout)

            this.$emit('close-dialog')

        },
        sendEvent(nodeId, eventId, type, action) {
            console.log(`sendEvent ${type} : ${nodeId} : ${eventId} : ${action}`)
            if (action == 'On') {
                this.$root.send('ACCESSORY_LONG_ON', {"nodeId": nodeId, "eventId": eventId})
            } else {
                this.$root.send('ACCESSORY_LONG_OFF', {"nodeId": nodeId, "eventId": eventId})
            }
        },
        groupList() {
            let output = []
            for (let event in this.$store.state.layout.eventDetails) {
                //console.log(`grouplist ${event} `)
                if (this.$store.state.layout.eventDetails[event].group) {
                    console.log(`groupList :: ${this.$store.state.layout.eventDetails[event].group}`)
                    output.push(this.$store.state.layout.eventDetails[event].group)
                }
            }
            return output
        },
        close() {
            console.log(`Close EditEventDialog`)
            this.$emit('close-dialog')
        }
    },
    template: `
      <v-card>
      <v-card-title>
        <span class="headline">Edit Event </span>
        <events-event-display-id :id="eventId"></events-event-display-id>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-text-field v-model="editedEvent.name" outlined
                          label="Event Name"></v-text-field>
          </v-row>
        </v-container>
        <events-event-display :id="eventId"></events-event-display>
        <v-select
            label="Colour"
            v-model="editedEvent.colour"
            :items="$store.state.colours"
            outlined
        ></v-select>
        <v-combobox
            v-model="editedEvent.group"
            :items="groupList()"
            label="Select a group"
        ></v-combobox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="update()">Update</v-btn>
      </v-card-actions>
      </v-card>`
})

Vue.component('events-event-display', {
    name: "events-event-display",
    props: ['id'],
    data: () => ({
        label: "",
    }),
    computed: {
        nodeId: function () {
            return parseInt(this.id.substr(0, 4), 16);
        },
        eventId: function () {
            return parseInt(this.id.substr(4, 4), 16);
        },
        displayName: function () {
            return this.$store.state.layout.eventDetails[this.id].name
        },
        displayColour: function () {
            return this.$store.state.layout.eventDetails[this.id].colour + '--text'
        }
    },
    template: `
      <v-container>
      <div v-if="id in $store.state.layout.eventDetails" :class="displayColour">{{ displayName }}</div>
      <div v-else class="black--text">Node : {{ nodeId }} - Event : {{ eventId }}</div>
      </v-container>`
})

Vue.component('events-event-display-id', {
    name: "events-event-display-id",
    props: ['id'],
    data: () => ({
        label: "",
    }),
    computed: {
        nodeId: function () {
            return parseInt(this.id.substr(0, 4), 16);
        },
        eventId: function () {
            return parseInt(this.id.substr(4, 4), 16);
        }
    },
    template: `
      <v-container>
      <div class="black--text">NodeId : {{ nodeId }} : EventId : {{ eventId }}</div>
      </v-container>`
})

Vue.component('events-teach-event', {
    name: "events-teach-event",
    props: ['editedEvent'],
    data: () => ({
        label: "",
        SelectedEventNode: '',
        teachEventOutput: 'Select a Node',
        teachEventStatus: false
    }),
    computed: {
        nodes: function () {
            return Object.values(this.$store.state.nodes)
        },
        nodeId: function () {
            return parseInt(this.editedEvent.id.substr(0, 4), 16);
        },
        eventId: function () {
            return parseInt(this.editedEvent.id.substr(4, 4), 16);
        },
        displayName: function () {
            return this.$store.state.layout.eventDetails[this.id].name
        },
        displayColour: function () {
            return this.$store.state.layout.eventDetails[this.id].colour + '--text'
        }
    },
    methods: {
        checkNode() {
            /*this.teachEventOutput = 'getEventVariables()'*/

            let input = Object.values(this.SelectedEventNode.actions)
            const found = input.find(o => o.event === this.editedEvent.id)
            console.log(`checkNode() ${this.SelectedEventNode.node} ${this.SelectedEventNode.consumer} : ${this.editedEvent.id} : found ${JSON.stringify(found)} : ${JSON.stringify(input)}`)
            /*this.teachEventOutput = JSON.stringify(Object.values(this.SelectedEventNode.actions))*/
            if (typeof (found) != "undefined") {
                this.teachEventStatus = false
                this.teachEventOutput = "Event already taught"
            } else {
                if (this.SelectedEventNode.consumer) {
                    if (this.SelectedEventNode.flim) {
                        this.teachEventStatus = true
                        this.teachEventOutput = "Event is Ok"
                    } else {
                        this.teachEventStatus = false
                        this.teachEventOutput = "Node not in Flim mode"
                    }
                } else {
                    this.teachEventStatus = false
                    this.teachEventOutput = "Node not a consumer"
                }
            }
        },
        teach(selectedNode, selectedEvent) {
            // eslint-disable-next-line no-console
            console.log(`TEACH_EVENT : ${selectedNode.node} : ${selectedNode.module} : ${selectedEvent.id}`)
            if (selectedNode.module == 'Universal') {
                this.$root.send('TEACH_EVENT', {
                    "nodeId": selectedNode.node,
                    "eventName": selectedEvent.id,
                    "eventId": 2,
                    "eventVal": 2
                })
            } else {
                this.$root.send('TEACH_EVENT', {
                    "nodeId": selectedNode.node,
                    "eventName": selectedEvent.id,
                    "eventId": 1,
                    "eventVal": 0
                })
            }
            this.close()
        },
        close() {
            console.log(`Close EditEventDialog`)
            this.$emit('close-dialog')
        }
    },
    template: `
      <v-card>
      <v-card-title>
        <span class="headline">Teach Event</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              {{ JSON.stringify(editedEvent) }}
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <v-text-field readonly v-model="editedEvent.id"
                            label="Event Id"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-select
                  v-model="SelectedEventNode"
                  :items="nodes"
                  label="Node"
                  item-text="node"
                  return-object
                  @change="checkNode()">
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              {{ teachEventOutput }}
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" :disabled="!teachEventStatus" text
               @click="teach(SelectedEventNode,editedEvent)">Teach
        </v-btn>
      </v-card-actions>
      </v-card>`
})