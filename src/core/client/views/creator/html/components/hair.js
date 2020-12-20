Vue.component('tab-hair', {
    props: ['data'],
    methods: {
        getHairCount() {
            if (this.data.sex === 0) {
                return femaleHair.length - 1;
            }

            return maleHair.length - 1;
        },
        getColorCount() {
            return hairColors.length - 1;
        },
        getFacialCount() {
            return facialHair.length - 1;
        },
        getEyebrowsCount() {
            return eyebrowNames.length - 1;
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
        }
    },
    template: `
        <v-container class="containerHelper">
            <!-- Hair Style -->
            <div class="d-flex flex-column mb-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Hair Style
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('hair', 0, getHairCount(), 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                        {{ data.sex === 0 ? femaleHair[data.hair] : maleHair[data.hair] }}
                    </p>
                    <v-btn @click="incrementParameter('hair', 0, getHairCount(), 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
            <!-- Hair Style Color -->
            <div class="d-flex flex-column mb-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Hair Style Color
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('hairColor1', 0, getColorCount(), 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                        {{ data.sex === 0 ? hairColors[data.hairColor1] : hairColors[data.hairColor1] }}
                    </p>
                    <v-btn @click="incrementParameter('hairColor1', 0, getColorCount(), 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
            <div class="d-flex flex-column mb-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Hair Style Highlights
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('hairColor2', 0, getColorCount(), 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                        {{ data.sex === 0 ? hairColors[data.hairColor2] : hairColors[data.hairColor2] }}
                    </p>
                    <v-btn @click="incrementParameter('hairColor2', 0, getColorCount(), 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
            <!-- Eyebrows -->
            <div class="d-flex flex-column mb-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Eyebrow Style
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('eyebrows', 0, getEyebrowsCount(), 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                        {{ data.eyebrows }}
                    </p>
                    <v-btn @click="incrementParameter('eyebrows', 0, getEyebrowsCount(), 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
            <div class="d-flex flex-column mb-3">
                <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                    Eyebrow Color
                </p>
                <div class="d-flex flex-row flex-grow-1">
                    <v-btn @click="decrementParameter('eyebrowsColor1', 0, getColorCount(), 1)" small>
                        <v-icon x-small>fa-chevron-left</v-icon>
                    </v-btn>
                    <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                        {{ hairColors[data.eyebrowsColor1] }}
                    </p>
                    <v-btn @click="incrementParameter('eyebrowsColor1', 0, getColorCount(), 1)" small>
                        <v-icon x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </div>
            </div>
            <!-- Male Only Choice -->
            <template v-if="data.sex !== 0">
                <div class="d-flex flex-column mb-3">
                    <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                        Facial Hair Style
                    </p>
                    <div class="d-flex flex-row flex-grow-1">
                        <v-btn @click="decrementParameter('facialHair', 0, getFacialCount(), 1)" small>
                            <v-icon x-small>fa-chevron-left</v-icon>
                        </v-btn>
                        <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                            {{ facialHair[data.facialHair] }}
                        </p>
                        <v-btn @click="incrementParameter('facialHair', 0, getFacialCount(), 1)" small>
                            <v-icon x-small>fa-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </div>
                <div class="d-flex flex-column mb-3">
                    <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                        Facial Hair Opacity ({{ data.facialHairOpacity }})
                    </p>
                    <div class="d-flex flex-row flex-grow-1">
                        <v-slider class="flex-grow-1" type="range" :min="0" :max="1" v-model.number="data.facialHairOpacity" :step="0.1" @input="e => handleChange(e, 'facialHairOpacity')" />
                    </div>
                </div>
                <div class="d-flex flex-column">
                    <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                        Facial Hair Color
                    </p>
                    <div class="d-flex flex-row flex-grow-1">
                        <v-btn @click="decrementParameter('facialHairColor1', 0, getColorCount(), 1)" small>
                            <v-icon x-small>fa-chevron-left</v-icon>
                        </v-btn>
                        <p class="flex-grow-1 text-sm-center align-self-center mb-0 mt-0" style="font-size: 12px !important;"> 
                            {{ hairColors[data.facialHairColor1] }}
                        </p>
                        <v-btn @click="incrementParameter('facialHairColor1', 0, getColorCount(), 1)" small>
                            <v-icon x-small>fa-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </div>
            </template>
        </v-container>
    `
});
