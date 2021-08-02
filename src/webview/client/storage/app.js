Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            name: 'Some Storage Box',
            inventory: [],
            storage: [],
            url: 'http://localhost:9111'
        };
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        setName(name) {
            this.name = name;
        },
        setStorage(storage) {
            this.storage = storage;
        },
        setInventory(inventory) {
            this.inventory = inventory;
        },
        condenseItemData(item, flipQuantity = false) {
            let actualName;

            if (item.name.length >= 12) {
                actualName = `${item.name.substring(0, 15)}...`;
            } else {
                actualName = item.name;
            }

            if (flipQuantity) {
                return `(${item.quantity}x) ${actualName}`;
            }

            return `${actualName} (${item.quantity}x)`;
        },
        moveFromPlayer(tab, index) {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('storage:MoveFromPlayer', tab, index);
        },
        moveFromStorage(index) {
            if (!('alt' in window)) {
                return;
            }

            alt.emit('storage:MoveFromStorage', index);
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            this.exit();
        },
        exit() {
            if ('alt' in window) {
                alt.emit('storage:Close');
            } else {
                console.log('Exit button go brr');
            }
        }
    },
    computed: {
        condenseInventory() {
            let itemList = [];
            this.inventory.forEach((tab, tabIndex) => {
                const items = tab.map((item, index) => {
                    return { ...item, tab: tabIndex, index };
                });

                itemList = itemList.concat(items);
            });

            return itemList;
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on('storage:SetName', this.setName);
            alt.on('storage:SetStorage', this.setStorage);
            alt.on('storage:SetInventory', this.setInventory);
            alt.on('url', this.setURL);
            alt.emit('storage:Ready');
            alt.emit('ready');
            alt.emit('url');
        } else {
            this.setStorage([
                {
                    name: `Sack`,
                    uuid: `some_hash_thing_26`,
                    slot: 1,
                    description: `Sack.`,
                    icon: 'sack',
                    behavior: 2,
                    quantity: Math.floor(Math.random() * 10) + 5,
                    data: {
                        water: 100,
                        event: 'test'
                    }
                },
                {
                    name: `Sack`,
                    uuid: `some_hash_thing_26`,
                    slot: 1,
                    description: `Sack.`,
                    icon: 'sack',
                    behavior: 2,
                    quantity: Math.floor(Math.random() * 10) + 5,
                    data: {
                        water: 100,
                        event: 'test'
                    }
                }
            ]);

            this.setInventory([
                [
                    {
                        name: `Sack`,
                        uuid: `some_hash_thing_26`,
                        slot: 1,
                        description: `Sack.`,
                        icon: 'sack',
                        behavior: 2,
                        quantity: Math.floor(Math.random() * 10) + 5,
                        data: {
                            water: 100,
                            event: 'test'
                        }
                    }
                ],
                [
                    {
                        name: `Sack Other Slot`,
                        uuid: `some_hash_thing_27`,
                        slot: 5,
                        description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                        icon: 'sack',
                        behavior: 2,
                        quantity: Math.floor(Math.random() * 10) + 5,
                        data: {
                            water: 100,
                            event: 'test'
                        }
                    },
                    {
                        name: `Sack Other Slot`,
                        uuid: `some_hash_thing_27`,
                        slot: 5,
                        description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                        icon: 'sack',
                        behavior: 2,
                        quantity: Math.floor(Math.random() * 10) + 5,
                        data: {
                            water: 100,
                            event: 'test'
                        }
                    },
                    {
                        name: `Sack Other Slot`,
                        uuid: `some_hash_thing_27`,
                        slot: 5,
                        description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                        icon: 'sack',
                        behavior: 2,
                        quantity: Math.floor(Math.random() * 10) + 5,
                        data: {
                            water: 100,
                            event: 'test'
                        }
                    },
                    {
                        name: `Sack Other Slot`,
                        uuid: `some_hash_thing_27`,
                        slot: 5,
                        description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                        icon: 'sack',
                        behavior: 2,
                        quantity: Math.floor(Math.random() * 10) + 5,
                        data: {
                            water: 100,
                            event: 'test'
                        }
                    },
                    {
                        name: `Sack Other Slot`,
                        uuid: `some_hash_thing_27`,
                        slot: 5,
                        description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                        icon: 'sack',
                        behavior: 2,
                        quantity: Math.floor(Math.random() * 10) + 5,
                        data: {
                            water: 100,
                            event: 'test'
                        }
                    },
                    {
                        name: `Sack Other Slot`,
                        uuid: `some_hash_thing_27`,
                        slot: 5,
                        description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                        icon: 'sack',
                        behavior: 2,
                        quantity: Math.floor(Math.random() * 10) + 5,
                        data: {
                            water: 100,
                            event: 'test'
                        }
                    },
                    {
                        name: `Sack Other Slot`,
                        uuid: `some_hash_thing_27`,
                        slot: 5,
                        description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                        icon: 'sack',
                        behavior: 2,
                        quantity: Math.floor(Math.random() * 10) + 5,
                        data: {
                            water: 100,
                            event: 'test'
                        }
                    },
                    {
                        name: `Sack Other Slot`,
                        uuid: `some_hash_thing_27`,
                        slot: 5,
                        description: `It's a sack and it doesn't do much other than sack around. What a lazy sack.`,
                        icon: 'sack',
                        behavior: 2,
                        quantity: Math.floor(Math.random() * 10) + 5,
                        data: {
                            water: 100,
                            event: 'test'
                        }
                    }
                ],
                [],
                [],
                [],
                [],
                []
            ]);
        }
    }
});
