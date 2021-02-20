Vue.component('common-display-json', {
    name: "common-display-json",
    props: ["info"],
    template: `
      <pre>{{
        JSON.stringify(info, function (k, v) {
          if (v instanceof Array)
            return JSON.stringify(v);
          return v;
        }, '\t')
      }}</pre>`
})

Vue.component('common-display-value', {
    name: "common-display-value",
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