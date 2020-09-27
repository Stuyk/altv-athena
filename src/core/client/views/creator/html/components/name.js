const nameRegex = new RegExp('^([A-Z][a-z]+_[A-Z][a-z]+)$');

Vue.component('tab-name', {
    props: ['data', 'noname', 'currentname'],
    data() {
        return {
            name: '',
            nameValid: false
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
    watch: {
        name(newValue) {
            if (!nameRegex.exec(newValue)) {
                this.nameValid = false;
                this.$root.$emit('updateName', newValue, false);
                return;
            }

            this.nameValid = true;
            this.$root.$emit('updateName', newValue, true);
        }
    },
    template: `
        <div class="options">
            <div class="option" v-if="!isNoName">
                <div class="labelContainer">
                    <div class="label">
                        Specify your character name.
                    </div>
                    <div class="value">
                        Example: John_Doe
                    </div>
                </div>
                <input type="text" value="currentname" placeholder="First_Last" class="textInput" v-model="name" :class="isNameValid" />
            </div>
            <div class="option" v-else>
                <div class="labelContainer">
                    <div class="label" style="text-align: center; width: 100%">
                        You have already provided your character name.
                    </div>
                </div>
            </div>
        </div>
    `,
    mounted() {
        this.name = this.currentname;
    }
});
