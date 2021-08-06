const MembersComponent = Vue.component('members', {
    props: ['faction', 'locales'],
    data() {
        return {
            search: '',
            searchedPlayers: []
        };
    },
    methods: {
        rankUp(playerID, actualRank) {
            if (!('alt' in window)) {
                return;
            }

            this.search = '';
            this.searchedPlayers = [];
            alt.emit('factions:Bus', View_Events_Factions.SetMemberRank, playerID, actualRank - 1);
        },
        rankDown(playerID, actualRank) {
            if (!('alt' in window)) {
                return;
            }

            this.search = '';
            this.searchedPlayers = [];
            alt.emit('factions:Bus', View_Events_Factions.SetMemberRank, playerID, actualRank + 1);
        },
        kickMember(playerID) {
            if (!('alt' in window)) {
                return;
            }

            this.search = '';
            this.searchedPlayers = [];
            alt.emit('factions:Bus', View_Events_Factions.RemoveMember, playerID);
        },
        organizeByRank(players) {
            if (!players) {
                return [];
            }

            return players.sort((a, b) => {
                return a.rank - b.rank;
            });
        },
        typing() {
            this.searchedPlayers = this.faction.players.filter((x) => {
                if (x.name.includes(this.search)) {
                    return true;
                }

                if (x.rank.toString() === this.search) {
                    return true;
                }

                return false;
            });
        }
    },
    template: `
        <template>
            <div class="wrapper pa-6">
                <v-text-field
                    placeholder="Search for Name, or Rank Index"
                    v-model="search"
                    autocomplete="off"
                    @keyup="typing"
                    type="string"
                    dense
                />
                <div class="table">
                    <div class="row headers">
                        <div class="cell font-weight-black overline">ID</div>
                        <div class="cell font-weight-black overline">Name</div>
                        <div class="cell font-weight-black overline">Rank</div>
                        <div class="cell font-weight-black overline">Options</div>
                    </div>
                    <!-- Repeating Member Info Here -->
                    <div v-for="(player, index) in searchedPlayers.length ? searchedPlayers : faction.players" :key="index" class="row">
                        <div class="cell id overline">{{ player.id }}</div>
                        <div class="cell name">{{ player.name }}</div>
                        <div class="cell rank overline">({{ player.rank }}) {{ faction.ranks[player.rank].name }}</div>
                        <div class="cell options split-auto">
                            <div class="small-icon" @click="rankUp(player.id, player.rank)" v-if="player.canRankUp">
                                <v-icon>icon-chevron-up</v-icon>
                            </div>
                            <div class="small-icon" @click="rankDown(player.id, player.rank)" v-if="player.canRankDown">
                                <v-icon>icon-chevron-down</v-icon>
                            </div>
                            <div class="small-icon kick" @click="kickMember(player.id)" v-if="player.canBeKicked">
                                <v-icon small>icon-user-times</v-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    `
});
