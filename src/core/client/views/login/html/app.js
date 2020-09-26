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
        onReady(url) {
            this.url = url;
            // this.$nextTick(() => {
            //     this.updates += 1;
            //     console.log(this.url);
            //     gsap.fromTo('.discord', { scale: 10 }, { duration: 1, rotation: 360, scale: 1 });
            //     gsap.fromTo('.discord', { opacity: -1 }, { opacity: 1, duration: 2 });
            // });
        },
        hoverLogo() {
            console.log(this.url);

            // gsap.fromTo('.discord img', { scale: 1 }, { duration: 0.5, scale: 1.2 });
        },
        unhoverLogo() {
            console.log(this.url);

            // gsap.fromTo('.discord img', { scale: 1.2 }, { duration: 0.5, scale: 1 });
        },
        beginAuth() {
            console.log(this.url);

            // gsap.fromTo('.discord img', { opacity: 1 }, { opacity: 0, duration: 0.1 });

            setTimeout(() => {
                window.open(this.url);
                this.loading = true;
                this.updates += 1;
                // gsap.fromTo('.discord img', { opacity: 0, scale: 1.2 }, { duration: 0.5, scale: 0.75, opacity: 1 });
            }, 100);
        },
        authAgain() {
            window.open(this.url);
        },
        finishedLoading() {
            alt.emit('discord:Loaded');
        }
    },
    mounted() {
        if (!('alt' in window)) {
            this.onReady(`https://youtube.com/stuyk/`);
            return;
        }

        alt.on('discord:Ready', this.onReady);
        this.finishedLoading();
    }
});
