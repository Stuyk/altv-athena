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
            genderValid: false
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
        }
    },
    watch: {
        name(newValue) {
            if (!nameRegex.exec(newValue)) {
                this.nameValid = false;
                this.data.name = newValue;
                return;
            }

            this.nameValid = true;
            this.data.name = newValue;
            this.verifyAllCorrect();
        },
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
    template: `
        <v-container class="containerHelper">
            <p class="text-sm-left font-weight-bold mb-1 orange--text text--accent-1 subtitle-2">
                Tell Us About Yourself
            </p>
            <div class="d-flex flex-row justify-content-space-between">
                <v-icon v-if="nameValid" small class="pr-5 green--text text--lighten-2">fa-check</v-icon>
                <v-icon v-if="!nameValid" small class="pr-5 error--text text--lighten-2">fa-times</v-icon>
                <v-text-field type="text" label="Your Name (Ex. John_Doe)" type="text" value="currentname" v-model="name" />
            </div>
            <div class="d-flex flex-row justify-content-space-between">
                <v-icon v-if="ageValid" small class="pr-5 green--text text--lighten-2">fa-check</v-icon>
                <v-icon v-if="!ageValid" small class="pr-5 error--text text--lighten-2">fa-times</v-icon>
                <v-text-field class="flex-grow-1" type="number" label="Your Age" type="text" value="infoData.age" v-model="age" />
            </div>
            <div class="d-flex flex-row justify-content-space-between">
                <v-icon v-if="genderValid" small class="pr-5 green--text text--lighten-2">fa-check</v-icon>
                <v-icon v-if="!genderValid" small class="pr-5 error--text text--lighten-2">fa-times</v-icon>
                <v-text-field class="flex-grow-1" type="text" label="Your Gender" type="text" value="infoData.gender" v-model="gender" />
            </div>
        </v-container>
    `,
    mounted() {
        this.name = this.currentname;
        this.age = this.infodata.age;
        this.gender = this.infodata.gender;
    }
});
