Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    data() {
        return {
            url: null,
            loading: false,
            updates: 0
        };
    },
    computed: {
        isShowing() {
            return this.show;
        }
    },
    methods: {
        setAsReady() {
            this.$nextTick(() => {
                this.updates += 1;
                gsap.fromTo('.discord', { scale: 10, rotation: 0 }, { duration: 1, rotation: 360, scale: 1 });
                gsap.fromTo('.discord', { opacity: -1 }, { opacity: 0.75, duration: 2 });
            });
        },
        hoverLogo() {
            gsap.fromTo('.discord img', { scale: 1, rotation: 0 }, { duration: 0.5, scale: 1.2, opacity: 1 });
        },
        unhoverLogo() {
            gsap.fromTo('.discord img', { scale: 1.2 }, { rotation: 360, duration: 0.5, scale: 1, opacity: 0.75 });
        },
        beginAuth() {
            gsap.fromTo('.discord img', { opacity: 1 }, { opacity: 0, duration: 0.1 });
            setTimeout(() => {
                this.getURL();
                this.loading = true;
                this.updates += 1;
                gsap.fromTo('.discord img', { opacity: 0, scale: 1.2 }, { duration: 0.5, scale: 0.75, opacity: 1 });
            }, 100);
        },
        authAgain() {
            this.getURL();
        },
        getURL() {
            if ('alt' in window) {
                alt.emit('discord:OpenURL');
            }
        },
        openURL(url) {
            window.open(url);
        },
        finishedLoading() {
            this.$nextTick(() => {
                this.setAsReady();
            });
        },
        loadAthena() {
            window.open(`https://github.com/stuyk/altv-athena`);
        }
    },
    mounted() {
        if ('alt' in window) {
            alt.on('discord:OpenURL', this.openURL);
        }

        this.finishedLoading();
    }
});
