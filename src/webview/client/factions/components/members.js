const MembersComponent = Vue.component('members', {
    props: ['faction', 'locales'],
    data() {
        return {};
    },
    methods: {
        rankUp(playerID, actualRank) {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.SetMemberRank, playerID, actualRank - 1);
        },
        rankDown(playerID, actualRank) {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.SetMemberRank, playerID, actualRank + 1);
        },
        kickMember(playerID) {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.RemoveMember, playerID);
        },
        organizeByRank(players) {
            if (!players) {
                return [];
            }

            return players.sort((a, b) => {
                return a.rank - b.rank;
            });
        }
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1 pa-6">
                <div class="table">
                    <div class="id font-weight-black overline">ID</div>
                    <div class="name font-weight-black overline">Name</div>
                    <div class="rank font-weight-black overline">Rank</div>
                    <div class="options font-weight-black overline">Options</div>
                    <!-- Split Here -->
                    <template v-for="(player, index) in faction.players" :key="index">
                        <div class="id">{{ player.id }}</div> 
                        <div class="name">{{ player.name.replace('_', ' ') }}</div>
                        <div class="rank">({{ player.rank }}) {{ faction.ranks[player.rank].name }}</div>
                        <div class="options split">
                            <template v-if="index !== 0">
                                <template v-if="player.rank !== 1">
                                    <div class="small-icon" @click="rankUp(player.id, player.rank)">
                                        <v-icon>icon-chevron-up</v-icon>
                                    </div>
                                </template>
                                <template v-if="player.rank !== faction.ranks.length - 1">
                                    <div class="small-icon" @click="rankDown(player.id, player.rank)">
                                        <v-icon>icon-chevron-down</v-icon>
                                    </div>
                                </template>
                                <div class="small-icon kick" @click="kickMember(player.id)">
                                    <v-icon small>icon-user-times</v-icon>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    `
});
