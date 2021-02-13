Vue.component('firmware', {
    name: "firmware",
    data: function () {
        return {
            programNodeDialog: false,
        }
    },

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
        firmwareVersion: function () {
            return `${this.node.parameters[7]}.${String.fromCharCode(this.node.parameters[2])}`
        },
    },

    methods: {
	},
    
    template: `
        <div>
            <!--<h1>Node Parameters {{ nodeId }}</h1>--> 
            <p v-if="$store.state.debug">{{ node.parameters }}</p>
            <v-container>

                <body-1>Node Type: {{ node.module }}</body-1></br> 
                <body-1>Node Number: {{ nodeId }}</body-1></br> 
                <body-1>Node Manufacturer: {{ node.moduleManufacturerName }}</body-1></br> 
                <body-1>CPU Type: {{ node.cpuName }}</body-1></br> 
                <body-1>CPU Manufacturer: {{ node.cpuManufacturerName }}</body-1></br> 
                <body-1>Current Firmware version: {{ firmwareVersion }}</body-1></br></br>  

                <v-btn color="blue darken-1" @click.stop="programNodeDialog = true" outlined>Program Node</v-btn>
                <v-dialog persistent v-model="programNodeDialog" max-width="500">
                    <program-node-dialog v-on:close-programNodeDialog="programNodeDialog=false"></program-node-dialog>
                </v-dialog>

            </v-container>
        </div>
    `
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