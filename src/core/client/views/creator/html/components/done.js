Vue.component('tab-done', {
    props: ['data', 'nodiscard', 'noname'],
    computed: {
        isNoDiscord() {
            return this.nodiscard;
        }
    },
    methods: {
        saveCharacter() {
            if (this.data.sex === 0) {
                this.data.facialHair = 29;
                this.data.facialHairColor1 = 0;
            }

            if ('alt' in window) {
                alt.emit('creator:Done', this.data);
            }
        },
        discardCharacter() {
            if ('alt' in window) {
                alt.emit('creator:Cancel');
            }
        }
    },
    template: `
        <div class="options">
            <p>All finished designing your character?</p>
            <div class="option">
                <button class="full" @click="saveCharacter" style="margin-bottom: 12px">Save</button>
                <button class="full danger" @click="discardCharacter" v-if="!isNoDiscord">Discard</button>
            </div>
        </div>
    `
});
