<template>
    <div
        class="button-mock"
        :class="dynamicClass"
        :style="style"
        @mouseover="playHover"
        @mouseup="playMouseUp"
        v-if="!disable"
    >
        <div class="help" v-if="help">
            {{ help }}
        </div>
        <div style="user-select: none !important; pointer-events: none !important">
            <slot />
        </div>
    </div>
    <div class="button-mock" :class="dynamicClass" :style="style" v-else>
        <div class="help" v-if="help">{{ help }}</div>
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
        help: {
            type: String,
            default: null,
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

<style>
.help {
    display: none;
    position: absolute;
}

.button-mock:hover .help {
    display: block;
    position: absolute;
    left: -42px;
    right: 0;
    top: -25px;
    background: rgba(12, 12, 12, 1);
    color: #fff !important;
    padding: 4px;
    width: 120px;
    z-index: 99;
    text-shadow: unset !important;
    border-radius: 6px;
}
</style>
