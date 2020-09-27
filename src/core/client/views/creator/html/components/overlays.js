Vue.component('tab-overlays', {
    props: ['data'],
    methods: {
        handleChange(e, parameter, index) {
            const value = parseFloat(e.target.value);
            this.data.opacityOverlays[index][parameter] = value;
            this.$root.$emit('updateCharacter');
        },
        getOverlayColorCount() {
            return overlayColors.length - 1;
        }
    },
    template: `
        <div class="options">
            <div v-for="(name, i) in opacityOverlays" :key="i" class="option">
                <div class="labelContainer">
                    <div class="label">
                        {{ opacityOverlays[i].label }}
                    </div>
                    <div class="value">
                        {{ data.opacityOverlays[i].value }} | {{ opacityOverlays[i].max }}
                    </div>
                </div>
                <div class="inputHolder">
                    <input type="range" :min="opacityOverlays[i].min" :max="opacityOverlays[i].max" v-model.number="opacityOverlays[i].value" :step="opacityOverlays[i].increment" @input="e => handleChange(e, 'value', i)" />
                </div>
                <div class="labelContainer">
                    <div class="label">
                        Opacity
                    </div>
                    <div class="value">
                        {{ data.opacityOverlays[i].opacity.toFixed(1) }} | 1.0
                    </div>
                </div>
                <div class="inputHolder">
                    <input type="range" :min="0" :max="1" v-model.number="opacityOverlays[i].opacity" :step="0.1" @input="e => handleChange(e, 'opacity', i)" />
                </div>
            </div>
        </div>
    `
});
