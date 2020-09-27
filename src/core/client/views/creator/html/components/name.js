Vue.component('tab-name', {
    props: ['data', 'noname'],
    computed: {
        isNoName() {
            return this.noname;
        }
    },
    methods: {
        saveCharacter() {
            if (this.data.sex === 0) {
                this.data.facialHair = 29;
                this.data.facialHairColor1 = 0;
            }

            if ('alt' in window) {
                alt.emit('character:Done', this.data);
            }
        },
        discardCharacter() {
            if ('alt' in window) {
                alt.emit('character:Cancel');
            }
        },
        importCharacter() {
            const characterJSON = this.$refs.textarea.value;
            let character;
            try {
                character = JSON.parse(characterJSON);
            } catch (err) {
                this.$refs.textarea.value = `INVALID CHARACTER JSON CODE. RESETTING...`;

                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                }

                this.timeout = setTimeout(() => {
                    this.$refs.textarea.value = JSON.stringify(this.data, null, '\t');
                }, 2500);
                return;
            }

            Object.keys(character).forEach((key) => {
                this.data[key] = character[key];
            });

            this.$root.$emit('updateCharacter');
            this.$root.$emit('resetSelection');
        },
        copyAll() {
            this.$refs.textarea.select();
            document.execCommand('copy');
        }
    },
    template: `
        <div class="options" style="min-height: unset">
            <div class="option" v-if="!isNoName">
                <div class="labelContainer">
                    <div class="label">
                        Specify your character name.
                    </div>
                    <div class="value">
                        Example: John_Doe
                    </div>
                </div>
                <input type="text" placeholder="FirstName_LastName"/>
            </div>
            <div class="option" v-else>
                <div class="labelContainer">
                    <div class="label" style="text-align: center; width: 100%">
                        You have already provided your character name.
                    </div>
                </div>
            </div>
        </div>
    `
});
