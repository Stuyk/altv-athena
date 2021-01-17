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
            pageMeta: [
                { name: 'INVENTORY TAB #1' },
                { name: 'INVENTORY TAB #2' },
                { name: 'INVENTORY TAB #3' },
                { name: 'FOOD & DRINK' },
                { name: 'KEYS' },
                { name: 'SETTINGS' }
            ],
            pageIcons: ['icon-box', 'icon-box', 'icon-box', 'icon-fastfood', 'icon-key', 'icon-settings'],
            inventory: [[], [], [], [], [], []],
            ground: []
        };
    },
    methods: {
        /**
         * List of items to append to the inventory data.
         * @param {Array<Object>} items
         */
        updateItems(itemTabs) {
            this.inventory = new Array(6).fill([]);
            itemTabs.forEach((items, index) => {
                this.inventory[index] = new Array(32).fill(null);

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
        setIndex(value) {
            this.pageIndex = value;
        },
        isActiveTab(index) {
            return this.pageIndex === index
                ? { 'light-blue': true, 'elevation-12': true }
                : { grey: true, 'elevation-12': true, 'darken-4': true };
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

            const id = e.target.id;
            console.log(id);
        }
    },
    computed: {
        getItemInfo() {
            if (this.itemInfo.includes('g-')) {
                return this.ground[parseInt(this.itemInfo.replace('g-', ''))];
            }

            return this.inventory[this.pageIndex][parseInt(this.itemInfo.replace('i-', ''))];
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('inventory:UpdateItems', this.updateItems);
            alt.emit('ready');
            return;
        }

        // Debug / Development Mode
        const items = [];
        for (let i = 0; i < 5; i++) {
            items.push({
                name: `An Item ${i}`,
                uuid: `some_hash_thing_${i}`,
                slot: i,
                description: `words`,
                icon: 'icon-sticky-note',
                quantity: Math.floor(Math.random() * 10),
                weight: Math.floor(Math.random() * 5),
                data: {
                    water: 100
                }
            });
        }

        items.push({
            name: `An Item 27`,
            uuid: `some_hash_thing_27`,
            slot: 27,
            description: `words`,
            icon: 'icon-sticky-note',
            quantity: Math.floor(Math.random() * 10),
            weight: Math.floor(Math.random() * 5),
            data: {
                water: 100
            }
        });

        const ground = [
            {
                name: `Ground Item`,
                uuid: `some_hash_thing_ground`,
                description: `Nice long description about this item that tells you some cool things.`,
                icon: 'icon-cog',
                quantity: Math.floor(Math.random() * 10),
                weight: Math.floor(Math.random() * 5),
                data: {
                    water: 100
                }
            }
        ];

        this.updateGround(ground);
        this.updateItems([items, [], [], [], [], [], []]);
    }
});
