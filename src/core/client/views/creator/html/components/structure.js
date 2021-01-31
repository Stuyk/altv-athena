Vue.component('tab-structure', {
    props: ['data'],
    data() {
        return {
            structureLabels: [...structureLabels]
        };
    },
    methods: {
        setParameter(parameter, value) {
            this.data[parameter] = value;
            this.$root.$emit('updateCharacter');
        }
    },
    watch: {
        'data.structure': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        }
    },
    template: `
        <div class="contentWrapper">
            <div class="group pt-3 pb-3">
                <div class="subtitle light-blue--text text-left">
                    Used to adjust minor facial details.
                </div>
            </div>
            <template  v-for="(name, index) in structureLabels" :key="index">
                <div class="group" style="min-height: 35px">
                    <div class="overline pa-0 ma-0 grey--text">
                       {{ structureLabels[index] }}
                    </div>
                </div>
                <div class="group" style="min-height: 50px">
                    <v-chip class="light-blue--text mr-3" label outlined block>
                        {{ parseFloat(data.structure[index]).toFixed(1) }}
                    </v-chip>
                    <v-slider thumb-label dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.structure[index]"/>
                </div>
                <div class="group pt-3 pb-3">
                    <v-divider></v-divider>
                </div>
            </template>
        </div>
    `
});
