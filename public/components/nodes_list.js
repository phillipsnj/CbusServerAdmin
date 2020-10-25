Vue.component('nodes-list', {
    name: "nodes-list",
    //props: ['nodes'],
    data: function () {
        return {
            headers: [
                {text: 'node', value: 'node'},
                {text: 'Name', value: 'name'},
                {text: 'Group', value: 'group'},
                {text: 'manuf', value: 'manuf'},
                {text: 'module', value: 'module'},
                {text: 'consumer', value: 'consumer'},
                {text: 'producer', value: 'producer'},
                {text: 'flim', value: 'flim'},
                {text: 'status', value: 'status'},
                {text: 'coe', value: 'coe'},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            search: '',
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
                    :items="Object.values($store.state.nodes)"
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
          <div v-for="node in $store.state.nodes" :key="node.node">
            <p>{{ JSON.stringify(node) }}</p>
          </div>
        </v-container>
      </div>
      </v-container>`
})

/*
Vue.component('node-list-node-display-name', {
    name: "node-list-node-display-name",
    props: ['id'],
    data: () => ({
        label: "",
    }),
    computed: {
        nodeId: function () {
            return parseInt(this.id.substr(0, 4), 16);
        },
        displayName: function () {
            return this.$store.state.layout.nodeDetails[this.id].name
        },
        displayColour: function () {
            return this.$store.state.layout.nodeDetails[this.id].colour + '--text'
        }
    },
    template: `
      <v-container>
      <div v-if="id in $store.state.layout.nodeDetails" :class="displayColour">{{ displayName }}</div>
      <div v-else class="black--text">Node : {{ nodeId }} </div>
      </v-container>`
})*/
