<template>
    <div class="wheel-menu">
        <div class="wheel-wrapper">
            <div class="wheel-option" style="transform: translate(46vw, 43vh)">
                <Icon class="wheel-icon mb-2" icon="icon-times-circle" :size="36" />
                <div class="wheel-text">Exit</div>
            </div>
            <div
                class="wheel-option"
                v-for="(option, index) in options"
                :key="index"
                @click="selectOption(index)"
                :style="getPositionalStyle(index)"
            >
                <Icon
                    class="wheel-icon mb-2"
                    :class="getColor(option)"
                    :icon="option.icon ? option.icon : 'icon-question'"
                    :size="36"
                />
                <div class="wheel-text" :class="getColor(option)">
                    {{ option.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

interface IWheelOption {
    name: string;
    uid: string;
    color?: string;
    icon?: string;
}

const ComponentName = 'WheelMenu';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {
            radius: 15,
            center: { x: 0, y: 0 },
            maxOptions: 8,
            options: [] as Array<IWheelOption>,
            points: [] as Array<{ x: number; y: number }>,
        };
    },
    methods: {
        getColor(option: IWheelOption) {
            if (!option.color) {
                return { 'white--text': true };
            }

            return { [`${option.color}--text`]: true };
        },
        addOption(option: IWheelOption) {
            if (this.options.length >= this.maxOptions) {
                return;
            }

            this.options.push(option);
        },
        getPointPosition(index: number): { x: number; y: number } {
            return this.points[index];
        },
        getPositionalStyle(index: number) {
            const point = this.getPointPosition(index);
            return `transform: translate(${46 - point.x}vw, ${43 - point.y}vh)`;
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

            points.push(points.shift());
            points.push(points.shift());

            this.points = points;
        },
        selectOption(index: number) {
            console.log(index);
        },
    },
    mounted() {
        this.generatePoints();

        if ('alt' in window) {
            return;
        }

        for (let i = 0; i < 8; i++) {
            if (i === 7) {
                this.addOption({
                    name: `Option ${i}`,
                    uid: `option-${i}`,
                    icon: 'icon-home',
                    color: 'blue',
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

.wheel-option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    min-width: 125px;
    max-width: 125px;
    min-height: 125px;
    max-height: 125px;
    border-radius: 50%;
    /* background: rgba(0, 0, 0, 0.65); */
    /* border: 2px solid rgba(0, 0, 0, 0.4); */
    text-align: center;
    left: 0;
    top: 0;
    box-sizing: border-box;
    transition: all 0.2s ease;
    background: rgba(0, 0, 0, 0.1);
}

@media screen and (min-width: 1280px) {
    .wheel-option {
        min-width: 150px;
        max-width: 150px;
        min-height: 150px;
        max-height: 150px;
    }

    .wheel-text {
        font-size: 16px !important;
    }
}

.wheel-option:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
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
