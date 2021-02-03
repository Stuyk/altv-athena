Vue.config.devtools = true;
Vue.prototype.window = window;

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    components: [leaderboard, chat, help, status],
    data() {
        return {
            show: false,
            leaderboard: false,
            players: []
        };
    },
    methods: {
        toggleLeaderboard(validPlayers) {
            this.players = validPlayers;
            this.leaderboard = !this.leaderboard;

            if ('alt' in window) {
                alt.emit('mouse:Focus', this.leaderboard);
            }
        },
        audio3D(soundName, pan, volume, duration = -1) {
            const audio = new Audio(`./sounds/${soundName}.mp3`);
            const ambientContext = new AudioContext();
            const source = ambientContext.createMediaElementSource(audio);
            const ambientPan = ambientContext.createStereoPanner();
            source.connect(ambientPan);
            ambientPan.connect(ambientContext.destination);
            ambientPan.pan.value = pan;

            if (duration >= 0) {
                audio.loop = true;
            } else {
                audio.loop = false;
            }

            audio.volume = volume;
            audio.autoplay = true;
            audio.play();

            if (duration >= 0) {
                setTimeout(() => {
                    audio.pause();
                }, duration);
            }
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('leaderboard:Toggle', this.toggleLeaderboard);
            alt.on('hud:Audio3D', this.audio3D);
        } else {
            this.players = [
                { name: 'Johnny_Joe', ping: 25, id: 0, distance: 25 },
                { name: 'Jobi_Jobanni', ping: 60, id: 1, distance: 30 }
            ];

            for (let i = 0; i < 5; i++) {
                this.players = [...this.players, ...this.players];
            }
        }

        this.$nextTick(() => {
            this.show = true;
        });
    }
});
