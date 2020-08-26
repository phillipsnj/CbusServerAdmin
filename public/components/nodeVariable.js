Vue.component('node-variable', {
    name: "node-variable",
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
        variableValue: function() {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function () {
            this.$root.send('NVSET', {
                "nodeId": this.nodeId,
                "variableId": this.varId,
                "variableValue": this.variableLocal
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
            console.log(` set `)
            this.checked = this.$store.state.nodes[this.nodeId].variables[this.varId] & this.bitArray[this.bit] ? true : false
        }
    },
    computed: {
        variableValue: function() {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function () {
            let value = this.$store.state.nodes[this.nodeId].variables[this.varId]
            if (this.checked) {
                value = value + this.bitArray[this.bit]
            } else {
                value = value - this.bitArray[this.bit]
            }
            this.$root.send('NVSET', {
                "nodeId": this.nodeId,
                "variableId": this.varId,
                "variableValue": value
            })
            console.log(`Stored : ${this.$store.state.nodes[this.nodeId].variables[this.varId]}`)
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
        variableValue: function() {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function (position) {
            this.$root.send('NVSET', {
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
                    :max="234"
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
        variableValue: function() {
            return this.$store.state.nodes[this.nodeId].variables[this.varId]
        }
    },
    methods: {
        updateNV: function () {
            this.$root.send('NVSET', {
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

Vue.component('nodeVariable2', {
    name: "nodeVariable2",
    template: `<h1>Node Variable Component 2</h1>`
})