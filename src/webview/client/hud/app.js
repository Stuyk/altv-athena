Vue.config.devtools = true;
Vue.prototype.window = window;

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

const audioStreams = [];

const app = new Vue({
    el: '#app',
    vuetify: new Vuetify({ theme: { dark: true } }),
    components: [actions, leaderboard, chat, help, phone, status],
    data() {
        return {
            show: false,
            leaderboard: false,
            youtubeInfo: {
                identifier: null,
                volume: 0
            },
            player: null,
            players: [],
            url: 'http://localhost:9111'
        };
    },
    methods: {
        setURL(url) {
            this.url = `http://${url}:9111`;
        },
        toggleLeaderboard(validPlayers, shouldOpenLeaderboard) {
            this.players = validPlayers;
            this.leaderboard = shouldOpenLeaderboard;

            if ('alt' in window) {
                alt.emit('mouse:Focus', this.leaderboard, 'isLeaderboardOpen');
            }
        },
        async audio3D(soundName, pan, volume, duration = -1) {
            if (!this.url && 'alt' in window) {
                alt.emit('url');
                await new Promise((r) => {
                    const isReady = () => {
                        return this.url !== null;
                    };

                    const interval = setInterval(() => {
                        if (!isReady) {
                            return;
                        }

                        clearInterval(interval);
                        r();
                    }, 50);
                });
            }

            const audio = new Audio(`${this.url}/sounds/${soundName}.ogg`);
            audio.crossOrigin = 'anonymous';

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
        },
        audioStream(identifier, volume, startSeconds = 0) {
            if (!('YT' in window)) {
                return;
            }

            if (this.youtubeInfo.identifier === identifier) {
                if (this.player.getPlayerState() === 2) {
                    this.player.playVideo();
                    this.player.seekTo(startSeconds, true);
                }

                this.player.setVolume(volume);
                return;
            }

            if (!this.player) {
                this.player = new YT.Player('player', {
                    height: '390',
                    width: '640',
                    videoId: `${identifier}`,
                    startSeconds: startSeconds,
                    events: {
                        onReady: (e) => {
                            this.player.loadVideoById(identifier, startSeconds, 'large');
                            this.player.playVideo();
                        }
                    }
                });
            } else {
                this.player.loadVideoById(identifier, startSeconds, 'large');
                this.player.playVideo();
            }

            this.youtubeInfo.identifier = identifier;
        },
        pauseStream() {
            if (!this.player) {
                return;
            }

            this.player.pauseVideo();
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('leaderboard:Toggle', this.toggleLeaderboard);
            alt.on('hud:Audio3D', this.audio3D);
            alt.on('hud:AudioStream', this.audioStream);
            alt.on('hud:PauseStream', this.pauseStream);
            alt.on('url', this.setURL);
        } else {
            this.players = [
                { name: 'Johnny_Joe', ping: 25, id: 0, distance: 25 },
                { name: 'Jobi_Jobanni', ping: 60, id: 1, distance: 30 }
            ];

            for (let i = 0; i < 5; i++) {
                this.players = [...this.players, ...this.players];
            }

            // setTimeout(() => {
            //     this.audioStream(`KrUak31dVqc`, 25, 25);
            // }, 1000);

            // setInterval(() => {
            //     this.audio3D('car_lock', 0, 1);
            // }, 2000);
        }

        this.$nextTick(() => {
            this.show = true;

            if ('alt' in window) {
                alt.emit('url');
            }
        });
    }
});
