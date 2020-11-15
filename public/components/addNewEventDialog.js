Vue.component('add-new-event-dialog', {
  data: function () {
    return {
        nodeId: 0,
        producerNode: null,
        newEvent: null,
        addEventOutput: '',
        radioGroup: "LONG",
        eventNumberLabel: "Event Number",
        rules: {
            required: value => !!value || 'Required',
        },
        visible: true,

    }
  },
  mounted() {
     this.nodeId = this.$store.state.selected_node_id;
     <!-- setInterval(() => this.visible = !this.visible, 1000); -->
  },
  methods: {
    close() {
        console.log(`Close addEventDialog`)
        this.$emit('close-addNewEventDialog')
    },

    save() {
        if(this.producerNode == null) {this.producerNode = 0};
        var producerNodeHex = parseInt(this.producerNode).toString(16).padStart(4, '0');
        var newEventHex = parseInt(this.newEvent).toString(16).padStart(4, '0');
        var eventName = producerNodeHex + newEventHex;
        console.log(`addEventDialog: nodeId ` + this.nodeId + " eventName " + eventName)

        var found = undefined;
        var eventList = Object.values(this.$store.state.nodes[this.$store.state.selected_node_id].actions);
        for (var eIndex = 0; eIndex < eventList.length; eIndex++) {
            if ( eventList[eIndex].event == eventName) {found = eventName;}
        }

        if (found == undefined)
        {
            this.$root.send('TEACH_EVENT', {
                "nodeId": this.nodeId,
                "eventName": eventName,
                "eventId": 1,
                "eventVal": 0})
            this.addEventOutput = "Event added";
			
            console.log(`REQUEST_CLEAR_ALL_NODE_EVENTS : ${this.nodeId}`)
            this.$root.send('CLEAR_NODE_EVENTS', {'nodeId': this.nodeId})
            console.log(`REQUEST_ALL_NODE_EVENTS : ${this.nodeId}`)
            this.$root.send('REQUEST_ALL_NODE_EVENTS', {"nodeId": this.nodeId})

        }
        else{
            this.addEventOutput = "Event already exists";
        }
    },
    
    longButton() {
        this.eventNumberLabel = 'Event Number';
        this.visible = true;
    },

    shortButton() {
        this.eventNumberLabel = 'Device Number';
        this.visible = false;
        this.producerNode = 0;
    },

  },
  
    template: `<v-card ref="form">
        <v-card-title class="justify-center">Add New Event</v-card-title>
                  
            <v-card-text>
                <v-container>
                    
                    <v-layout row>
                        <v-radio-group v-model="radioGroup">
                            <v-radio label="Long" value="LONG" 
                                @click="longButton">
                            </v-radio>
                            <v-radio label="Short" value="SHORT" 
                                @click="shortButton">
                            </v-radio>
                        </v-radio-group>
                    </v-layout>

                    <!-- <v-layout row v-if="radioGroup == 'LONG'"> -->
                    <v-layout row :style="{visibility: visible ? 'visible' : 'hidden'}">
                        <v-flex xs5 sm5 md5 lg5 x5 >
                            <v-subheader>Producer Node</v-subheader>
                        </v-flex>
                        <v-flex xs6 sm6 md6 lg6 x6 >
                            <v-text-field 
                                autofocus
                                v-model=producerNode 
                                placeholder="1 to 65535" 
                                outlined
                                type="number"
                                :rules="[rules.required]">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs5 sm5 md5 lg5 x5 >
                            <v-subheader>{{ eventNumberLabel }}</v-subheader>
                        </v-flex>
                        <v-flex xs6 sm6 md6 lg6 x6 >
                            <v-text-field 
                                v-model=newEvent 
                                placeholder="1 to 65535" 
                                outlined
                                type="number"
                                :rules="[rules.required]">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        {{ addEventOutput }}
                    </v-layout>

                </v-container>
            </v-card-text>
                  
            <v-card-actions>
                <v-btn text @click="close">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    `
})


