Vue.component('nodeInfo', {
    name: "nodeInfo",
    //props: ['nodeId'],
    mounted() {
        for (let i = 1; i <= this.node.parameters[0]; i++) {
            this.$root.send('RQNPN', {"nodeId": this.node.node, "parameter": i})
        }
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
    template: `
        <div>
            <h1>Node Info {{ nodeId }}</h1>
            <v-container>
                <v-row>
                    <nodeParameter :nodeId="nodeId" parId="1" name="Manufacturer Id"></nodeParameter>
                    <nodeValue name="Module" :value="node.module"></nodeValue>
                    <nodeValue name="Version" :value="moduleVersion"></nodeValue>
                    <nodeParameter :nodeId="nodeId" parId="6" name="Variables"></nodeParameter>
                    <nodeParameter :nodeId="nodeId" parId="5" name="Event Variables"></nodeParameter>
                    <nodeParameter :nodeId="nodeId" parId="4" name="Supported Events"></nodeParameter>
                    <nodeValue name="Stored Events" :value="node.EvCount"></nodeValue>
                </v-row>
            </v-container>
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