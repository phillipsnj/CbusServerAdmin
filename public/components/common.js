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