Vue.component('tab-overlays', {
    props: ['data'],
    methods: {
        handleChange(value, parameter, index) {
            this.data.opacityOverlays[index][parameter] = value;
            this.$root.$emit('updateCharacter');
        },
        getOverlayColorCount() {
            return overlayColors.length - 1;
        },
        decrementParameter(index, min, max, incrementValue) {
            const currentValues = [...this.data.opacityOverlays];
            currentValues[index].value -= incrementValue;

            if (currentValues[index].value < min) {
                currentValues[index].value = max;
            }

            this.data.opacityOverlays = currentValues;
            console.log(this.data.opacityOverlays[index].value)
            this.$root.$emit('updateCharacter');
        },
        incrementParameter(index, min, max, incrementValue) {
            const currentValues = [...this.data.opacityOverlays];
            currentValues[index].value += incrementValue;

            if (currentValues[index].value > max) {
                currentValues[index].value = min;
            }

            this.data.opacityOverlays = currentValues;
            this.$root.$emit('updateCharacter');
        }
    },
    template: `
        <v-container class="containerHelper" v-if="data.opacityOverlays[0]">
            <div v-for="(name, i) in opacityOverlays" :key="i" class="d-flex flex-column mb-5">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    {{ opacityOverlays[i].label }}
                </p>
                <div class="d-flex flex-row flex-grow-1 mb-3">
                    <v-btn @click="decrementParameter(i, opacityOverlays[i].min, opacityOverlays[i].max, 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                        {{ data.opacityOverlays[i].value !== null ? data.opacityOverlays[i].value : -1 }}
                    </p>
                    <v-btn @click="incrementParameter(i, opacityOverlays[i].min, opacityOverlays[i].max, 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-2 subtitle-2">
                    {{ opacityOverlays[i].label }} Opacity ({{ parseFloat(data.opacityOverlays[i].opacity).toFixed(1) }})
                </p>
                <v-slider class="flex-grow-1 mb-5" type="range" :min="0" :max="1" v-model.number="opacityOverlays[i].opacity" :step="0.1" @input="e => handleChange(e, 'opacity', i)" />
                <v-divider></v-divider>
            </div>
        </v-container>
    `
});
