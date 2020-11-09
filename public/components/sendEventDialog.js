Vue.component('send-event-dialog', {
  data: function () {
    return {
        nodeId: 0,
        producerNode: null,
        newEvent: null,
        addEventOutput: '',
		radioGroup: "ACON",
		rules: {
			required: value => !!value || 'Required',
		},
    }
  },

  mounted() {
     this.nodeId = this.$store.state.selected_node_id
  },

  methods: {

	close() {
		console.log(`Close sendEventDialog`)
		this.$emit('close-sendEventDialog')
	},

	send() {
		console.log(`sendEventDialog: producerNodeId ` + this.producerNode + " Event " + this.newEvent)
		console.log(`sendEventDialog: radioGroup ` + this.radioGroup)

		if (this.radioGroup == "ACON") {
             this.$root.send('ACCESSORY_LONG_ON', {"nodeId": this.producerNode, "eventId": this.newEvent})
		}
		if (this.radioGroup == "ACOF") {
             this.$root.send('ACCESSORY_LONG_OFF', {"nodeId": this.producerNode, "eventId": this.newEvent})
		}
		if (this.radioGroup == "ASON") {
             this.$root.send('ACCESSORY_SHORT_ON', {"nodeId": this.producerNode, "deviceNumber": this.newEvent})
		}
		if (this.radioGroup == "ASOF") {
             this.$root.send('ACCESSORY_SHORT_OFF', {"nodeId": this.producerNode, "deviceNumber": this.newEvent})
		}
    }
  },
  
  template: `<v-card ref="form">
				  <v-card-title class="justify-center">send Event</v-card-title>
				  
				  <v-card-text>
					<v-container>
					  <v-layout row>
							<v-flex xs5 sm5 md5 lg5 x5 >
							<v-subheader>Producer Node</v-subheader>
						  </v-flex>
							<v-flex xs5 sm5 md5 lg5 x5 >
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
							<v-subheader>Event/Device Number</v-subheader>
						  </v-flex>
							<v-flex xs5 sm5 md5 lg5 x5 >
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
					        <v-radio-group v-model="radioGroup">
								<v-radio
								  label="Long Accessory On"
								  value="ACON"
								></v-radio>
								<v-radio
								  label="Long Accessory OFF"
								  value="ACOF"
								></v-radio>
								<v-radio
								  label="Short Accessory On"
								  value="ASON"
								></v-radio>
								<v-radio
								  label="Short Accessory OFF"
								  value="ASOF"
								></v-radio>
							</v-radio-group>
					  </v-layout>

					  
					</v-container>
				  </v-card-text>
				  
				  <v-card-actions>
					<v-btn outlined @click="close">Cancel</v-btn>
					<v-spacer> </v-spacer>
					<v-btn outlined @click="send">send</v-btn>
				  </v-card-actions>
				</v-card>`
})


