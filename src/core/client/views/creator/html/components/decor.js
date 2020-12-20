Vue.component('tab-decor', {
    props: ['data'],
    methods: {
        setParameter(parameter, value) {
            this.data[parameter] = value;
            this.$root.$emit('updateCharacter');
        },
        handleChange(e, parameter, index) {
            const value = parseFloat(e.target.value);
            this.data.colorOverlays[index][parameter] = value;
            this.$root.$emit('updateCharacter');
        },
        getOverlayColorCount() {
            return overlayColors.length - 1;
        },
        decrementParameter(index, propertyName, min, max, incrementValue) {
            const currentValues = [...this.data.colorOverlays];
            currentValues[index][propertyName] -= incrementValue;

            if (currentValues[index][propertyName] < min) {
                currentValues[index][propertyName] = max;
            }

            this.data.colorOverlays = currentValues;
            this.$root.$emit('updateCharacter');
        },
        incrementParameter(index, propertyName, min, max, incrementValue) {
            const currentValues = [...this.data.colorOverlays];
            currentValues[index][propertyName] += incrementValue;

            if (currentValues[index][propertyName] > max) {
                currentValues[index][propertyName] = min;
            }

            this.data.colorOverlays = currentValues;
            this.$root.$emit('updateCharacter');
        }
    },
    template: `
        <v-container class="containerHelper" v-if="data.opacityOverlays[0]">
            <div v-for="(name, i) in colorOverlays" :key="i" class="d-flex flex-column mb-5">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    {{ colorOverlays[i].label }}
                </p>
                <div class="d-flex flex-row flex-grow-1 mb-3">
                    <v-btn @click="decrementParameter(i, 'value', colorOverlays[i].min, colorOverlays[i].max, 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                        {{ data.colorOverlays[i].value !== null ? data.colorOverlays[i].value : 0 }}
                    </p>
                    <v-btn @click="incrementParameter(i, 'value', colorOverlays[i].min, colorOverlays[i].max, 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
                <!-- Opacity -->
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-2 subtitle-2">
                    {{ colorOverlays[i].label }} Opacity ({{ parseFloat(data.colorOverlays[i].opacity).toFixed(1) }})
                </p>
                <input class="flex-grow-1 mb-5" type="range" :min="0" :max="1" v-model.number="colorOverlays[i].opacity" :step="0.1" @input="e => handleChange(e, 'opacity', i)" />
                <!-- Color 1 -->
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-2 subtitle-2">
                    {{ colorOverlays[i].label }} Primary Color
                </p>
                <div class="d-flex flex-row flex-grow-1 mb-3">
                    <v-btn @click="decrementParameter(i, 'color1', colorOverlays[i].min, getOverlayColorCount(), 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                        {{ data.colorOverlays[i].color1 !== null ? data.colorOverlays[i].color1 : 0 }}
                    </p>
                    <v-btn @click="incrementParameter(i, 'color1', colorOverlays[i].min, getOverlayColorCount(), 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
                <!-- Color 2 -->
                <template v-if="colorOverlays[i].color2 !== undefined">
                    <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-2 subtitle-2">
                        {{ colorOverlays[i].label }} Secondary Color
                    </p>
                    <div class="d-flex flex-row flex-grow-1 mb-3">
                        <v-btn @click="decrementParameter(i, 'color2', colorOverlays[i].min, getOverlayColorCount(), 1)" small>
                            <v-icon x-small>fa-chevron-left</v-icon>
                        </v-btn>
                        <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                            {{ data.colorOverlays[i].color2 !== null ? data.colorOverlays[i].color2 : 0 }}
                        </p>
                        <v-btn @click="incrementParameter(i, 'color2', colorOverlays[i].min, getOverlayColorCount(), 1)" small>
                            <v-icon x-small>fa-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </template>
                <v-divider></v-divider>
            </div>
        </v-container>
    `
});
