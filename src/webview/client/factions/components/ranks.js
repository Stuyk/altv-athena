const RanksComponent = Vue.component('ranks', {
    props: ['faction', 'flags', 'locales'],
    data() {
        return {
            rankName: '',
            permissions: 0,
            permissionsRank: -1,
            changeRankNameIndex: -1,
            updatedRankName: ''
        };
    },
    methods: {
        factionUpdate(updatedFactionData) {
            if (this.permissionsRank === -1) {
                return;
            }

            const rank = updatedFactionData.ranks[this.permissionsRank];
            this.permissions = rank.permissions;
        },
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

            console.log(this.permissions);
            console.log(this.permissionsRank);
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
        goBack() {
            this.permissions = 0;
            this.permissionsRank = -1;
        },
        typing() {
            if (this.rankName.length > 36) {
                this.rankName = this.rankName.substr(0, 36);
                return;
            }
        },
        isFlagEnabled(flags, otherFlags) {
            return isFlagEnabled(flags, otherFlags);
        },
        toggleFlag(flag) {
            if (this.isFlagEnabled(this.permissions, flag)) {
                this.permissions -= flag;
            } else {
                this.permissions += flag;
            }

            if (!('alt' in window)) {
                console.log(this.permissions);
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.SetPermissions, this.permissionsRank, this.permissions);
        },
        toggleEditor(index) {
            this.updatedRankName = '';
            this.changeRankNameIndex = index;
        },
        finishRankNameChange() {
            if (this.updatedRankName <= 3) {
                return;
            }

            const newName = this.updatedRankName;
            const selectedRank = this.changeRankNameIndex;

            this.changeRankNameIndex = -1;
            this.updatedRankName = '';

            if (!('alt' in window)) {
                console.log(this.permissions);
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.SetRankName, selectedRank, newName);
        },
        cancelRankNameChange() {
            this.updatedRankName = '';
            this.changeRankNameIndex = -1;
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
                        <div class="cell overline">
                            <template v-if="changeRankNameIndex === index">
                                <div class="split-auto">
                                    <v-text-field
                                        placeholder="Rank Name to Change (Min: 4, Max: 36)"
                                        v-model="updatedRankName"
                                        autocomplete="off"
                                        @keyup="typing"
                                        type="string"
                                        style="max-width: 350px"
                                        single-line
                                        dense
                                    />
                                    <div class="small-icon hoverable hover-green ml-2" @click="finishRankNameChange">
                                        <v-icon color="green" class="pl-2 pr-2" small>icon-checkmark</v-icon>
                                    </div>
                                    <div class="small-icon hoverable hover-red" @click="cancelRankNameChange">
                                        <v-icon color="red" class="pl-2 pr-2" small>icon-cancel</v-icon>
                                    </div>
                                </div>
                            </template>
                            <template v-else> {{ rank.name }} </template>
                        </div>
                        <div class="cell options split-auto">
                            <!-- Edit Rank Name -->
                            <div class="small-icon hoverable" @click="toggleEditor(index)" v-if="rank.canRenameRank">
                                <v-icon small class="pl-1 pr-1">icon-edit</v-icon>
                            </div>
                            <div class="small-icon no-hover" v-else>
                                <v-icon color="grey darken-2" class="pl-1 pr-1" small>icon-edit</v-icon>
                            </div>

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
                            <div
                                class="small-icon hoverable hover-green"
                                @click="togglePermissions(index)"
                                v-if="rank.canChangeRankPerms"
                            >
                                <v-icon color="green" class="pl-1 pr-1" small>icon-checkmark</v-icon>
                            </div>
                            <div class="small-icon no-hover" v-else>
                                <v-icon color="grey darken-2" class="pl-1 pr-1" small>icon-checkmark</v-icon>
                            </div>

                            <!-- Remove Rank -->
                            <div
                                class="small-icon hoverable hover-red"
                                @click="removeRank(index)"
                                v-if="rank.canRemoveRank"
                            >
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
                    <div class="small-icon hoverable orange--text hover-orange" @click="goBack">
                        <v-icon> icon-chevron-left </v-icon>
                    </div>
                    <div class="overline">Updating Permission(s) for {{ faction.ranks[permissionsRank].name }}</div>
                </div>
                <div class="table mt-4">
                    <div class="row headers">
                        <div class="cell font-weight-black overline" style="text-align: center">Flag Name</div>
                        <div class="cell font-weight-black overline" style="text-align: center">Status</div>
                        <div class="cell font-weight-black overline" style="text-align: center">Options</div>
                    </div>
                    <div v-for="(key, index) in Object.keys(flags)" :key="index" class="row">
                        <template v-if="!isNaN(flags[key])">
                            <span class="cell" style="text-align: center"> {{ key }} ({{ flags[key] }}) </span>
                            <span class="cell" style="text-align: center">
                                <v-icon color="green" v-if="isFlagEnabled(permissions, flags[key])" small>
                                    icon-checkmark
                                </v-icon>
                                <v-icon color="red" v-else small> icon-cancel-circle </v-icon>
                            </span>
                            <div class="cell options split-auto">
                                <div
                                    class="small-icon hoverable orange--text hover-orange"
                                    @click="toggleFlag(flags[key])"
                                    style="width: 100%"
                                    v-if="isFlagEnabled(permissions, flags[key])"
                                >
                                    DISABLE
                                </div>
                                <div
                                    class="small-icon hoverable green--text hover-green"
                                    @click="toggleFlag(flags[key])"
                                    style="width: 100%"
                                    v-else
                                >
                                    ENABLE
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    `
});
