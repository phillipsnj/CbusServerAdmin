Vue.component('add-new-event-dialog', {
  data: function () {
    return {
        nodeId: 0,
        producerNode: null,
        newEvent: null,
        addEventOutput: '',
    }
  },
  mounted() {
     this.nodeId = this.$store.state.selected_node_id
  },
  methods: {
	close() {
		console.log(`Close addEventDialog`)
		this.$emit('close-addNewEventDialog')
	},

	save() {
		var producerNodeHex = parseInt(this.producerNode).toString(16).padStart(4, '0');
		var newEventHex = parseInt(this.newEvent).toString(16).padStart(4, '0');
		var eventName = producerNodeHex + newEventHex;
		console.log(`CANACC5: addEventDialog nodeId ` + this.nodeId + " eventName " + eventName)

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
		}
		else{
			this.addEventOutput = "Event already exists";
		}
    }
  },
  
  template: `<v-card ref="form">
				  <v-card-title class="justify-center">Add New Event</v-card-title>
				  
				  <v-card-text>
					<v-container>
					  <v-layout row>
							<v-subheader>Producer Node</v-subheader>
							<v-flex xs5 sm5 md5 lg5 x5 >
						  <v-text-field 
							ref="producerNode" 
							v-model=producerNode 
							label="Producer Node" 
							placeholder="1 to 65535" 
							outlined
							single-line
							type="number"
							>
						  </v-text-field>
						  </v-flex>
					  </v-layout>
					  <v-layout row>
							<v-subheader>Event Number</v-subheader>
							<v-flex xs5 sm5 md5 lg5 x5 >
						  <v-text-field 
							ref="newEvent" 
							v-model=newEvent 
							label="Event Number" 
							placeholder="1 to 65535" 
							outlined
							single-line
							type="number">
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
				</v-card>`
})


