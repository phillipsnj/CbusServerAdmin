Vue.component('node-variable', {
    name: "node-variable",
    props: ["nodeId", "varId", "name", "max", "min", "hint"],
    data: () => ({
        /*rules: [
            value => value >= 0 || 'Cannot be a negative number',
            value => value <= 255 || 'Number to High'
        ],*/
        maximum: 255,
        minimum: 0,
        label: "",
        variableLocal: 0,
    }),
    mounted() {
        if (this.max !== undefined) {
            this.maximum = this.max
        }
        if (this.min !== undefined) {
            this.minimum = this.min
        }
        this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function () {
            if (this.variableLocal >= this.minimum && this.variableLocal <= this.maximum) {
                this.$root.send('UPDATE_NODE_VARIABLE', {
                    "nodeId": this.nodeId,
                    "variableId": this.varId,
                    "variableValue": this.variableLocal
                })
            }
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat>
      <v-text-field
          :label="label"
          :hint="hint"
          v-model="variableLocal"
          outlined
          :rules="[value => value >= this.minimum || 'Number to low',
            value => value <= this.maximum || 'Number to High']"
          @change="updateNV"
      >
      </v-text-field>
      </v-card>`
})

Vue.component('node-variable-bit', {
    name: "node-variable-bit",
    props: ["nodeId", "varId", "bit", "name"],
    data: () => ({
        label: "",
        checked: false,
        bitValue: 0,
        bitArray: {0: 1, 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128}
    }),
    mounted() {
        this.bitValue = this.bitArray[this.bit]
        this.checked = this.$store.state.nodes[this.nodeId].variables[this.varId] & this.bitArray[this.bit] ? true : false
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            this.checked = this.$store.state.nodes[this.nodeId].variables[this.varId] & this.bitArray[this.bit] ? true : false
            //console.log(`Set ${this.bit} : ${this.bitArray[this.bit]} : ${this.checked}`)
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function () {
            let value = this.$store.state.nodes[this.nodeId].variables[this.varId]
            //console.log(`Update Nv : ${this.bit} : ${this.bitArray[this.bit]} : ${value}`)
            if (this.checked) {
                value = value + this.bitArray[this.bit]
            } else {
                value = value - this.bitArray[this.bit]
            }
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId": this.varId,
                "variableValue": value
            })
            //console.log(`Stored : ${this.bit} : ${this.bitArray[this.bit]} : ${value}`)
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat>
      <v-checkbox min-width="100"
                  v-model="checked"
                  :label="name"
                  @change="updateNV"
      ></v-checkbox>
      </v-card>`
})

Vue.component('node-variable-slider', {
    name: "node-variable-slider",
    props: ["nodeId", "varId", "name"],
    data: () => ({
        rules: [
            value => value >= 0 || 'Cannot be a negative number',
            value => value <= 255 || 'Number to High'
        ],
        label: "",
        variableLocal: 0
    }),
    mounted() {
        this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function (position) {
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId": this.varId,
                "variableValue": position
            })
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat>
      <v-text-field
          :label="label"
          readonly
          :value=variableLocal>
      </v-text-field>
      <v-slider
          v-model="variableLocal"
          class="align-center"
          :max="255"
          :min="0"
          hide-details
          @change="updateNV(variableLocal)"
      >

        <template v-slot:prepend>
          <v-icon color="blue" @click="updateNV(variableLocal-1)">
            mdi-minus
          </v-icon>
        </template>
        <template v-slot:append>
          <v-icon color="blue" @click="updateNV(variableLocal+1)">
            mdi-plus
          </v-icon>
        </template>
      </v-slider>
      </v-card>`
})

Vue.component('node-variable-select', {
    name: "node-variable-select",
    props: ["nodeId", "varId", "name", "items"],
    data: () => ({
        label: "",
        variableLocal: 0
    }),
    mounted() {
        this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function () {
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId": this.varId,
                "variableValue": this.variableLocal
            })
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat>
      <v-select
          :label="label"
          v-model="variableLocal"
          outlined
          @change="updateNV"
          :items="items"
      >
      </v-select>
      </v-card>`
})

Vue.component('node-variable-bit-array', {
    name: "node-variable-bit-array",
    props: ["nodeId", "varId", "name"],
    template: `
      <v-card class="xs6 md3 pa-3" flat>
      <div>{{ name }}</div>
      <v-row>
        <node-variable-bit v-for="n in [0,1,2,3,4,5,6,7]"
                           :key="n"
                           v-bind:nodeId="nodeId"
                           :varId="varId"
                           :bit="n"
                           :name="(n+1).toString()">
        </node-variable-bit>
      </v-row>
      </v-card>`
})

Vue.component('nodeVariable2', {
    name: "nodeVariable2",
    template: `<h1>Node Variable Component 2</h1>`
})

Vue.component('node-variable-slider2', {
    name: "node-variable-slider2",
    props: ["nodeId", "varId", "name", "max", "min", "step", "multi"],
    data: () => ({
        rules: [
            value => value >= this.min || 'Cannot be a negative number',
            value => value <= this.max || 'Number to High'
        ],
        label: "",
        variableLocal: 0,
        displayLocal:0,
        multiplier : 1,
        minimum : 0,
        maximum :255
    }),
    mounted() {
        this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
        if (this.multi !== undefined){
            this.multiplier = this.multi
        }
        if (this.max !== undefined){
            this.maximum = this.max
        }
        if (this.min !== undefined){
            this.minimum = this.min
        }
        this.displayLocal = this.$store.state.nodes[this.nodeId].variables[this.varId] * this.multi
    },
    watch: {
        variableValue() {
            this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
            this.displayLocal = this.$store.state.nodes[this.nodeId].variables[this.varId] * this.multiplier
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function (position) {
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId": this.varId,
                "variableValue": position
            })
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat>
      <v-text-field
          :label="label"
          readonly
          :value=displayLocal>
      </v-text-field>
      <v-slider
          v-model="variableLocal"
          class="align-center"
          :max="maximum"
          :min="minimum"
          :step="step"
          hide-details
          @change="updateNV(variableLocal)"
      >

        <template v-slot:prepend>
          <v-icon color="blue" @click="updateNV(variableLocal-1)">
            remove
          </v-icon>
        </template>
        <template v-slot:append>
          <v-icon color="blue" @click="updateNV(variableLocal+1)">
            add
          </v-icon>
        </template>
      </v-slider>
      </v-card>`
})

Vue.component('node-variable-dual', {
    name: "node-variable-dual",
    props: ["nodeId", "varId1", "varId2", "name"],
    data: () => ({
        rules: [
            value => value >= 0 || 'Cannot be a negative number',
            value => value <= 62000 || 'Number to High'
        ],
        label: "",
        variableLocal: 0
    }),
    mounted() {
        this.variableLocal = (this.$store.state.nodes[this.nodeId].variables[this.varId1] << 8) + this.$store.state.nodes[this.nodeId].variables[this.varId2]
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            this.variableLocal = (this.$store.state.nodes[this.nodeId].variables[this.varId1] << 8) + this.$store.state.nodes[this.nodeId].variables[this.varId2]
        }
    },
    computed: {
        variableValue: function () {
            return (this.$store.state.nodes[this.nodeId].variables[this.varId1] << 8) + this.$store.state.nodes[this.nodeId].variables[this.varId2]
        }
    },
    methods: {
        updateNV: function () {
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId": this.varId1,
                "variableValue": this.variableLocal >> 8
            })
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId": this.varId2,
                "variableValue": this.variableLocal & 0xFF
            })
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat>
      <v-text-field
          :label="label"
          v-model="variableLocal"
          outlined
          :rules="rules"
          @change="updateNV"
      >
      </v-text-field>
      </v-card>`
})

Vue.component('node-variable2', {
    name: "node-variable2",
    props: ["nodeId", "varId", "name", "max", "min", "text"],
    data: () => ({
        /*rules: [
            value => value >= 0 || 'Cannot be a negative number',
            value => value <= 255 || 'Number to High'
        ],*/
        maximum: 255,
        minimum: 0,
        label: "",
        variableLocal: 0,
    }),
    mounted() {
        if (this.max !== undefined) {
            this.maximum = this.max
        }
        if (this.min !== undefined) {
            this.minimum = this.min
        }
        this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        if (this.name) {
            this.label = this.name
        } else {
            this.label = `Variable ${this.varId}`
        }
    },
    watch: {
        variableValue() {
            this.variableLocal = this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    computed: {
        variableValue: function () {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function () {
            if (this.variableLocal >= this.minimum && this.variableLocal <= this.maximum) {
                this.$root.send('UPDATE_NODE_VARIABLE', {
                    "nodeId": this.nodeId,
                    "variableId": this.varId,
                    "variableValue": this.variableLocal
                })
            }
        }
    },
    template: `
      <v-container fluid>
      <v-row>
        <v-col cols="2">
          <v-row>
            <!--          <div>{{ label }}</div>-->

            <v-text-field
                :label="label"
                v-model="variableLocal"
                outlined
                :rules="[value => value >= this.minimum || 'Number to low',
            value => value <= this.maximum || 'Number to High']"
                @change="updateNV"
            >
            </v-text-field>
          </v-row>
        </v-col>
        <v-col align="start" justify="start" class="mx-0" cols="8">
          <div align="start" justify="start" class="grey--text ml-4">{{ this.text }}</div>

        </v-col>
      </v-row>
      </v-container>
    `
})

Vue.component('node-variable-byteslider', {
    name: "node-variable-byteslider",
    props: ["nodeVariableIndex", "title", "units", "scaling"],
    data: function () {
        return {
            variableLocal: 0,
            sliderValue: 0,
            max: Math.floor(255 * this.scaling),
            min: 0,
        }
    },
    mounted() {
        this.updateVariables()
    },
    watch: {
        variableValue() {
            this.updateVariables()
        }
    },
    computed: {
		nodeId: function () {
			return this.$store.state.selected_node_id;
		},
        variableValue: function () {
            return this.$store.state.nodes[this.$store.state.selected_node_id].variables[this.nodeVariableIndex]
        },
    },
    methods: {
        updateVariables() {
            this.sliderValue = this.variableValue * this.scaling
            this.min = 0
        },
        updateNV: function () {
            this.variableLocal = this.sliderValue / this.scaling;
            this.$root.send('UPDATE_NODE_VARIABLE', {
                "nodeId": this.nodeId,
                "variableId":this.nodeVariableIndex,
                "variableValue": this.variableLocal
            })
        }
    },
    template: `
      <v-card class="xs6 md3 pa-3" flat max-width="344" min-width="350">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-subtitle>{{ sliderValue }} {{ units }}</v-card-subtitle>
      <v-card-text>
        <v-slider
            v-model="sliderValue"
            class="align-center"
            :max="max"
            :min="min"
            step="1"
            tick-size="4"
            hide-details
            @change="updateNV()"
        >
          <template v-slot:prepend>
            <v-icon color="blue" @click="updateNV()">
              mdi-minus
            </v-icon>
          </template>
          <template v-slot:append>
            <v-icon color="blue" @click="updateNV()">
              mdi-plus
            </v-icon>
          </template>
        </v-slider>
      </v-card-text>
      </v-card>
    `
})


