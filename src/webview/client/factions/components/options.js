const OptionsComponent = Vue.component('options', {
    props: ['faction', 'locales'],
    data() {
        return {
            textFactionName: ''
        };
    },
    mounted() {},
    methods: {
        changeFactionName() {
            if (this.textFactionName.length <= 3 || this.textFactionName.lenght >= 36) {
                return;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit('factions:Bus', View_Events_Factions.SetName, this.textFactionName);
        }
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1 pa-6">
                <div class="stack">
                    <h1 class="center-header mt-4 mb-6">
                        {{ faction.name }}
                    </h1>
                    <div class="table">
                        <div class="row headers">
                            <div class="cell font-weight-black overline">Option Name</div>
                            <div class="cell font-weight-black overline">Current Value</div>
                            <div class="cell font-weight-black overline">Option</div>
                        </div>
                        <!-- Set Faction Name -->
                        <div class="row" v-if="faction.canChangeName">
                            <div class="cell overline">Set Faction Name</div>
                            <div class="cell overline">{{ faction.name }}</div>
                            <div class="cell overline">
                                <div class="split">
                                    <v-text-field
                                        placeholder="Change faction name..."
                                        v-model="textFactionName"
                                        autocomplete="off"
                                        type="string"
                                        dense
                                    />
                                    <div class="small-icon hoverable hover-green" @click="changeFactionName">
                                        <v-icon color="green" class="pl-2 pr-2" small>icon-checkmark</v-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="overline mt-6" style="text-align: center">If there are no option(s) you may not have permission.</p>
                </div>
            </div>
        </template>
    `
});
