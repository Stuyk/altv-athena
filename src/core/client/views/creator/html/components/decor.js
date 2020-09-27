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
        }
    },
    template: `
        <div class="options">
            <div v-for="(name, i) in colorOverlays" :key="i" class="option">
                <div class="labelContainer">
                    <div class="label">
                        {{ colorOverlays[i].label }}
                    </div>
                    <div class="value">
                        {{ data.colorOverlays[i].value }} | {{ colorOverlays[i].max }}
                    </div>
                </div>
                <div class="inputHolder">
                    <input type="range" :min="colorOverlays[i].min" :max="colorOverlays[i].max" v-model.number="colorOverlays[i].value" :step="colorOverlays[i].increment" @input="e => handleChange(e, 'value', i)" />
                </div>

                <div class="labelContainer">
                    <div class="label">
                        {{ colorOverlays[i].label }} Opacity
                    </div>
                    <div class="value">
                        {{ parseFloat(data.colorOverlays[i].opacity).toFixed(1) }} | 1.0
                    </div>
                </div>
                <div class="inputHolder">
                    <input type="range" :min="0" :max="1" v-model.number="colorOverlays[i].opacity" :step="0.1" @input="e => handleChange(e, 'opacity', i)" />
                </div>

                <div class="labelContainer">
                    <div class="label">
                        {{ colorOverlays[i].label }} Color
                    </div>
                    <div class="value">
                        {{ data.colorOverlays[i].color1 }} | {{ getOverlayColorCount() }}
                    </div>
                </div>
                <div class="inputHolder">
                    <input type="range" :min="0" :max="getOverlayColorCount()" v-model.number="colorOverlays[i].color1" :step="1" @input="e => handleChange(e, 'color1', i)" />
                </div>

                <template v-if="colorOverlays[i].color2 !== undefined">
                    <div class="labelContainer">
                        <div class="label">
                            {{ colorOverlays[i].label }} Color 2
                        </div>
                        <div class="value">
                            {{ data.colorOverlays[i].color2 }} | {{ getOverlayColorCount() }}
                        </div>
                    </div>
                    <div class="inputHolder">
                        <input type="range" :min="0" :max="getOverlayColorCount()" v-model.number="colorOverlays[i].color2" :step="1" @input="e => handleChange(e, 'color2', i)" />
                    </div>
                </template>
            </div>
        </div>
    `
});
