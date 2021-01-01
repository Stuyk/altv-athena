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
        <v-container class="containerHelper transparent">
            <div class="d-flex flex-column justify-space-between fill-height" block fluid>
                <v-card v-for="(name, i) in structureLabels" :key="i" class="d-flex flex-column elevation-2 mb-2 pa-3 grey fill-height darken-3" min-height="85" block>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1">
                        {{ structureLabels[i] }}
                    </span>
                    <div class="d-flex flex-row flex-grow-1 fill-height" block>
                        <v-chip class="light-blue--text mr-3" label outlined block>{{ parseFloat(data.structure[i]).toFixed(1) }}</v-chip>
                        <v-slider thumb-label dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="-1" max="1" step="0.1" v-model.number="data.structure[i]" block />
                    </div>
                </v-card>
            </div>
        </v-container>
    `
});
