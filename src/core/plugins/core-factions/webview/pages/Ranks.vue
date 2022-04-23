<template>
    <div class="wrapper ranks-wrapper pa-4">
        <!-- Modals -->
        <EditRank v-if="editRank" :rank="editRank" @close="() => startRankEdit(null)" @update="finishRankEdit" />
        <DeleteRank
            v-if="rankToDelete"
            :rank="rankToDelete"
            @close="() => startRankDelete(null)"
            @update="finishRankDelete"
        />
        <AddRank v-bind:faction="faction" v-if="addRank" @close="() => (addRank = false)" @update="finishAddRank" />
        <ManageRank
            :rank="rankPermissionsToManage"
            v-if="rankPermissionsToManage"
            @close="() => (rankPermissionsToManage = null)"
            @update="finishManageRankPermissions"
        />
        <!-- END MODALS -->
        <div class="rank-panel mb-4" v-if="manageRanks">
            <div class="split space-between">
                <div class="overline">Add New Rank?</div>
                <Button class="rank-button" color="green" @click="addRank = true">
                    <Icon :size="14" icon="icon-plus" />
                </Button>
            </div>
        </div>
        <div class="rank-panel mb-4" v-for="(rank, index) in getRanks()" :key="index">
            <div class="split space-between">
                <div class="overline">[ {{ rank.weight <= 9 ? `0${rank.weight}` : rank.weight }} ] {{ rank.name }}</div>
                <div class="split" v-if="manageRanks">
                    <!-- Change Rank Name -->
                    <Button class="rank-button" color="blue" @click="startRankEdit(rank)" help="Edit Rank">
                        <Icon :size="14" icon="icon-pencil1" />
                    </Button>

                    <!-- Change Rank Order -->
                    <template v-if="rank.weight <= 98 && index !== 1">
                        <Button class="rank-button" color="cyan" help="Rank Up" @click="swapRank(rank, true)">
                            <Icon :size="14" icon="icon-arrow-bold-up" />
                        </Button>
                    </template>
                    <template v-else>
                        <Button class="rank-button" :disable="true">
                            <Icon :size="14" icon="icon-arrow-bold-up" />
                        </Button>
                    </template>
                    <template v-if="getRanks().length - 1 !== index && rank.weight <= 98">
                        <Button class="rank-button" color="cyan" help="Rank Down" @click="swapRank(rank, false)">
                            <Icon :size="14" icon="icon-arrow-bold-down" />
                        </Button>
                    </template>
                    <template v-else>
                        <Button class="rank-button" :disable="true">
                            <Icon :size="14" icon="icon-arrow-bold-down" />
                        </Button>
                    </template>

                    <!-- Change Rank Permissions -->
                    <template v-if="rank.weight <= 98 && manageRankPermissions">
                        <Button
                            class="rank-button"
                            color="green"
                            help="Permissions"
                            @click="startManageRankPermissions(rank)"
                        >
                            <Icon :size="14" icon="icon-cog2" />
                        </Button>
                    </template>
                    <template v-else>
                        <Button class="rank-button" :disable="true">
                            <Icon :size="14" icon="icon-cog2" />
                        </Button>
                    </template>

                    <!-- Delete Rank -->
                    <template v-if="rank.weight <= 98">
                        <Button class="rank-button" color="red" @click="startRankDelete(rank)" help="Delete Rank">
                            <Icon :size="14" icon="icon-cross" />
                        </Button>
                    </template>
                    <template v-else>
                        <Button class="rank-button" :disable="true">
                            <Icon :size="14" icon="icon-cross" />
                        </Button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Modal from '@components/Modal.vue';
import Frame from '@components/Frame.vue';
import Toolbar from '@components/Toolbar.vue';

// Local Components
import EditRank from './ranks/EditRank.vue';
import DeleteRank from './ranks/DeleteRank.vue';
import AddRank from './ranks/AddRank.vue';
import ManageRank from './ranks/ManageRank.vue';

import { Faction, FactionRank, RankPermissions } from '../../shared/interfaces';
import { FactionParser } from '../utility/factionParser';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { FACTION_PFUNC } from '../../shared/funcNames';

