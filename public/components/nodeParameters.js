Vue.component('nodeParameters', {
    name: "nodeParameters",
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_PARAMETERS', {"nodeId": this.node.node, "parameters": 20, "delay":30})
        console.log(`nodeParamters : ${this.nodeId}`)
    },
    computed: {

        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        node: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id]
        },
        moduleVersion: function () {
            return `${this.node.parameters[7]}.${String.fromCharCode(this.node.parameters[2])}`
        }
    },
    methods: {
		update() {}
	},
    template: `
      <div>
      <!--<h1>Node Parameters {{ nodeId }}</h1>--> 
      <p v-if="$store.state.debug">{{ node.parameters }}</p>
      <v-container>
        <v-row>
          <nodeParameter :nodeId="nodeId" parId="0" name="0: Number of Node Parameters"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="1" name="1: Manufacturer Id"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="2" name="2: Minor Version"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="3" name="3: Module Id"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="4" name="4: Supported Events"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="5" name="5: Event Variables"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="6" name="6: Node Variables"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="7" name="7: Major Version"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="8" name="8: Node Flags"></nodeParameter>
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

Vue.component('nodeDetail', {
    name: "nodeParameter",
    props: ['nodeId', 'parId', 'name'],
    template: `
      <div>
      <v-card class="xs6 md3 pa-3" flat>
        <v-text-field
            :label="name"
            v-model="$store.state.nodes[nodeId].parameters[parId]"
            outlined
            readonly
        >
        </v-text-field>
      </v-card>
      </div>`
})

Vue.component('nodeParameter', {
    name: "nodeParameter",
    props: ['nodeId', 'parId', 'name'],
    template: `
      <div>
      <v-card class="xs6 md3 pa-3" flat>
        <v-text-field
            :label="name"
            v-model="$store.state.nodes[nodeId].parameters[parId]"
            outlined
            readonly
        >
        </v-text-field>
      </v-card>
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