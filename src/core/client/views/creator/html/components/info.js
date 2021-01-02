const nameRegex = new RegExp('^([A-Z][a-z]+_[A-Z][a-z]+)$');

Vue.component('tab-info', {
    props: ['data', 'infodata'],
    data() {
        return {
            name: '',
            age: 0,
            gender: '',
            nameValid: false,
            ageValid: false,
            genderValid: false,
            isNameAvailable: false,
            firstTime: true
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
        nameChanged(newValue) {
            if (!newValue) {
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
            if (newValue >= 18 && newValue <= 90) {
                this.ageValid = true;
                this.infodata.age = parseInt(newValue).toFixed(0);
                this.verifyAllCorrect();
                return;
            }

            this.ageValid = false;
            this.infodata.age = 18;
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
        <v-container class="containerHelper transparent">
            <div class="d-flex flex-column justify-space-between fill-height" block fluid>
                <v-card class="d-flex flex-column elevation-2 mb-2 pa-3 grey darken-3 fill-height" block fluid>
                    <span class="text-md-body-1 light-blue--text text--lighten-3 mb-1" block>
                        Tell Us About Yourself
                    </span>
                    <div class="d-flex flex-row justify-content-space-between">
                        <template v-if="this.isNameAvailable !== null">
                            <v-icon v-if="nameValid" small class="pr-5 green--text text--lighten-2">icon-check</v-icon>
                            <v-icon v-if="!nameValid" small class="pr-5 error--text text--lighten-2">icon-times</v-icon>
                        </template>
                        <template v-else>
                            <v-icon small class="spinner yellow--text text--lighten-2">icon-spinner</v-icon>
                            <span class="pr-5"></span>
                        </template>
                        <v-text-field type="text" label="Your Name (Ex. John_Doe)" value="infodata.name" v-model="name" @change="nameChanged" />
                    </div>
                    <div class="d-flex flex-row justify-content-space-between">
                        <v-icon v-if="ageValid" small class="pr-5 green--text text--lighten-2">icon-check</v-icon>
                        <v-icon v-if="!ageValid" small class="pr-5 error--text text--lighten-2">icon-times</v-icon>
                        <v-text-field class="flex-grow-1" type="number" label="Your Age" value="infoData.age" v-model="age" />
                    </div>
                    <div class="d-flex flex-row justify-content-space-between">
                        <v-icon v-if="genderValid" small class="pr-5 green--text text--lighten-2">icon-check</v-icon>
                        <v-icon v-if="!genderValid" small class="pr-5 error--text text--lighten-2">icon-times</v-icon>
                        <v-text-field class="flex-grow-1" type="text" label="Your Gender" value="infoData.gender" v-model="gender" />
                    </div>
                    <p class="text-caption">Once the information above is filled out you may proceed to the 'done' page.</p>
                </v-card>
            </div>
        </v-container>
    `
});
