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
        <div class="options">
            <div v-for="(name, i) in structureLabels" :key="i" class="option">
                <div class="labelContainer">
                    <div class="label">
                        {{ structureLabels[i] }}
                    </div>
                    <div class="value">
                        {{ parseFloat(data.structure[i]).toFixed(1) }} | 1.0
                    </div>
                </div>
                <div class="inputHolder">
                    <input type="range" min="-1" max="1" step="0.1" v-model.number="data.structure[i]"/>
                </div>
            </div>
        </div>
    `
});
