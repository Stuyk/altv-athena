Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            x: 0,
            y: 0,
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
        updateItems(items) {
            this.inventory = items;
        },
        setIndex(value) {
            this.pageIndex = value;
        },
        isActiveTab(index) {
            return this.pageIndex === index
                ? { 'light-blue': true, 'elevation-12': true }
                : { grey: true, 'elevation-12': true, 'darken-3': true };
        },
        selectItem(e, index) {
            // Calculate Element Size
            const element = document.getElementById(index);
            this.dragAndDrop.shiftX = e.clientX - element.getBoundingClientRect().left;
            this.dragAndDrop.shiftY = e.clientY - element.getBoundingClientRect().top;
            this.dragAndDrop.selectedElement = { style: element.style, classList: element.classList.toString() };
            this.dragAndDrop.itemIndex = index;

            // Append Cloned Element to Page and Modify Style
            const clonedElement = element.cloneNode(true);
            clonedElement.id = `cloned-${element.id}`;
            document.body.append(clonedElement);
            this.clonedElement = document.getElementById(`cloned-${element.id}`);
            this.clonedElement.classList.add('item-clone');
            this.clonedElement.classList.add('no-animation');
            this.clonedElement.style.left = `${e.clientX - 25}px`;
            this.clonedElement.style.top = `${e.clientY - this.dragAndDrop.shiftY}px`;

            // Modify Current Element
            element.style.pointerEvents = 'none';
            element.style.setProperty('border', '2px dashed rgba(255, 255, 255, 0.5)', 'important');
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
                element.style.removeProperty('box-shadow');
                this.lastHoverID = null;
            }

            if (!e || !e.target || !e.target.id || e.target.id === '') {
                return;
            }

            if (this.lastHoverID !== e.target.id) {
                const element = document.getElementById(e.target.id);
                element.style.setProperty('border', '2px solid white', 'important');
                element.style.setProperty('box-shadow', 'inset 0px 0px 5px 0px white', 'important');
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
    watch: {},
    mounted() {
        if ('alt' in window) {
            alt.on('inventory:UpdateItems', this.updateItems);
            alt.emit('ready');
            return;
        }

        // Debug / Development Mode
        const items = [];
        for (let i = 0; i < 100; i++) {
            items.push({
                name: `An Item ${i}`,
                uuid: `some_hash_thing_${i}`,
                description: `words`,
                quantity: Math.floor(Math.random() * 500),
                weight: Math.floor(Math.random() * 9000),
                data: {
                    water: 100
                }
            });
        }

        this.updateItems([items, [], [], [], [], [], []]);
    }
});
