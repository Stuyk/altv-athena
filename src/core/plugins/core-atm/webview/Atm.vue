<template>
    <Frame minWidth="30vw" maxWidth="30vw">
        <template v-slot:toolbar>
            <Toolbar @close-page="relayClosePage" pageName="Atm">
                {{ locales.LABEL_ATM }}
            </Toolbar>
        </template>
        <template v-slot:content>
            <div class="split center pb-4">
                {{ locales.LABEL_BANK_ACCOUNT_NUMBER }} <span class="allow-select">{{ bankNumber }}</span>
            </div>
            <!-- Balance Group -->
            <div class="split space-between">
                <div class="overline">
                    {{ locales.LABEL_CASH }}
                </div>
                <div class="overline">
                    {{ locales.LABEL_BANK }}
                </div>
            </div>
            <div class="split space-between">
                <div class="text--subtitle-2 green--text">${{ cash.toLocaleString() }}</div>
                <div class="text--subtitle-2 blue--text">${{ bank.toLocaleString() }}</div>
            </div>
            <div class="balancer mb-4 mt-4 pa-2 rounded" :style="getBalancerBackground">
                <div class="bar blue darken-2" :style="getBalancerBackground"></div>
                <div class="text rounded-sm">${{ (cash + bank).toLocaleString() }}</div>
            </div>
            <!-- Button Group -->
            <div class="split mb-6">
                <template v-for="(color, index) in colors" :key="index">
                    <template v-if="setting === index">
                        <Button class="mt-2 button-group" :raise="false" :color="color" @click="selectSetting(index)">
                            {{ locales[labels[index]] }}
                        </Button>
                    </template>
                    <template v-else>
                        <Button class="mt-2 button-group" :color="color" @click="selectSetting(index)">
                            {{ locales[labels[index]] }}
                        </Button>
                    </template>
                </template>
            </div>
            <component v-bind:is="options[setting]" v-bind:locales="locales" v-bind:cash="cash" v-bind:bank="bank" />
        </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import DefaultLocale from './utility/defaultLocale';

export const ComponentName = 'Atm';
export default defineComponent({
    name: ComponentName,
    components: {
        Deposit: defineAsyncComponent(() => import('./components/Deposit.vue')),
        Withdraw: defineAsyncComponent(() => import('./components/Withdraw.vue')),
        Transfer: defineAsyncComponent(() => import('./components/Transfer.vue')),
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            cash: 0,
            bank: 0,
            bankNumber: 9999,
            colors: ['green', 'blue', 'orange'],
            labels: ['LABEL_DEPOSIT', 'LABEL_WITHDRAW', 'LABEL_TRANSFER'],
            locales: DefaultLocale,
            options: ['Deposit', 'Withdraw', 'Transfer'],
            // components: [DepositComponent, WithdrawComponent, TransferComponent],
            processing: true,
            balancerPercentage: 50,
            setting: 0,
            update: 0,
        };
    },
    methods: {
        relayClosePage() {
            this.$emit('close-page', `${ComponentName}:Close`);
        },
        selectSetting(value) {
            this.setting = value;

            if (!('alt' in window)) {
                return;
            }
        },
        isSetting(value) {
            if (value === this.setting) {
                return { active: true };
            }

            return {};
        },
        updateBalances(bank, cash, bankNumber) {
            this.bank = bank;
            this.cash = cash;
            this.bankNumber = bankNumber;

            const total = this.bank + this.cash;
            this.balancerPercentage = (this.bank / total) * 100;

            setTimeout(() => {
                this.isValid = false;
                this.processing = false;
            }, 1000);
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${ComponentName}:Close`);
        },
    },
    computed: {
        getBalancerBackground() {
            return `width: ${this.balancerPercentage}% !important`;
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on(`${ComponentName}:Update`, this.updateBalances);
            alt.on(`${ComponentName}:SetLocale`, this.setLocales);
            alt.emit(`${ComponentName}:Ready`);
            alt.emit('ready');
        } else {
            const cash = Math.floor(Math.random() * 5000000);
            const bank = Math.floor(Math.random() * 5000000);
            this.updateBalances(cash, bank, 9999);
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.off(`${ComponentName}:Update`, this.updateBalances);
            alt.off(`${ComponentName}:SetLocale`, this.setLocales);
        }
    },
});
</script>

<style scoped>
.balancer {
    position: relative;
    flex-grow: 1;
    min-width: 100% !important;
    background-color: #388e3c !important;
    text-align: center;
    overflow: hidden !important;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    box-sizing: border-box;
    border: 2px solid #2c2c2c;
}

.bar {
    position: absolute;
    height: 50px !important;
    top: 0px;
    right: -5px;
    transform: skew(-15deg);
}

.balancer .text {
    position: relative;
    z-index: 99;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.2);
}

.button-group {
    width: 50%;
}
</style>
