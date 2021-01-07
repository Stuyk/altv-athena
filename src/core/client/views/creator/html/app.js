Vue.config.devtools = true;
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
                age: 18,
                gender: 'none',
                name: 'John_Dane'
            },
            navOptions: ['Sex', 'Structure', 'Hair', 'Overlays', 'Decor', 'Info', 'Done'],
            navOptionsIcons: [
                { icon: 'icon-orientation' },
                { icon: 'icon-cogs' },
                { icon: 'icon-hair' },
                { icon: 'icon-details1' },
                { icon: 'icon-makeup' },
                { icon: 'icon-id-card' },
                { icon: 'icon-check' }
            ],
            navOptionsTitles: ['Appearance', 'Structure', 'Hair', 'Details', 'Makeup', 'Info', 'Done'],
            noDiscard: false,
            noName: false,
            validInfoData: false,
            drawer: true,
            mini: true,
            totalCharacters: 1
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
        },
        getTabComponent: function () {
            return `tab-${this.navOptions[this.selection].toLowerCase()}`;
        }
    },
    methods: {
        setReady(noDiscard = true, noName = true) {
            if (this.show) {
                return;
            }

            this.noDiscard = noDiscard;
            this.noName = noName;
            this.show = true;

            if ('alt' in window) {
                alt.emit('creator:ReadyDone');
            }
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
        goNavigate(value) {
            this.selection = value;

            // Info
            if ('alt' in window) {
                alt.emit('creator:DisableControls', this.selection === 5 ? true : false);
            }
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

            if ('alt' in window) {
                alt.emit('creator:Sync', this.data, true);
            }
        },
        resetSelection() {
            this.selection = 0;
        },
        isVerified(isValid) {
            this.validInfoData = isValid;
        }
    },
    mounted() {
        this.$root.$on('updateCharacter', this.updateCharacter);
        this.$root.$on('resetSelection', this.resetSelection);
        this.$root.$on('isVerified', this.isVerified);

        overlaysTemplateList.forEach((overlay) => {
            const overlayData = { ...overlay };
            overlayData.value = 0;
            delete overlayData.key;
            delete overlayData.max;
            delete overlayData.min;
            delete overlayData.label;
            delete overlayData.increment;

            this.data.opacityOverlays.push(overlayData);
        });

        colorOverlays.forEach((overlay) => {
            const overlayData = { ...overlay };
            overlayData.value = 0;
            delete overlayData.key;
            delete overlayData.max;
            delete overlayData.min;
            delete overlayData.label;
            delete overlayData.increment;

            this.data.colorOverlays.push(overlayData);
        });

        this.$nextTick(() => {
            if ('alt' in window) {
                alt.on('creator:Ready', this.setReady);
                alt.on('creator:SetData', this.setData);
                alt.emit('ready');
            } else {
                this.show = true;
            }
        });

        console.log(`Loaded Character Creator`);
    }
});
