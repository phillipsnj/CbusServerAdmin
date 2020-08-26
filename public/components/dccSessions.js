Vue.component('dcc-sessions', {
    name: "dcc-sessions",
    //props: ['events'],
    data: function () {
        return {
            headers: [
                {text: 'id', value: 'id'},
                {text: 'loco', value: 'loco'},
                {text: 'status', value: 'status'},
                {text: 'direction', value: 'direction'},
                {text: 'speed', value: 'speed'},
                {text: 'count', value: 'count'},
                {text: 'F1', value: 'F1'},
                {text: 'F2', value: 'F2'},
                {text: 'F3', value: 'F3'},
                {text: 'functions', value: 'functions'}
            ]
        }
    },
    template: `
      <div>
      <v-container>
        <v-toolbar light>
          <v-toolbar-title>DCC Sessions</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!--<v-btn color="success" v-on:click="QNN">QNN()</v-btn>-->
          </v-toolbar-items>
        </v-toolbar>
        <v-data-table :headers="headers" :items="Object.values(this.$store.state.dccSessions)" item-key="id"
                      class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.loco }}</td>
            <td>{{ props.item.status }}</td>
            <td>{{ props.item.direction }}</td>
            <td>{{ props.item.speed }}</td>
            <td>{{ props.item.count }}</td>
            <td>{{ props.item.F1 }}</td>
            <td>{{ props.item.F2 }}</td>
            <td>{{ props.item.F3 }}</td>
            <td>{{ props.item.functions }}</td>
          </template>
        </v-data-table>
        <h3>CBUS Errors</h3>
        <div v-for="dccSession in this.$store.state.dccSessions" :key="dccSession.id">
          <p>{{ JSON.stringify(dccSession) }}</p>
        </div>
      </v-container>
      </div>

    `
})