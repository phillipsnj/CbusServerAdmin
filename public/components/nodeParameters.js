Vue.component('nodeParameters', {
    name: "nodeParameters",

    mounted() {
        this.$root.send('REQUEST_ALL_NODE_PARAMETERS', {"nodeId": this.node.node, "parameters": 20, "delay":30})
        console.log(`nodeParameters : ${this.nodeId}`)
    },
    computed: {

        nodeId: function ()
		{
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
		moduleManufacturer: function () {
			var value = 'unknown'
			if (this.node.parameters[1] == 70) { value = 'ROCRAIL'}
			if (this.node.parameters[1] == 80) { value = 'SPECTRUM'}
			if (this.node.parameters[1] == 165) { value = 'MERG'}
			return value;
		},
        moduleVersion: function () {
            return `${this.node.parameters[7]}.${String.fromCharCode(this.node.parameters[2])}`
        },
		cpuType: function () {
			var type = 'unknown'
			if (this.node.parameters[9] == 1) { type = 'P18F2480'}
			if (this.node.parameters[9] == 2) { type = 'P18F4480'}
			if (this.node.parameters[9] == 3) { type = 'P18F2580'}
			if (this.node.parameters[9] == 4) { type = 'P18F4580'}
			if (this.node.parameters[9] == 5) { type = 'P18F2585'}
			if (this.node.parameters[9] == 6) { type = 'P18F4585'}
			if (this.node.parameters[9] == 7) { type = 'P18F2680'}
			if (this.node.parameters[9] == 8) { type = 'P18F4680'}
			if (this.node.parameters[9] == 9) { type = 'P18F2682'}
			if (this.node.parameters[9] == 10) { type = 'P18F4682'}
			if (this.node.parameters[9] == 11) { type = 'P18F2685'}
			if (this.node.parameters[9] == 12) { type = 'P18F4685'}
			if (this.node.parameters[9] == 13) { type = 'P18F25K80'}
			if (this.node.parameters[9] == 14) { type = 'P18F45K80'}
			if (this.node.parameters[9] == 15) { type = 'P18F26K80'}
			if (this.node.parameters[9] == 16) { type = 'P18F46K80'}
			if (this.node.parameters[9] == 17) { type = 'P18F65K80'}
			if (this.node.parameters[9] == 18) { type = 'P18F66K80'}
			//
			if (this.node.parameters[9] == 30) { type = 'P32MX534F064'}
			if (this.node.parameters[9] == 31) { type = 'P32MX564F064'}
			if (this.node.parameters[9] == 32) { type = 'P32MX564F128'}
			if (this.node.parameters[9] == 33) { type = 'P32MX575F256'}
			if (this.node.parameters[9] == 34) { type = 'P32MX575F512'}
			if (this.node.parameters[9] == 35) { type = 'P32MX764F128'}
			if (this.node.parameters[9] == 36) { type = 'P32MX775F256'}
			if (this.node.parameters[9] == 37) { type = 'P32MX775F512'}
			if (this.node.parameters[9] == 38) { type = 'P32MX795F512'}
			return type;
		},
		interfaceType: function () {
			var type = 'unknown'
			if (this.node.parameters[10] == 1) { type = 'CAN'}
			if (this.node.parameters[10] == 2) { type = 'Ethernet'}
			if (this.node.parameters[10] == 3) { type = 'Microchip mesh network'}
			return type;
		},
		manufacturerName: function () {
			var value = 'unknown'
			if (this.node.parameters[19] == 1) { value = 'MICROCHIP'}
			if (this.node.parameters[19] == 2) { value = 'ATMEL'}
			if (this.node.parameters[19] == 3) { value = 'ARM'}
			return value;
		},
    },
    methods: {
		variableName: function (index) {
			var name = index + ":";
			if (index == 0) {name = index + ": Number of Node Parameters"}
			if (index == 1) {name = index + ": Manufacturer Id"}
			if (index == 2) {name = index + ": Minor Version"}
			if (index == 3) {name = index + ": Module Id"}
			if (index == 4) {name = index + ": Number of Supported Events"}
			if (index == 5) {name = index + ": Number of Event Variables"}
			if (index == 6) {name = index + ": Number of Node Variables"}
			if (index == 7) {name = index + ": Major Version"}
			if (index == 8) {name = index + ": Node Flags"}
			if (index == 9) {name = index + ": CPU type"}
			if (index == 10) {name = index + ": Interface Type"}
			if (index == 11) {name = index + ": CPU Load Address"}
			if (index == 12) {name = index + ": CPU Load Address"}
			if (index == 13) {name = index + ": CPU Load Address"}
			if (index == 14) {name = index + ": CPU Load Address"}
			if (index == 15) {name = index + ": CPU Manufacturers Code"}
			if (index == 16) {name = index + ": CPU Manufacturers Code"}
			if (index == 17) {name = index + ": CPU Manufacturers Code"}
			if (index == 18) {name = index + ": CPU Manufacturers Code"}
			if (index == 19) {name = index + ": Code for CPU Manufacturer"}
			if (index == 20) {name = index + ": Beta version number"}
			return name;
		},
	},
    template: `
      <div>
      <!--<h1>Node Parameters {{ nodeId }}</h1>--> 
      <p v-if="$store.state.debug">{{ node.parameters }}</p>
      <v-container>

        <v-row>
		<template v-for="(parameter, index) in node.parameters" >
          <nodeValue :name="variableName(index)" :value="parameter"></nodeValue>
		</template>
        </v-row>
		
        <v-row>
	      <p>Translated values</p>
        </v-row>
        <v-row>
          <nodeValue name="Module Manufacturer" :value="moduleManufacturer"></nodeValue>
          <nodeValue name="Version" :value="moduleVersion"></nodeValue>
          <nodeValue name="Flim" :value="node.flim"></nodeValue>
          <nodeValue name="Consumer" :value="node.consumer"></nodeValue>
          <nodeValue name="Producer" :value="node.producer"></nodeValue>
          <nodeValue name="CPU Type" :value="cpuType"></nodeValue>
          <nodeValue name="Interface Type" :value="interfaceType"></nodeValue>
          <nodeValue name="Manufacturer" :value="manufacturerName"></nodeValue>
        </v-row>
      </v-container>
      </div>`
})

Vue.component('nodeValue', {
    name: "nodeValue",
    props: ['name', 'value'],
    template: `
      <div>
      <v-card class="xs6 md3 pa-3" flat>
        <v-text-field
            :label="name"
            readonly
            outlined
            :value=value>
        </v-text-field>
      </v-card>
      </div>`
})