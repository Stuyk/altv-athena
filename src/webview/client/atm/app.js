Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            cash: 0,
            bank: 0,
            locales: {
                LABEL_ATM: 'ATM',
                LABEL_CASH: 'Cash',
                LABEL_BANK: 'Bank',
                LABEL_DEPOSIT: 'Deposit',
                LABEL_WITHDRAW: 'Withdraw',
                LABEL_TRANSFER: 'Transfer',
                LABEL_CASH_TO_DEPOSIT: 'Cash to Deposit',
                LABEL_CASH_TO_WITHDRAW: 'Cash to Withdraw',
                LABEL_BANK_TO_TRANSFER: 'Bank amount to transfer',
                LABEL_USER_ID: `User ID to transfer to`,
                FIELD_IS_REQUIRED: `Field is required`,
                GREATER_THAN_ZERO: `Value must be greater than zero`,
                LESS_THAN_CASH: `Value must be less than cash`,
                LESS_THAN_BANK: `Value must be less than bank`,
                USER_ID_POSITIVE: `User ID must be positive`
            },
            components: [DepositComponent, WithdrawComponent, TransferComponent],
            processing: true,
            balancerPercentage: 50,
            setting: 0,
            update: 0,
            url: 'http://localhost:9111'
        };
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        selectSetting(value) {
            this.setting = value;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        isSetting(value) {
            if (value === this.setting) {
                return { active: true };
            }

            return {};
        },
        updateBalances(bank, cash) {
            this.bank = bank;
            this.cash = cash;

            const total = this.bank + this.cash;
            this.balancerPercentage = (this.bank / total) * 100;

            setTimeout(() => {
                this.isValid = false;
                this.processing = false;
            }, 1000);
        },
        exit() {
            if ('alt' in window) {
                alt.emit('atm:Close');
            } else {
                console.log('Exit button go brr');
            }
        },
        setProcessing() {
            this.processing = true;
            this.update += 1;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            this.exit();
        }
    },
    computed: {
        getBalancerBackground() {
            return { width: `${this.balancerPercentage}%` };
        },
        getComponent() {
            return this.components[this.setting];
        }
    },
    mounted() {
        this.$on('set-processing', this.setProcessing);
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on('atm:Update', this.updateBalances);
            alt.on('atm:SetLocale', this.setLocales);
            alt.on('url', this.setURL);
            alt.emit('atm:Ready');
            alt.emit('ready');
            alt.emit('url');
        } else {
            const cash = Math.floor(Math.random() * 5000000);
            const bank = Math.floor(Math.random() * 5000000);
            this.updateBalances(cash, bank);
        }
    }
});
