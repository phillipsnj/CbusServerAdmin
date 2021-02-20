Vue.component('nodeParameters', {
    name: "nodeParameters",

    mounted() {
        this.$root.send('REQUEST_ALL_NODE_PARAMETERS', {"nodeId": this.node.node, "parameters": 20, "delay": 30})
        console.log(`nodeParameters : ${this.nodeId}`)
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
        },
    },
    methods: {
        variableName: function (index) {
            var name = index + ":";
            if (index == 0) {
                name = index + ": Number of Node Parameters"
            }
            if (index == 1) {
                name = index + ": Manufacturer Id"
            }
            if (index == 2) {
                name = index + ": Minor Version"
            }
            if (index == 3) {
                name = index + ": Module Id"
            }
            if (index == 4) {
                name = index + ": Number of Supported Events"
            }
            if (index == 5) {
                name = index + ": Number of Event Variables"
            }
            if (index == 6) {
                name = index + ": Number of Node Variables"
            }
            if (index == 7) {
                name = index + ": Major Version"
            }
            if (index == 8) {
                name = index + ": Node Flags"
            }
            if (index == 9) {
                name = index + ": CPU type"
            }
            if (index == 10) {
                name = index + ": Interface Type"
            }
            if (index == 11) {
                name = index + ": CPU Load Address"
            }
            if (index == 12) {
                name = index + ": CPU Load Address"
            }
            if (index == 13) {
                name = index + ": CPU Load Address"
            }
            if (index == 14) {
                name = index + ": CPU Load Address"
            }
            if (index == 15) {
                name = index + ": CPU Manufacturers Code"
            }
            if (index == 16) {
                name = index + ": CPU Manufacturers Code"
            }
            if (index == 17) {
                name = index + ": CPU Manufacturers Code"
            }
            if (index == 18) {
                name = index + ": CPU Manufacturers Code"
            }
            if (index == 19) {
                name = index + ": Code for CPU Manufacturer"
            }
            if (index == 20) {
                name = index + ": Beta version number"
            }
            return name;
        },
    },
    template: `
      <div>
      <!--<h1>Node Parameters {{ nodeId }}</h1>-->
      <p v-if="$store.state.debug">{{ node.parameters }}</p>
      <v-container>
        <v-row>
          <nodeValue name="Module Manufacturer" :value="node.moduleManufacturerName"></nodeValue>
          <nodeValue name="Module" :value="node.module"></nodeValue>
          <nodeValue name="Version" :value="moduleVersion"></nodeValue>
          <nodeValue name="Flim" :value="node.flim"></nodeValue>
          <nodeValue name="Consumer" :value="node.consumer"></nodeValue>
          <nodeValue name="Producer" :value="node.producer"></nodeValue>
          <nodeValue name="CPU Type" :value="node.cpuName"></nodeValue>
          <nodeValue name="Interface Type" :value="node.interfaceName"></nodeValue>
          <nodeValue name="CPU Manufacturer" :value="node.cpuManufacturerName"></nodeValue>
        </v-row>
        <v-row v-if="$store.state.advanced">
          <p>Raw Values</p>
        </v-row>
        <v-row v-if="$store.state.advanced">
          <template v-for="(parameter, index) in node.parameters">
            <common-display-value :name="variableName(index)" :value="parameter"></common-display-value>
          </template>
        </v-row>
      </v-container>
      </div>`
})

Vue.component('node-parameters-node-value', {
    name: "node-parameters-node-value",
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