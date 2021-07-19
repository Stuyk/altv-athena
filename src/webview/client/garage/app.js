Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    data() {
        return {
            locales: {
                LABEL_GARAGE: 'Garage',
                LABEL_DESC: 'Spawn your vehicles through this terminal.',
                LABEL_MODEL: 'Model',
                LABEL_FUEL: 'Fuel',
                LABEL_CONTROLS: 'Controls',
                LABEL_SPAWN: 'spawn',
                LABEL_DESPAWN: 'despawn'
            },
            vehicles: [],
            url: 'http://localhost:9111'
        };
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        setVehicles(vehicles) {
            this.vehicles = vehicles;
        },
        exit() {
            if ('alt' in window) {
                alt.emit('garage:Close');
            } else {
                console.log('Exit button go brr');
            }
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            this.exit();
        },
        spawn(index) {
            if (!('alt' in window)) {
                console.log(this.vehicles[index]);
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('garage:Spawn', this.vehicles[index].uid);
        },
        despawn(index) {
            if (!('alt' in window)) {
                console.log(this.vehicles[index]);
                return;
            }

            alt.emit('play:Sound', 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            alt.emit('garage:Despawn', this.vehicles[index].uid);
        }
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on('garage:SetVehicles', this.setVehicles);
            alt.on('garage:SetLocale', this.setLocales);
            alt.on('url', this.setURL);
            alt.emit('garage:Ready');
            alt.emit('ready');
            alt.emit('url');
        } else {
            // Dummy Vehicles Display
            this.setVehicles([
                {
                    fuel: 100,
                    model: 'washington',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'dsfdsafsafdsaf'
                },
                {
                    fuel: 100,
                    model: 'akuma',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'dfdsfsdfdsfdswfeew'
                },
                {
                    fuel: 100,
                    model: 'faggio',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'd1f1f1f'
                },
                {
                    fuel: 100,
                    model: 'infernus',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'g4554g54g45g45'
                },
                {
                    fuel: 100,
                    model: 'infernus2',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'g54g454444444'
                },
                {
                    fuel: 100,
                    model: 'washington',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'dsfdsafsafdsaf'
                },
                {
                    fuel: 100,
                    model: 'akuma',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'dfdsfsdfdsfdswfeew'
                },
                {
                    fuel: 100,
                    model: 'faggio',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'd1f1f1f'
                },
                {
                    fuel: 100,
                    model: 'infernus',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'g4554g54g45g45'
                },
                {
                    fuel: 100,
                    model: 'infernus2',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    uid: 'g54g454444444'
                }
            ]);
        }
    }
});
