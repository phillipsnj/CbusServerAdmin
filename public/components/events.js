Vue.component('events', {
    name: "events",
    //props: ['events'],
    data: function () {
        return {
            headers: [
                {text: 'id', value: 'id'},
                {text: 'nodeId', value: 'nodeId'},
                {text: 'eventId', value: 'eventId'},
                {text: 'type', value: 'type'},
                {text: 'status', value: 'status'},
                {text: 'count', value: 'count'}
            ]
        }
    },
    template: `<div>
                    <v-toolbar light>
                        <v-toolbar-title>Events</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items >
                            <!--<v-btn color="success" v-on:click="QNN">QNN()</v-btn>-->
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-data-table :headers="headers" :items="this.$store.state.events" item-key="id" class="elevation-1" >
                        <template v-slot:items="props">
                            <td>{{ props.item.id }}</td>
                            <td>{{ props.item.nodeId }}</td>
                            <td>{{ props.item.eventId }}</td>
                            <td>{{ props.item.type }}</td>
                            <td>
                                <v-badge color="red" v-if="props.item.status === 'off'">
                                    <template v-slot:badge>Off</template>
                                </v-badge>
                                <v-badge color="green" v-else>
                                    <template v-slot:badge>On</template>
                                </v-badge>
                            </td>
                            <td>{{ props.item.count }}</td>
                        </template>
                    </v-data-table>
                        <h3>Events</h3>
                        <div v-for="event in this.$store.state.events" :key="event.id">
                            <p>{{ JSON.stringify(event) }}</p>
                        </div>
                   </div>
                   `
})