<template>
    <div class="stack fill-full-width">
        <template v-if="isPayCheckReady && hasSalary()">
            <Button color="green" class="paycheck-button" @click="claim">Claim Paycheck</Button>
        </template>
        <template v-else>
            <span class="subtitle-2 mb-4">{{ (timeLeft / 60000).toFixed(2) }} minutes until next claim.</span>
            <Button color="grey" :disable="true" class="paycheck-button">Claim Paycheck</Button>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Vector3 } from '../../../shared/interfaces/vector';
import { Faction } from '../../core-factions/shared/interfaces';
import { FactionParser } from '../../core-factions/webview/utility/factionParser';
import { FactionRank } from '../shared/extensions';
import { F_PAYCHECK_VIEW_EVENTS } from '../shared/events';

const ComponentName = 'BankPaychecks';
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
            timeLeft: 0,
            isPayCheckReady: false,
        };
    },
    methods: {
        hasSalary() {
            const member = FactionParser.getMember(this.faction, this.character);
            const rank = FactionParser.getRank(this.faction, member) as FactionRank;

            if (rank.paycheck && rank.paycheck >= 1) {
                return true;
            }

            return false;
        },
        setPaycheckTime(value: number) {
            this.timeLeft = value;

            if (value <= 0) {
                this.isPayCheckReady = true;
                return;
            }

            this.isPayCheckReady = false;
        },
        claim() {
            if (!('alt' in window)) {
                console.log(`claiming...`);
                return;
            }

            alt.emit(F_PAYCHECK_VIEW_EVENTS.CLAIM);
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on(F_PAYCHECK_VIEW_EVENTS.SET_TIME, this.setPaycheckTime);
            alt.emit(F_PAYCHECK_VIEW_EVENTS.REQUEST_TIME);
            return;
        }

        // This is just to create dummy data for the faction and previewing it.
        const factionClone = { ...this.faction };
        for (const element of factionClone.ranks) {
            element.paycheck = Math.floor(Math.random() * 6000) || 0;
        }

        factionClone.settings.paycheckClaimTime = 60;
        factionClone.members[this.character].nextPaycheck = 25000;
        this.setPaycheckTime(25000);

        this.$emit('updateFactionProp', factionClone);
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(F_PAYCHECK_VIEW_EVENTS.SET_TIME, this.setPaycheckTime);
            return;
        }
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
