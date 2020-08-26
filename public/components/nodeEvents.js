Vue.component('nodeEvents', {
    name: "nodeEvents",
    props: ['nodeId'],
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
            // eslint-disable-next-line no-console
            console.log(`editEvent(${item.event})`)
            for (let i = 1; i <= this.node.parameters[5]; i++) {
                this.$root.send('REVAL', {"nodeId": this.nodeId, "actionId": item.actionId, "valueId": i})
            }
            //this.getEventVariables(item.actionId)
            this.eventDialog = true
            this.editedEvent = item

        },
        deleteEvent: function (event) {
            // eslint-disable-next-line no-console
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
        node: function () {
            return this.$store.state.nodes[this.nodeId]
        },
        eventList: function () {
            return Object.values(this.$store.state.nodes[this.nodeId].actions)
        }
    },
    template: `
        <v-container>
            <h3>Event Variables</h3>
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
                            <v-spacer></v-spacer>
                            <v-dialog v-model="eventDialog" max-width="500px">
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Edit Event</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="node.parameters[5]"
                                                                  label="Number of Event Variables" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedEvent.event"
                                                                  label="Event Name" readonly></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedEvent.actionId"
                                                                  label="actionId"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <nodeEventVariables v-bind:nodeId="nodeId" v-bind:actionId="editedEvent.actionId"></nodeEventVariables>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn color="blue darken-1" text @click="editEvent(item)" outlined>Edit</v-btn>
                        <v-btn color="blue darken-1" text @click="deleteEvent(item)" outlined>Delete</v-btn>
                        <!--<v-icon
                                small
                                class="mr-2"
                                @click="editEvent(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                                small
                                @click="deleteEvent(item)"
                        >
                            mdi-delete
                        </v-icon>-->
                    </template>
                </v-data-table>
            </v-card>
            <p>{{ $store.state.nodes[this.nodeId].actions }}</p>
        </v-container>`
})