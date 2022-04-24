<template>
    <div class="bank-wrapper pa-4">
        <div class="stack center">
            <div class="split full-split space-between">
                <div class="panel mb-4 pb-4 mr-2">
                    <h1 style="margin-bottom: 0px">${{ faction.bank.toLocaleString() }}</h1>
                    <sup class="grey--text text--lighten-1 pt-2">Faction Balance</sup>
                </div>
                <div class="panel mb-4 pb-4 ml-2">
                    <h1 style="margin-bottom: 0px">${{ money.toLocaleString() }}</h1>
                    <sup class="grey--text text--lighten-1 pt-2">Your Balance</sup>
                </div>
            </div>
            <div class="panel pa-6 mb-4">
                <input v-model="amount" type="number" class="input" placeholder="Amount" />
            </div>
            <div class="split full-split space-between">
                <div class="panel mb-4 mr-2 pa-4">
                    <template v-if="bankAdd && faction.bank >= 1 && isValid">
                        <Button class="bank-button" color="red" @click="withdraw">Withdraw</Button>
                    </template>
                    <template v-else>
                        <Button class="bank-button" :disable="true">Withdraw</Button>
                    </template>
                </div>
                <div class="panel mb-4 ml-2 pa-4">
                    <template v-if="bankRemove && money >= 1 && isValid">
                        <Button class="bank-button" color="blue" @click="deposit">Deposit</Button>
                    </template>
                    <template v-else>
                        <Button class="bank-button" :disable="true">Deposit</Button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Faction } from '../../shared/interfaces';
import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';

import { FactionParser } from '../utility/factionParser';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { FACTION_PFUNC } from '../../shared/funcNames';

const ComponentName = 'Bank';
export default defineComponent({
    name: ComponentName,
    props: {
        faction: Object as () => Faction,
        character: String,
        money: Number,
    },
    components: {
        Button,
        Icon,
    },
    data() {
        return {
            amount: 0,
            bankAdd: true,
            bankRemove: false,
            isValid: false,
        };
    },
    methods: {
        withdraw() {
            if (this.amount > this.faction.bank) {
                return;
            }

            if (this.amount <= 0) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.SUB_BANK, this.amount);
        },
        deposit() {
            if (this.amount > this.money) {
                return;
            }

            if (this.amount <= 0) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit(FACTION_EVENTS.WEBVIEW.ACTION, FACTION_PFUNC.ADD_BANK, this.amount);
        },
    },
    watch: {
        amount() {
            if (this.amount <= 0) {
                this.isValid = false;
                return;
            }

            this.isValid = true;
        },
        faction() {
            const member = FactionParser.getMember(this.faction, this.character);
            const rank = FactionParser.getRank(this.faction, member);

            this.bankAdd = rank.rankPermissions.bankAdd;
            this.bankRemove = rank.rankPermissions.bankRemove;

            this.manageRanks = rank.rankPermissions.manageRanks;
            this.manageRankPermissions = rank.rankPermissions.manageRankPermissions;
        },
    },
    mounted() {
        const member = FactionParser.getMember(this.faction, this.character);
        const rank = FactionParser.getRank(this.faction, member);

        this.bankAdd = rank.rankPermissions.bankAdd;
        this.bankRemove = rank.rankPermissions.bankRemove;

        this.manageRanks = rank.rankPermissions.manageRanks;
        this.manageRankPermissions = rank.rankPermissions.manageRankPermissions;
    },
});
</script>

<style scoped>
.bank-wrapper {
    width: 100%;
    min-height: 75vh;
    max-height: 75vh;
    box-sizing: border-box;
    overflow-y: scroll;
}

.panel {
    width: 100%;
    background: rgba(48, 48, 48, 1);
    border: 2px solid rgba(28, 28, 28, 1);
    border-radius: 6px;
    box-sizing: border-box;
}

.full-split {
    width: 100%;
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

.bank-button {
    border-radius: 6px;
}
</style>
