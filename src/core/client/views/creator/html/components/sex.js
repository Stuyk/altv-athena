Vue.component('tab-sex', {
    props: ['data'],
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
                Object.keys(preset).forEach(key => {
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
        'data.faceMix': function(newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        },
        'data.skinMix': function(newVal, oldVal) {
            this.$root.$emit('updateCharacter');
        }
    },
    template: `
        <v-container class="containerHelper">
            <!-- Sexual Orientation -->
            <div class="d-flex flex-column">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Sexual Orientation
                </p>
                <v-btn-toggle v-model="data.sex" class="flex-grow-1">
                    <v-btn @click="setParameter('sex', 0)" class="flex-grow-1" small>Female</v-btn>
                    <v-btn @click="setParameter('sex', 1)" class="flex-grow-1" small>Male</v-btn>
                </v-btn-toggle>
                <p class="text-sm-left font-weight-bold mb-1 mt-3 orange--text text--accent-1 subtitle-2">
                    Presets
                </p>
                <v-btn-toggle class="flex-grow-1">
                    <v-btn v-for="i in 6" :key="i" @click="setParameter('preset', i)" class="flex-grow-1" x-small>
                        {{ i }}
                    </v-btn>
                </v-btn-toggle>
            </div>
            <!-- Father Face / Skin -->
            <div class="d-flex flex-column mt-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Father Face
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('faceFather', 0, 45, 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center" small> 
                        {{faceNames[data.faceFather] }}
                    </p>
                    <v-btn @click="incrementParameter('faceFather', 0, 45, 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
            <div class="d-flex flex-column mt-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Father Skin
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('skinFather', 0, 45, 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center" small> 
                        {{faceNames[data.skinFather] }}
                    </p>
                    <v-btn @click="incrementParameter('skinFather', 0, 45, 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
            <!-- Mother Face / Skin -->
            <div class="d-flex flex-column mt-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Mother Face
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('faceMother', 0, 45, 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center" small> 
                        {{faceNames[data.faceMother] }}
                    </p>
                    <v-btn @click="incrementParameter('faceMother', 0, 45, 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
            <div class="d-flex flex-column mt-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Mother Skin
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('skinMother', 0, 45, 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center" small> 
                        {{faceNames[data.skinMother] }}
                    </p>
                    <v-btn @click="incrementParameter('skinMother', 0, 45, 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
            <!-- Face Mix Parameters -->
            <div class="d-flex flex-column mt-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Face Mix ({{ parseFloat(data.faceMix).toFixed(1) }})
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <input class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.faceMix"/>
                </div>
            </div>
            <div class="d-flex flex-column mt-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Skin Mix ({{ parseFloat(data.skinMix).toFixed(1) }})
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <input class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.skinMix"/>
                </div>
            </div>
            <!-- Eyes -->
            <div class="d-flex flex-column mt-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Eye Color
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('eyes', 0, 30, 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center" small> 
                        {{ data.eyes }}
                    </p>
                    <v-btn @click="incrementParameter('eyes', 0, 30, 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
        </v-container>
    `
});
