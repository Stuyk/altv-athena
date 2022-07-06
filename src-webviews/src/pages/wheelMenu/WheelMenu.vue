<template>
    <div class="wheel-menu">
        <div class="wheel-wrapper">
            <div class="wheel-menu-page overline">
                <div class="wheel-menu-page-box">
                    {{ optionIndex / maxOptions + 1 }} / {{ Math.floor(options.length / maxOptions) + 1 }} Pages
                </div>
            </div>
            <div class="wheel-menu-label overline">
                <div class="wheel-menu-label-box">
                    {{ label }}
                </div>
            </div>
            <div class="wheel-option" style="left: calc(50vw - 62.2px); top: calc(50vh - 62.2px)" @click="close">
                <Icon class="wheel-icon" icon="icon-times-circle" :size="36" />
            </div>
            <div
                class="wheel-option"
                v-for="(option, index) in getCurrentOptions"
                :key="index"
                @click="selectOption(option.uid)"
                :style="getPositionalStyle(index)"
            >
                <template v-if="!option.image">
                    <Icon
                        class="wheel-icon mb-2"
                        :class="getColor(option)"
                        :icon="option.icon ? option.icon : 'icon-question'"
                        :size="36"
                    />
                </template>
                <template v-else>
                    <img class="wheel-icon mb-2" :src="ResolvePath(option.image)" :alt="option.label" />
                </template>
                <div class="wheel-text" :class="getColor(option)">
                    {{ option.name }}
                </div>
            </div>
            <div
                class="wheel-number overline"
                v-for="(option, index) in getCurrentOptions"
                :key="index"
                :style="getPositionalStyle(index, 1.35, true)"
            >
                {{ index + 1 }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { VIEW_EVENTS_WHEEL_MENU } from '../../../../src/core/shared/enums/views';
import { WebViewEventNames } from '../../../../src/core/shared/enums/webViewEvents';
import { IWheelOption } from '../../../../src/core/shared/interfaces/wheelMenu';
import ResolvePath from '../../utility/pathResolver';

const TIME_BETWEEN_SCROLLS = 50;

const ComponentName = 'WheelMenu';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {
            label: '',
            radius: 15,
            center: { x: 0, y: 0 },
            optionIndex: 0,
            maxOptions: 8,
            options: [] as Array<IWheelOption>,
            points: [] as Array<{ x: number; y: number }>,
            nextScroll: Date.now() + TIME_BETWEEN_SCROLLS,
        };
    },
    computed: {
        getCurrentOptions() {
            const options = [];

            for (let i = this.optionIndex; i < this.options.length; i++) {
                if (options.length >= this.maxOptions) {
                    break;
                }

                options.push(this.options[i]);
            }

            return options;
        },
    },
    methods: {
        ResolvePath,
        getImage(option: IWheelOption) {
            return option.image ? option.image : this.ResolvePath('/assets/images/wheel-menu/question.png');
        },
        getColor(option: IWheelOption) {
            if (!option.color) {
                return { 'white--text': true };
            }

            return { [`${option.color}--text`]: true };
        },
        addOption(option: IWheelOption) {
            this.options.push(option);
        },
        addOptions(label: string, options: Array<IWheelOption>) {
            this.label = label;
            this.options = [];

            for (let i = 0; i < options.length; i++) {
                this.addOption(options[i]);
            }
        },
        getPointPosition(index: number): { x: number; y: number } {
            return this.points[index];
        },
        getPositionalStyle(index: number, multiplyRadius = null, skipBgImage = false) {
            const option = this.options[index];
            const point = this.getPointPosition(index);

            let style = '';

            if (point) {
                if (multiplyRadius && typeof multiplyRadius === 'number') {
                    style += `left: calc(50vw - 62.2px - ${point.x * multiplyRadius}vw); top: calc(50vh - 62.2px - ${
                        point.y * multiplyRadius
                    }vh);`;
                } else {
                    style += `left: calc(50vw - 62.2px - ${point.x}vw); top: calc(50vh - 62.2px - ${point.y}vh);`;
                }
            }

            if (option.bgImage && !skipBgImage) {
                style += `background-image: url(${this.ResolvePath(option.bgImage)}); background-size: cover;`;
            }

            return style;
        },
        generatePoints() {
            const points = [];
            const slice = (2 * Math.PI) / this.maxOptions;
            for (let i = 0; i < this.maxOptions; i++) {
                const angle = slice * i;
                const newX = this.center.x + this.radius * Math.cos(angle);
                const newY = this.center.y + this.radius * Math.sin(angle);
                const point = { x: newX * 1.15, y: newY * 2 };
                points.push(point);
            }

            this.points = points;
        },
        selectOption(uid: string) {
            if (!('alt' in window)) {
                console.log(`Selected: ${uid}`);
                return;
            }

            alt.emit(VIEW_EVENTS_WHEEL_MENU.EXECUTE, uid);
        },
        close() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit(WebViewEventNames.CLOSE_PAGE);
        },
        handleScroll(e) {
            const totalPages = Math.floor(this.options.length / this.maxOptions);
            if (totalPages <= 0) {
                return;
            }

            if (this.nextScroll > Date.now()) {
                return;
            }

            this.nextScroll = Date.now() + TIME_BETWEEN_SCROLLS;

            if (e.wheelDelta > 0) {
                // Scroll Up
                if (this.optionIndex / this.maxOptions !== totalPages) {
                    this.optionIndex += this.maxOptions;
                }
            } else {
                // Scroll Down
                if (this.optionIndex > 0) {
                    this.optionIndex -= this.maxOptions;
                }
            }
        },
        handleKeyUp(e) {
            if (e.keyCode < 49 || e.keyCode > 56) {
                return;
            }

            const index = e.keyCode - 49;
            const option = this.options[index + this.optionIndex];

            if (!option) {
                return;
            }

            this.selectOption(option.uid);
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handleKeyUp);
        document.addEventListener('mousewheel', this.handleScroll);

        this.generatePoints();

        if ('alt' in window) {
            alt.on(VIEW_EVENTS_WHEEL_MENU.ADD_OPTIONS, this.addOptions);
            alt.emit(VIEW_EVENTS_WHEEL_MENU.READY);
            return;
        }

        this.label = 'Testing';

        for (let i = 0; i < 600; i++) {
            if (i === 7) {
                this.addOption({
                    name: `Option ${i}`,
                    uid: `option-${i}`,
                    icon: 'icon-home',
                    color: 'blue',
                });
                continue;
            }

            if (i === 4) {
                this.addOption({
                    name: `Option ${i}`,
                    uid: `option-${i}`,
                    image: '/assets/icons/bullpuprifle.png',
                    bgImage: '/assets/images/loginBackground.jpg',
                });
                continue;
            }

            if (i === 5) {
                this.addOption({
                    name: `Option ${i}`,
                    uid: `option-${i}`,
                    icon: 'icon-checkmark',
                    color: 'green',
                });
                continue;
            }

            if (i === 2) {
                this.addOption({
                    name: `Option ${i}`,
                    uid: `option-${i}`,
                    icon: 'icon-close',
                    color: 'yellow',
                });
                continue;
            }

            if (i >= 4) {
                this.addOption({
                    name: `Option REALLY LONG THO ${i}`,
                    uid: `option-${i}`,
                });
                continue;
            }

            this.addOption({
                name: `Option ${i}`,
                uid: `option-${i}`,
                icon: 'icon-home',
            });
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('mousewheel', this.handleScroll);

        if ('alt' in window) {
            alt.off(VIEW_EVENTS_WHEEL_MENU.ADD_OPTIONS, this.addOptions);
        }
    },
});
</script>