const ComponentName = 'Ranks';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
        character: String,
    },
    components: {
        Button,
        Icon,
        Modal,
        Frame,
        Toolbar,
        EditRank,
        DeleteRank,
        AddRank,
        ManageRank,
    },
    data() {
        return {
            manageRanks: false,
            manageRankPermissions: false,
            editRank: null,
            rankToDelete: null,
            rankPermissionsToManage: null,
            addRank: false,
        };
    },
    methods: {
        getRanks(): Array<FactionRank> {
            return FactionParser.getFactionRanks(this.faction);
        },
        swapRank(rank: FactionRank, increasingWeight: boolean) {
            const ranks = this.getRanks() as Array<FactionRank>;
            let targetRank: FactionRank = null;
            let changingWeight = rank.weight + (increasingWeight ? 1 : -1);

            while (!targetRank) {
                const foundRank = ranks.find((r) => r.weight === changingWeight);

                if (changingWeight >= 99 || changingWeight === 0) {
                    targetRank = null;
                    break;
                }

                if (!foundRank) {
                    if (increasingWeight) {
                        changingWeight++;
                    } else {
                        changingWeight--;
                    }
                    continue;
                }

                targetRank = foundRank;
            }

            if (!targetRank) {
                return;
            }

            if (!('alt' in window)) {
                console.log(`Swapping ${rank.name} with ${targetRank.name}`);
                return;
            }

            console.log(`Swapping... ${rank.name} with ${targetRank.name}`);
            console.log(rank.uid);
            console.log(JSON.stringify(rank));
            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.SWAP_RANKS, rank.uid, targetRank.uid);
        },
        startRankDelete(rank: FactionRank) {
            if (!rank) {
                this.rankToDelete = null;
                return;
            }

            this.rankToDelete = rank;
        },
        startRankEdit(rank: FactionRank) {
            if (!rank) {
                this.newRankName = '';
                this.editRank = null;
                return;
            }

            this.editRank = rank;
            this.newRankName = this.editRank.name;
        },
        startManageRankPermissions(rank: FactionRank) {
            this.rankPermissionsToManage = rank;
        },
        finishRankEdit(_newRankName: string) {
            const newRankName = _newRankName;
            const rank = this.editRank;
            this.editRank = null;

            if (!rank) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.SET_RANK_NAME, rank.uid, newRankName);
        },
        finishRankDelete() {
            if (!this.rankToDelete) {
                this.rankToDelete = null;
                return;
            }

            const uid = this.rankToDelete.uid;
            this.rankToDelete = null;

            if (!uid) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.REMOVE_RANK, uid);
        },
        finishAddRank(rankName: string, rankWeight: number) {
            this.addRank = false;

            if (!rankName || !rankWeight) {
                return;
            }

            if (!('alt' in window)) {
                console.log(`Adding... ${rankName} with weight ${rankWeight}`);
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.ADD_RANK, rankName, rankWeight);
        },
        finishManageRankPermissions(rankPermissions: RankPermissions) {
            const rankIdentifier = this.rankPermissionsToManage.uid;
            this.rankPermissionsToManage = null;

            if (!('alt' in window)) {
                return;
            }

            alt.emit(
                FACTION_EVENTS.WEBVIEW.ACTION,
                FACTION_PFUNC.SET_RANK_PERMISSIONS,
                rankIdentifier,
                // Have to convert rankPermissions to non-proxy object.
                JSON.parse(JSON.stringify(rankPermissions)),
            );
        },
    },
    mounted() {
        const member = FactionParser.getMember(this.faction, this.character);
        const rank = FactionParser.getRank(this.faction, member);

        this.manageRanks = rank.rankPermissions.manageRanks;
        this.manageRankPermissions = rank.rankPermissions.manageRankPermissions;
    },
});
</script>

<style scoped>
.ranks-wrapper {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    min-height: 75vh;
    max-height: 75vh;
    overflow-y: scroll;
}

.rank-panel {
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    border: 2px solid rgba(28, 28, 28, 1);
    background: rgba(28, 28, 28, 1);
    border-radius: 6px;
    background: rgb(48, 48, 48);
}

.rank-button {
    border-radius: 12px;
}

input {
    align-self: center;
    font-family: 'Roboto', sans-serif;
    background: rgba(12, 12, 12, 1);
    border: 2px solid rgba(36, 36, 36, 1);
    padding: 6px;
    width: 100%;
    box-sizing: border-box;
    color: white;
}

input:focus {
    border-color: rgba(52, 52, 52, 1);
}
</style>
