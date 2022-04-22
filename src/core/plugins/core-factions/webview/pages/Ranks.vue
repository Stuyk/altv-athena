<template>
    <div class="wrapper ranks-wrapper pa-4">
        <Modal v-if="editRank">
            <Frame minWidth="30vw" maxWidth="30vw">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">Editing Rank Name - ({{ editRank.name }})</Toolbar>
                </template>
                <template v-slot:content>
                    <div class="stack">
                        <input class="mb-4" v-model="newRankName" placeholder="New rank name..." />
                        <div class="split">
                            <div style="width: 100%; display: block"></div>
                            <Button class="mt-2" color="red" :style="'border-radius: 6px;'" @click="edit(null)">
                                <Icon :size="14" icon="icon-cross" />
                            </Button>
                            <Button
                                class="ml-4 mt-2"
                                color="green"
                                :style="'border-radius: 6px;'"
                                @click="finishRankEdit()"
                            >
                                <Icon :size="14" icon="icon-checkmark" />
                            </Button>
                        </div>
                    </div>
                </template>
            </Frame>
        </Modal>
        <Modal v-if="rankToDelete">
            <Frame minWidth="30vw" maxWidth="30vw">
                <template v-slot:toolbar>
                    <Toolbar :hideExit="true">Delete Rank? - ({{ rankToDelete.name }})</Toolbar>
                </template>
                <template v-slot:content>
                    <div class="stack">
                        <div class="overline">Are you sure?</div>
                        <div class="split">
                            <div style="width: 100%; display: block"></div>
                            <Button class="mt-2" color="red" :style="'border-radius: 6px;'" @click="deleteRank(null)">
                                <Icon :size="14" icon="icon-cross" />
                            </Button>
                            <Button
                                class="ml-4 mt-2"
                                color="green"
                                :style="'border-radius: 6px;'"
                                @click="finishRankDelete()"
                            >
                                <Icon :size="14" icon="icon-checkmark" />
                            </Button>
                        </div>
                    </div>
                </template>
            </Frame>
        </Modal>
        <div class="rank-panel mb-4" v-for="(rank, index) in getRanks()" :key="index">
            <div class="split space-between">
                <div class="overline">{{ rank.name }} ({{ rank.weight }})</div>
                <div class="split">
                    <Button class="rank-button" color="blue" @click="edit(rank)">
                        <Icon :size="14" icon="icon-pencil1" />
                    </Button>
                    <template v-if="rank.weight <= 98 && index !== 1">
                        <Button class="rank-button" color="cyan">
                            <Icon :size="14" icon="icon-arrow-bold-up" />
                        </Button>
                    </template>
                    <template v-else>
                        <Button class="rank-button" :disable="true">
                            <Icon :size="14" icon="icon-arrow-bold-up" />
                        </Button>
                    </template>
                    <template v-if="getRanks().length - 1 !== index && rank.weight <= 98">
                        <Button class="rank-button" color="cyan">
                            <Icon :size="14" icon="icon-arrow-bold-down" />
                        </Button>
                    </template>
                    <template v-else>
                        <Button class="rank-button" :disable="true">
                            <Icon :size="14" icon="icon-arrow-bold-down" />
                        </Button>
                    </template>

                    <template v-if="rank.weight <= 98">
                        <Button class="rank-button" color="red" @click="deleteRank(rank)">
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

import { Faction, FactionRank } from '../../shared/interfaces';
import { FactionParser } from '../utility/factionParser';

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
    },
    data() {
        return {
            manageRanks: false,
            manageRankPermissions: false,
            editRank: null,
            rankToDelete: null,
            newRankName: '',
        };
    },
    computed: {},
    methods: {
        getRanks(): Array<FactionRank> {
            return FactionParser.getFactionRanks(this.faction);
        },
        edit(rank: FactionRank) {
            if (!rank) {
                this.newRankName = '';
                this.editRank = null;
                return;
            }

            this.editRank = rank;
            this.newRankName = this.editRank.name;
        },
        deleteRank(rank: FactionRank) {
            if (!rank) {
                this.rankToDelete = null;
                return;
            }

            this.rankToDelete = rank;
        },
        finishRankEdit() {
            const newRankName = this.newRankName;
            this.editRank = null;
            this.newRankName = '';
            console.log(newRankName);
        },
        finishRankDelete() {
            if (!this.rankToDelete) {
                this.rankToDelete = null;
                return;
            }

            console.log(`Deleting... ${this.rankToDelete.name}`);
            this.rankToDelete = null;
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
