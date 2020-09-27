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
        <div class="options">
            <div class="option">
                <div class="labelContainer">
                    <div class="label">
                        Select Sex
                    </div>
                    <div class="value">
                        {{ data.sex === 0 ? 'Female' : 'Male' }}
                    </div>
                </div>
                <div class="split">
                    <button @click="setParameter('sex', 0)" :class="isActive('sex', 0)">Female</button>
                    <button @click="setParameter('sex', 1)" :class="isActive('sex', 1)">Male</button>
                </div>
                <div class="label" style="margin-top: 6px">
                    Presets
                </div>
                <div class="split-auto">
                    <button v-for="i in 6" :key="i" @click="setParameter('preset', i)">
                        {{ i }}
                    </button>
                </div>
            </div>
            <div class="option">
                <div class="labelContainer">
                    <div class="label">
                        Father Face
                    </div>
                    <div class="value">
                        {{ data.faceFather }} | 45
                    </div>
                </div>
                <div class="controls">
                    <button class="arrowLeft" @click="decrementParameter('faceFather', 0, 45, 1)">&#8249;</button>
                    <span> {{faceNames[data.faceFather] }}</span>
                    <button class="arrowRight" @click="incrementParameter('faceFather', 0, 45, 1)">&#8250;</button>
                </div>
            </div>
            <div class="option">
                <div class="labelContainer">
                    <div class="label">
                        Father Skin
                    </div>
                    <div class="value">
                        {{ data.skinFather }} | 45
                    </div>
                </div>
                <div class="controls">
                    <button class="arrowLeft" @click="decrementParameter('skinFather', 0, 45, 1)">&#8249;</button>
                    <span> {{faceNames[data.skinFather] }}</span>
                    <button class="arrowRight" @click="incrementParameter('skinFather', 0, 45, 1)">&#8250;</button>
                </div>
            </div>
            <div class="option">
                <div class="labelContainer">
                    <div class="label">
                        Mother Face
                    </div>
                    <div class="value">
                        {{ data.faceMother }} | 45
                    </div>
                </div>
                <div class="controls">
                    <button class="arrowLeft" @click="decrementParameter('faceMother', 0, 45, 1)">&#8249;</button>
                    <span> {{faceNames[data.faceMother] }}</span>
                    <button class="arrowRight" @click="incrementParameter('faceMother', 0, 45, 1)">&#8250;</button>
                </div>
            </div>
            <div class="option">
                <div class="labelContainer">
                    <div class="label">
                        Mother Skin
                    </div>
                    <div class="value">
                        {{ data.skinMother }} | 45
                    </div>
                </div>
                <div class="controls">
                    <button class="arrowLeft" @click="decrementParameter('skinMother', 0, 45, 1)">&#8249;</button>
                    <span> {{faceNames[data.skinMother] }}</span>
                    <button class="arrowRight" @click="incrementParameter('skinMother', 0, 45, 1)">&#8250;</button>
                </div>
            </div>
            <div class="option">
                <div class="labelContainer">
                    <div class="label">
                       Face Mix
                    </div>
                    <div class="value">
                        {{ parseFloat(data.faceMix).toFixed(1) }} | 1.0
                    </div>
                </div>
                <div class="inputHolder">
                    <input type="range" min="0" max="1" step="0.1" v-model.number="data.faceMix"/>
                </div>
            </div>
            <div class="option">
                <div class="labelContainer">
                    <div class="label">
                       Skin Mix
                    </div>
                    <div class="value">
                        {{ parseFloat(data.skinMix).toFixed(1) }} | 1.0
                    </div>
                </div>
                <div class="inputHolder">
                    <input type="range" min="0.0" max="1.0" step="0.1" v-model.number="data.skinMix"/>
                </div>
            </div>
            <div class="option">
                <div class="labelContainer">
                    <div class="label">
                        Eye Color
                    </div>
                    <div class="value">
                        {{ data.eyes }} | 30
                    </div>
                </div>
                <div class="controls">
                    <button class="arrowLeft" @click="decrementParameter('eyes', 0, 30, 1)">&#8249;</button>
                    <span> {{ data.eyes }} </span>
                    <button class="arrowRight" @click="incrementParameter('eyes', 0, 30, 1)">&#8250;</button>
                </div>
            </div>
        </div>
    `
});
