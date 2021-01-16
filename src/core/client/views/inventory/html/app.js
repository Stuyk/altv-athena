Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            x: 0,
            y: 0,
            itemIndex: null,
            lastHoverID: null,
            pageIndex: 0,
            pageMeta: [
                { name: 'INVENTORY TAB #1' },
                { name: 'INVENTORY TAB #2' },
                { name: 'INVENTORY TAB #3' },
                { name: 'FOOD & DRINK' },
                { name: 'KEYS' },
                { name: 'SETTINGS' }
            ],
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
        isPageIndex(index) {
            return this.pageIndex === index ? { 'light-green': true } : {};
        },
        selectItem(e, index) {
            const element = document.getElementById(index);
            element.style.position = 'fixed';
            element.style.left = `calc(${e.clientX}px)`;
            element.style.top = `${e.clientY}px`;
            element.style.zIndex = 99;
            element.style.pointerEvents = 'none';
            element.classList.add('elevation-12');
            element.classList.add('vip');

            this.itemIndex = index;

            document.addEventListener('mousemove', this.updatePosition);
            document.addEventListener('mouseup', this.dropItem);
            document.addEventListener('mouseover', this.mouseOver);
        },
        mouseOver(e) {
            if (this.lastHoverID) {
                const element = document.getElementById(this.lastHoverID);
                element.style.removeProperty('transform');
                this.lastHoverID = null;
            }

            if (!e || !e.target || !e.target.id || e.target.id === '') {
                return;
            }

            if (this.lastHoverID !== e.target.id) {
                const element = document.getElementById(e.target.id);
                element.style.transform = 'scale(0.95, 0.95)';
                this.lastHoverID = e.target.id;
            }
        },
        updatePosition(e) {
            const element = document.getElementById(this.itemIndex);
            element.style.left = `calc(${e.clientX}px)`;
            element.style.top = `${e.clientY}px`;
        },
        dropItem(e) {
            document.removeEventListener('mouseover', this.mouseOver);
            document.removeEventListener('mouseup', this.dropItem);
            document.removeEventListener('mousemove', this.updatePosition);

            if (this.lastHoverID) {
                const element = document.getElementById(this.lastHoverID);
                element.style.removeProperty('transform');
                this.lastHoverID = null;
            }

            const element = document.getElementById(this.itemIndex);
            element.style.position = 'relative';
            element.style.pointerEvents = 'all';
            element.style.removeProperty('left');
            element.style.removeProperty('top');
            element.style.removeProperty('left');
            element.classList.remove('vip');
            element.classList.remove('elevation-12');

            this.itemIndex = null;
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

        console.log(this);

        this.updateItems([items, [], [], [], [], [], []]);
    }
});
