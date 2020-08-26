Vue.component('nodeEventVariables', {
    name: "nodeEventVariables",
    props: ['nodeId','actionId'],
    mounted() {
        console.log(`nodeEventVariables mounted : ${this.nodeId} :: ${this.actionId}`)
        for (let i = 1; i <= this.node.parameters[5]; i++) {
            this.$root.send('REVAL', {"nodeId": this.nodeId, "actionId": this.actionId, "valueId": i})
        }
    },
    computed: {
        node: function () {
            return this.$store.state.nodes[this.nodeId]
        }
    },
    template: `
        <v-container>
            <h3>Node Variables</h3>
            <v-row>
                <nodeEventVariable v-bind:nodeId="nodeId" 
                                   v-bind:actionId="actionId"
                              v-bind:varId="n" 
                              v-for="n in node.parameters[5]"
                              :key="n">
                    
                </nodeEventVariable>
            </v-row>
            <p>{{ node.actions[actionId] }}</p>
        </v-container>`
})