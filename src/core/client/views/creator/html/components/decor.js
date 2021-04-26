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
        <div class="contentWrapper">
            <template v-for="(name, i) in colorOverlays" :key="i" v-if="colorOverlays[i]">
                <div class="group">
                    <div class="overline pa-0 ma-0 grey--text">
                        {{ colorOverlays[i].label }}
                    </div>
                </div>
                <div class="group">
                    <button
                        @click="decrementParameter(i, 'value', colorOverlays[i].min, colorOverlays[i].max, 1)"
                        class="light-blue--text"
                        outlined
                        small
                        text
                    >
                        <v-icon small>icon-chevron-left</v-icon>
                    </button>
                    <span class="flex-grow-1 text-md-body-1 text-center pt-1" small v-if="data.colorOverlays[i]">
                        {{ data.colorOverlays[i].value !== null ? data.colorOverlays[i].value : 0 }}
                    </span>
                    <button
                        @click="incrementParameter(i, 'value', colorOverlays[i].min, colorOverlays[i].max, 1)"
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
                        {{ colorOverlays[i].label }} Opacity
                    </div>
                </div>
                <div class="group">
                    <v-chip class="light-blue--text mr-3" label outlined v-if="data.colorOverlays[i]">
                        {{ parseFloat(data.colorOverlays[i].opacity).toFixed(1) }}
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
                        v-if="data.colorOverlays[i]"
                        v-model.number="data.colorOverlays[i].opacity"
                        @input="e => handleChange(e, 'opacity', i)"
                    />
                </div>
                <div class="group">
                    <div class="overline pa-0 ma-0 grey--text">
                        {{ colorOverlays[i].label }} Primary Colour
                    </div>
                </div>
                <div class="group">
                    <button
                        @click="decrementParameter(i, 'color1', colorOverlays[i].min, getOverlayColorCount(), 1)"
                        class="light-blue--text"
                        outlined
                        small
                        text
                    >
                        <v-icon small>icon-chevron-left</v-icon>
                    </button>
                    <span class="flex-grow-1 text-md-body-1 text-center pt-1" small v-if="data.colorOverlays[i]">
                        {{ data.colorOverlays[i].color1 !== null ? data.colorOverlays[i].color1 : 0 }}
                    </span>
                    <button
                        @click="incrementParameter(i, 'color1', colorOverlays[i].min, getOverlayColorCount(), 1)"
                        class="light-blue--text"
                        outlined
                        small
                        text
                    >
                        <v-icon small>icon-chevron-right</v-icon>
                    </button>
                </div>
                <template v-if="colorOverlays[i].color2 !== undefined">
                    <div class="group">
                        <div class="overline pa-0 ma-0 grey--text">
                            {{ colorOverlays[i].label }} Secondary Colour
                        </div>
                    </div>
                    <div class="group">
                        <button
                            @click="decrementParameter(i, 'color2', colorOverlays[i].min, getOverlayColorCount(), 1)"
                            class="light-blue--text"
                            outlined
                            small
                            text
                        >
                            <v-icon small>icon-chevron-left</v-icon>
                        </button>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small v-if="data.colorOverlays[i]">
                            {{ data.colorOverlays[i].color2 !== null ? data.colorOverlays[i].color2 : 0 }}
                        </span>
                        <button
                            @click="incrementParameter(i, 'color2', colorOverlays[i].min, getOverlayColorCount(), 1)"
                            class="light-blue--text"
                            outlined
                            small
                            text
                        >
                            <v-icon small>icon-chevron-right</v-icon>
                        </button>
                    </div>
                </template>
                <div class="group pt-3 pb-3">
                    <v-divider></v-divider>
                </div>
            </template>
        </v-container>
    `
});
