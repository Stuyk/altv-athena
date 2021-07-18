const nameRegex = new RegExp('^([A-Z][a-z]+_[A-Z][a-z]+)$');

const InfoComponent = Vue.component('tab-info', {
    props: ['data', 'infodata', 'locales'],
    data() {
        return {
            characterName: '',
            day: 0,
            month: 0,
            year: 1990,
            gender: null,
            nameValid: false,
            dayValid: false,
            monthValid: false,
            yearValid: false,
            genderValid: false,
            isNameAvailable: true,
            firstTime: true,
            nameRules: [],
            dayRules: [],
            monthRules: [],
            yearRules: [],
            minYear: 1940,
            minAge: 18,
            isVerified: false,
            processing: false
        };
    },
    computed: {
        isNoName() {
            return this.noname;
        },
        isNameValid() {
            return this.nameValid ? { validName: true } : { invalidName: true };
        }
    },
    methods: {
        verifyAllCorrect() {
            this.infodata.age = new Date(this.year, this.month, this.day);

            if (!this.nameValid || !this.dayValid || !this.monthValid || !this.yearValid || !this.genderValid) {
                this.isVerified = false;
                return;
            }

            this.isVerified = true;
        },
        verifyYear(newValue) {
            const maxYear = new Date(Date.now()).getFullYear() - this.minAge;
            if (newValue < this.minYear) {
                this.yearValid = false;
                this.verifyAllCorrect();
                return;
            }

            if (newValue >= maxYear) {
                this.yearValid = false;
                this.verifyAllCorrect();
                return;
            }

            this.yearValid = true;
            this.verifyAllCorrect();
        },
        verifyDay(newValue) {
            if (newValue <= 0 || newValue >= 32) {
                this.dayValid = false;
                this.verifyAllCorrect();
                return;
            }

            this.dayValid = true;
            this.verifyAllCorrect();
        },
        verifyMonth(newValue) {
            if (newValue <= 0 || newValue >= 13) {
                this.monthValid = false;
                this.verifyAllCorrect();
                return;
            }

            this.monthValid = true;
            this.verifyAllCorrect();
        },
        verifyName(newValue) {
            if (!newValue || newValue === '') {
                this.isNameAvailable = true;
                this.nameValid = false;
                this.infodata.name = newValue;
                this.verifyAllCorrect();
                return;
            }

            if (!newValue.includes('_')) {
                this.isNameAvailable = true;
                this.nameValid = false;
                this.infodata.name = newValue;
                this.verifyAllCorrect();
                return;
            }

            if (!nameRegex.exec(newValue)) {
                this.isNameAvailable = true;
                this.nameValid = false;
                this.infodata.name = newValue;
                this.verifyAllCorrect();
                return;
            }

            this.isNameAvailable = null;
            this.infodata.name = newValue;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('creator:CheckName', newValue);
            alt.emit('creator:DisableControls', false);
        },
        verifyGender(newValue) {
            if (newValue && newValue !== '' && newValue.length >= 4 && newValue.toLowerCase() !== 'none') {
                this.genderValid = true;
                this.infodata.gender = newValue;
                this.verifyAllCorrect();
                return;
            }

            this.genderValid = false;
            this.infodata.gender = newValue;
        },
        disableControls() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('creator:DisableControls', true);
        },
        handleNameAvailable(result) {
            this.isNameAvailable = result;

            if (!this.isNameAvailable) {
                this.nameValid = false;
                return;
            }

            this.nameValid = true;
            this.verifyAllCorrect();
        },
        save() {
            this.processing = true;

            if (this.data.sex === 0) {
                this.data.facialHair = 29;
                this.data.facialHairColor1 = 0;
            }

            if (!('alt' in window)) {
                return;
            }

            alt.emit('creator:Done', this.data, this.infodata, this.infodata.name);
        }
    },
    watch: {
        day(newValue) {
            this.verifyDay(newValue);
        },
        month(newValue) {
            this.verifyMonth(newValue);
        },
        year(newValue) {
            this.verifyYear(newValue);
        },
        gender(newValue) {
            this.verifyGender(newValue);
        },
        characterName(newValue) {
            this.verifyName(newValue);
        }
    },
    mounted() {
        // Populate Rules
        this.nameRules = [
            (v) => !!v || this.locales.LABEL_FIELD_REQUIRED,
            (v) => (v && v !== ``) || this.locales.LABEL_FIELD_REQUIRED,
            (v) =>
                (v && v.length <= 16) ||
                `${this.locales.LABEL_NAME} ${this.locales.LABEL_CANNOT_EXCEED} 16 ${this.locales.LABEL_CHARACTER}`,
            (v) =>
                (v && v.length >= 5) ||
                `${this.locales.LABEL_NAME} ${this.locales.LABEL_CANNOT_BE_LESS} 5 ${this.locales.LABEL_CHARACTER}`,
            (v) => (v && nameRegex.test(v)) || this.locales.LABEL_NO_SPECIAL
        ];

        this.dayRules = [
            (v) => !!v || this.locales.LABEL_FIELD_REQUIRED,
            (v) => (v && v !== ``) || this.locales.LABEL_FIELD_REQUIRED,
            (v) => (v && v >= 1) || `${this.locales.LABEL_DAY} ${this.locales.LABEL_CANNOT_BE_LESS} 1`,
            (v) => (v && v <= 31) || `${this.locales.LABEL_DAY} ${this.locales.LABEL_CANNOT_EXCEED} 31`
        ];

        this.monthRules = [
            (v) => !!v || this.locales.LABEL_FIELD_REQUIRED,
            (v) => (v && v !== ``) || this.locales.LABEL_FIELD_REQUIRED,
            (v) => (v && v >= 1) || `${this.locales.LABEL_MONTH} ${this.locales.LABEL_CANNOT_BE_LESS} 1`,
            (v) => (v && v <= 12) || `${this.locales.LABEL_MONTH} ${this.locales.LABEL_CANNOT_EXCEED} 12`
        ];

        const maxYear = new Date(Date.now()).getFullYear() - this.minAge;

        this.yearRules = [
            (v) => !!v || this.locales.LABEL_FIELD_REQUIRED,
            (v) => (v && v !== ``) || this.locales.LABEL_FIELD_REQUIRED,
            (v) =>
                (v && v >= 1940) || `${this.locales.LABEL_YEAR} ${this.locales.LABEL_CANNOT_BE_LESS} ${this.minYear}`,
            (v) => (v && v < maxYear) || `${this.locales.LABEL_YEAR} ${this.locales.LABEL_CANNOT_EXCEED}  ${maxYear}`
        ];

        const date = new Date(this.infodata.age);
        this.characterName = this.infodata.name;
        this.day = date.getDay();
        this.month = date.getMonth();
        this.year = date.getFullYear();
        this.gender = this.infodata.gender;

        this.verifyName(this.characterName);
        this.verifyDay(this.day);
        this.verifyMonth(this.month);
        this.verifyYear(this.year);

        if (!(`alt` in window)) {
            return;
        }

        alt.on('creator:IsNameAvailable', this.handleNameAvailable);
    },
    template: `
        <template>
            <div class="wrapper flex-grow-1">
                <div class="stack mb-3">
                    <div class="overline blue-grey--text">{{ locales.LABEL_NAME }}</div>
                    <div class="subtitle-2 grey--text">{{ locales.characterName }}</div>
                    <div class="subtitle-2 red--text mb-2" v-if="isNameAvailable === false">
                        {{ locales.LABEL_NAME_NOT_AVAILABLE }}
                    </div>
                    <div class="split">
                        <template v-if="isNameAvailable !== null">
                            <template v-if="nameValid">
                                <v-icon class="green--text mr-3 pb-1">icon-checkmark</v-icon>
                            </template>
                            <template v-else>
                                <v-icon class="red--text mr-3 pb-1">icon-error</v-icon>
                            </template>
                        </template>
                        <template v-else>
                            <v-icon class="spinner blue--text text--lighten-2">icon-spinner</v-icon>
                            <span class="mr-3"></span>
                        </template>
                        <v-text-field 
                            :label="locales.LABEL_NAME"
                            :rules="nameRules" 
                            type="name" 
                            placeholder="John_Doe" 
                            v-model="characterName"
                            @focus="disableControls"
                        />
                    </div>
                </div>

                <div class="stack mb-3">
                    <div class="overline blue-grey--text">{{ locales.LABEL_BIRTHDAY }}</div>
                    <div class="subtitle-2 grey--text mb-2">{{ locales.characterBirth }}</div>
                    <div class="stack">
                        <div class="split mb-4">
                            <template v-if="dayValid">
                                <v-icon class="green--text mr-3 pb-1">icon-checkmark</v-icon>
                            </template>
                            <template v-else>
                                <v-icon class="red--text mr-3 pb-1">icon-error</v-icon>
                            </template>
                            <v-text-field
                                :label="locales.LABEL_DAY"
                                :rules="dayRules"
                                v-model="day" 
                                autocomplete="off"
                                type="number"
                            />
                        </div>

                        <div class="split mb-4">
                            <template v-if="monthValid">
                                <v-icon class="green--text mr-3 pb-1">icon-checkmark</v-icon>
                            </template>
                            <template v-else>
                                <v-icon class="red--text mr-3 pb-1">icon-error</v-icon>
                            </template>
                            <v-text-field
                                :label="locales.LABEL_MONTH"
                                :rules="monthRules"
                                v-model="month" 
                                autocomplete="off"
                                type="number"
                                dense
                            />
                        </div>

                        <div class="split mb-4">
                            <template v-if="yearValid">
                                <v-icon class="green--text mr-3 pb-1">icon-checkmark</v-icon>
                            </template>
                            <template v-else>
                                <v-icon class="red--text mr-3 pb-1">icon-error</v-icon>
                            </template>
                            <v-text-field
                                :label="locales.LABEL_YEAR"
                                :rules="yearRules"
                                v-model="year" 
                                autocomplete="off"
                                type="number"
                            />
                        </div>
                    </div>
                </div>

                <div class="stack">
                    <div class="overline blue-grey--text">{{ locales.LABEL_GENDER }}</div>
                    <div class="subtitle-2 grey--text mb-2">{{ locales.characterGender }}</div>
                    <div class="split">
                        <template v-if="genderValid">
                            <v-icon class="green--text mr-3 pb-1">icon-checkmark</v-icon>
                        </template>
                        <template v-else>
                            <v-icon class="red--text mr-3 pb-1">icon-error</v-icon>
                        </template>
                        <v-text-field type="text" :placeholder="locales.LABEL_CHARACTER_GENDER" v-model="gender" />
                    </div>
                </div>

                <div class="stack" v-if="isVerified">
                    <div class="overline green--text">{{ locales.LABEL_VERIFIED }}</div>
                    <div class="button-group flex-grow-1">
                    <template v-if="!processing">
                        <button style="width: 100%" @click="save">
                            <span class="overline green--text">{{ locales.LABEL_SAVE }}</span>
                        </button>
                    </template>
                    <template v-else>
                        <button style="width: 100%">
                            <v-progress-circular
                                indeterminate
                                color="green"
                            ></v-progress-circular>
                        </button>
                    </template>
                </div>
            </div>
        </template>
    `
});
