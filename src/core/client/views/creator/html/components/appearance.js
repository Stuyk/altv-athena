const AppearanceComponent = Vue.component('appearance', {
    props: ['data', 'locales'],
    data() {
        return {
            modules: {
                frame: false,
                presets: false,
                father: false,
                mother: false,
                skinBlend: false,
                faceBlend: false,
                eyeColour: false
            },
            preset: 1
        };
    },
    methods: {
        toggleModule(moduleName) {
            this.modules[moduleName] = !this.modules[moduleName];

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        isActive(parameter, value) {
            if (this.data[parameter] === value) {
                return { active: true };
            }

            return { active: false };
        },
        setParameter(parameter, value) {
            if (parameter === 'sex') {
                if (value === 0) {
                    this.data.faceFather = 33;
                    this.data.faceMother = 45;
                    this.data.skinFather = 45;
                    this.data.skinMother = 45;
                    this.data.skinMix = 0.5;
                    this.data.faceMix = 0.5;
                    this.data.facialHair = 29;
                    this.data.facialHairColor1 = 0;
                    this.data.eyebrows = 0;
                } else {
                    this.data.faceMother = 0;
                    this.data.faceFather = 0;
                    this.data.skinFather = 0;
                    this.data.skinMother = 0;
                    this.data.skinMix = 0.5;
                    this.data.faceMix = 0.5;
                    this.data.facialHair = 29;
                    this.data.facialHairColor1 = 0;
                    this.data.eyebrows = 0;
                }
            }

            if (parameter === 'preset') {
                this.preset = value;
                const index = parseInt(value - 1);
                const preset = this.data.sex === 0 ? femalePresets[index] : malePresets[index];
                Object.keys(preset).forEach((key) => {
                    this.data[key] = preset[key];
                });

                this.data.facialHair = 29;
                this.data.facialHairColor1 = 0;
                this.data.eyebrows = 0;
            } else {
                if (isNaN(value)) {
                    this.data[parameter] = value;
                } else {
                    this.data[parameter] = parseFloat(value);
                }
            }

            this.$root.$emit('updateCharacter');
        },
        decrementParameter(parameter, min, max, incrementValue) {
            this.data[parameter] -= incrementValue;

            if (this.data[parameter] < min) {
                this.data[parameter] = max;
            }
        },
        incrementParameter(parameter, min, max, incrementValue) {
            this.data[parameter] += incrementValue;

            if (this.data[parameter] > max) {
                this.data[parameter] = min;
            }
        },
        isHighlighted(arg1, arg2) {
            return arg1 === arg2 ? { 'blue--text': true, active: true } : { 'grey--text': true };
        },
        getLocale(name) {
            return this.locales.appearanceComponent[name]
                ? this.locales.appearanceComponent[name]
                : `COULD NOT FIND LOCALE FOR appearanceComponent.${name}`;
        }
    },
    watch: {
        'data.faceFather': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        },
        'data.skinFather': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        },
        'data.faceMother': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        },
        'data.skinMother': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        },
        'data.faceMix': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        },
        'data.skinMix': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        },
        'data.eyes': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        }
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1">
                <button @click="toggleModule('frame')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.frame ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_FRAME') }}
                    </div>
                </button>
                <template v-if="modules.frame">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_FRAME') }}</div>
                    <div class="button-group">
                        <div class="split">
                            <button @click="setParameter('sex', 0)" class="overline flex-grow-1" :class="isHighlighted(data.sex, 0)" small>
                                {{ getLocale('LABEL_FEMININE') }}
                            </button>
                            <button @click="setParameter('sex', 1)" class="overline flex-grow-1" :class="isHighlighted(data.sex, 1)" small>
                                {{ getLocale('LABEL_MASCULINE') }}
                            </button>
                        </div>
                    </div>
                </template>
            
                <button @click="toggleModule('presets')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.presets ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_PRESETS') }}
                    </div>
                </button>
                <template v-if="modules.presets">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_PRESETS') }}</div>
                    <div class="button-group">
                        <div class="split">
                            <button v-for="i in 6" :key="i" @click="setParameter('preset', i)" class="overline flex-grow-1" :class="isHighlighted(preset, i)" outlined text small>
                                {{ i }}
                            </button>
                        </div>
                    </div>
                </template>
                
                <button @click="toggleModule('father')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.father ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_FATHER') }}
                    </div>
                </button>
                <template v-if="modules.father">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_FATHER') }}</div>
                    <div class="button-group pa-2">
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_FACE') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('faceFather', 0, 45, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="overline pt-1 flex-grow-1 text-center grey--text"> 
                                {{ locales.faces[data.faceFather] }}
                            </span>
                            <button @click="incrementParameter('faceFather', 0, 45, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.faceFather }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" max="45" step="1" v-model.number="data.faceFather"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_SKIN') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('skinFather', 0, 45, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="overline pt-1 flex-grow-1 text-center grey--text"> 
                                {{ locales.faces[data.skinFather] }}
                            </span>
                            <button @click="incrementParameter('skinFather', 0, 45, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.skinFather }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" max="45" step="1" v-model.number="data.skinFather"/>
                        </div>
                    </div>
                </template>

                <button @click="toggleModule('mother')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.mother ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_MOTHER') }}
                    </div>
                </button>
                <template v-if="modules.mother">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_MOTHER') }}</div>
                    <div class="button-group pa-2">
                        <div class="overline blue-grey--text">{{ getLocale('LABEL_FACE') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('faceMother', 0, 45, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="overline pt-1 flex-grow-1 text-center grey--text"> 
                                {{ locales.faces[data.faceMother] }}
                            </span>
                            <button @click="incrementParameter('faceMother', 0, 45, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.faceMother }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" max="45" step="1" v-model.number="data.faceMother"/>
                        </div>

                        <div class="overline blue-grey--text">{{ getLocale('LABEL_SKIN') }}</div>
                        <div class="split flex-grow-1">
                            <button @click="decrementParameter('skinMother', 0, 45, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="overline pt-1 flex-grow-1 text-center grey--text"> 
                                {{ locales.faces[data.skinMother] }}
                            </span>
                            <button @click="incrementParameter('skinMother', 0, 45, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.skinMother }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" max="45" step="1" v-model.number="data.skinMother"/>
                        </div>
                    </div>
                </template>

                <button @click="toggleModule('faceBlend')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.faceBlend ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_FACEBLEND') }}
                    </div>
                </button>
                <template v-if="modules.faceBlend">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_FACEBLEND') }}</div>
                    <div class="button-group pa-2" v-if="modules.faceBlend">
                        <div class="split">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ parseFloat(data.faceMix).toFixed(1) }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="6" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.faceMix"/>
                        </div>
                    </div>
                </template>

                <button @click="toggleModule('skinBlend')" class="mt-2 split-close">
                    <v-icon class="blue--text" small>{{ modules.skinBlend ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_SKINBLEND') }}
                    </div>
                </button>
                <template v-if="modules.skinBlend">
                    <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_SKINBLEND') }}</div>
                    <div class="button-group pa-2" v-if="modules.skinBlend">
                        <div class="split">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ parseFloat(data.skinMix).toFixed(1) }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.skinMix"/>
                        </div>
                    </div>
                </template>

                <button @click="toggleModule('eyeColour')" class="mt-2 split-close rounded">
                    <v-icon class="blue--text" small>{{ modules.eyeColour ? 'icon-minus' : 'icon-plus' }}</v-icon>
                    <div class="overline blue--text">
                        &nbsp;{{ getLocale('LABEL_EYECOLOUR') }}
                    </div>
                </button>
                <template v-if="modules.eyeColour">
                <div class="subtitle-2 grey--text mb-2">{{ getLocale('DESC_EYECOLOUR') }}</div>
                    <div class="button-group pa-2" v-if="modules.eyeColour">
                        <div class="split">
                            <button @click="decrementParameter('eyes', 0, locales.color.eyes.length - 1, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-left</v-icon>
                            </button>
                            <span class="overline flex-grow-1 text-center grey--text"> 
                                {{ locales.color.eyes[data.eyes] }}
                            </span>
                            <button @click="incrementParameter('eyes', 0, locales.color.eyes.length - 1, 1)" class="outline-transparent pl-4 pr-4">
                                <v-icon class="blue--text">icon-chevron-right</v-icon>
                            </button>
                        </div>
                        <div class="split mt-4 mb-4">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ data.eyes }}</v-chip>
                            <v-slider dense hide-details ticks="always" tick-size="1" class="flex-grow-1" type="range" min="0" :max="locales.color.eyes.length - 1" step="1" v-model.number="data.eyes"/>
                        </div>
                    </div>
                    
                </template>
            </div>
        </template>
    `
});
