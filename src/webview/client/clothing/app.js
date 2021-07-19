Vue.prototype.window = window;

const plainText = new RegExp(/^[a-zA-Z 0-9]{3,32}$/);
const plainTextDesc = new RegExp(/^[a-zA-Z 0-9]{3,64}$/);

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            // Super Important Component Data
            // Component Data corresponds with their slot order.
            // So the first element is the first slot of the equipment.
            name: '',
            desc: '',
            componentIndex: 0,
            cost: 0,
            inputSelected: false,
            shirtNames: [],
            components: [],
            allPassing: false,
            nameValid: false,
            descValid: false,
            locales: DefaultLocale,
            url: 'http://localhost:9111'
        };
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        incrementComponent(index, dataName) {
            const newComponents = [...this.components];
            newComponents[this.componentIndex][dataName][index] += 1;

            if (dataName === 'drawables') {
                newComponents[this.componentIndex].textures[index] = 0;
                console.log(`Set texture back to zero for switching drawable`);
            }

            if (dataName === 'drawables') {
                const maxValue = newComponents[this.componentIndex].maxDrawables[index];
                if (newComponents[this.componentIndex].drawables[index] > maxValue) {
                    newComponents[this.componentIndex].drawables[index] = 0;
                }
            }

            if (dataName === 'textures') {
                const maxValue = newComponents[this.componentIndex].maxTextures[index];
                if (newComponents[this.componentIndex].textures[index] > maxValue) {
                    newComponents[this.componentIndex].textures[index] = 0;
                }
            }

            if ('alt' in window) {
                alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            }

            this.components = newComponents;
            this.updatePlayerComponents();
        },
        decrementComponent(index, dataName) {
            const newComponents = [...this.components];
            newComponents[this.componentIndex][dataName][index] -= 1;

            if (dataName === 'drawables') {
                newComponents[this.componentIndex].textures[index] = 0;
            }

            if (dataName === 'drawables') {
                const maxValue = newComponents[this.componentIndex].maxDrawables[index];
                if (newComponents[this.componentIndex].drawables[index] < 0) {
                    newComponents[this.componentIndex].drawables[index] = maxValue;
                }
            }

            if (dataName === 'textures') {
                const maxValue = newComponents[this.componentIndex].maxTextures[index];
                if (newComponents[this.componentIndex].textures[index] <= -1) {
                    newComponents[this.componentIndex].textures[index] = maxValue;
                }
            }

            if ('alt' in window) {
                alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            }

            this.components = newComponents;
            this.updatePlayerComponents();
        },
        updatePlayerComponents() {
            if (!('alt' in window)) {
                return;
            }

            this.handleBlur();
            alt.emit('clothing:Update', this.components);
        },
        incrementIndex() {
            if (this.componentIndex + 1 >= this.components.length) {
                this.componentIndex = 0;
                return;
            }

            this.componentIndex += 1;

            if (!('alt' in window)) {
                return;
            }

            this.handleBlur();
            alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        decrementIndex() {
            if (this.componentIndex - 1 <= -1) {
                this.componentIndex = this.components.length - 1;
                return;
            }

            this.componentIndex -= 1;

            if (!('alt' in window)) {
                return;
            }

            this.handleBlur();
            alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        handlePropagation(arrayOfComponentData) {
            this.components = arrayOfComponentData;
        },
        handleClose(ev) {
            if (ev.keyCode !== 27) {
                return;
            }

            document.removeEventListener('keyup', this.handleClose);
            this.exit();
        },
        exit() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('clothing:Exit');
        },
        purchaseComponent() {
            const componentData = JSON.parse(JSON.stringify(this.components[this.componentIndex]));
            delete componentData.maxDrawables;
            delete componentData.maxTextures;
            delete componentData.name;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('clothing:Purchase', this.componentIndex, componentData, this.name, this.desc);
        },
        handleFocus() {
            this.inputSelected = true;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('clothing:DisableControls', true);
        },
        handleBlur() {
            this.inputSelected = false;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('clothing:DisableControls', false);
        },
        toggleLock() {
            this.inputSelected = !this.inputSelected;

            if (!('alt' in window)) {
                return;
            }

            alt.emit('play:Sound', 'TOGGLE_ON', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('clothing:DisableControls', this.inputSelected);
        },
        setLocales(localeObject) {
            this.locales = localeObject;
            this.updateLocales(true);
        },
        updateLocales(skipDefault = false) {
            if (!skipDefault) {
                this.locales = DefaultLocale;
            }

            this.shirtNames = [this.locales.LABEL_TOP, this.locales.LABEL_UNDERSHIRT, this.locales.LABEL_TORSO];
            this.components = [
                {
                    name: this.locales.LABEL_HAT,
                    ids: [0],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: true
                },
                {
                    name: this.locales.LABEL_MASK,
                    ids: [1],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                },
                {
                    name: this.locales.LABEL_SHIRT,
                    ids: [11, 8, 3],
                    drawables: [0, 0, 0],
                    textures: [0, 0, 0],
                    maxValues: [0, 0, 0],
                    maxDrawables: [0, 0, 0],
                    maxTextures: [0, 0, 0],
                    isProp: false
                },
                {
                    name: this.locales.LABEL_BOTTOMS,
                    ids: [4],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                },
                {
                    name: this.locales.LABEL_SHOES,
                    ids: [6],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                },
                {
                    name: this.locales.LABEL_GLASSES,
                    ids: [1],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: true
                },
                {
                    name: this.locales.LABEL_EARRINGS,
                    ids: [2],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: true
                },
                {
                    name: this.locales.LABEL_BAG,
                    ids: [5],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                },
                {
                    name: this.locales.LABEL_ARMOUR,
                    ids: [9],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                },
                {
                    name: this.locales.LABEL_WATCH,
                    ids: [6],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: true
                },
                {
                    name: this.locales.LABEL_BRACELET,
                    ids: [7],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: true
                }
            ];
        }
    },
    watch: {
        name(value) {
            this.allPassing = false;
            this.nameValid = false;
            this.descValid = false;
            this.name = value;

            if (plainText.test(this.name)) {
                this.nameValid = true;
            }

            if (plainTextDesc.test(this.desc)) {
                this.descValid = true;
            }

            if (this.nameValid && this.descValid) {
                this.allPassing = true;
                return;
            }

            this.allPassing = false;
        },
        desc(value) {
            this.allPassing = false;
            this.nameValid = false;
            this.descValid = false;
            this.desc = value;

            if (plainText.test(this.name)) {
                this.nameValid = true;
            }

            if (plainTextDesc.test(this.desc)) {
                this.descValid = true;
            }

            if (this.nameValid && this.descValid) {
                this.allPassing = true;
                return;
            }

            this.allPassing = false;
        }
    },
    mounted() {
        this.updateLocales();

        if ('alt' in window) {
            alt.on('clothing:SetLocales', this.setLocales);
            alt.on('clothing:Propagate', this.handlePropagation);
            alt.on('url', this.setURL);
            alt.emit('ready');
            alt.emit('clothing:Populate', this.components);
            alt.emit('clothing:Ready');
            alt.emit('url');
        }

        document.addEventListener('keyup', this.handleClose);
    }
});
