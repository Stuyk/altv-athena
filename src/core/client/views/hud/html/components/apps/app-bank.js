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
                (v) => v <= this.data.bank || 'Amount must not be greater than your bank account.'
            ],
            playerAmount: 0,
            playerID: ''
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
                return;
            }

            return this.$refs.form.validate();
        },
        transfer() {
            if ('alt' in window) {
                alt.emit('phone:Route', 'atm:Transfer', this.playerID, this.playerAmount);
            }
        }
    },
    mounted() {
        //
    },
    beforeDestroy() {
        if (!('alt' in window)) {
            return;
        }

        // alt.off('hud:HelpText', this.setHelpText);
        // alt.off('hud:HelpState', this.setHelpState);
    },
    template: `
        <div class="app-bank">
            <div class="app-wrapper">
                <div class="header pt-2 pb-2">
                    <div class="subtitle-2">A&nbsp;&nbsp;T&nbsp;&nbsp;H&nbsp;&nbsp;E&nbsp;&nbsp;N&nbsp;&nbsp;A</div>
                </div>
                <div class="main-screen">
                    <div class="split pt-2 pb-2 pl-3 pr-3" style="max-height: 100px">
                        <div class="text-overline flex-grow-1 text-center">
                            Cash 
                                <br/> 
                            \${{ data.cash.toFixed(2).toLocaleString() }}
                        </div>
                        <div class="text-overline flex-grow-1 text-center ml-3">
                            Bank
                                <br/> 
                            \${{ data.bank.toFixed(2).toLocaleString() }}
                        </div>
                    </div>
                    <v-divider></v-divider>
                    <div class="overline font-weight pl-3 grey darken-4">Transfer Bank Balance</div>
                    <v-form ref="form">
                        <div class="pa-3 grey darken-4">
                            <v-text-field
                                class="font-weight-black"
                                label="Player ID"
                                :rules="playerRules"
                                v-model="playerID"
                                ></v-text-field>
                        </div>
                        <div class="pa-3 grey darken-4">
                            <v-text-field
                                class="font-weight-black"
                                label="Amount from Bank"
                                :rules="withdrawRules"
                                v-model="playerAmount"
                                ></v-text-field>
                        </div>
                    </v-form>
                    <v-divider></v-divider>
                    <template v-if="validateForm()">
                        <v-btn @click="transfer" class="font-weight-black light-blue--text text--lighten-2 block ma-6" color="light-blue lighten-2" outlined text>
                            Transfer
                        </v-btn>
                    </template>
                </div>
            </div>
        </div>
    `
});
