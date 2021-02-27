Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            vehicles: []
        };
    },
    methods: {
        setData(vehicles) {
            this.vehicles = vehicles;
        },
        locate(index) {
            if ('alt' in window) {
                alt.emit('vehicles:Locate', index);
            }
        },
        despawn() {
            if ('alt' in window) {
                alt.emit('vehicles:Despawn');
            }
        },
        spawn(index) {
            if ('alt' in window) {
                alt.emit('vehicles:Spawn', index);
            }
        },
        exit() {
            if ('alt' in window) {
                alt.emit('vehicles:Exit');
            }
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.emit('ready');
            alt.on('vehicles:Data', this.setData);
        } else {
            this.setData([
                {
                    fuel: 100,
                    model: 'rocoto',
                    uid: 'a68888e32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1f34462c'
                },
                {
                    fuel: 50,
                    model: 'infernus',
                    uid: 'a6c32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 25,
                    model: 'cheetah',
                    uid: 'a6ff332a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 100,
                    model: 'rocoto',
                    uid: 'a68888e32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1f34462c'
                },
                {
                    fuel: 50,
                    model: 'infernus',
                    uid: 'a6c32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 25,
                    model: 'cheetah',
                    uid: 'a6ff332a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 100,
                    model: 'rocoto',
                    uid: 'a68888e32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1f34462c'
                },
                {
                    fuel: 50,
                    model: 'infernus',
                    uid: 'a6c32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 25,
                    model: 'cheetah',
                    uid: 'a6ff332a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 100,
                    model: 'rocoto',
                    uid: 'a68888e32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1f34462c'
                },
                {
                    fuel: 50,
                    model: 'infernus',
                    uid: 'a6c32a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                },
                {
                    fuel: 25,
                    model: 'cheetah',
                    uid: 'a6ff332a152dcf66c1e3bcdfe8062fa143027744529fd0a6cd63053afa1fdsfsdf'
                }
            ]);
        }
    }
});
