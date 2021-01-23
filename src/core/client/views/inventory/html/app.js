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
            pageMeta: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'],
            pageIcons: ['icon-box', 'icon-box', 'icon-box', 'icon-box', 'icon-box'],
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
        updateInventory(inventoryItems) {
            const newInventory = new Array(6);
            for (let i = 0; i < newInventory.length; i++) {
                newInventory[i] = new Array(28).fill(null);
            }

            // inventoryItems is an array of arrays.
            // The first array is the pageIndex or tab.
            for (let i = 0; i < inventoryItems.length; i++) {
                const tabIndex = i;
                for (let x = 0; x < inventoryItems[tabIndex].length; x++) {
                    if (!inventoryItems[tabIndex][x]) {
                        continue;
                    }

                    const slot = inventoryItems[tabIndex][x].slot;
                    newInventory[tabIndex][slot] = inventoryItems[tabIndex][x];
                }
            }

            this.inventory = newInventory;
        },
        updateGround(groundItems) {
            const newGround = new Array(8).fill(null);
            groundItems.forEach((item) => {
                if (!item) {
                    return;
                }

                newGround[item.slot] = item;
            });

            this.ground = newGround;
        },
        updateEquipment(equipmentItems) {
            const newEquipment = new Array(9).fill(null);
            equipmentItems.forEach((item) => {
                if (!item) {
                    return;
                }

                newEquipment[item.slot] = item;
            });

            this.equipment = newEquipment;
        },
        updateToolbar(toolbarItems) {
            const newToolbar = new Array(4).fill(null);

            toolbarItems.forEach((item) => {
                if (!item) {
                    return;
                }

                newToolbar[item.slot] = item;
            });

            this.toolbar = newToolbar;
        },
        updateGround(groundItems) {
            const newGround = new Array(8).fill(null);

            if (groundItems.length <= 0) {
                this.ground = newGround;
                return;
            }

            groundItems.forEach((groundItem, index) => {
                if (index >= newGround.length) {
                    return;
                }

                if (!groundItem) {
                    return;
                }

                newGround[index] = groundItem.item;
            });

            this.ground = newGround;
        },
        setIndex(value) {
            this.pageIndex = value;
        },
        isActiveTab(index) {
            return this.pageIndex === index
                ? { 'light-blue': true, tab: true, 'mb-1': true, 'elevation-6': true }
                : { grey: true, 'darken-4': true, tab: true, 'mb-1': true, 'elevation-6': true };
        },
        getInventoryClass() {
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
            if (this.dragging) {
                return;
            }

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

            if (!e || !e.target || !e.target.id || e.target.id === '') {
                return;
            }

            if (this.lastHoverID !== e.target.id) {
                const element = document.getElementById(e.target.id);
                element.style.setProperty('border', '2px dashed white', 'important');
                this.lastHoverID = e.target.id;
            }
        },
        async dropItem(e) {
            this.dragging = false;

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

            const selectElement = document.getElementById(this.dragAndDrop.itemIndex);
            selectElement.style = this.dragAndDrop.selectedElement.style;
            selectElement.style.pointerEvents = 'all';
            selectElement.classList.remove(...selectElement.classList);
            selectElement.classList.add(...this.dragAndDrop.selectedElement.classList.split(' '));

            this.x = 0;
            this.y = 0;

            if (!e || !e.target || !e.target.id || e.target.id === '') {
                return;
            }

            const selectedSlot = this.dragAndDrop.itemIndex;
            const endSlot = e.target.id;

            const endElement = document.getElementById(endSlot);
            const isTab = endElement.id.includes('tab');
            if (!isTab) {
                if (!endElement.classList.contains('is-null-item')) {
                    return;
                }
            }

            if (selectedSlot === endSlot) {
                return;
            }

            const hash = selectElement.dataset.hash ? `${selectElement.dataset.hash}` : null;

            if ('alt' in window) {
                alt.emit('inventory:Process', { selectedSlot, endSlot, tab: this.pageIndex, hash });
            }

            if (!isTab) {
                await this.updateLocalData(selectedSlot, endSlot);
            }
        },
        updateLocalData(selectedSlot, endSlot) {
            const selectIndex = this.stripCategory(selectedSlot);
            const endIndex = this.stripCategory(endSlot);

            const selectName = this.getDataName(selectedSlot);
            const endName = this.getDataName(endSlot);

            const selectItems = [...this[selectName]];
            const endItems = [...this[endName]];

            const selectItem = this.removeLocalItem(selectIndex, selectName === 'inventory', selectItems);
            const endItem = this.removeLocalItem(endIndex, endName === 'inventory', endItems);

            if (endItem) {
                endItem.slot = selectIndex;
            }

            selectItem.slot = endIndex;

            this.replaceLocalData(endIndex, selectItem, endName === 'inventory', endItems);
            this.replaceLocalData(selectIndex, endItem, selectName === 'inventory', selectItems);

            const selectFunctionUpdater = `update${this.capitalizeFirst(selectName)}`;
            const endFunctionUpdater = `update${this.capitalizeFirst(endName)}`;

            this[selectFunctionUpdater](selectItems);
            this[endFunctionUpdater](endItems);
        },
        capitalizeFirst(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        getDataName(prefix) {
            if (prefix.includes('tab-')) {
                return 'tab';
            }

            if (prefix.includes('i-')) {
                return 'inventory';
            }

            if (prefix.includes('g-')) {
                return 'ground';
            }

            if (prefix.includes('e-')) {
                return 'equipment';
            }

            return 'toolbar';
        },
        removeLocalItem(index, isInventory = false, localArray) {
            if (isInventory) {
                const itemClone = localArray[this.pageIndex][index];
                localArray[this.pageIndex][index] = null;
                return itemClone;
            }

            const itemClone = localArray[index];
            localArray[index] = null;
            return itemClone;
        },
        replaceLocalData(index, replacementItem, isInventory = false, localArray) {
            if (isInventory) {
                localArray[this.pageIndex][index] = replacementItem;
                return;
            }

            localArray[index] = replacementItem;
        },
        stripCategory(value) {
            return parseInt(value.replace(/.-/gm, ''));
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
        }
    },
    computed: {
        getInventory() {
            return this.inventory[this.pageIndex];
        },
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
            alt.on('inventory:Toolbar', this.updateToolbar);
            alt.on('inventory:Inventory', this.updateInventory);
            alt.on('inventory:Equipment', this.updateEquipment);
            alt.on('inventory:Ground', this.updateGround);
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

            const slot2 = [
                {
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
                }
            ];

            const ground = [
                {
                    position: { x: 0, y: 0, z: 0 },
                    item: {
                        name: `Gun`,
                        uuid: `some_hash_thing_ground`,
                        description: `Forbidden pez dispenser go brrr.`,
                        icon: 'gun',
                        quantity: 1,
                        weight: 2,
                        hash: '490218490129012',
                        data: {
                            bang: true,
                            ammo: 25,
                            'gluten-free': true,
                            owner: 'some_guy_off_main',
                            condition: 50,
                            rarity: `A+`
                        }
                    }
                }
            ];

            this.updateToolbar([]);
            this.updateGround(ground);
            this.updateInventory([items, slot2, [], [], [], [], []]);
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
