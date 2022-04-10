<template>
    <!-- Rank View -->
    <div class="ranks flex-grow-1 pa-6" v-if="permissionsRank <= -1">
        <div class="split mb-4" v-if="faction.canAddRanks">
            <input
                placeholder="Rank Name to Add (Min: 4, Max: 36)"
                v-model="rankName"
                autocomplete="off"
                @keyup="typing"
                type="string"
                class="pa-2 mr-4"
                dense
            />
            <Button @click="addRank" color="green">
                <span class="green--text">Add</span>
            </Button>
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
                            <input
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
                                <Icon color="green" class="pl-2 pr-2" icon="icon-checkmark" :size="14" />
                            </div>
                            <div class="small-icon hoverable hover-red" @click="cancelRankNameChange">
                                <Icon color="red" class="pl-2 pr-2" icon="icon-cancel" :size="14" />
                            </div>
                        </div>
                    </template>
                    <template v-else> {{ rank.name }} </template>
                </div>
                <div class="cell options split-auto">
                    <!-- Edit Rank Name -->
                    <div class="small-icon hoverable" @click="toggleEditor(index)" v-if="rank.canRenameRank">
                        <Icon class="green--text" icon="icon-edit" :size="14" />
                    </div>
                    <div class="small-icon no-hover" v-else>
                        <Icon class="grey--text" icon="icon-edit" :size="14" />
                    </div>

                    <!-- Move Rank Up -->
                    <div class="small-icon hoverable" @click="moveRankUp(index)" v-if="rank.canMoveRankUp">
                        <Icon icon="icon-chevron-up" :size="14" />
                    </div>
                    <div class="small-icon no-hover" v-else>
                        <Icon class="grey--text" icon="icon-chevron-up" :size="14" />
                    </div>

                    <!-- Move Rank Down -->
                    <div class="small-icon hoverable" @click="moveRankDown(index)" v-if="rank.canMoveRankDown">
                        <Icon icon="icon-chevron-down" :size="14" />
                    </div>
                    <div class="small-icon no-hover" v-else>
                        <Icon class="grey--text" icon="icon-chevron-down" :size="14" />
                    </div>

                    <!-- Manage Permissions -->
                    <div
                        class="small-icon hoverable hover-green"
                        @click="togglePermissions(index)"
                        v-if="rank.canChangeRankPerms"
                    >
                        <Icon class="green--text" icon="icon-checkmark" :size="14" />
                    </div>
                    <div class="small-icon no-hover" v-else>
                        <Icon class="grey--text" icon="icon-checkmark" :size="14" />
                    </div>

                    <!-- Remove Rank -->
                    <div class="small-icon hoverable hover-red" @click="removeRank(index)" v-if="rank.canRemoveRank">
                        <Icon class="red--text" icon="icon-remove" :size="14" />
                    </div>
                    <div class="small-icon no-hover" v-else>
                        <Icon class="grey--text" icon="icon-remove" :size="14" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Permission View -->
    <div class="ranks flex-grow-1 pa-6" v-else>
        <div class="split">
            <div class="small-icon hoverable orange--text hover-orange" @click="goBack">
                <Icon icon="icon-chevron-left" :size="14" />
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
                        <Icon
                            class="green--text"
                            v-if="isFlagEnabled(permissions, flags[key])"
                            icon="icon-checkmark"
                            :size="14"
                        />
                        <Icon color="red" v-else icon="icon-cancel-circle" :size="14" />
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

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';
import { ViewEventsFactions } from '../utility/events';
import { isFlagEnabled } from '../utility/flags';

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
        locales: {
            type: Object,
            required: false,
        },
    },
    data() {
        return {
            rankName: '',
            permissions: 0,
            permissionsRank: -1,
            changeRankNameIndex: -1,
            updatedRankName: '',
        };
    },
    components: {
        Button,
        Icon,
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
            alt.emit('factions:Bus', ViewEventsFactions.ChangeRankOrder, index, false);
        },
        moveRankDown(index) {
            if (!('alt' in window)) {
                console.log(index);
                return;
            }

            // Last parameter is 'moveDown'
            alt.emit('factions:Bus', ViewEventsFactions.ChangeRankOrder, index, true);
        },
        removeRank(index) {
            if (!('alt' in window)) {
                console.log(index);
                return;
            }

            alt.emit('factions:Bus', ViewEventsFactions.RemoveRank);
        },
        addRank() {
            if (!('alt' in window)) {
                console.log(this.rankName);
                return;
            }

            if (this.rankName.length <= 3) {
                return;
            }

            alt.emit('factions:Bus', ViewEventsFactions.AddRank, this.rankName);
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

            alt.emit('factions:Bus', ViewEventsFactions.SetPermissions, rankIndex, flags);
        },
        goBack() {
            this.permissions = 0;
            this.permissionsRank = -1;
        },
        typing() {
            if (this.rankName.length > 36) {
                this.rankName = this.rankName.substring(0, 36);
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

            alt.emit('factions:Bus', ViewEventsFactions.SetPermissions, this.permissionsRank, this.permissions);
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

            alt.emit('factions:Bus', ViewEventsFactions.SetRankName, selectedRank, newName);
        },
        cancelRankNameChange() {
            this.updatedRankName = '';
            this.changeRankNameIndex = -1;
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
