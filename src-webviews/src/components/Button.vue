<template>
    <div :class="dynamicClass" :style="style" @mouseover="playHover" @mouseup="playMouseUp" v-if="!disable">
        <div style="user-select: none !important; pointer-events: none !important">
            <slot />
        </div>
    </div>
    <div :class="dynamicClass" :style="style" v-else>
        <div style="user-select: none !important; pointer-events: none !important">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResolvePath from '../utility/pathResolver';

const ComponentName = 'Button';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            _audio: null,
        };
    },
    props: {
        disable: {
            type: Boolean,
            default: false,
        },
        hover: Boolean,
        color: {
            type: String,
            default: 'blue-grey',
        },
        raise: {
            type: Boolean,
            default: true,
        },
        flatten: {
            type: Boolean,
            default: false,
        },
        glow: {
            type: Boolean,
            default: true,
        },
        padding: {
            type: Number,
            default: 3,
        },
        style: {
            type: String,
            default: '',
        },
    },
    methods: {
        ResolvePath,
        async playHover() {
            if (!this._audio) {
                this._audio = new Audio(this.ResolvePath('assets/sounds/ui/hover.ogg'));
                this._audio.volume = 0.2;
            }

            this._audio.setAttribute('src', this.ResolvePath('assets/sounds/ui/hover.ogg'));

            try {
                await this._audio.play();
            } catch (err) {}
        },
        async playMouseUp() {
            if (!this._audio) {
                this._audio = new Audio(this.ResolvePath('assets/sounds/ui/click.ogg'));
                this._audio.volume = 0.2;
            }

            this._audio.setAttribute('src', this.ResolvePath('assets/sounds/ui/click.ogg'));
            try {
                await this._audio.play();
            } catch (err) {}
        },
    },
    computed: {
        dynamicClass() {
            const classes = {
                button: true,
                overline: true,
            };

            if (this.padding) {
                classes[`pa-${this.padding}`] = true;
            }

            if (this.disable) {
                classes['disable'] = true;
                return classes;
            }

            classes[`hover`] = true;

            if (this.color) {
                classes[`${this.color}--text`] = true;
            }

            if (this.glow && this.color) {
                classes[`${this.color}--hover`] = true;
            }

            if (this.raise && !this.flatten) {
                classes[`raise`] = true;
            }

            if (!this.raise && this.flatten) {
                classes[`flatten`] = true;
            }

            return classes;
        },
    },
    mounted() {
        this.$nextTick(() => {
            if (this.disable) {
                this.sound = false;
            }
        });
    },
});
</script>
