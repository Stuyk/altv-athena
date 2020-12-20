Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: {dark: true }}),
    data() {
        return {
            show: false,
            selection: 3,
            data: {
                name: '',
                sex: 1,
                faceFather: 33,
                faceMother: 45,
                skinFather: 45,
                skinMother: 45,
                faceMix: 0.5,
                skinMix: 0.5,
                structure: new Array(20).fill(0),
                hair: 11,
                hairColor1: 5,
                hairColor2: 2,
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
            navOptions: ['Sex', 'Structure', 'Hair', 'Overlays', 'Decor', 'Name', 'Done'],
            noDiscard: false,
            noName: false,
            validName: false
        };
    },
    computed: {
        isInactive() {
            if (this.selection >= this.navOptions.length - 1) {
                return true;
            }

            if (this.selection === 5 && !this.noName && !this.validName) {
                return true;
            }

            return false;
        },
        isInactiveNext() {
            if (this.selection >= this.navOptions.length - 1) {
                return true;
            }

            if (this.selection === 5 && !this.noName && !this.validName) {
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
        setData(oldData) {
            if (!oldData) {
                this.updateCharacter();
                return;
            }

            this.data = oldData;
            this.updateCharacter();
        },
        goNext() {
            if (this.selection >= this.navOptions.length - 1) {
                return;
            }

            this.selection += 1;
        },
        goBack() {
            if (this.selection <= 0) {
                return;
            }

            this.selection -= 1;
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
                alt.emit('creator:Sync', this.data);
            }
        },
        resetSelection() {
            this.selection = 0;
        },
        updateName(name, isValid) {
            this.data.name = name;
            this.validName = isValid;
        }
    },
    mounted() {
        this.$root.$on('updateCharacter', this.updateCharacter);
        this.$root.$on('resetSelection', this.resetSelection);
        this.$root.$on('updateName', this.updateName);

        opacityOverlays.forEach((overlay) => {
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
            } else {
                this.show = true;
            }
        });
    }
});
