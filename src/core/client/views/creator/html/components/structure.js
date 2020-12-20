Vue.component('tab-structure', {
    props: ['data'],
    methods: {
        setParameter(parameter, value) {
            this.data[parameter] = value;
            this.$root.$emit('updateCharacter');
        }
    },
    watch: {
        'data.structure': function(newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        }
    },
    template: `
        <v-container class="containerHelper">
            <div v-for="(name, i) in structureLabels" :key="i" class="d-flex flex-column mb-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    {{ structureLabels[i] }} ({{ parseFloat(data.structure[i].toFixed(1) )}})
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <input class="flex-grow-1" type="range" min="-1" max="1" step="0.1" v-model.number="data.structure[i]"/>
                </div>
            </div>
        </v-container>
    `
});
