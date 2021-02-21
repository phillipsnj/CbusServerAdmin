const socket = io()

Vue.use(Vuetify)

Vue.use(Vuex)

const vuetifyOptions = {
    icons: {
        iconfont: 'md'
    }
}

const store = new Vuex.Store({
    state: {
        nodes: [],
        events: [],
        cbusErrors:[],
        dccErrors:[],
        cbusNoSupport:[],
		cbusTraffic: [],
        dccSessions:[],
        raw:{},
        layout:{},
        programNodeEvent: "",
        display_component: "nodes-list",
        node_component: "nodeInfo",
        edit_event_component: "merg-default-node-event-variables",
        selected_node_id: 0,
        selected_action_id: "",
        canmio_happening_actions: {},
        canmio_event_actions: {},
        debug : false,
        colours :["black","red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","blue-grey","grey"]
    }
})

//var socket = io.connect();

socket.on('events', function (data) {
    store.state.events = data;
});

socket.on('nodes', function (data) {
    // console.log(`Nodes Received:${JSON.stringify(data)}`)
    store.state.nodes = data;
});

socket.on('dccError', function (data) {
    // console.log(`Dcc Errors Received:${JSON.stringify(data)}`)
    store.state.dccErrors = data;
});

socket.on('cbusError', function (data) {
    // console.log(`CBUS Errors Received:${JSON.stringify(data)}`)
    store.state.cbusErrors = data;
});

socket.on('cbusNoSupport', function (data) {
    // console.log(`CBUS Errors Received:${JSON.stringify(data)}`)
    store.state.cbusNoSupport = data;
});


socket.on('cbusTraffic', function (data) {
    if (store.state.debug) {
        console.log(`cbusTraffic : ` + data.direction + " " + data.raw + " " + data.translated)
    }
    store.state.cbusTraffic.push(			 
			{
			  name: data.direction,
			  data: data.translated,
			}
	)
	if (store.state.cbusTraffic.length > 20) store.state.cbusTraffic.shift();
});


socket.on('dccSessions', function (data) {
    // console.log(`CBUS Errors Received:${JSON.stringify(data)}`)
    store.state.dccSessions = data;
});

socket.on('layoutDetails', (data) => {
    store.state.layout = data;
})

socket.on('PROGRAM_NODE', function (data) {
    console.log(`PROGRAM_NODE : ` + JSON.stringify(data))
    store.state.programNodeEvent = data;
});


Vue.component('test', {
    template: `<h2>Test Component</h2>`
})

var app = new Vue({
    el: "#app",
    store,
    vuetify: new Vuetify(vuetifyOptions),
    data: {
        display_component:"nodes-list",
        drawer:true,
    },
    methods : {
        send(type, data) {
            socket.emit(type,data)
        }
    }
})