Vue.component('tab-done', {
    props: ['data', 'nodiscard', 'noname', 'infodata', 'totalcharacters'],
    computed: {
        isNoDiscord() {
            return this.nodiscard;
        }
    },
    methods: {
        saveCharacter() {
            if (this.data.sex === 0) {
                this.data.facialHair = 29;
                this.data.facialHairColor1 = 0;
            }

            if ('alt' in window) {
                alt.emit('creator:Done', this.data, this.infodata, this.infodata.name);
            }
        },
        discardCharacter() {
            if ('alt' in window) {
                alt.emit('creator:Cancel');
            }
        }
    },
    template: `
        <v-container class="containerHelper transparent">
            <div class="d-flex flex-column justify-space-between" block fluid>
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        Does this look correct?
                    </span>
                    <v-list class="transparent">
                        <v-list-item>
                            <v-list-item-content>
                                Name: {{ infodata.name }}
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>    
                                Age: {{ infodata.age }}
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                Gender: {{ infodata.gender }}
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
                <div class="d-flex flex-row">
                    <v-tooltip bottom nudge-bottom="8px" color="error lighten-2" v-if="totalcharacters >= 1">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn @click="discardCharacter" class="error--text flex-grow-1 mr-3" outlined text v-bind="attrs" v-on="on">
                                <v-icon small>icon-times</v-icon>
                            </v-btn>
                        </template>
                        <span>Discard Character</span>
                    </v-tooltip>
                    <v-tooltip bottom nudge-bottom="8px" color="green lighten-2">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn @click="saveCharacter" class="green--text text--lighten-2 flex-grow-1" outlined text v-bind="attrs" v-on="on">
                                <v-icon small>icon-save</v-icon>
                            </v-btn>
                        </template>
                    <span>Save Character</span>
                    </v-tooltip>
                </div>
            </div>
        </v-container>
    `
});
