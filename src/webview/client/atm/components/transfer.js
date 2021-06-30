const TransferComponent = Vue.component('transfer', {
    props: ['bank', 'cash', 'locales', 'processing'],
    data() {
        return {
            wireTransferAmount: null,
            wireTransferID: null,
            idRules: [],
            wireTransferRules: [],
            isValid: false
        };
    },
    watch: {
        wireTransferAmount(newValue) {
            if (newValue <= 0 || newValue > this.bank) {
                this.isValid = false;
                return;
            }

            if (this.wireTransferID === null || this.wireTransferID === undefined || this.wireTransferID <= -1) {
                this.isValid = false;
                return;
            }

            this.isValid = true;
        },
        wireTransferID() {
            const newValue = this.wireTransferAmount;

            if (newValue <= 0 || newValue > this.bank) {
                this.isValid = false;
                return;
            }

            if (this.wireTransferID === null || this.wireTransferID === undefined || this.wireTransferID <= -1) {
                this.isValid = false;
                return;
            }

            this.isValid = true;
        }
    },
    methods: {
        handleDeposit() {
            this.$root.$emit('set-processing');
  
            if ('alt' in window) {
                alt.emit('atm:Action', 'withdraw', this.wireTransferAmount);
            } else {
                console.log(`Deposit action go brr...`);
            }
        },
        setMax() {
            this.wireTransferAmount = this.bank;
        }
    },
    mounted() {
        this.wireTransferRules = [
            (v) => !!v || this.locales.FIELD_IS_REQUIRED,
            (v) => v > 0 || this.locales.GREATER_THAN_ZERO,
            (v) => v <= this.bank || this.locales.LESS_THAN_BANK
        ];

        this.idRules = [
            (v) => !!v || this.locales.FIELD_IS_REQUIRED, 
            (v) => v >= 0 || this.locales.USER_ID_POSITIVE
        ]
    },
    template: `
        <template>
            <div class="options">
                <div class="split" v-if="!processing">
                    <v-text-field :rules="idRules" :placeholder="locales.LABEL_USER_ID" class="mb-4 flex-grow-1" type="number" v-model="wireTransferID" />
                </div>

                <div class="split" v-if="!processing">
                    <v-text-field :rules="wireTransferRules" :placeholder="locales.LABEL_BANK_TO_TRANSFER" class="mb-4 flex-grow-1" type="number" v-model="wireTransferAmount" />
                    <button @click="setMax" class="ml-4">max</button>
                </div>
                
                <template v-if="isValid && !processing">
                    <button @click="handleDeposit" class="flex-grow-1 outline-round">
                        <v-icon color="orange">icon-checkmark</v-icon>
                    </button>
                </template>

                <template v-else>    
                    <button class="flex-grow-1 outline-round disabled-button" disabled>
                        <template v-if="!processing">
                            <v-icon color="grey darken-2">icon-checkmark</v-icon>
                        </template>
                        <template v-else>
                            <v-progress-circular indeterminate color="orange"></v-progress-circular>
                        </template>
                    </button>
                </template>
                
            </div>
        </template>
    `
});
