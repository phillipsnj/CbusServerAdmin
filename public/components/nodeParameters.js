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
        moduleVersion: function () {
            return `${this.node.parameters[7]}.${String.fromCharCode(this.node.parameters[2])}`
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
			if (index == 6) {name = index + ": Number of Node Parameters"}
			if (index == 7) {name = index + ": Major Version"}
			if (index == 8) {name = index + ": Node Flags"}
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
          <nodeValue name="Version" :value="moduleVersion"></nodeValue>
          <nodeValue name="Flim" :value="node.flim"></nodeValue>
          <nodeValue name="Consumer" :value="node.consumer"></nodeValue>
          <nodeValue name="Producer" :value="node.producer"></nodeValue>
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