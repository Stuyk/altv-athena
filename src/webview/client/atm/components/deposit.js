const DepositComponent = Vue.component('deposit', {
    props: ['bank', 'cash', 'locales', 'processing'],
    data() {
        return {
            depositRules: [],
            depositAmount: null,
            isValid: false
        };
    },
    watch: {
        depositAmount(newValue) {
            if (newValue <= 0 || newValue > this.cash) {
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
                alt.emit('atm:Action', 'deposit', this.depositAmount);
            } else {
                console.log(`Deposit action go brr...`);
            }
        },
        setMax() {
            this.depositAmount = this.cash;
        }
    },
    mounted() {
        this.depositRules = [
            (v) => !!v || this.locales.FIELD_IS_REQUIRED,
            (v) => v > 0 || this.locales.GREATER_THAN_ZERO,
            (v) => v <= this.cash || this.locales.LESS_THAN_CASH
        ]
    },
    template: `
        <template>
            <div class="options">
                <div class="split" v-if="!processing">
                    <v-text-field :rules="depositRules" :placeholder="locales.LABEL_CASH_TO_DEPOSIT" class="mb-4 flex-grow-1" type="number" v-model="depositAmount" />
                    <button @click="setMax" class="ml-4">max</button>
                </div>

                <template v-if="isValid && !processing">
                    <button @click="handleDeposit" class="flex-grow-1 outline-round">
                        <v-icon color="green">icon-checkmark</v-icon>
                    </button>
                </template>

                <template v-else>    
                    <button class="flex-grow-1 outline-round disabled-button" disabled>
                        <template v-if="!processing">
                            <v-icon color="grey darken-2">icon-checkmark</v-icon>
                        </template>
                        <template v-else>
                            <v-progress-circular indeterminate color="green"></v-progress-circular>
                        </template>
                    </button>
                </template>
                
            </div>
        </template>
    `
});
