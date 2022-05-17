<template>
    <div class="stack fill-full-width">
        <div class="panel rank-list pa-4 mb-4">
            <div class="setting-header mb-2 pb-2">Claim Time</div>
            <div class="subtitle-2 grey--text text--lighten-1">
                Real life minutes between when a member can claim a pay check. Only applies to next pay check claimed by
                a member. If zero is set; pay checks will be disabled.
            </div>
            <div class="split space-between fill-full-width mb-4">
                <template v-if="isFactionOwner()">
                    <input v-model="claimTime" type="number" />
                    <Button color="green" class="paycheck-button ml-4" @click="updateClaimTime()">
                        <Icon :size="16" icon="icon-update"></Icon>
                    </Button>
                </template>
                <template v-else>
                    <Button color="grey" :disable="true" class="paycheck-button ml-4">
                        <Icon :size="16" icon="icon-update"></Icon>
                    </Button>
                </template>
            </div>
            <div class="setting-header mb-2 pb-2">Salaries</div>
            <div class="rank-panel mb-4" v-for="(rank, index) in getRanks()" :key="index" :name="rank.name">
                <div class="split space-between fill-full-width">
                    <span class="subtitle-2 grey--text text--lighten-1">{{ rank.name }}</span>
                    <div class="split space-between">
                        <template v-if="isFactionOwner()">
                            <span class="subtitle-2 mr-4 grey--text text--darken-1">$</span>
                            <input v-model="ranks[rank.uid]" type="number" />
                            <Button color="green" class="paycheck-button ml-4" @click="updateRankPaycheck(rank.uid)">
                                <Icon :size="16" icon="icon-update"></Icon>
                            </Button>
                        </template>
                        <template v-else>
                            <Button color="grey" :disable="true" class="paycheck-button ml-4">
                                <Icon :size="16" icon="icon-update"></Icon>
                            </Button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Vector3 } from '../../../shared/interfaces/vector';
import { Faction } from '../../core-factions/shared/interfaces';
import { FactionParser } from '../../core-factions/webview/utility/factionParser';
import { F_PAYCHECK_VIEW_EVENTS } from '../shared/events';
import { FactionRank } from '../shared/extensions';

const ComponentName = 'Paychecks';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
        character: String,
        pos: Object as () => Vector3,
        rot: Object as () => Vector3,
        isOwner: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Module: defineAsyncComponent(() => import('@components/Module.vue')),
    },
    data() {
        return {
            claimTime: 0,
            ranks: {} as { [key: string]: FactionRank },
        };
    },
    methods: {
        getRanks(): Array<FactionRank> {
            return FactionParser.getFactionRanks(this.faction);
        },
        updateRankPaycheck(uid: string) {
            const newAmount = this.ranks[uid];

            if (!('alt' in window)) {
                console.log(`Should update to ${newAmount}`);
                return;
            }

            alt.emit(F_PAYCHECK_VIEW_EVENTS.SET_RANK_PAYCHECK, uid, newAmount);
        },
        isFactionOwner() {
            const member = FactionParser.getMember(this.faction, this.character);

            if (!member) {
                return false;
            }

            return member.hasOwnership;
        },
        updateClaimTime() {
            if (!('alt' in window)) {
                console.log(Math.abs(this.claimTime));
                return;
            }

            alt.emit(F_PAYCHECK_VIEW_EVENTS.SET_TIME, Math.abs(this.claimTime));
        },
        dataSetup() {
            this.claimTime = this.faction.settings.paycheckClaimTime ? this.faction.settings.paycheckClaimTime : 0;

            const rankPaycheckData = { ...this.ranks };
            for (let i = 0; i < this.faction.ranks.length; i++) {
                rankPaycheckData[this.faction.ranks[i].uid] = this.faction.ranks[i].paycheck
                    ? this.faction.ranks[i].paycheck
                    : 0;
            }

            this.ranks = rankPaycheckData;
        },
    },
    mounted() {
        if ('alt' in window) {
            this.dataSetup();
            return;
        }

        // This is just to create dummy data for the faction and previewing it.
        const factionClone = { ...this.faction };
        for (let i = 0; i < factionClone.ranks.length; i++) {
            factionClone.ranks[i].paycheck = Math.floor(Math.random() * 6000) || 0;
        }

        factionClone.settings.paycheckClaimTime = 60;
        this.$emit('updateFactionProp', factionClone);
        this.dataSetup();
    },
});
</script>

<style>
.rank-list {
    max-height: 500px;
    overflow-y: scroll;
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

.paycheck-button {
    border-radius: 12px;
}
</style>
