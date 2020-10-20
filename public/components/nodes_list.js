Vue.component('nodes-list', {
    name: "nodes-list",
    //props: ['nodes'],
    data: function () {
        return {
            headers: [
                {text: 'node', value: 'node'},
                {text: 'manuf', value: 'manuf'},
                {text: 'module', value: 'module'},
                {text: 'consumer', value: 'consumer'},
                {text: 'producer', value: 'producer'},
                {text: 'flim', value: 'flim'},
                {text: 'status', value: 'status'},
                {text: 'coe', value: 'coe'},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            dialog: false,
            nodeComponent: 'mergDefault',
            selectedNode: {}
        }
    },
    methods: {
        QNN: function () {
            this.$root.send('QUERY_ALL_NODES')
        },
        editNode(node) {
            console.log(`Edit Node ${node.component} : ${node.node}`)
            this.$store.state.selected_node_id = node.node
            if (node.component) {
                this.$store.state.display_component = node.component
            } else {
                this.$store.state.display_component  = 'mergDefault'
            }
       }
    },
    template: `
      <v-container>
        <v-toolbar flat>
          <v-toolbar-title>Cbus Modules</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text v-on:click="QNN">Check Nodes</v-btn>
        </v-toolbar>

        <v-data-table :headers="headers"
                      :items="Object.values($store.state.nodes)"
                      item-key="node"
                      class="elevation-1">
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
          <div v-for="node in $store.state.nodes" :key="node.node">
            <p>{{ JSON.stringify(node) }}</p>
          </div>
          </v-container>
        </div>
      </v-container>`
})