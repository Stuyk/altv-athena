const BankComponent = Vue.component('bank', {
    props: ['faction', 'locales'],
    data() {
        return {
            totalCurrency: 0,
            depositAmount: 1,
            withdrawAmount: 1
        };
    },
    methods: {
        factionUpdate() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('factions:GetCurrency');
        },
        setCurrency(totalCurrency) {
            this.totalCurrency = totalCurrency;
        },
        typing() {
            if (this.depositAmount <= 0) {
                this.depositAmount = Math.abs(this.depositAmount);
            }

            if (this.withdrawAmount <= 0) {
                this.withdrawAmount = Math.abs(this.withdrawAmount);
            }
        },
        deposit() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.Deposit, this.depositAmount);
        },
        withdraw() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.Withdraw, this.withdrawAmount);
        }
    },
    mounted() {
        if (!('alt' in window)) {
            this.setCurrency(500000);
            return;
        }

        alt.on('factions:SetCurrency', this.setCurrency);
        alt.emit('factions:GetCurrency');
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1 pa-6">
                <div class="stack-center">
                    <h1 class="center-header mb-6">
                        \${{ faction.bank ? faction.bank.toFixed(2) : parseInt(0).toFixed(2) }}
                    </h1>
                    <div class="split-space-evenly mt-6">
                        <div class="stack" style="min-width: 20vw" v-if="faction.canAddToBank">
                            <h4 class="center-header">Deposit</h4>
                            <v-text-field
                                placeholder="Deposit Amount"
                                v-model="depositAmount"
                                autocomplete="off"
                                type="number"
                                min="1"
                                :max="totalCurrency"
                                @keyup="typing"
                                dense
                            />
                            <div class="small-icon-solo hoverable green--text hover-green mt-6" @click="deposit" style="width: 100%">
                                DEPOSIT
                            </div>
                            <div class="overline mt-2" style="text-align: center; width: 100%;">  
                                Your Money:
                            </div>
                            <div class="overline mt-2" style="text-align: center; width: 100%;">
                                \${{ totalCurrency.toFixed(2) }}
                            </div>
                        </div>
                        <div class="stack" style="min-width: 20vw" v-if="faction.canRemoveFromBank">
                            <h4 class="center-header">Withdraw</h4>
                            <v-text-field
                                placeholder="Withdraw Amount"
                                v-model="withdrawAmount"
                                autocomplete="off"
                                type="number"
                                min="1"
                                max="faction.bank ? faction.bank : 0"
                                @keyup="typing"
                                dense
                            />
                            <div class="small-icon-solo hoverable orange--text hover-orange mt-6" @click="withdraw" style="width: 100%">
                                WITHDRAW
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    `
});
