const RanksComponent = Vue.component('ranks', {
    props: ['faction', 'locales'],
    data() {
        return {};
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
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.RemoveRank, index, false);
        }
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1 pa-6">
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
                            <div class="small-icon" @click="moveRankUp(index)" v-if="rank.canMoveRankUp">
                                <v-icon>icon-chevron-up</v-icon>
                            </div>
                            <div class="small-icon" @click="moveRankDown(index)" v-if="rank.canMoveRankDown">
                                <v-icon>icon-chevron-down</v-icon>
                            </div>
                            <div class="small-icon" @click="removeRank(index)" v-if="rank.canRemoveRank">
                                <v-icon>icon-times-circle</v-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    `
});
