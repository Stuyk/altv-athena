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
        <div class="contentWrapper">
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Hairstyle
                </div>
            </div>
            <div class="group">
                <v-btn @click="decrementParameter('hair', 0, getHairCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </v-btn>
                <span class="flex-grow-1 subtitle-2 text-center" small>
                    {{ data.sex === 0 ? femaleHair[data.hair] : maleHair[data.hair] }}
                </span>
                <v-btn @click="incrementParameter('hair', 0, getHairCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </v-btn>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Hair Style Colour
                </div>
            </div>
            <div class="group">
                <v-btn @click="decrementParameter('hairColor1', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </v-btn>
                <span class="flex-grow-1 overline text-center pt-1" small>
                    {{ hairColors[data.hairColor1] }}
                </span>
                <v-btn @click="incrementParameter('hairColor1', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </v-btn>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Hair Style Highlights
                </div>
            </div>
            <div class="group">
                <v-btn @click="decrementParameter('hairColor2', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </v-btn>
                <span class="flex-grow-1 overline text-center pt-1" small>
                    {{ hairColors[data.hairColor2] }}
                </span>
                <v-btn @click="incrementParameter('hairColor2', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </v-btn>
            </div>
            <div class="group pt-2">
                <v-divider></v-divider>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Eyebrow Style
                </div>
            </div>
            <div class="group">
                <v-btn @click="decrementParameter('eyebrows', 0, getEyebrowsCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </v-btn>
                <span class="flex-grow-1 overline text-center pt-1" small> {{ eyebrowNames[data.eyebrows] }} </span>
                <v-btn @click="incrementParameter('eyebrows', 0, getEyebrowsCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </v-btn>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    Eyebrow Colour
                </div>
            </div>
            <div class="group">
                <v-btn @click="decrementParameter('eyebrowsColor1', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-left</v-icon>
                </v-btn>
                <span class="flex-grow-1 overline text-center pt-1" small>
                    {{ hairColors[data.eyebrowsColor1] }}
                </span>
                <v-btn @click="incrementParameter('eyebrowsColor1', 0, getColorCount(), 1)" class="light-blue--text" outlined small text>
                    <v-icon small>icon-chevron-right</v-icon>
                </v-btn>
            </div>
            <div class="group pt-2">
                <v-divider></v-divider>
            </div>
            <template v-if="data.sex !== 0">
                <div class="group">
                    <div class="overline pa-0 ma-0 grey--text">
                        Facial Hair
                    </div>
                </div>
                <div class="group">
                    <v-btn @click="decrementParameter('facialHair', 0, getFacialCount(), 1)" class="light-blue--text" outlined small text>
                        <v-icon small>icon-chevron-left</v-icon>
                    </v-btn>
                    <span class="flex-grow-1 overline text-center pt-1" small>
                        {{ facialHair[data.facialHair] }}
                    </span>
                    <v-btn
                        @click="incrementParameter('facialHair', 0, getFacialCount(), 1)"
                        class="light-blue--text"
                        outlined
                        small
                        text
                    >
                        <v-icon small>icon-chevron-right</v-icon>
                    </v-btn>
                </div>
                <div class="group">
                    <div class="overline pa-0 ma-0 grey--text">
                        Facial Hair Opacity
                    </div>
                </div>
                <div class="group">
                    <v-chip class="light-blue--text mr-3" label outlined>
                        {{ parseFloat(data.facialHairOpacity).toFixed(1) }}
                    </v-chip>
                    <v-slider
                        thumb-label
                        dense
                        hide-details
                        ticks="always"
                        tick-size="4"
                        class="flex-grow-1"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        v-model.number="data.facialHairOpacity"
                        @input="e => handleChange(e, 'facialHairOpacity')"
                    />
                </div>
                <div class="group">
                    <div class="overline pa-0 ma-0 grey--text">
                        Facial Hair Colour
                    </div>
                </div>
                <div class="group">
                    <v-btn
                        @click="decrementParameter('facialHairColor1', 0, getColorCount(), 1)"
                        class="light-blue--text"
                        outlined
                        small
                        text
                    >
                        <v-icon small>icon-chevron-left</v-icon>
                    </v-btn>
                    <span class="flex-grow-1 overline text-center pt-1" small>
                        {{ hairColors[data.facialHairColor1] }}
                    </span>
                    <v-btn
                        @click="incrementParameter('facialHairColor1', 0, getColorCount(), 1)"
                        class="light-blue--text"
                        outlined
                        small
                        text
                    >
                        <v-icon small>icon-chevron-right</v-icon>
                    </v-btn>
                </div>
                <div class="group pt-2">
                    <v-divider></v-divider>
                </div>
            </template>
        </div>
    `
});
