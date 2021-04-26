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
        <div class="contentWrapper" v-if="overlayTemplate">
            <template class="groupWrapper" v-for="(name, i) in overlayTemplate" :key="i">
                 <div class="group">
                    <div class="overline pa-0 ma-0 grey--text">
                        {{ overlayTemplate[i].label }}
                    </div>
                </div>
                <div class="group">
                    <button
                        @click="decrementParameter(i, overlayTemplate[i].min, overlayTemplate[i].max, 1)"
                        class="light-blue--text"
                        outlined
                        small
                        text
                    >
                        <v-icon small>icon-chevron-left</v-icon>
                    </button>
                    <span class="flex-grow-1 text-md-body-1 text-center pt-1" small>
                        {{ data.opacityOverlays[i].value !== null ? data.opacityOverlays[i].value : -1 }}
                    </span>
                    <button
                        @click="incrementParameter(i, overlayTemplate[i].min, overlayTemplate[i].max, 1)"
                        class="light-blue--text"
                        outlined
                        small
                        text
                    >
                        <v-icon small>icon-chevron-right</v-icon>
                    </button>
                </div>
                <div class="group">
                    <div class="overline pa-0 ma-0 grey--text">
                        {{ overlayTemplate[i].label }} Opacity
                    </div>
                </div>
                <div class="group">
                    <v-chip class="light-blue--text mr-3" label outlined>
                    {{ parseFloat(data.opacityOverlays[i].opacity).toFixed(1) }}
                    </v-chip>
                    <v-slider
                        thumb-label
                        dense
                        hide-details
                        ticks="always"
                        tick-size="4"
                        class="flex-grow-1"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        v-model.number="data.opacityOverlays[i].opacity"
                        @input="e => handleChange(e, 'opacity', i)"
                    />
                </div>
                <div class="group pt-3 pb-3">
                    <v-divider></v-divider>
                </div>
            </template>
        </div>
    `
});