<style scoped>
.wheel-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
}

.wheel-menu-label {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 60vh;
    width: 100%;
    left: 0;
    text-align: center;
    font-weight: bolder;
    font-size: 16px !important;
}

.wheel-menu-label-box {
    min-width: 175px;
    max-width: 200px;
    background: rgba(0, 0, 0, 0.5);
    padding: 6px;
    box-sizing: border-box;
    border-radius: 6px;
}

.wheel-menu-page {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 37vh;
    width: 100%;
    left: 0;
    text-align: center;
    font-weight: bolder;
    font-size: 16px !important;
}

.wheel-menu-page-box {
    min-width: 175px;
    max-width: 200px;
    background: rgba(0, 0, 0, 0.5);
    padding: 6px;
    box-sizing: border-box;
    border-radius: 6px;
}

.wheel-option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    min-width: 125px;
    max-width: 125px;
    min-height: 125px;
    max-height: 125px;
    border-radius: 50%;
    text-align: center;
    box-sizing: border-box;
    transition: all 0.2s ease;
    background: rgba(0, 0, 0, 0.5);
}

@media screen and (max-width: 1280px) {
    .wheel-option {
        scale: 0.8;
    }

    .wheel-option:hover {
        scale: 0.805 !important;
    }

    .wheel-number {
        scale: 0.8;
    }

    .wheel-menu-label-box {
        scale: 0.8;
    }

    .wheel-menu-page-box {
        scale: 0.8;
    }
}

.wheel-number {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    min-width: 125px;
    max-width: 125px;
    min-height: 125px;
    max-height: 125px;
    border-radius: 50%;
    text-align: center;
    box-sizing: border-box;
    transition: all 0.2s ease;
    pointer-events: none;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.6);
    font-size: 16px !important;
}

.wheel-wrapper {
    display: flex;
    position: relative;
    min-width: 100vw;
    min-height: 100vh;
}

.wheel-option:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.05) !important;
}

.wheel-option img {
    width: 65%;
    height: 65%;
    object-fit: cover;
    user-select: none !important;
}

.wheel-icon {
    left: 0;
    right: 0;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
}

.wheel-text {
    font-size: 14px;
    font-weight: bolder;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
}
</style>
