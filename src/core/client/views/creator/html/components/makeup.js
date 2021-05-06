const MakeupComponent = Vue.component('makeup', {
    props: ['data', 'locales'],
    data() {
        return {
            modules: {
                4: false,
                5: false,
                8: false
            }
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
            return this.locales.color.overlays.length - 1;
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
        },
        toggleModule(moduleName) {
            this.modules[moduleName] = !this.modules[moduleName];

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        getLocale(id) {
            return this.locales.makeupComponent.ids[id]
                ? this.locales.makeupComponent.ids[id]
                : `COULD NOT FIND LOCALE FOR makeupComponent.${id}`;
        }
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1">
                <template v-for="(option, i) in MakeupList" :key="i">
                    <button @click="toggleModule(option.id)" class="mt-2 split-close">
                        <v-icon class="blue--text" small>{{ modules[option.id] ? 'icon-minus' : 'icon-plus' }}</v-icon>
                        <div class="overline blue--text">
                            &nbsp;{{ getLocale(option.id).name }}
                        </div>
                    </button>
                    <template v-if="modules[option.id]">
                        <div class="subtitle-2 grey--text mb-2">{{ getLocale(option.id).description }}</div>
                        <div class="button-group pa-2">
                            <div class="overline blue-grey--text">{{ locales.makeupComponent.LABEL_OPACITY }}</div>
                            <div class="split mt-4 mb-4">
                                <v-chip class="light-blue--text mr-3" label outlined>{{ data.colorOverlays[i].opacity }}</v-chip>
                                <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" :min="0" :max="1" step="0.1" v-model.number="data.colorOverlays[i].opacity" @input="e => handleChange(e, 'opacity', i)"/>
                            </div>

                            <div class="overline blue-grey--text">{{ locales.makeupComponent.LABEL_STYLE }}</div>
                            <div class="split flex-grow-1">
                                <button @click="decrementParameter(i, 'value', 0, option.max, 1)" class="outline-transparent pl-4 pr-4">
                                    <v-icon class="blue--text">icon-chevron-left</v-icon>
                                </button>
                                <span class="flex-grow-1 text-center grey--text caption"> 
                                    {{ getLocale(option.id).labels[data.colorOverlays[i].value] }}
                                </span>
                                <button @click="incrementParameter(i, 'value', 0, option.max, 1)" class="outline-transparent pl-4 pr-4">
                                    <v-icon class="blue--text">icon-chevron-right</v-icon>
                                </button>
                            </div>
                            <div class="split mt-4 mb-4">
                                <v-chip class="light-blue--text mr-3" label outlined>{{ data.colorOverlays[i].value }}</v-chip>
                                <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" :min="0" :max="option.max" step="1" v-model.number="data.colorOverlays[i].value" @input="e => handleChange(e, 'value', i)"/>
                            </div>

                            <div class="overline blue-grey--text">{{ locales.makeupComponent.LABEL_COLOUR1 }}</div>
                            <div class="split flex-grow-1">
                                <button @click="decrementParameter(i, 'color1', option.min, getOverlayColorCount(), 1)" class="outline-transparent pl-4 pr-4">
                                    <v-icon class="blue--text">icon-chevron-left</v-icon>
                                </button>
                                <span class="flex-grow-1 text-center grey--text caption"> 
                                    {{ data.colorOverlays[i].color1 }}
                                </span>
                                <button @click="incrementParameter(i, 'color1', option.min, getOverlayColorCount(), 1)" class="outline-transparent pl-4 pr-4">
                                    <v-icon class="blue--text">icon-chevron-right</v-icon>
                                </button>
                            </div>
                            <div class="split mt-4 mb-4">
                                <v-chip class="light-blue--text mr-3" label outlined>{{ data.colorOverlays[i].color1 }}</v-chip>
                                <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" :min="0" :max="getOverlayColorCount()" step="1" v-model.number="data.colorOverlays[i].color1" @input="e => handleChange(e, 'color1', i)"/>
                            </div>

                            <template v-if="option.color2 !== undefined">
                                <div class="overline blue-grey--text">{{ locales.makeupComponent.LABEL_COLOUR2 }}</div>
                                <div class="split flex-grow-1">
                                    <button @click="decrementParameter(i, 'color2', option.min, getOverlayColorCount(), 1)" class="outline-transparent pl-4 pr-4">
                                        <v-icon class="blue--text">icon-chevron-left</v-icon>
                                    </button>
                                    <span class="flex-grow-1 text-center grey--text caption"> 
                                        {{ data.colorOverlays[i].color2 }}
                                    </span>
                                    <button @click="incrementParameter(i, 'color2', option.min, getOverlayColorCount(), 1)" class="outline-transparent pl-4 pr-4">
                                        <v-icon class="blue--text">icon-chevron-right</v-icon>
                                    </button>
                                </div>
                                <div class="split mt-4 mb-4">
                                    <v-chip class="light-blue--text mr-3" label outlined>{{ data.colorOverlays[i].color2 }}</v-chip>
                                    <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" :min="0" :max="getOverlayColorCount()" step="1" v-model.number="data.colorOverlays[i].color2" @input="e => handleChange(e, 'color2', i)"/>
                                </div>
                            </template>
                        </div>
                    </template>
                </template>
            </div>
        </template>
    `
});
