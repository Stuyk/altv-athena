Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: { dark: true },
        icons: {
            iconfont: 'fa'
        }
    }),
    data() {
        return {
            show: false,
            selection: 0,
            data: {
                sex: 1,
                faceMother: 0,
                faceFather: 0,
                skinMother: 0,
                skinFather: 0,
                skinMix: 0.5,
                faceMix: 0.5,
                structure: new Array(20).fill(0),
                hair: 3,
                hairColor1: 1,
                hairColor2: 5,
                hairOverlay: '',
                facialHair: 29,
                facialHairColor1: 0,
                facialHairOpacity: 0,
                eyebrows: 0,
                eyebrowsOpacity: 1,
                eyebrowsColor1: 0,
                eyes: 0,
                opacityOverlays: [],
                colorOverlays: []
            },
            infoData: {
                age: new Date(1990, 1, 1),
                gender: null,
                name: ''
            },
            navOptions: [
                AppearanceComponent,
                StructureComponent,
                HairComponent,
                OverlaysComponent,
                MakeupComponent,
                InfoComponent
            ],
            noDiscard: false,
            noName: false,
            totalCharacters: 1,
            locales: DefaultLocales,
            url: 'http://localhost:9111'
        };
    },
    computed: {
        isInactive() {
            if (this.selection >= this.navOptions.length - 1) {
                return true;
            }

            if (this.selection === 5 && !this.noName && !this.validInfoData) {
                return true;
            }

            return false;
        },
        isInactiveNext() {
            if (this.selection >= this.navOptions.length - 1) {
                return true;
            }

            if (this.selection === 5 && !this.noName && !this.validInfoData) {
                return true;
            }

            return false;
        },
        isInactiveBack() {
            if (this.selection <= 0) {
                return true;
            }

            return false;
        }
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        incrementIndex() {
            if (this.selection + 1 >= this.navOptions.length) {
                this.selection = this.navOptions.length - 1;
                return;
            }

            this.selection += 1;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        decrementIndex() {
            if (this.selection - 1 <= -1) {
                this.selection = 0;
                return;
            }

            this.selection -= 1;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        setReady(noDiscard = true, noName = true) {
            if (this.show) {
                return;
            }

            this.noDiscard = noDiscard;
            this.noName = noName;
            this.show = true;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('creator:ReadyDone');
        },
        setData(oldData, totalCharacters) {
            this.totalCharacters = totalCharacters;

            if (!oldData) {
                this.updateCharacter();
                return;
            }

            this.data = oldData;
            this.updateCharacter();
        },
        updateCharacter() {
            const isFemale = this.data.sex === 0;
            this.data.hairOverlay = isFemale ? femaleHairOverlays[this.data.hair] : maleHairOverlays[this.data.hair];

            if (isFemale) {
                this.data.facialHair = 30;
                this.data.facialHairOpacity = 0;
            }

            // Update Floats
            this.data.skinMix = parseFloat(this.data.skinMix);
            this.data.faceMix = parseFloat(this.data.faceMix);

            if (!('alt' in window)) {
                return;
            }

            alt.emit('creator:Sync', this.data);
            alt.emit('play:Sound', 'HIGHLIGHT_NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        resetSelection() {
            this.selection = 0;
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        }
    },
    mounted() {
        this.$root.$on('updateCharacter', this.updateCharacter);
        this.$root.$on('resetSelection', this.resetSelection);

        OverlaysList.forEach((overlay) => {
            const overlayData = { ...overlay };
            overlayData.value = 0;
            delete overlayData.key;
            delete overlayData.max;
            delete overlayData.min;
            delete overlayData.label;
            delete overlayData.increment;

            this.data.opacityOverlays.push(overlayData);
        });

        MakeupList.forEach((overlay) => {
            const overlayData = { ...overlay };
            overlayData.value = 0;
            delete overlayData.key;
            delete overlayData.max;
            delete overlayData.min;
            delete overlayData.label;
            delete overlayData.increment;

            this.data.colorOverlays.push(overlayData);
        });

        if (!('alt' in window)) {
            this.show = true;
            return;
        }

        alt.on('creator:Ready', this.setReady);
        alt.on('creator:SetData', this.setData);
        alt.on('creator:SetLocales', this.setLocales);
        alt.on('url', this.setURL);

        this.$nextTick(() => {
            alt.emit('ready');
            alt.emit('url');
        });
    }
});
