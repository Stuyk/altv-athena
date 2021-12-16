<template>
    <div class="members pa-6">
        <input
            class="mb-4 pa-2"
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
            <div
                v-for="(player, index) in searchedPlayers.length ? searchedPlayers : faction.players"
                :key="index"
                class="row"
            >
                <div class="cell id overline selectable">{{ player.id }}</div>
                <div class="cell name">{{ player.name }}</div>
                <div class="cell rank overline">
                    ({{ player.rank }})
                    {{ faction.ranks[player.rank] ? faction.ranks[player.rank].name : 'Rank is Invalid' }}
                </div>
                <div class="cell options split-auto">
                    <!-- Rank Up -->
                    <div class="small-icon hoverable" @click="rankUp(player.id, player.rank)" v-if="player.canRankUp">
                        <Icon icon="icon-chevron-up" :size="12" />
                    </div>
                    <div class="small-icon no-hover" v-else>
                        <Icon class="grey--text" icon="icon-chevron-up" :size="12" />
                    </div>

                    <!-- Rank Down -->
                    <div
                        class="small-icon hoverable"
                        @click="rankDown(player.id, player.rank)"
                        v-if="player.canRankDown"
                    >
                        <Icon icon="icon-chevron-down" :size="12" />
                    </div>
                    <div class="small-icon no-hover" v-else>
                        <Icon class="grey--text" icon="icon-chevron-down" :size="12" />
                    </div>

                    <!-- Kick -->
                    <div
                        class="small-icon hoverable hover-red"
                        @click="kickMember(player.id)"
                        v-if="player.canBeKicked"
                    >
                        <Icon class="red--text" icon="icon-user-times" :size="12" />
                    </div>
                    <div class="small-icon no-hover" v-else>
                        <Icon class="grey--text" icon="icon-user-times" :size="12" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import { ViewEventsFactions } from '../utility/events';

const ComponentName = 'Members';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: {
            type: Object,
            required: true,
        },
        flags: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            search: '',
            searchedPlayers: [],
        };
    },
    components: {
        Button,
        Icon,
    },
    methods: {
        rankUp(playerID, actualRank) {
            if (!('alt' in window)) {
                return;
            }

            this.search = '';
            this.searchedPlayers = [];
            alt.emit('factions:Bus', ViewEventsFactions.SetMemberRank, playerID, actualRank - 1);
        },
        rankDown(playerID, actualRank) {
            if (!('alt' in window)) {
                return;
            }

            this.search = '';
            this.searchedPlayers = [];
            alt.emit('factions:Bus', ViewEventsFactions.SetMemberRank, playerID, actualRank + 1);
        },
        kickMember(playerID) {
            if (!('alt' in window)) {
                return;
            }

            this.search = '';
            this.searchedPlayers = [];
            alt.emit('factions:Bus', ViewEventsFactions.RemoveMember, playerID);
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
        },
    },
});
</script>

<style scoped>
.members {
    overflow-y: scroll;
}

input {
    width: 100%;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(0, 0, 0, 0.1);
    color: white;
    font-family: 'Roboto';
    box-sizing: border-box;
    min-height: 42px;
    max-height: 42px;
}
</style>
