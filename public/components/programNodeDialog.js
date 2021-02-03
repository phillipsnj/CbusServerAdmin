Vue.component('program-node-dialog', {

    data: function () {
        return {
            visible: true,
            nodeNumber: 0,
            moduleName: "",
            moduleType: "",
            cpuType: 0,
            programNodeEventText: "",
            options: [],
            fullFilePath: './tests/test_firmware/shortFile.HEX',
        }
    },

    mounted() {
        this.nodeNumber = this.$store.state.selected_node_id;
        this.moduleType = this.$store.state.nodes[this.$store.state.selected_node_id].module
        this.cpuType = this.$store.state.nodes[this.$store.state.selected_node_id].parameters[9]
        if (this.nodeNumber in this.$store.state.layout.nodeDetails) {
            this.moduleName = this.$store.state.layout.nodeDetails[this.nodeNumber].name
        } else {
            this.moduleName = `${this.nodeNumber}`
        }
    },

    watch: {
        eventText() {
            this.programNodeEventText = this.$store.state.programNodeEvent
        }
    },
    
    computed: {
        eventText: function () {
            return this.$store.state.programNodeEvent
        },        
    },

    methods: {
        close() {
            console.log(`Close programNodeDialog`)
            this.$emit('close-programNodeDialog')
        },
        program() {
            this.programNodeEventText = "Started",
            console.log(`program Node clicked`)

            var flags = 0
            if (this.options.indexOf('CONFIG') > -1) {flags |= 1}
            if (this.options.indexOf('EEPROM') > -1) {flags |= 2}
            if (this.options.indexOf('IgnoreCpuType') > -1) {flags |= 4}

            console.log(`program Node: ` + this.nodeNumber + ' Type: ' + this.cpuType + ' Flags: ' + flags)

            this.$root.send('PROGRAM_NODE', {
                "nodeNumber": this.nodeNumber,
                "cpuType": this.cpuType,
                "file": './tests/test_firmware/shortFile.HEX',
                "flags": flags})
        },
    },
  
    template: `<v-card ref="form">
        <v-card-title class="justify-center">Program Node {{ moduleName }}</v-card-title>
            <v-card-text>
                <v-container class="pa-0">

                    <body-1>Node Type {{ moduleType }}</body-1></br> 
                    <body-1>Node Number {{ nodeNumber }}</body-1></br> 
                    <body-1>CPU Type {{ cpuType }}</body-1></br></br>  

                      <v-checkbox 
                        class="pa-0 ma-0"
                        v-model="options"
                        label="Program CONFIG"
                        value="CONFIG"
                      ></v-checkbox>

                      <v-checkbox
                        class="pa-0 ma-0"
                        v-model="options"
                        label="Program EEPROM"
                        value="EEPROM"
                      ></v-checkbox>

                      <v-checkbox
                        class="pa-0 ma-0"
                        v-model="options"
                        label="Ignore CPU type"
                        value="IgnoreCpuType"
                      ></v-checkbox>

                        <v-text-field 
                            v-model=fullFilePath 
                            outlined>
                        </v-text-field>


                    <v-layout row>
                        <h3>{{ programNodeEventText }}</h3>
                    </v-layout>

                </v-container>
            </v-card-text>
                  
            <v-card-actions>
                <v-btn text @click="close">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="program">Program</v-btn>
            </v-card-actions>
        </v-card>
    `
})


