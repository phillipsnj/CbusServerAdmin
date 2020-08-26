Vue.component('nodeVariables', {
    name: "nodeVariables",
    props: ['nodeId'],
    mounted() {
        for (let i = 1; i <= this.node.parameters[6]; i++) {
            this.$root.send('NVRD', {"nodeId": this.nodeId, "variableId": i})
        }
    },
    computed: {
        node: function () {
            return this.$store.state.nodes[this.nodeId]
        },
    },
    template: `
        <v-container>
            <h3>Node Variables</h3>
            <v-row>
                <nodeVariable v-bind:nodeId="node.node" 
                              v-bind:varId="n" 
                              v-for="n in node.parameters[6]"
                              :key="n">
                    
                </nodeVariable>
            </v-row>
            <p>{{ node.variables }}</p>
        </v-container>`
})