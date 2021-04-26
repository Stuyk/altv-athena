Vue.component('tab-sex', {
    props: ['data'],
    data() {
        return {
            faceNames: [...faceNames],
            preset: 1
        };
    },
    methods: {
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

            this.$root.$emit('updateCharacter');
        },
        incrementParameter(parameter, min, max, incrementValue) {
            this.data[parameter] += incrementValue;

            if (this.data[parameter] > max) {
                this.data[parameter] = min;
            }

            this.$root.$emit('updateCharacter');
        },
        isHighlighted(arg1, arg2) {
            return arg1 === arg2 ? { 'light-blue--text': true, 'text--lighten-2': true } : { 'grey--text': true };
        }
    },
    watch: {
        'data.faceMix': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        },
        'data.skinMix': function (newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        }
    },
    template: `
        <div class="contentWrapper">
            <div class="group mt-3">
                <button v-for="i in 6" :key="i" @click="setParameter('preset', i)" class="flex-grow-1 ml-1 mr-1" :class="isHighlighted(preset, i)" outlined text small>
                    {{ i }}
                </button>
            </div>
            <div class="group mt-3">
                <button @click="setParameter('sex', 0)" class="flex-grow-1 mr-3" :class="isHighlighted(data.sex, 0)" outlined text small>Female</button>
                <button @click="setParameter('sex', 1)" class="flex-grow-1" :class="isHighlighted(data.sex, 1)" outlined text small>Male</button>
            </div>
            <div class="group mt-3">
                <v-divider></v-divider>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Father Face
                </div>
            </div>
            <div class="group">
                <button @click="decrementParameter('faceFather', 0, 45, 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </button>
                <span class="flex-grow-1 overline text-center pt-1" small> 
                    {{faceNames[data.faceFather] }}
                </span>
                <button @click="incrementParameter('faceFather', 0, 45, 1)"  class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </button>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Father Skin
                </div>
            </div>
            <div class="group">
                <button @click="decrementParameter('skinFather', 0, 45, 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </button>
                <span class="flex-grow-1 overline text-center pt-1" small> 
                    {{faceNames[data.skinFather] }}
                </span>
                <button @click="incrementParameter('skinFather', 0, 45, 1)"  class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </button>
            </div>
            <div class="group pt-2">
                <v-divider></v-divider>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Mother Face
                </div>
            </div>
            <div class="group">
                <button @click="decrementParameter('faceMother', 0, 45, 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </button>
                <span class="flex-grow-1 overline text-center pt-1" small> 
                    {{faceNames[data.faceMother] }}
                </span>
                <button @click="incrementParameter('faceMother', 0, 45, 1)"  class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </button>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Mother Skin
                </div>
            </div>
            <div class="group">
                <button @click="decrementParameter('skinMother', 0, 45, 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </button>
                <span class="flex-grow-1 overline text-center pt-1" small> 
                    {{faceNames[data.skinMother] }}
                </span>
                <button @click="incrementParameter('skinMother', 0, 45, 1)"  class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </button>
            </div>
            <div class="group pt-2">
                <v-divider></v-divider>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Face Blend
                </div>
            </div>
            <div class="group">
                <v-chip class="light-blue--text mr-3" label outlined>{{ parseFloat(data.faceMix).toFixed(1) }}</v-chip>
                <v-slider thumb-label dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.faceMix"/>
            </div>
            <div class="group pt-2">
                <v-divider></v-divider>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Skin Blend
                </div>
            </div>
            <div class="group">
                <v-chip class="light-blue--text mr-3" label outlined>{{ parseFloat(data.skinMix).toFixed(1) }}</v-chip>
                <v-slider thumb-label dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.skinMix"/>
            </div>
            <div class="group pt-2">
                <v-divider></v-divider>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Eye Colour
                </div>
            </div>
            <div class="group">
                <button @click="decrementParameter('eyes', 0, 45, 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </button>
                <span class="flex-grow-1 overline text-center pt-1" small> 
                    {{ data.eyes }}
                </span>
                <button @click="incrementParameter('eyes', 0, 45, 1)"  class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </button>
            </div>
            <div class="group pt-2">
                <v-divider></v-divider>
            </div>
        </div>
    `
});
