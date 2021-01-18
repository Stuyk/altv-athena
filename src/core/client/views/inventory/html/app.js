Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            x: 0,
            y: 0,
            itemInfo: null,
            dragAndDrop: {
                shiftX: null,
                shiftY: null,
                clonedElement: null,
                itemIndex: null,
                selectedElement: null
            },
            pageIndex: 0,
            pageMeta: ['Tab 1', 'Tab 2', 'Tab 3', 'Food & Drink', 'Keys'],
            pageIcons: ['icon-box', 'icon-box', 'icon-box', 'icon-fastfood', 'icon-key'],
            equipmentMeta: ['Hat', 'Mask', 'Shirt', 'Pants', 'Feet', 'Glasses', 'Ears', 'Bag', 'Armour'],
            inventory: [[], [], [], [], [], []],
            ground: [],
            equipment: [],
            toolbar: []
        };
    },
    methods: {
        /**
         * List of items to append to the inventory data.
         * @param {Array<Object>} items
         */
        updateItems(itemTabs) {
            this.inventory = new Array(6).fill(new Array(28).fill(null));
            itemTabs.forEach((items, index) => {
                items.forEach((item) => {
                    this.inventory[index][item.slot] = item;
                });
            });
        },
        updateGround(groundItems) {
            this.ground = new Array(8).fill(null);
            groundItems.forEach((item, index) => {
                this.ground[index] = item;
            });
        },
        updateEquipment(equipmentItems) {
            this.equipment = new Array(9).fill(null);
            equipmentItems.forEach((item, index) => {
                this.equipment[index] = item;
            });
        },
        updateToolbar(toolbarItems) {
            this.toolbar = new Array(4).fill(null);
            toolbarItems.forEach((item, index) => {
                this.toolbar[index] = item;
            });
        },
        setIndex(value) {
            this.pageIndex = value;
        },
        isActiveTab(index) {
            return this.pageIndex === index
                ? { 'light-blue': true, tab: true, 'mb-1': true, 'elevation-6': true }
                : { grey: true, 'darken-4': true, tab: true, 'mb-1': true, 'elevation-6': true };
        },
        getInventoryClass(isNull) {
            const classList = {};

            if (this.ground.length <= 0) {
                classList['expand-list'] = true;
            }

            return classList;
        },
        selectItemInfo(e) {
            if (this.dragging) {
                return;
            }

            if (!e || !e.target || !e.target.id) {
                return;
            }

            this.itemInfo = e.target.id;
        },
        setItemInfo() {
            this.itemInfo = null;
        },
        selectItem(e, index) {
            this.dragging = true;

            // Calculate Element Size
            const element = document.getElementById(e.target.id);
            this.dragAndDrop.shiftX = e.clientX - element.getBoundingClientRect().left;
            this.dragAndDrop.shiftY = e.clientY - element.getBoundingClientRect().top;
            this.dragAndDrop.selectedElement = { style: element.style, classList: element.classList.toString() };
            this.dragAndDrop.itemIndex = e.target.id;

            // Append Cloned Element to Page and Modify Style
            const clonedElement = element.cloneNode(true);
            clonedElement.id = `cloned-${element.id}`;
            document.body.append(clonedElement);
            this.clonedElement = document.getElementById(`cloned-${element.id}`);
            this.clonedElement.classList.add('item-clone');
            this.clonedElement.classList.add('no-animation');
            this.clonedElement.style.left = `${e.clientX + 25}px`;
            this.clonedElement.style.top = `${e.clientY - this.dragAndDrop.shiftY}px`;

            // Modify Current Element
            element.style.pointerEvents = 'none';
            element.style.setProperty('border', '2px dashed rgba(255, 255, 255, 0.5)', 'important');
            element.style.setProperty('opacity', '0.2', 'important');
            element.classList.add('grey', 'darken-4');
            element.classList.remove('grey', 'darken-3');

            // Toggle Event Listeners
            document.addEventListener('mouseup', this.dropItem);
            document.addEventListener('mouseover', this.mouseOver);
            document.addEventListener('mousemove', this.updatePosition); // This calls UpdatePosition
        },
        updatePosition(e) {
            this.clonedElement.style.left = `${e.clientX + 25}px`;
            this.clonedElement.style.top = `${e.clientY - this.dragAndDrop.shiftY}px`;
        },
        mouseOver(e) {
            if (this.lastHoverID) {
                const element = document.getElementById(this.lastHoverID);
                element.style.removeProperty('border');
                this.lastHoverID = null;
            }

            this.dragging = false;

            if (!e || !e.target || !e.target.id || e.target.id === '') {
                return;
            }

            if (this.lastHoverID !== e.target.id) {
                const element = document.getElementById(e.target.id);
                element.style.setProperty('border', '2px dashed white', 'important');
                this.lastHoverID = e.target.id;
            }
        },
        dropItem(e) {
            document.removeEventListener('mouseover', this.mouseOver);
            document.removeEventListener('mouseup', this.dropItem);
            document.removeEventListener('mousemove', this.updatePosition);

            if (this.lastHoverID) {
                const element = document.getElementById(this.lastHoverID);
                element.style.removeProperty('border');
                element.style.removeProperty('box-shadow');
                this.lastHoverID = null;
            }

            this.clonedElement.remove();

            const element = document.getElementById(this.dragAndDrop.itemIndex);
            element.style = this.dragAndDrop.selectedElement.style;
            element.style.pointerEvents = 'all';
            element.classList.remove(...element.classList);
            element.classList.add(...this.dragAndDrop.selectedElement.classList.split(' '));

            this.x = 0;
            this.y = 0;

            if (!e || !e.target || !e.target.id || e.target.id === '') {
                return;
            }

            const selectedSlot = this.dragAndDrop.itemIndex;
            const endSlot = e.target.id;

            if (selectedSlot === endSlot) {
                return;
            }

            if ('alt' in window) {
                alt.emit('inventory:Process', selectedSlot, endSlot, this.pageIndex);
            }
        },
        handleClose(keyPress) {
            if (keyPress.key !== 'Escape') {
                return;
            }

            document.removeEventListener('keyup', this.handleClose);

            setTimeout(() => {
                if ('alt' in window) {
                    alt.emit('inventory:Close');
                }
            }, 50);
        },
        handleProcess(inventory, equipment, toolbar) {
            this.updateItems(inventory);
            this.updateEquipment(equipment);
            this.updateToolbar(toolbar);
        }
    },
    computed: {
        getItemInfo() {
            if (this.itemInfo.includes('g-')) {
                return this.ground[parseInt(this.itemInfo.replace('g-', ''))];
            }

            if (this.itemInfo.includes('t-')) {
                return this.toolbar[parseInt(this.itemInfo.replace('t-', ''))];
            }

            if (this.itemInfo.includes('e-')) {
                return this.equipment[parseInt(this.itemInfo.replace('e-', ''))];
            }

            return this.inventory[this.pageIndex][parseInt(this.itemInfo.replace('i-', ''))];
        },
        getItemProperties() {
            if (this.itemInfo.includes('g-')) {
                const target = this.ground[parseInt(this.itemInfo.replace('g-', ''))];

                if (!target || !target.data) {
                    return null;
                }

                return Object.keys(target.data).map((key) => {
                    return { key, value: target.data[key] };
                });
            }

            if (this.itemInfo.includes('t-')) {
                const target = this.toolbar[parseInt(this.itemInfo.replace('g-', ''))];

                if (!target || !target.data) {
                    return null;
                }

                return Object.keys(target.data).map((key) => {
                    return { key, value: target.data[key] };
                });
            }

            if (this.itemInfo.includes('e-')) {
                const target = this.equipment[parseInt(this.itemInfo.replace('e-', ''))];

                if (!target || !target.data) {
                    return null;
                }

                return Object.keys(target.data).map((key) => {
                    return { key, value: target.data[key] };
                });
            }

            const target = this.inventory[this.pageIndex][parseInt(this.itemInfo.replace('i-', ''))];

            if (!target || !target.data) {
                return null;
            }

            return Object.keys(target.data).map((key) => {
                return { key, value: target.data[key] };
            });
        }
    },
    mounted() {
        document.addEventListener('keyup', this.handleClose);

        // Used to populate data on entry.
        this.inventory = new Array(6).fill(new Array(28).fill(null));
        this.ground = new Array(8).fill(null);
        this.equipment = new Array(9).fill(null);
        this.toolbar = new Array(4).fill(null);

        if ('alt' in window) {
            alt.on('inventory:Process', this.handleProcess);
            alt.emit('inventory:Update');
            alt.emit('ready');
        } else {
            // Debug / Development Mode
            const items = [];
            for (let i = 0; i < 5; i++) {
                items.push({
                    name: `An Item ${i}`,
                    uuid: `some_hash_thing_${i}`,
                    slot: i,
                    description: `words`,
                    icon: 'crate',
                    quantity: Math.floor(Math.random() * 10),
                    weight: Math.floor(Math.random() * 5),
                    data: {
                        water: 100
                    }
                });
            }

            items.push({
                name: `Sack`,
                uuid: `some_hash_thing_27`,
                slot: 27,
                description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                icon: 'sack',
                quantity: Math.floor(Math.random() * 10),
                weight: Math.floor(Math.random() * 5),
                data: {
                    water: 100
                }
            });

            const ground = [
                {
                    name: `Gun`,
                    uuid: `some_hash_thing_ground`,
                    description: `Forbidden pez dispenser go brrr.`,
                    icon: 'gun',
                    quantity: 1,
                    weight: 2,
                    data: {
                        bang: true,
                        ammo: 25,
                        'gluten-free': true,
                        owner: 'some_guy_off_main',
                        condition: 50,
                        rarity: `A+`
                    }
                }
            ];

            this.updateToolbar([]);
            this.updateGround(ground);
            this.updateItems([items, [], [], [], [], [], []]);
            this.updateEquipment([
                {
                    name: `Hat`,
                    uuid: `some_hash_thing_ground`,
                    description: `What a cozy hat! Wow. Much cozy. Many comforts.`,
                    icon: 'hat',
                    quantity: Math.floor(Math.random() * 10),
                    weight: Math.floor(Math.random() * 5)
                }
            ]);
        }
    }
});
