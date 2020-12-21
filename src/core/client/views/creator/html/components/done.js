Vue.component('tab-done', {
    props: ['data', 'nodiscard', 'noname', 'infodata'],
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
                alt.emit('creator:Done', this.data, this.infodata);
            }
        },
        discardCharacter() {
            if ('alt' in window) {
                alt.emit('creator:Cancel');
            }
        }
    },
    template: `
        <v-container class="containerHelper">
            <div class="d-flex flex-column">
                <p class="text-sm-left flex-grow-1 font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Does this look correct?
                </p>
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            Name: {{ data.name }}
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
            </div>
            <v-divider></v-divider>
            <div class="d-flex flex-row">
                <v-tooltip bottom nudge-bottom="8px" color="error lighten-2">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="discardCharacter" class="full flex-grow-1 mt-6 elevation-0" color="error lighten-2" outlined text v-bind="attrs" v-on="on">
                            <v-icon small>fa-times</v-icon>
                        </v-btn>
                    </template>
                    <span>Discard Character</span>
                </v-tooltip>
                <v-tooltip bottom nudge-bottom="8px" color="green lighten-2">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="saveCharacter" class="full flex-grow-1 ml-3 mt-6 elevation-0" color="green lighten-2" outlined text v-bind="attrs" v-on="on">
                            <v-icon small>fa-save</v-icon>
                        </v-btn>
                    </template>
                <span>Save Character</span>
                </v-tooltip>
            </div>
        </v-container>
    `
});
