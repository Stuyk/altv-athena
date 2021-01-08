Vue.config.devtools = true;
Vue.prototype.window = window;

const exampleCharacter = {
    _id: '5f7117a3fd8d0a66b02eb998',
    pos: { x: -734.5714111328125, y: -264.4747314453125, z: 37.03076171875 },
    cash: 25,
    bank: 50,
    rewardPoints: 0,
    info: {
        age: 18,
        gender: 'male'
    },
    name: 'Kodi_Fanooli',
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
        opacityOverlays: [0, 0, 0, 0, 0, 0],
        sex: 1,
        skinFather: 16,
        skinMix: 0.1,
        skinMother: 23
    },
    account_id: '5f70bb5e829f5c3e80aa4192',
    position: { x: -740.6505737304688, y: -254.8219757080078, z: 37.03076171875 },
    characterIndex: 0
};

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            characters: [],
            statNames: [
                /* Name of the stat, variable name inside character object */
                { varName: 'Name', varRef: 'name' },
                { varName: 'Age', varRef: 'age', suffix: ' Years Old', useInfo: true },
                { varName: 'Gender', varRef: 'gender', useInfo: true },
                { varName: 'Reward Points', varRef: 'rewardPoints', suffix: ' Hours' },
                { varName: 'Cash', varRef: 'cash', prefix: '$' },
                { varName: 'Bank', varRef: 'bank', prefix: '$' }
            ],
            characterIndex: 0,
            deleteDialog: false
        };
    },
    computed: {
        hasCharacters() {
            return this.characters.length >= 2;
        }
    },
    methods: {
        handleSet(characters) {
            this.characterIndex = 0;
            this.characters = characters;
            this.updateAppearance();
        },
        setIndex(value) {
            this.characterIndex = value;
            this.updateAppearance();
        },
        updateAppearance() {
            if ('alt' in window) {
                alt.emit('characters:Update', this.characters[this.characterIndex].appearance);
            }
        },
        selectCharacter() {
            if ('alt' in window) {
                alt.emit('characters:Select', this.characters[this.characterIndex]._id);
            }
        },
        newCharacter() {
            if ('alt' in window) {
                alt.emit('characters:New');
            }
        },
        deleteCharacter() {
            if ('alt' in window) {
                alt.emit('characters:Delete', this.characters[this.characterIndex]._id);
            }
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('characters:Set', this.handleSet);
            alt.emit('ready');
        } else {
            this.characters = [
                exampleCharacter,
                { ...exampleCharacter, ...{ appearance: { sex: 0 }, name: 'Jobi_Jobonai' } }
            ];
        }
    }
});
