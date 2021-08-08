const LogComponent = Vue.component('log-component', {
    props: ['faction', 'locales'],
    data() {
        return {
            textFactionName: ''
        };
    },
    mounted() {},
    methods: {},
    template: `
        <template>
            <div class="wrapper flex-grow-1 pa-6">
                <div class="stack">
                    <div class="table" v-if="faction.logs">
                        <div class="row headers">
                            <div class="cell font-weight-black overline">Log Info</div>
                        </div>
                        <!-- Set Faction Name -->
                        <div v-for="(log, index) in faction.logs" class="row" v-if="faction.canChangeName">
                            <div class="cell overline">{{ log }}</div>
                        </div>
                    </div>
                    <p class="overline mt-6" style="text-align: center" v-if="!faction.logs || faction.logs.length <= 0">There are no logs(s)</p>
                </div>
            </div>
        </template>
    `
});
