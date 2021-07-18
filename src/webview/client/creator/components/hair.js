const HairComponent = Vue.component('hair', {
    props: ['data', 'locales'],
    data() {
        return {
            modules: {
                hairstyle: false,
                eyebrows: false,
                facial: false
            }
        };
    },
    methods: {
        handleChange(value, parameter) {
            this.data[parameter] = value;
            this.$root.$emit('updateCharacter');
        },
        getHairCount() {
            if (this.data.sex === 0) {
                return this.locales.hairComponent.feminine.length - 2;
            }

            return this.locales.hairComponent.masculine.length - 2;
        },
        getColourCount() {
            return this.locales.color.hair.length - 1;
        },
        getFacialCount() {
            return this.locales.hairComponent.facial.length - 1;
        },
        getEyebrowsCount() {
            return this.locales.hairComponent.eyebrows.length - 1;
        },
        setParameter(parameter, value) {
            this.data[parameter] = value;
            this.$root.$emit('updateCharacter');
        },
        decrementParameter(parameter, min, max, incrementValue) {
            this.data[parameter] -= incrementValue;

            if (this.data[parameter] < min) {
                this.data[parameter] = max;
            }

            this.$root.$emit('updateCharacter');
        },
        incrementParameter(parameter, min, max, incrementValue) {
            this.data[parameter] += incrementValue;

            if (this.data[parameter] > max) {
                this.data[parameter] = min;
            }

            this.$root.$emit('updateCharacter');
        },
        handleChange(value, parameter) {
            this.data.colorOverlays[parameter] = value;
            this.$root.$emit('updateCharacter');
        },
        toggleModule(moduleName) {
            this.modules[moduleName] = !this.modules[moduleName];

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        getLocale(name) {
            return this.locales.hairComponent[name]
                ? this.locales.hairComponent[name]
                : `COULD NOT FIND LOCALE FOR hairComponent.${name}`;
        }
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1">
            <!-- HAIRSTYLE -->
                <button @click="toggleModule('hairstyle')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.hairstyle ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_HAIRSTYLE') }}
                    </div>
                </button>
                <template v-if="modules.hairstyle">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_HAIRSTYLE') }}</div>
                    <div class="button-group pa-2">
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_HAIRSTYLE') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('hair', 0, getHairCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ data.sex === 0 ? locales.hairComponent.feminine[data.hair] : locales.hairComponent.masculine[data.hair] }}
                            </span>
                            <button @click="incrementParameter('hair', 0, getHairCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.hair }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getHairCount()" step="1" v-model.number="data.hair" @input="e => handleChange(e, 'hair')"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_HAIRSTYLE_COLOUR') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('hairColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.color.hair[data.hairColor1] }}
                            </span>
                            <button @click="incrementParameter('hairColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.hairColor1 }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getColourCount()" step="1" v-model.number="data.hairColor1" @input="e => handleChange(e, 'hairColor1')"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_HAIRSTYLE_HIGHLIGHTS') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('hairColor2', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.color.hair[data.hairColor2] }}
                            </span>
                            <button @click="incrementParameter('hairColor2', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.hairColor2 }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getColourCount()" step="1" v-model.number="data.hairColor2" @input="e => handleChange(e, 'hairColor2')"/>
                        </div>
                    </div>
                </template>
    
            <!-- EYEBROWS -->
                <button @click="toggleModule('eyebrows')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.eyebrows ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_EYEBROWS') }}
                    </div>
                </button>
                <template v-if="modules.eyebrows">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_EYEBROWS') }}</div>
                    <div class="button-group pa-2">
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_EYEBROWS') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('eyebrows', 0, getEyebrowsCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.hairComponent.eyebrows[data.eyebrows] }}
                            </span>
                            <button @click="incrementParameter('eyebrows', 0, getEyebrowsCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.eyebrows }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getEyebrowsCount()" step="1" v-model.number="data.eyebrows" @input="e => handleChange(e, 'eyebrows')"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_EYEBROWS_COLOUR') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('eyebrowsColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.color.hair[data.eyebrowsColor1] }}
                            </span>
                            <button @click="incrementParameter('eyebrowsColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.eyebrowsColor1 }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getColourCount()" step="1" v-model.number="data.eyebrowsColor1" @input="e => handleChange(e, 'eyebrowsColor1')"/>
                        </div>
                    </div>
                </template>

            <!-- FACIAL HAIR -->
                <button @click="toggleModule('facial')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.facial ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_FACIAL_HAIR') }}
                    </div>
                </button>
                <template v-if="modules.facial">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_FACIAL_HAIR') }}</div>
                    <div class="button-group pa-2">
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_OPACITY') }}</div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.facialHairOpacity }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.facialHairOpacity" @input="e => handleChange(e, 'facialHairOpacity')" />
                        </div>
                    
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_FACIAL_HAIR') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('facialHair', 0, getFacialCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.hairComponent.facial[data.facialHair] }}
                            </span>
                            <button @click="incrementParameter('facialHair', 0, getFacialCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.facialHair }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getFacialCount()" step="1" v-model.number="data.facialHair" @input="e => handleChange(e, 'facialHair')"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_FACIAL_HAIR_COLOUR') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('facialHairColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="flex-grow-1 text-center grey--text caption"> 
                                {{ locales.color.hair[data.facialHairColor1] }}
                            </span>
                            <button @click="incrementParameter('facialHairColor1', 0, getColourCount(), 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.facialHairColor1 }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="getColourCount()" step="1" v-model.number="data.facialHairColor1" @input="e => handleChange(e, 'facialHairColor1')"/>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    `
});
