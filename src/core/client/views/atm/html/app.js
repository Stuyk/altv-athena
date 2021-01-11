Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            cash: 0,
            bank: 0,
            withdrawAmount: 0,
            depositAmount: 0,
            type: null,
            wireTransferAmount: 0,
            wireTransferID: 0,
            idRules: [(v) => !!v || 'This field is required', (v) => v >= 0 || 'ID must be positive'],
            depositRules: [
                (v) => !!v || 'This field is required',
                (v) => v > 0 || 'Value must be greater than zero.',
                (v) => v < this.cash || 'Amount must not be greater than your cash on hand.'
            ],
            withdrawRules: [
                (v) => !!v || 'This field is required',
                (v) => v > 0 || 'Value must be greater than zero.',
                (v) => v < this.bank || 'Amount must not be greater than your bank account.'
            ],
            wireTransferRules: [
                (v) => !!v || 'This field is required',
                (v) => v > 0 || 'Value must be greater than zero.',
                (v) => v < this.bank || 'Amount must not be greater than your bank account.'
            ],
            isValid: false,
            processing: true
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
        depositAmount(newValue) {
            if (newValue <= 0 || newValue > this.cash) {
                this.isValid = false;
                return;
            }

            this.isValid = true;
        },
        wireTransferAmount(newValue) {
            if (newValue <= 0 || newValue > this.bank) {
                this.isValid = false;
                return;
            }

            this.isValid = true;
        }
    },
    methods: {
        setType(name) {
            this.type = name;
        },
        transact() {
            let amount = 0;
            if (this.type === 'deposit') {
                amount = this.depositAmount;
            }

            if (this.type === 'withdraw') {
                amount = this.withdrawAmount;
            }

            if (this.type === 'transfer') {
                amount = this.wireTransferAmount;
            }

            if (!this.isValid) {
                return;
            }

            this.processing = true;

            if ('alt' in window) {
                alt.emit('atm:Action', this.type, amount, this.wireTransferID);
            }
        },
        updateBalances(bank, cash) {
            this.bank = bank;
            this.cash = cash;
            this.isValid = false;
            this.processing = false;
        },
        exit() {
            if ('alt' in window) {
                alt.emit('atm:Close');
            }
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('atm:Update', this.updateBalances);
            alt.emit('atm:Ready');
            alt.emit('ready');
        } else {
            const cash = Math.floor(Math.random() * 5000000);
            const bank = Math.floor(Math.random() * 5000000);
            this.updateBalances(cash, bank);
        }
    }
});
