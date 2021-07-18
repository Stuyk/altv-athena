const WithdrawComponent = Vue.component('withdraw', {
    props: ['bank', 'cash', 'locales', 'processing'],
    data() {
        return {
            withdrawRules: [],
            withdrawAmount: null,
            isValid: false
        };
    },
    watch: {
        withdrawAmount(newValue) {
            if (newValue <= 0 || newValue > this.bank) {
                this.isValid = false;
                return;
            }

            this.isValid = true;
        },
    },
    methods: {
        handleDeposit() {
            this.$root.$emit('set-processing');
  
            if ('alt' in window) {
                alt.emit('atm:Action', 'withdraw', this.withdrawAmount);
            } else {
                console.log(`Deposit action go brr...`);
            }
        },
        setMax() {
            this.withdrawAmount = this.bank;
        }
    },
    mounted() {
        this.withdrawRules = [
            (v) => !!v || this.locales.FIELD_IS_REQUIRED,
            (v) => v > 0 || this.locales.GREATER_THAN_ZERO,
            (v) => v <= this.bank || this.locales.LESS_THAN_BANK
        ]
    },
    template: `
        <template>
            <div class="options">
                <div class="split" v-if="!processing">
                    <v-text-field :rules="withdrawRules" :placeholder="locales.LABEL_CASH_TO_WITHDRAW" class="mb-4 flex-grow-1" type="number" v-model="withdrawAmount" />
                    <button @click="setMax" class="ml-4">max</button>
                </div>

                <template v-if="isValid && !processing">
                    <button @click="handleDeposit" class="flex-grow-1 outline-round">
                        <v-icon color="blue">icon-checkmark</v-icon>
                    </button>
                </template>

                <template v-else>    
                    <button class="flex-grow-1 outline-round disabled-button" disabled>
                        <template v-if="!processing">
                            <v-icon color="grey darken-2">icon-checkmark</v-icon>
                        </template>
                        <template v-else>
                            <v-progress-circular indeterminate color="blue"></v-progress-circular>
                        </template>
                    </button>
                </template>
                
            </div>
        </template>
    `
});
