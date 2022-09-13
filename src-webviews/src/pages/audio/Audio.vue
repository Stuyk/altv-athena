<template></template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResolvePath from '../../utility/pathResolver';

const ComponentName = 'Audio';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            _audio: null,
            _ambientPan: null,
            isReady: true,
            queue: [],
        };
    },
    mounted() {
        if ('alt' in window) {
            alt.on(`${ComponentName}:Play`, this.addToQueue);
            alt.on(`${ComponentName}:TriggerQueue`, this.dequeue);
        } else {
            setInterval(() => {
                this.addToQueue('@plugins/sounds/core-items/test');
                this.addToQueue('item_shuffle_1');
                this.addToQueue('item_purchase');
                this.addToQueue('item_eat');
                this.addToQueue('item_remove');
                this.addToQueue('car_unlock');
                this.addToQueue('item_teleport');

                this.dequeue();
            }, 2000);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(`${ComponentName}:Play`, this.addToQueue);
            alt.off(`${ComponentName}:TriggerQueue`, this.dequeue);
        }
    },
    // Used to define functions you can call with 'this.x'
    methods: {
        async dequeue() {
            if (!this.isReady) {
                return;
            }

            if (this.queue.length <= 0) {
                return;
            }

            this.isReady = false;
            const item = this.queue.shift();
            this.handleAudio(item.soundName, item.pan, item.volume, item.duration);
        },
        async addToQueue(soundName: string, pan: number = 0, volume: number = 0.2, duration = -1) {
            this.queue.push({ soundName, pan, volume, duration });
        },
        async audioStopped(e) {
            this.isReady = true;
        },
        async handleAudio(soundName: string, pan: number = 0, volume: number = 0.2, duration = -1) {
            if (!soundName.includes('.ogg')) {
                soundName += `.ogg`;
            }

            const path = ResolvePath(`../../assets/sounds/${soundName}`);

            if (!this._audio) {
                this._audio = new Audio(path);
                this._audio.addEventListener('ended', this.audioStopped);
                this._audio.crossOrigin = 'anonymous';
                const ambientContext = new AudioContext();
                const source = ambientContext.createMediaElementSource(this._audio);
                this._ambientPan = ambientContext.createStereoPanner();
                source.connect(this._ambientPan);
                this._ambientPan.connect(ambientContext.destination);
            }

            try {
                this._audio.setAttribute('src', path);
                this._ambientPan.pan.value = pan;

                if (duration >= 0) {
                    this._audio.loop = true;
                } else {
                    this._audio.loop = false;
                }

                this._audio.volume = volume;
                this._audio.autoplay = true;
                this._audio.play();
            } catch (err) {
                console.log(err);
                this.isReady = false;
            }
        },
    },
});
</script>

<style scoped></style>
