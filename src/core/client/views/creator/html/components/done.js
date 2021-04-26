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
        <div class="contentWrapper">
            <div class="group pt-3 pb-3">
                <div class="overline pa-0 ma-0 grey--text">
                    Does this information look correct?
                </div>
            </div>
            <div class="group">
                <v-list class="transparent">
                    <v-list-item>
                        <v-list-item-content> Name: {{ infodata.name }} </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content> Birthday: {{ infodata.age }} </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content> Gender: {{ infodata.gender }} </v-list-item-content>
                    </v-list-item>
                </v-list>
            </div>
            <div class="group">
                <v-tooltip bottom nudge-bottom="8px" color="error lighten-2" v-if="totalcharacters >= 1">
                    <template v-slot:activator="{ on, attrs }">
                        <button
                            @click="discardCharacter"
                            class="error--text flex-grow-1 mr-3"
                            outlined
                            text
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon small>icon-times-circle</v-icon>
                        </button>
                    </template>
                    <span>Discard Character</span>
                </v-tooltip>
                <v-tooltip bottom nudge-bottom="8px" color="green lighten-2">
                    <template v-slot:activator="{ on, attrs }">
                        <button
                            @click="saveCharacter"
                            class="green--text text--lighten-2 flex-grow-1"
                            outlined
                            text
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon small>icon-save</v-icon>
                        </button>
                    </template>
                    <span>Save Character</span>
                </v-tooltip>
            </div>
        </div>

    `
});
