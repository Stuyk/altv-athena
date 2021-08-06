const BankComponent = Vue.component('bank', {
    props: ['faction', 'locales'],
    data() {
        return {};
    },
    mounted() {
        console.log('BANK!');
    },
    methods: {},
    template: `
        <template>
            <div class="wrapper flex-grow-1">
                <span>{{ faction.bank }}</span>
            </div>
        </template>
    `
});
