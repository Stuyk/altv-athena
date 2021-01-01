Vue.component('tab-decor', {
    props: ['data'],
    data() {
        return {
            colorOverlays: [...colorOverlays]
        };
    },
    methods: {
        setParameter(parameter, value) {
            this.data[parameter] = value;
            this.$root.$emit('updateCharacter');
        },
        handleChange(value, parameter, index) {
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
        <v-container class="containerHelper transparent">
            <div class="d-flex flex-column justify-space-between fill-height" block fluid>
                <v-card v-for="(name, i) in colorOverlays" :key="i" class="d-flex flex-column elevation-2 mb-3 pa-3 grey darken-3 fill-height">
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        {{ colorOverlays[i].label }}
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                        <v-btn @click="decrementParameter(i, 'value', colorOverlays[i].min, colorOverlays[i].max, 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{ data.colorOverlays[i].value !== null ? data.colorOverlays[i].value : 0 }}
                        </span>
                        <v-btn @click="incrementParameter(i, 'value', colorOverlays[i].min, colorOverlays[i].max, 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                <!-- Opacity -->
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1 mt-4" block>
                        {{ colorOverlays[i].label }} Opacity
                    </span>
                    <div class="d-flex flex-row flex-grow-1">
                        <v-chip class="light-blue--text mr-3" label outlined>{{ parseFloat(data.colorOverlays[i].opacity).toFixed(1) }}</v-chip>
                        <v-slider thumb-label dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.colorOverlays[i].opacity"  @input="e => handleChange(e, 'opacity', i)" />
                    </div>
                <!-- Color 1 -->
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1 mt-4" block>
                        {{ colorOverlays[i].label }} Primary Color
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                        <v-btn @click="decrementParameter(i, 'color1', colorOverlays[i].min, getOverlayColorCount(), 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{ data.colorOverlays[i].color1 !== null ? data.colorOverlays[i].color1 : 0 }}
                        </span>
                        <v-btn @click="incrementParameter(i, 'color1', colorOverlays[i].min, getOverlayColorCount(), 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                <!-- Color 2 -->
                    <template v-if="colorOverlays[i].color2 !== undefined">
                        <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1 mt-4" block>
                            {{ colorOverlays[i].label }} Secondary Color
                        </span>
                        <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                            <v-btn @click="decrementParameter(i, 'color2', colorOverlays[i].min, getOverlayColorCount(), 1)" class="light-blue--text" outlined small text>
                                <v-icon small>icon-chevron-left</v-icon>
                            </v-btn>
                            <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                                {{ data.colorOverlays[i].color2 !== null ? data.colorOverlays[i].color2 : 0 }}
                            </span>
                            <v-btn @click="incrementParameter(i, 'color2', colorOverlays[i].min, getOverlayColorCount(), 1)"  class="light-blue--text" outlined small text>
                                <v-icon small>icon-chevron-right</v-icon>
                            </v-btn>
                        </div>
                    </template>
                </v-card>
            </div>
        </v-container>
    `
});
