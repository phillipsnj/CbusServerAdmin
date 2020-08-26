Vue.component('cbus-errors', {
    name: "cbus-errors",
    //props: ['events'],
    data: function () {
        return {
            headers: [
                {text: 'id', value: 'id'},
                {text: 'type', value: 'type'},
                {text: 'Error', value: 'Error'},
                {text: 'Message', value: 'Message'},
                {text: 'node', value: 'node'},
                {text: 'count', value: 'count'}
            ]
        }
    },
    template: `
        <div>
            <v-container>
                <v-toolbar light>
                    <v-toolbar-title>CBUS Errors</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <!--<v-btn color="success" v-on:click="QNN">QNN()</v-btn>-->
                    </v-toolbar-items>
                </v-toolbar>
                <v-data-table :headers="headers" :items="Object.values(this.$store.state.cbusErrors)" item-key="id"
                              class="elevation-1">
                    <template v-slot:items="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.type }}</td>
                        <td>{{ props.item.Error }}</td>
                        <td>{{ props.item.Message }}</td>
                        <td>{{ props.item.node }}</td>
                        <td>{{ props.item.count }}</td>
                    </template>
                </v-data-table>
                <h3>CBUS Errors</h3>
                <div v-for="cbusErr in this.$store.state.cbusErrors" :key="cbusErr.id">
                    <p>{{ JSON.stringify(cbusErr) }}</p>
                </div>
            </v-container>
        </div>

    `
})