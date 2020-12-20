Vue.config.devtools = true;
Vue.prototype.window = window;

const exampleCharacter = {
    _id: '5f7117a3fd8d0a66b02eb998',
    age: 0,
    pos: { x: -734.5714111328125, y: -264.4747314453125, z: 37.03076171875 },
    cash: 0,
    bank: 0,
    appearance: {
        colorOverlays: [0, 0, 0],
        eyebrows: 0,
        eyes: 3,
        eyebrowsColor1: 4,
        eyebrowsOpacity: 1,
        faceMix: 0.5,
        facialHairOpacity: 1,
        faceFather: 44,
        faceMother: 38,
        facialHair: 29,
        facialHairColor1: 0,
        hair: 68,
        hairColor1: 5,
        hairColor2: 8,
        hairOverlay: { collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_M' },
        structure: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        name: 'Jane_Dane',
        opacityOverlays: [0, 0, 0, 0, 0, 0],
        sex: 1,
        skinFather: 16,
        skinMix: 0.1,
        skinMother: 23
    },
    account_id: '5f70bb5e829f5c3e80aa4192',
    position: { x: -740.6505737304688, y: -254.8219757080078, z: 37.03076171875 }
};

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data() {
        return {
            characters: [],
            index: 0
        };
    },
    computed: {
        getName() {
            const char = this.characters[this.index];
            return char.appearance && char.appearance.name
                ? char.appearance.name.replace('_', ' ')
                : 'No Name Specified';
        },
        getAge() {
            const char = this.characters[this.index];
            return char.age;
        },
        getCash() {
            const char = this.characters[this.index];
            return char.cash.toLocaleString();
        },
        getBank() {
            const char = this.characters[this.index];
            return char.bank.toLocaleString();
        },
        getRewardPoints() {
            const char = this.characters[this.index];
            return char.rewardPoints ? 60 / (char.rewardPoints * 5) : 0;
        },
        hasCharacters() {
            return this.characters.length >= 2;
        }
    },
    methods: {
        handleSet(characters) {
            this.characters = characters;
            this.updateAppearance();
        },
        goBack() {
            this.index -= 1;
            if (this.index <= -1) {
                this.index = this.characters.length - 1;
            }

            this.updateAppearance();
        },
        goNext() {
            this.index += 1;
            if (this.index >= this.characters.length) {
                this.index = 0;
            }

            this.updateAppearance();
        },
        updateAppearance() {
            if ('alt' in window) {
                alt.emit('characters:Update', this.characters[this.index].appearance);
            }
        },
        selectCharacter() {
            if ('alt' in window) {
                alt.emit('characters:Select', this.characters[this.index]._id);
            }
        },
        newCharacter() {
            if ('alt' in window) {
                alt.emit('characters:New');
            }
        },
        deleteCharacter() {
            // Verify with user first.

            if ('alt' in window) {
                alt.emit('characters:Delete', this.characters[this.index]._id);
            }
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('characters:Set', this.handleSet);
        } else {
            this.characters = [exampleCharacter, exampleCharacter];
        }
    }
});
