Vue.component('events_list', {
    name: "events_list",
    // props: ['events'],
    data: function () {
        return {
            headers:[
                {text: 'id', value: 'id'},
                {text: 'type', value: 'type'},
                {text: 'nodeId', value: 'nodeId'},
                {text: 'eventId', value: 'eventId'},
                {text: 'status', value: 'status'}
            ]
        }
    },
    methods: {
        QNN: function(){
            socket.emit('QNN')
        }
    },
    template: `<div>
                    <v-btn color="success" v-on:click="QNN">QNN()</v-btn>
                    <v-data-table :headers="headers" :items="this.$root.events" item-key="id" class="elevation-1" >
                        <template v-slot:items="props">
                            <td>{{ props.item.id }}</td>
                            <td>{{ props.item.type }}</td>
                            <td>{{ props.item.nodeId }}</td>
                            <td>{{ props.item.eventId }}</td>
                            <td>{{ props.item.status }}</td>
                        </template>
                    </v-data-table>
                        <h3>Raw Event Data</h3>
                        <div v-for="event in this.$root.events" :key="event.id">
                            <p>{{ JSON.stringify(event) }}</p>
                        </div>
                   </div>
                   `
})

