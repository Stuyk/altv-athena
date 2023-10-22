<template></template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResolvePath from '../../utility/pathResolver.js';

const ComponentName = 'Audio';

//Unique ID for all queued sounds
const queueIdentifier = '67906f00-4172-4a2f-8a0b-2140d5d01ac5';

export interface IAudioMap {
    [soundInstantID: string]: HTMLAudioElement;
}

export interface IPanMap {
    [soundInstantID: string]: StereoPannerNode;
}

export default defineComponent({
    name: ComponentName,
    data() {
        return {
            _audio: {} as IAudioMap,
            _ambientPan: {} as IPanMap,
            isReady: true,
            queue: [],
        };
    },
    mounted() {
        if ('alt' in window) {
            alt.on(`${ComponentName}:Play`, this.playAudio);
            alt.on(`${ComponentName}:Stop`, this.stopAudio);
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
            alt.off(`${ComponentName}:Play`, this.playAudio);
            alt.off(`${ComponentName}:Stop`, this.stopAudio);
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
        async playAudio(
            soundName: string,
            pan: number = 0,
            volume: number = 0.2,
            duration = -1,
            soundInstantID?: string,
        ) {
            if (soundInstantID) {
                this.handleAudio(soundName, pan, volume, duration, soundInstantID);
            } else {
                this.queue.push({ soundName, pan, volume, duration });
            }
        },
        async audioStopped(e) {
            if (e.currentTarget.soundID === queueIdentifier) {
                this.isReady = true;
            }
        },
        async handleAudio(
            soundName: string,
            pan: number = 0,
            volume: number = 0.2,
            duration = -1,
            soundInstantID?: string,
        ) {
            if (!soundName.includes('.ogg')) {
                soundName += `.ogg`;
            }

            const path = ResolvePath(`../../assets/sounds/${soundName}`);

            let soundID = queueIdentifier; //All queued sounds have the same id
            if (soundInstantID) {
                soundID = soundInstantID; //Same should also run more times
            }

            if (!this._audio[soundID]) {
                this._audio[soundID] = new Audio(path);
                this._audio[soundID].soundID = soundID;
                this._audio[soundID].addEventListener('ended', this.audioStopped);
                this._audio[soundID].crossOrigin = 'anonymous';
                const ambientContext = new AudioContext();
                const source = ambientContext.createMediaElementSource(this._audio[soundID]);
                this._ambientPan[soundID] = ambientContext.createStereoPanner();
                source.connect(this._ambientPan[soundID]);
                this._ambientPan[soundID].connect(ambientContext.destination);
            }

            try {
                this._audio[soundID].setAttribute('src', path);
                this._ambientPan[soundID].pan.value = pan;

                if (duration >= 0) {
                    this._audio[soundID].loop = true;
                } else {
                    this._audio[soundID].loop = false;
                }

                this._audio[soundID].volume = volume;
                this._audio[soundID].autoplay = true;
                this._audio[soundID].play();
            } catch (err) {
                console.log(err);
                if (!soundInstantID) this.isReady = false;
            }
        },
        async stopAudio(soundInstantID?: string) {
            let soundID = queueIdentifier;
            if (soundInstantID) {
                soundID = soundInstantID;
            }

            if (this._audio[soundID]) {
                this._audio[soundID].pause();
                if (!soundInstantID) this.isReady = true;
            }
        },
    },
});
</script>

<style scoped></style>
