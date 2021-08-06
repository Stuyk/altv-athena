const RanksComponent = Vue.component('ranks', {
    props: ['faction', 'locales'],
    data() {
        return {};
    },
    methods: {},
    template: `
        <template>
            <div class="wrapper flex-grow-1">
                {{ faction.ranks }}
            </div>
        </template>
    `
});
