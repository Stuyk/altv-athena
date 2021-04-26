const appBank = Vue.component('app-bank', {
    props: ['data'],
    data() {
        return {
            updated: 0,
            playerRules: [
                (v) => !!v || 'This field is required',
                (v) => v.length >= 1 || 'ID must be at least one value.'
            ],
            withdrawRules: [
                (v) => !!v || 'This field is required',
                (v) => v > 0 || 'Value must be greater than zero.',
                (v) => v < Number.MAX_SAFE_INTEGER || 'Value must be less than max integer value.',
                (v) => v <= this.data.bank || 'Amount must not be greater than your bank account.'
            ],
            playerAmount: 0,
            playerID: '',
            showBankTransfer: false,
            showCashTransfer: false,
            processing: false
        };
    },
    watch: {
        playerAmount(data) {
            this.updated += 1;
            this.playerAmount = data;
        },
        playerID(data) {
            this.updated += 1;
            this.playerID = data;
        }
    },
    methods: {
        validateForm() {
            if (!this.$refs.form) {
                return false;
            }

            return this.$refs.form.validate();
        },
        transfer() {
            this.processing = true;

            if (!('alt' in window)) {
                return;
            }

            const type = this.showBankTransfer ? 'bank' : 'cash';
            alt.emit('phone:Event', 'phone:ATM:Transfer', type, this.playerAmount, this.playerID);
        },
        endProcess() {
            this.processing = false;
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('phone:ATM:Process', this.endProcess);
            alt.emit('phone:ATM:Populate');
        }
    },
    beforeDestroy() {
        if (!('alt' in window)) {
            return;
        }

        alt.off('phone:ATM:Process', this.endProcess);
    },
    template: `
        <div class="app-bank">
            <div class="app-wrapper">
                <div class="header">
                    <div class="subtitle-2">Bank of Los Santos</div>
                </div>
                <div class="main-screen pa-2">
                    <template v-if="!processing">
                        <v-card>
                            <template v-if="!showBankTransfer">
                                <v-card-title class="font-weight-black">
                                    \${{ data.bank.toFixed(2).toLocaleString() }}
                                </v-card-title>
                                <v-card-subtitle class="font-weight-black"> Bank Balance </v-card-subtitle>
                                <v-card-actions>
                                    <button
                                        @click="showBankTransfer = true; showCashTransfer = false;"
                                        class="font-weight-black flex-grow-1 light-blue--text text--lighten-2"
                                        outlined
                                    >
                                        Transfer
                                    </button>
                                </v-card-actions>
                            </template>
                            <template v-else>
                                <v-card-title class="font-weight-black">
                                    \${{ data.bank.toFixed(2).toLocaleString() }}
                                </v-card-title>
                                <v-card-subtitle class="font-weight-black"> Transfer From Bank Account </v-card-subtitle>
                                <v-form ref="form">
                                    <v-divider></v-divider>
                                    <div class="pa-2">
                                        <v-text-field
                                            class="font-weight-black"
                                            label="Player ID"
                                            :rules="playerRules"
                                            v-model="playerID"
                                        ></v-text-field>
                                    </div>
                                    <v-divider></v-divider>
                                    <div class="pa-2">
                                        <v-text-field
                                            class="font-weight-black"
                                            label="Amount from Bank"
                                            :rules="withdrawRules"
                                            v-model="playerAmount"
                                        ></v-text-field>
                                    </div>
                                    <v-divider></v-divider>
                                </v-form>
                                <v-card-actions>
                                    <button
                                        @click="showBankTransfer = false"
                                        class="font-weight-black flex-grow-1 orange--text text--lighten-2"
                                        outlined
                                    >
                                        Back
                                    </button>
                                    <button
                                        class="font-weight-black flex-grow-1 green--text text--lighten-2"
                                        outlined
                                        v-if="validateForm()"
                                        @click="transfer"
                                    >
                                        Accept
                                    </button>
                                </v-card-actions>
                            </template>
                        </v-card>
                        <v-card class="mt-2">
                            <template v-if="!showCashTransfer">
                                <v-card-title class="font-weight-black">
                                    \${{ data.cash.toFixed(2).toLocaleString() }}
                                </v-card-title>
                                <v-card-subtitle class="font-weight-black"> Cash Balance </v-card-subtitle>
                                <v-card-actions>
                                    <button
                                        @click="showCashTransfer = true; showBankTransfer = false;"
                                        class="font-weight-black flex-grow-1 light-blue--text text--lighten-2"
                                        outlined
                                    >
                                        Transfer
                                    </button>
                                </v-card-actions>
                            </template>
                            <template v-else>
                                <v-card-title class="font-weight-black">
                                    \${{ data.cash.toFixed(2).toLocaleString() }}
                                </v-card-title>
                                <v-card-subtitle class="font-weight-black"> Transfer From On-Hand Cash </v-card-subtitle>
                                <v-form ref="form">
                                    <v-divider></v-divider>
                                    <div class="pa-2">
                                        <v-text-field
                                            class="font-weight-black"
                                            label="Player ID"
                                            :rules="playerRules"
                                            v-model="playerID"
                                        ></v-text-field>
                                    </div>
                                    <v-divider></v-divider>
                                    <div class="pa-2">
                                        <v-text-field
                                            class="font-weight-black"
                                            label="Amount from Wallet"
                                            :rules="withdrawRules"
                                            v-model="playerAmount"
                                        ></v-text-field>
                                    </div>
                                    <v-divider></v-divider>
                                </v-form>
                                <v-card-actions>
                                    <button
                                        @click="showCashTransfer = false"
                                        class="font-weight-black flex-grow-1 orange--text text--lighten-2"
                                        outlined
                                    >
                                        Back
                                    </button>
                                    <button
                                        class="font-weight-black flex-grow-1 green--text text--lighten-2"
                                        outlined
                                        v-if="validateForm()"
                                        @click="transfer"
                                    >
                                        Accept
                                    </button>
                                </v-card-actions>
                            </template>
                        </v-card>
                    </template>
                    <template v-if="processing">
                        <div class="d-flex justify-center align-center flex-grow-1">
                            <v-icon x-large class="spinner white--text text--lighten-2">icon-spinner</v-icon>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    `
});
