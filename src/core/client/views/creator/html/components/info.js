const nameRegex = new RegExp('^([A-Z][a-z]+_[A-Z][a-z]+)$');

Vue.component('tab-info', {
    props: ['data', 'infodata'],
    data() {
        return {
            first: '',
            last: '',
            age: new Date().toISOString().substr(0, 10),
            gender: null,
            nameValid: false,
            ageValid: false,
            genderValid: false,
            isNameAvailable: false,
            firstTime: true,
            nameRules: [
                (v) => !!v || 'This field is required',
                (v) => (v && v !== '') || 'This field is required',
                (v) => (v && nameRegex.test(v)) || 'No special characters. Greater than 5. Less than 16.'
            ]
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
            if (!this.nameValid || !this.ageValid || !this.genderValid) {
                this.$root.$emit('isVerified', false);
                return;
            }

            this.$root.$emit('isVerified', true);
        },
        disableControls() {
            if ('alt' in window) {
                alt.emit('creator:DisableControls', true);
            }
        },
        handleNameAvailable(result) {
            this.isNameAvailable = result;

            if (!this.isNameAvailable) {
                this.nameValid = false;
                return;
            }

            this.nameValid = true;
            this.verifyAllCorrect();
        }
    },
    watch: {
        age(newValue) {
            const currentYear = new Date(Date.now()).getFullYear();
            const date = new Date(newValue);
            const age = currentYear - date.getFullYear();

            if (age < 18) {
                this.ageValid = false;
                this.infodata.age = new Date().toISOString().substr(0, 10);
                this.verifyAllCorrect();
                return;
            }

            this.ageValid = true;
            this.infodata.age = newValue;
            this.verifyAllCorrect();
            return;
        },
        gender(newValue) {
            if (newValue.length >= 4 && newValue.toLowerCase() !== 'none') {
                this.genderValid = true;
                this.infodata.gender = newValue;
                this.verifyAllCorrect();
                return;
            }

            this.genderValid = false;
            this.infodata.gender = newValue;
        },
        first(newValue) {
            if (!newValue.includes('_')) {
                return;
            }

            if (!nameRegex.exec(newValue)) {
                this.nameValid = false;
                this.infodata.name = newValue;
                return;
            }

            this.isNameAvailable = null;
            this.infodata.name = newValue;

            if ('alt' in window) {
                alt.emit('creator:CheckName', newValue);
                alt.emit('creator:DisableControls', false);
            }
        }
    },
    mounted() {
        this.name = this.infodata.name;
        this.age = this.infodata.age;
        this.gender = this.infodata.gender;

        if ('alt' in window) {
            alt.on('creator:IsNameAvailable', this.handleNameAvailable);
        }
    },
    template: `
        <div class="contentWrapper">
            <div class="group pt-3 pb-3">
                <div class="subtitle light-blue--text text-left">
                    We need some more information before we let you make your character. 
                    <br />
                    <br />
                    Please fill out the forms below.
                </div>
            </div>
            <div class="group pb-3">
                <v-divider></v-divider>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    What is your character's name?
                </div>
            </div>
            <div class="group pt-3">
                <template v-if="this.isNameAvailable !== null">
                    <v-icon v-if="nameValid" small class="pr-5 green--text text--lighten-2">icon-check</v-icon>
                    <v-icon v-if="!nameValid" small class="pr-5 error--text text--lighten-2">icon-times-circle</v-icon>
                </template>
                <template v-else>
                    <v-icon small class="spinner yellow--text text--lighten-2">icon-spinner</v-icon>
                    <span class="pr-5"></span>
                </template>
                <v-text-field
                    label="First Name & Last Name (ex. John_Doe)"
                    placeholder="John_Doe"
                    :rules="nameRules"
                    v-model="first"
                    hide-details="auto"
                    outlined
                    dense
                    @focus="disableControls"
                >
                </v-text-field>
            </div>
            <div class="group pt-3 pb-3">
                <v-divider></v-divider>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                    When is your character's Birthday?
                </div>
            </div>
            <div class="group pt-3">
                <v-icon v-if="ageValid" small class="pr-5 green--text text--lighten-2">icon-check</v-icon>
                <v-icon v-if="!ageValid" small class="pr-5 error--text text--lighten-2">icon-times-circle</v-icon>
                <v-date-picker
                    v-model="age"
                    full-width
                >
                </v-date-picker>
            </div>
            <div class="group pb-3 pt-6">
                <v-divider></v-divider>
            </div>
            <div class="group">
                <div class="overline pa-0 ma-0 grey--text">
                   What is your character's Gender?
                </div>
            </div>
            <div class="group">
                <v-icon v-if="genderValid" small class="pr-5 green--text text--lighten-2">icon-check</v-icon>
                <v-icon v-if="!genderValid" small class="pr-5 error--text text--lighten-2">icon-times-circle</v-icon>
                <v-radio-group v-model="gender" class="flex-grow-1" mandatory>
                    <v-radio label="Female" value="female" off-icon="icon-circle-o" on-icon="icon-circle2"></v-radio>
                    <v-radio label="Male" value="male" off-icon="icon-circle-o" on-icon="icon-circle2"></v-radio>
                    <v-radio label="Other" value="other" off-icon="icon-circle-o" on-icon="icon-circle2"></v-radio>
                </v-radio-group>
            </div>
            <div class="group pb-3">
                <v-divider></v-divider>
            </div>
        </div>
        <v-container class="containerHelper transparent">
            <div class="d-flex flex-column justify-space-between fill-height" block fluid>
                    <div class="d-flex flex-row justify-content-space-between">
                        <v-icon v-if="genderValid" small class="pr-5 green--text text--lighten-2">icon-check</v-icon>
                        <v-icon v-if="!genderValid" small class="pr-5 error--text text--lighten-2">icon-times-circle</v-icon>
                        <v-text-field
                            class="flex-grow-1"
                            type="text"
                            label="Your Gender"
                            value="infoData.gender"
                            v-model="gender"
                        />
                    </div>
                    <p class="text-caption">
                        Once the information above is filled out you may proceed to the 'done' page.
                    </p>
                </v-card>
            </div>
        </v-container>
    `
});
