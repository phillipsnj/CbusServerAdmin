Vue.component('nodes-list', {
    name: "nodes-list",
    //props: ['nodes'],
    data: function () {
        return {
            headers: [
                {text: 'node', value: 'node'},
                {text: 'Name', value: 'name'},
                {text: 'Group', value: 'group'},
                {text: 'module', value: 'module'},
                {text: 'flim', value: 'flim'},
                {text: 'status', value: 'status'},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            search: '',
            dialog: false,
            nodeComponent: 'mergDefault',
            selectedNode: {},
            node_list: []
        }
    },
    mounted() {
        //this.node_list = Object.values(this.$store.state.nodes)
        this.update_node_list()
        /*for (let node of Object.values(this.$store.state.nodes)){
            let new_node = {}
            new_node.node = node.node
            new_node.module = node.module
            new_node.flim = node.flim
            new_node.status = node.status
            if (node.node in this.$store.state.layout.nodeDetails) {
                new_node.name = this.$store.state.layout.nodeDetails[node.node].name
                new_node.group = this.$store.state.layout.nodeDetails[node.node].group
                new_node.colour = this.$store.state.layout.nodeDetails[node.node].colour
            } else {
                new_node.name = `Node ${node.node}`
                new_node.group = ''
                new_node.colour = 'black'
            }
            console.log(`Node : ${node.node}`)
            this.node_list.push(new_node)
        }*/
    },
    watch: {
        nodes() {
            console.log('Nodes have changed')
            this.update_node_list()
        }
    },
    computed: {
        nodeId: function () {
            return this.$store.state.selected_node_id
        },
        nodes: function () {
            return this.$store.state.nodes
        },
    },
    methods: {
        QNN: function () {
            this.$root.send('QUERY_ALL_NODES')
        },
        update_node_list: function () {
            this.node_list = []
            for (let node of Object.values(this.$store.state.nodes)){
                let new_node = {}
                new_node.node = node.node
                new_node.module = node.module
                new_node.flim = node.flim
                new_node.status = node.status
                if (node.node in this.$store.state.layout.nodeDetails) {
                    new_node.name = this.$store.state.layout.nodeDetails[node.node].name
                    new_node.group = this.$store.state.layout.nodeDetails[node.node].group
                    new_node.colour = this.$store.state.layout.nodeDetails[node.node].colour
                } else {
                    new_node.name = `Node ${node.node}`
                    new_node.group = ''
                    new_node.colour = 'black'
                }
                console.log(`Node : ${node.node}`)
                this.node_list.push(new_node)
            }
        },
        editNode(node) {
            console.log(`Edit Node ${node.component} : ${node.node}`)
            this.$store.state.selected_node_id = node.node
            if (node.component) {
                this.$store.state.display_component = node.component
            } else {
                this.$store.state.display_component = 'mergDefault'
            }
        },
        displayName: function (id) {
            return this.$store.state.layout.nodeDetails[id].name
        },
        displayColour: function (id) {
            return this.$store.state.layout.nodeDetails[id].colour + '--text'
        },
        displayGroup: function (id) {
            return this.$store.state.layout.nodeDetails[id].group
        }
    },
    template: `
      <v-container>
      <v-data-table :headers="headers"
                    :items="node_list"
                    item-key="node"
                    class="elevation-1"
                    :search="search">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Modules</v-toolbar-title>  
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            <v-btn color="blue darken-1" text v-on:click="QNN()">Check Modules</v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.name="{ item }">
          <div v-if="item.node in $store.state.layout.nodeDetails"
               :class="displayColour(item.node)">{{ displayName(item.node) }}</div>
          <div v-else class="black--text">Node : {{ item.node }} </div>
        </template>
        <template v-slot:item.group="{ item }">
          <div v-if="item.node in $store.state.layout.nodeDetails">{{ displayGroup(item.node) }}</div>
        </template>
        <template v-slot:item.flim="{ item }">
          <v-chip color="amber" dark v-if="item.flim">Flim</v-chip>
          <v-chip color="green" dark v-else>Slim</v-chip>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip color="green" dark v-if="item.status">Ok</v-chip>
          <v-chip color="red" dark v-else>Error</v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn color="blue darken-1" text @click="editNode(item)" outlined>Edit</v-btn>
        </template>
      </v-data-table>
      <div>
        <v-container v-if="$store.state.debug">
          <h3>Raw Node Data</h3>
          <p>{{ node_list }}</p>
          <div v-for="node in node_list" :key="node.node">
            <p>{{ JSON.stringify(node) }}</p>
          </div>
        </v-container>
      </div>
      </v-container>`
})

