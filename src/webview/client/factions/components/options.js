const OptionsComponent = Vue.component('options', {
    props: ['faction', 'locales'],
    data() {
        return {
            textFactionName: '',
            matchFactionName: '',
            newOwnerID: ''
        };
    },
    mounted() {},
    methods: {
        changeFactionName() {
            if (this.textFactionName.length <= 3 || this.textFactionName.lenght >= 36) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.SetName, this.textFactionName);
        },
        changeOwner() {
            const target = faction.players.find((p) => p.id === this.newOwnerID);

            if (!target) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.ChangeOwner, this.newOwnerID);
        },
        disbandFaction() {
            if (this.matchFactionName !== this.faction.name) {
                return;
            }

            if (!('alt' in window)) {
                console.log(`Matched for disband...`);
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.Disband, this.matchFactionName);
        }
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1 pa-6">
                <div class="stack">
                    <h1 class="center-header mt-4 mb-6">
                        {{ faction.name }}
                    </h1>
                    <div class="table" v-if="faction">
                        <div class="row headers">
                            <div class="cell font-weight-black overline">Option Name</div>
                            <div class="cell font-weight-black overline"></div>
                            <div class="cell font-weight-black overline">Option</div>
                        </div>
                        <!-- Set Faction Name -->
                        <div class="row" v-if="faction.canChangeName">
                            <div class="cell overline">Set Faction Name</div>
                            <div class="cell overline">Type New Faction Name</div>
                            <div class="cell overline">
                                <div class="split">
                                    <v-text-field
                                        placeholder="Change faction name..."
                                        v-model="textFactionName"
                                        autocomplete="off"
                                        type="string"
                                        dense
                                    />
                                    <div class="small-icon hoverable hover-green" @click="changeFactionName">
                                        <v-icon color="green" class="pl-2 pr-2" small>icon-checkmark</v-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Hand Off Faction -->
                        <div class="row" v-if="faction && faction.players && faction.players[0].id === faction.clientID">
                            <div class="cell overline orange--text" >Hand Off Faction?</div>
                            <div class="cell overline orange--text">Type New Owner ID</div>
                            <div class="cell overline">
                                <div class="split">
                                    <v-text-field
                                        placeholder="Type New Owner's ID"
                                        v-model="newOwnerID"
                                        autocomplete="off"
                                        type="string"
                                        dense
                                    />
                                    <div class="small-icon hoverable hover-red" @click="changeOwner">
                                        <v-icon color="orange" class="pl-2 pr-2" small>icon-checkmark</v-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Disband Faction -->
                        <div class="row" v-if="faction && faction.players && faction.players[0].id === faction.clientID">
                            <div class="cell overline red--text" >Disband Faction?</div>
                            <div class="cell overline red--text">Type Faction Name</div>
                            <div class="cell overline">
                                <div class="split">
                                    <v-text-field
                                        placeholder="Match faction name..."
                                        v-model="matchFactionName"
                                        autocomplete="off"
                                        type="string"
                                        dense
                                    />
                                    <div class="small-icon hoverable hover-red" @click="disbandFaction">
                                        <v-icon color="red" class="pl-2 pr-2" small>icon-checkmark</v-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="overline mt-6" style="text-align: center">If there are no option(s) you may not have permission.</p>
                </div>
            </div>
        </template>
    `
});
