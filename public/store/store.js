export default new Vuex.Store({
    state: {
        title: 'vue-test',
        subTitle: 'Alpha',
        nodes: [],
        events: [],
        cbusErrors:[],
        dccErrors:[],
        raw:{},
        layout: {},
        display_component: "node_list",
        selected_node_id: 0,
        debug : false,
        colours :["black","red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","blue-grey","grey"]
    },
    mutations: {
        selectNode (state, payload) {
            state.selected_node = payload.node
            state.display_item = payload.component
        },
        selectDisplay (state, payload){
            state.display_item = payload.component
        }
    }
})
