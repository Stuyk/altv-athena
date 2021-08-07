const RanksComponent = Vue.component('ranks', {
    props: ['faction', 'flags', 'locales'],
    data() {
        return {
            rankName: '',
            permissions: 0,
            permissionsRank: -1
        };
    },
    methods: {
        moveRankUp(index) {
            if (!('alt' in window)) {
                console.log(index);
                return;
            }

            // Last parameter is 'moveDown'
            alt.emit('factions:Bus', View_Events_Factions.ChangeRankOrder, index, false);
        },
        moveRankDown(index) {
            if (!('alt' in window)) {
                console.log(index);
                return;
            }

            // Last parameter is 'moveDown'
            alt.emit('factions:Bus', View_Events_Factions.ChangeRankOrder, index, true);
        },
        removeRank(index) {
            if (!('alt' in window)) {
                console.log(index);
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.RemoveRank);
        },
        addRank() {
            if (!('alt' in window)) {
                console.log(this.rankName);
                return;
            }

            if (this.rankName.length <= 3) {
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.AddRank, this.rankName);
        },
        togglePermissions(rankIndex) {
            this.permissions = this.faction.ranks[rankIndex].permissions;
            this.permissionsRank = rankIndex;
        },
        updatePermissions(rankIndex, flags) {
            this.permissions = 0;
            this.permissionsRank = -1;

            if (!('alt' in window)) {
                console.log(this.rankName);
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.SetPermissions, rankIndex, flags);
        },
        typing() {
            if (this.rankName.length > 36) {
                this.rankName = this.rankName.substr(0, 36);
                return;
            }
        }
    },
    template: `
        <template>
            <!-- Rank View -->
            <div class="wrapper flex-grow-1 pa-6" v-if="permissionsRank <= -1">
                <div class="split" v-if="faction.canAddRanks">
                    <v-text-field
                        placeholder="Rank Name to Add (Min: 4, Max: 36)"
                        v-model="rankName"
                        autocomplete="off"
                        @keyup="typing"
                        type="string"
                        dense
                    />
                    <v-icon @click="addRank" class="ml-6 hoverable">icon-plus</v-icon>
                </div>
                <div class="table">
                    <div class="row headers">
                        <div class="cell font-weight-black overline">Index</div>
                        <div class="cell font-weight-black overline">Name</div>
                        <div class="cell font-weight-black overline">Options</div>
                    </div>
                    <!-- Repeating Rank Info Here -->
                    <div v-for="(rank, index) in faction.ranks" :key="index" class="row">
                        <div class="cell overline">{{ index }}</div>
                        <div class="cell overline">{{ rank.name }}</div>
                        <div class="cell options split-auto">
                            <!-- Move Rank Up -->
                            <div class="small-icon hoverable" @click="moveRankUp(index)" v-if="rank.canMoveRankUp">
                                <v-icon>icon-chevron-up</v-icon>
                            </div>
                            <div class="small-icon no-hover" v-else>
                                <v-icon color="grey darken-2">icon-chevron-up</v-icon>
                            </div>    

                            <!-- Move Rank Down -->
                            <div class="small-icon hoverable" @click="moveRankDown(index)" v-if="rank.canMoveRankDown">
                                <v-icon>icon-chevron-down</v-icon>
                            </div>
                            <div class="small-icon no-hover" v-else>
                                <v-icon color="grey darken-2">icon-chevron-down</v-icon>
                            </div>

                            <!-- Manage Permissions -->
                            <div class="small-icon hoverable" @click="togglePermissions(index)" v-if="rank.canChangeRankPerms">
                                <v-icon color="green">icon-check</v-icon>
                            </div>
                            <div class="small-icon no-hover" v-else>
                                <v-icon color="grey darken-2">icon-check</v-icon>
                            </div>

                            <!-- Remove Rank -->
                            <div class="small-icon hoverable" @click="removeRank(index)" v-if="rank.canRemoveRank">
                                <v-icon color="red">icon-remove</v-icon>
                            </div>
                            <div class="small-icon no-hover" v-else>
                                <v-icon color="grey darken-2">icon-remove</v-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Permission View -->
            <div class="wrapper flex-grow-1 pa-6" v-else>
                <div class="split">
                    <h4 class="mb-2">Updating Permission(s) for {{ faction.ranks[permissionsRank].name }}</h3>
                    <div>save</div>
                </div>
                <div class="table mt-4">
                    <div class="row headers">
                        <div class="cell font-weight-black overline">Flag Name</div>
                        <div class="cell font-weight-black overline">Enable</div>
                        <div class="cell font-weight-black overline">Disable</div>
                    </div>
                    <div v-for="(key, index) in Object.keys(flags)" :key="index" class="row">
                        <template v-if="!isNaN(flags[key])">
                            {{ key }}
                        </template>
                    </div>
                </div>
            </div>
        </template>
    `
});
