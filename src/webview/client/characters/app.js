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
    name: 'Arachnid_Monolith_Name_Face',
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
    characterIndex: 0,
    hours: 40.55555555
};

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            characters: [],
            locales: {
                LABEL_DELETE: 'Delete',
                LABEL_NEW: 'New',
                LABEL_SELECT: 'Select',
                LABEL_YES: 'Yes',
                LABEL_NO: 'No',
                LABEL_CONFIRM_DELETE: 'Are you sure you want to delete your character',
                LABEL_NAME: 'Name',
                LABEL_AGE: 'Age',
                LABEL_GENDER: 'Gender',
                LABEL_HOURS: 'Hours',
                LABEL_CASH: 'Cash',
                LABEL_BANK: 'Bank'
            },
            statNames: [],
            characterIndex: 0,
            deleteDialog: false,
            url: 'http://localhost:9111'
        };
    },
    computed: {
        hasCharacters() {
            return this.characters.length >= 2;
        }
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        pruneDecimals(value) {
            try {
                if (value === null || value === undefined) {
                    return 0;
                }

                if (isNaN(value)) {
                    return value;
                }

                return value.toFixed(2);
            } catch (err) {
                return value;
            }
        },
        handleSet(characters) {
            this.characterIndex = 0;
            this.characters = characters;
            this.updateAppearance();
        },
        incrementIndex() {
            this.characterIndex += 1;
            if (this.characterIndex > this.characters.length - 1) {
                this.characterIndex = 0;
            }
            this.updateAppearance();

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        decrementIndex() {
            this.characterIndex -= 1;
            if (this.characterIndex <= -1) {
                this.characterIndex = this.characters.length - 1;
            }
            this.updateAppearance();

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        updateAppearance() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('characters:Update', this.characters[this.characterIndex].appearance);

            setTimeout(() => {
                alt.emit('characters:Equipment', this.characters[this.characterIndex].equipment);
            }, 500);
        },
        selectCharacter() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('characters:Select', this.characters[this.characterIndex]._id);
        },
        newCharacter() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('characters:New');
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        showDeleteInterface() {
            this.deleteDialog = true;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        hideDeleteInterface() {
            this.deleteDialog = false;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        deleteCharacter() {
            this.deleteDialog = false;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('characters:Delete', this.characters[this.characterIndex]._id);
            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        setLocales(localeObject) {
            this.locales = localeObject;
            this.updateLocales(true);
        },
        updateLocales(skipDefault = false) {
            this.statNames = [
                /* Name of the stat, variable name inside character object */
                { varName: this.locales.LABEL_NAME, varRef: 'name' },
                { varName: this.locales.LABEL_AGE, varRef: 'age', useInfo: true },
                { varName: this.locales.LABEL_GENDER, varRef: 'gender', useInfo: true },
                { varName: this.locales.LABEL_HOURS, varRef: 'hours' },
                { varName: this.locales.LABEL_CASH, varRef: 'cash', prefix: '$' },
                { varName: this.locales.LABEL_BANK, varRef: 'bank', prefix: '$' }
            ];
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('characters:SetLocale', this.setLocales);
            alt.on('characters:Set', this.handleSet);
            alt.on('url', this.setURL);
            alt.emit('url');
            alt.emit('characters:Ready');
            alt.emit('ready');
        } else {
            this.characters = [
                exampleCharacter,
                { ...exampleCharacter, ...{ appearance: { sex: 0 }, name: 'Jobi_Jobonai' } }
            ];
        }

        this.updateLocales();
    }
});
