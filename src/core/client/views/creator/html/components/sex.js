Vue.component('tab-sex', {
    props: ['data'],
    data() {
        return {
            faceNames: [...faceNames]
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
        <v-container class="containerHelper transparent">
            <!-- Sexual Orientation -->
            <div class="d-flex flex-column justify-space-between fill-height" block fluid>
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3" block fluid>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        Sexual Orientation
                    </span>
                    <v-btn-toggle v-model="data.sex" class="flex-grow-1" color="light-blue" text block>
                        <v-btn @click="setParameter('sex', 0)" class="flex-grow-1" small>Female</v-btn>
                        <v-btn @click="setParameter('sex', 1)" class="flex-grow-1" small>Male</v-btn>
                    </v-btn-toggle>
                </v-card>
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3">
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1">
                        Preset Faces
                    </span>
                    <v-btn-toggle class="flex-grow-1" color="light-blue" text>
                        <v-btn v-for="i in 6" :key="i" @click="setParameter('preset', i)" class="flex-grow-1" small>
                            {{ i }}
                        </v-btn>
                    </v-btn-toggle>
                </v-card>
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3">
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1">
                        Father Face
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-content-center justify-content-center">
                        <v-btn @click="decrementParameter('faceFather', 0, 45, 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{faceNames[data.faceFather] }}
                        </span>
                        <v-btn @click="incrementParameter('faceFather', 0, 45, 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mt-4 mb-1">
                        Skin
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-content-center justify-content-center">
                        <v-btn @click="decrementParameter('skinFather', 0, 45, 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{faceNames[data.skinFather] }}
                        </span>
                        <v-btn @click="incrementParameter('skinFather', 0, 45, 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3">
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1">
                        Mother Face
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-content-center justify-content-center">
                        <v-btn @click="decrementParameter('faceMother', 0, 45, 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{faceNames[data.faceMother] }}
                        </span>
                        <v-btn @click="incrementParameter('faceMother', 0, 45, 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mt-4 mb-1">
                        Skin
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-content-center justify-content-center">
                        <v-btn @click="decrementParameter('skinMother', 0, 45, 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{faceNames[data.skinMother] }}
                        </span>
                        <v-btn @click="incrementParameter('skinMother', 0, 45, 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3">
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1">
                        Face Blend
                    </span>
                    <div class="d-flex flex-row flex-grow-1">
                        <v-chip class="light-blue--text mr-3" label outlined>{{ parseFloat(data.faceMix).toFixed(1) }}</v-chip>
                        <v-slider thumb-label dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.faceMix"/>
                    </div>
                </v-card>
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3">
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1">
                        Skin Blend
                    </span>
                    <div class="d-flex flex-row flex-grow-1">
                        <v-chip class="light-blue--text mr-3" label outlined>{{ parseFloat(data.skinMix).toFixed(1) }}</v-chip>
                        <v-slider thumb-label dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.skinMix"/>
                    </div>
                </v-card>
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3">
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1">
                       Eye Color
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-content-center justify-content-center">
                        <v-btn @click="decrementParameter('eyes', 0, 45, 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{ data.eyes }}
                        </span>
                        <v-btn @click="incrementParameter('eyes', 0, 45, 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>
            </div>
        </div>
        </v-container>
    `
});
