Vue.component('home', {
    name: "home",
    //props: ['nodeId'],
    template: `
        <v-container>
        <v-col align="center">
            <v-row>
                <v-flex xs12>
                    <v-img
                            src="assets/merg_logo.png"
                            class="my-3"
                            contain
                            height="200"
                    ></v-img>
                </v-flex>
            </v-row>
            <v-row align="center">
                <v-flex mb-4>
                    <h1 class="display-2 font-weight-bold mb-3">
                        Web FCU Project
                    </h1>
                    <p class="subheading font-weight-regular">
                        This is a proof of concept for a Web based FCU.
                        <br>
                    </p>
                </v-flex>
            </v-row>
        </v-col>
    </v-container>
`
})

