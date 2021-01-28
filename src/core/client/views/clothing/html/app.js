Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            // Super Important Component Data
            // Component Data corresponds with their slot order.
            // So the first element is the first slot of the equipment.
            componentIndex: 0,
            cost: 0,
            shirtNames: ['Top', 'Undershirt', 'Torso'],
            components: [
                {
                    name: 'Hat',
                    ids: [0],
                    drawables: [-1],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: true
                },
                {
                    name: 'Mask',
                    ids: [1],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                },
                {
                    name: 'Shirt',
                    ids: [11, 8, 3],
                    drawables: [0, 0, 0],
                    textures: [0, 0, 0],
                    maxValues: [0, 0, 0],
                    maxDrawables: [0, 0, 0],
                    maxTextures: [0, 0, 0],
                    isProp: false
                },
                {
                    name: 'Bottoms',
                    ids: [4],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                },
                {
                    name: 'Feet',
                    ids: [6],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                },
                {
                    name: 'Glasses',
                    ids: [1],
                    drawables: [-1],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: true
                },
                {
                    name: 'Ears',
                    ids: [2],
                    drawables: [-1],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: true
                },
                {
                    name: 'Bag',
                    ids: [5],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                },
                {
                    name: 'Armour',
                    ids: [9],
                    drawables: [0],
                    textures: [0],
                    maxDrawables: [0],
                    maxTextures: [0],
                    isProp: false
                }
            ]
        };
    },
    methods: {
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
                    newComponents[this.componentIndex].drawables[index] = -1;
                }
            }

            if (dataName === 'textures') {
                const maxValue = newComponents[this.componentIndex].maxTextures[index];
                if (newComponents[this.componentIndex].textures[index] > maxValue) {
                    newComponents[this.componentIndex].textures[index] = 0;
                }
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
                if (newComponents[this.componentIndex].drawables[index] < -1) {
                    newComponents[this.componentIndex].drawables[index] = maxValue - 1;
                }
            }

            if (dataName === 'textures') {
                const maxValue = newComponents[this.componentIndex].maxTextures[index];
                if (newComponents[this.componentIndex].textures[index] < -1) {
                    newComponents[this.componentIndex].textures[index] = maxValue;
                }
            }

            this.components = newComponents;
            this.updatePlayerComponents();
        },
        updatePlayerComponents() {
            if ('alt' in window) {
                alt.emit('clothing:Update', this.components);
            }
        },
        incrementIndex() {
            if (this.componentIndex + 1 >= this.components.length) {
                this.componentIndex = 0;
                return;
            }

            this.componentIndex += 1;
        },
        decrementIndex() {
            if (this.componentIndex - 1 <= -1) {
                this.componentIndex = this.components.length - 1;
                return;
            }

            this.componentIndex -= 1;
        },
        handlePropagation(arrayOfComponentData) {
            this.components = arrayOfComponentData;
        },
        exit() {
            if ('alt' in window) {
                alt.emit('clothing:Exit');
            } else {
                console.log('bai');
            }
        },
        purchaseComponent() {
            const componentData = JSON.parse(JSON.stringify(this.components[this.componentIndex]));
            delete componentData.maxDrawables;
            delete componentData.maxTextures;
            delete componentData.name;

            if ('alt' in window) {
                alt.emit('clothing:Purchase', this.componentIndex, componentData);
            } else {
                console.log(componentData);
            }
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('clothing:Propagate', this.handlePropagation);
            alt.emit('ready');
            alt.emit('clothing:Populate', this.components);
        }
    }
});
