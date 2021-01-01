Vue.component('tab-overlays', {
    props: ['data'],
    data() {
        return {
            overlayTemplate: [...overlaysTemplateList]
        };
    },
    methods: {
        test() {
            console.log(this);
        },
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
        <v-container class="containerHelper transparent" v-if="data.opacityOverlays[0]">
            <div class="d-flex flex-column justify-space-between fill-height mb-12" block fluid>
                <v-card v-for="(name, i) in overlayTemplate" :key="i" class="d-flex flex-column elevation-2 mb-3 pa-3 grey darken-3">
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        {{ overlayTemplate[i].label }}
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-content-center justify-content-center">
                        <v-btn @click="decrementParameter(i, overlayTemplate[i].min, overlayTemplate[i].max, 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{ data.opacityOverlays[i].value !== null ? data.opacityOverlays[i].value : -1 }}
                        </span>
                        <v-btn @click="incrementParameter(i, overlayTemplate[i].min, overlayTemplate[i].max, 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1 mt-4" block>
                        {{ overlayTemplate[i].label }} Opacity
                    </span>
                    <div class="d-flex flex-row flex-grow-1">
                        <v-chip class="light-blue--text mr-3" label outlined>{{ parseFloat(data.opacityOverlays[i].opacity).toFixed(1) }}</v-chip>
                        <v-slider thumb-label dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.opacityOverlays[i].opacity" @input="e => handleChange(e, 'opacity', i)" />
                    </div>
                </v-card>
            </div>
        </v-container>
    `
});
