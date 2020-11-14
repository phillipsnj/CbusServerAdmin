Vue.component('nodeInfo', {
    name: "nodeInfo",
    //props: ['nodeId'],
    data: () => ({
        nodeDetails: {
            name: "",
            colour: ""
        }
    }),
    mounted() {
        this.$root.send('REQUEST_ALL_NODE_PARAMETERS', {"nodeId": this.node.node, "parameters": 20, "delay":30})
        console.log(`nodeDetails : ${this.nodeId}`)
        if (this.nodeId in this.$store.state.layout.nodeDetails) {
            this.nodeDetails.name = this.$store.state.layout.nodeDetails[this.nodeId].name
            this.nodeDetails.colour = this.$store.state.layout.nodeDetails[this.nodeId].colour
            this.nodeDetails.group = this.$store.state.layout.nodeDetails[this.nodeId].group
        } else {
            this.nodeDetails.name = `Node ${this.nodeId}`
            this.nodeDetails.colour = `Black`
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
        },
        displayColour: function () {
            return this.$store.state.layout.nodeDetails[this.nodeId].colour + '--text'
        }
    },
    methods: {
    update() {
        this.$store.state.layout.nodeDetails[this.nodeId] = {}
        this.$store.state.layout.nodeDetails[this.nodeId].name = this.nodeDetails.name
        this.$store.state.layout.nodeDetails[this.nodeId].colour = this.nodeDetails.colour
        this.$store.state.layout.nodeDetails[this.nodeId].group = this.nodeDetails.group
        this.$root.send('UPDATE_LAYOUT_DETAILS', this.$store.state.layout)
    },
    groupList() {
        let output = []
        for (let node in this.$store.state.layout.nodeDetails) {
            //console.log(`grouplist ${node} `)
            if (this.$store.state.layout.nodeDetails[node].group) {
                //console.log(`groupList :: ${this.$store.state.layout.nodeDetails[node].group}`)
                output.push(this.$store.state.layout.nodeDetails[node].group)
            }
        }
        return output
    }
},
    template: `
      <div>
      <!--<h1>Node Info {{ nodeId }}</h1>--> 
      <p v-if="$store.state.debug">{{ node.parameters }}</p>
      <v-container>
        <v-col cols="12" sm="6" md="4">
          <v-text-field outlined
                        label="Name"
                        placeholder="Nama"
                        v-model=nodeDetails.name
                        @change="update()"
                        :text-color="nodeDetails.colour"
          >
          </v-text-field>
          <!--<displayNodeName :id="nodeId"></displayNodeName>-->
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
              label="Colour"
              v-model="nodeDetails.colour"
              :items="$store.state.colours"
              outlined
              @change="update()"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-combobox
              v-model="nodeDetails.group"
              :items="groupList()"
              label="Select a group"
              outlined
              @change="update()"
          ></v-combobox>
        </v-col>
      </v-container>
      <v-container>
        <v-row>
          <nodeValue name="NodeId" :value="nodeId"></nodeValue>
          <nodeParameter :nodeId="nodeId" parId="1" name="Manufacturer Id"></nodeParameter>
          <nodeValue name="Module" :value="node.module"></nodeValue>
          <nodeValue name="Version" :value="moduleVersion"></nodeValue>
          <nodeValue name="Flim" :value="node.flim"></nodeValue>
          <nodeValue name="Consumer" :value="node.consumer"></nodeValue>
          <nodeValue name="Producer" :value="node.producer"></nodeValue>
          <nodeValue name="Learn" :value="node.learn"></nodeValue>
          <nodeParameter :nodeId="nodeId" parId="6" name="Variables"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="5" name="Event Variables"></nodeParameter>
          <nodeParameter :nodeId="nodeId" parId="4" name="Supported Events"></nodeParameter>
          <nodeValue name="Stored Events" :value="node.EvCount"></nodeValue>
          <nodeValue name="Actual Events" :value="Object.values(node.actions).length"></nodeValue>
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