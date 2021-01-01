Vue.component('tab-hair', {
    props: ['data'],
    data() {
        return {
            maleHair: [...maleHair],
            femaleHair: [...femaleHair],
            hairColors: [...hairColors],
            facialHair: [...facialHair]
        };
    },
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
        <v-container class="containerHelper transparent">
            <div class="d-flex flex-column justify-space-between fill-height" block fluid>
            <!-- Hair Style -->
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        Hair Style
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                        <v-btn @click="decrementParameter('hair', 0, getHairCount(), 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{ data.sex === 0 ? femaleHair[data.hair] : maleHair[data.hair] }}
                        </span>
                        <v-btn @click="incrementParameter('hair', 0, getHairCount(), 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>
            <!-- Hair Style Color -->
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        Hair Style Color
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                        <v-btn @click="decrementParameter('hairColor1', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{ hairColors[data.hairColor1] }}
                        </span>
                        <v-btn @click="incrementParameter('hairColor1', 0, getColorCount(), 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>
            <!-- Hair Style Highlights -->
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        Hair Style Highlights
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                        <v-btn @click="decrementParameter('hairColor2', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{ hairColors[data.hairColor2] }}
                        </span>
                        <v-btn @click="incrementParameter('hairColor2', 0, getColorCount(), 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>
            <!-- Eyebrows -->
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        Eyebrow Style
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                        <v-btn @click="decrementParameter('eyebrows', 0, getEyebrowsCount(), 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{ data.eyebrows }}
                        </span>
                        <v-btn @click="incrementParameter('eyebrows', 0, getEyebrowsCount(), 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>
            <!-- Eyebrow Color -->
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        Eyebrow Color
                    </span>
                    <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                        <v-btn @click="decrementParameter('eyebrowsColor1', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-left</v-icon>
                        </v-btn>
                        <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                            {{ hairColors[data.eyebrowsColor1] }}
                        </span>
                        <v-btn @click="incrementParameter('eyebrowsColor1', 0, getColorCount(), 1)"  class="light-blue--text" outlined small text>
                            <v-icon small>icon-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>
            <!-- Male Only Choice -->
                <template v-if="data.sex !== 0">
                    <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                        <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                            Facial Hair Style
                        </span>
                        <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                            <v-btn @click="decrementParameter('facialHair', 0, getFacialCount(), 1)" class="light-blue--text" outlined small text>
                                <v-icon small>icon-chevron-left</v-icon>
                            </v-btn>
                            <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                                {{ facialHair[data.facialHair] }}
                            </span>
                            <v-btn @click="incrementParameter('facialHair', 0, getFacialCount(), 1)"  class="light-blue--text" outlined small text>
                                <v-icon small>icon-chevron-right</v-icon>
                            </v-btn>
                        </div>
                    </v-card>
                    <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                        <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                            Facial Hair Opacity
                        </span>
                        <div class="d-flex flex-row flex-grow-1">
                            <v-chip class="light-blue--text mr-3" label outlined>{{ parseFloat(data.facialHairOpacity).toFixed(1) }}</v-chip>
                            <v-slider thumb-label dense hide-details ticks="always" tick-size="4" class="flex-grow-1" type="range" min="0" max="1" step="0.1" v-model.number="data.facialHairOpacity"  @input="e => handleChange(e, 'facialHairOpacity', i)" />
                        </div>
                    </v-card>
                    <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                        <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                            Facial Hair Color
                        </span>
                        <div class="d-flex flex-row flex-grow-1 align-center justify-content-center">
                            <v-btn @click="decrementParameter('facialHairColor1', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                                <v-icon small>icon-chevron-left</v-icon>
                            </v-btn>
                            <span class="flex-grow-1 text-md-body-1 text-center pt-1" small> 
                                {{ hairColors[data.facialHairColor1] }}
                            </span>
                            <v-btn @click="incrementParameter('facialHairColor1', 0, getColorCount(), 1)"  class="light-blue--text" outlined small text>
                                <v-icon small>icon-chevron-right</v-icon>
                            </v-btn>
                        </div>
                    </v-card>
                </template>
            </div>
        </v-container>
    `
});
