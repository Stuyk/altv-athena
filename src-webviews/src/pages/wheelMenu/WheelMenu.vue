<template>
    <div class="grid grid-cols-3 gap-2 opacity-90" v-if="showMenu && this.options.length >= 1">
        <!-- Renders 1 - 4 -->
        <WheelOption
            v-for="n in 4"
            :option="this.options[n - 1] ? this.options[n - 1] : undefined"
            :index="n - 1"
            @click="selectOption(n - 1)"
        />
        <!-- Center -->
        <div
            @click="close"
            class="bg-neutral-900 w-36 h-36 flex flex-col items-center justify-center rounded-lg overflow-hidden p-2 select-none"
        >
            <div
                class="flex flex-col flex-grow items-center justify-center border w-full rounded border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 active:bg-neutral-600 cursor-pointer"
            >
                <div class="flex flex-col justify-center items-center flex-grow">
                    <Icon class="text-neutral-200 pt-3" icon="icon-times-circle" :size="24" />
                </div>
                <div class="flex flex-col items-end justify-end h-12 text-xs text-neutral-200 pb-3">
                    {{ label }}
                </div>
            </div>
        </div>
        <!-- Bottom Row -->
        <WheelOption
            v-for="n in 4"
            :option="this.options[n + 3] ? this.options[n + 3] : undefined"
            :index="n + 3"
            @click="selectOption(n + 3)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VIEW_EVENTS_WHEEL_MENU } from '../../../../src/core/shared/enums/views.js';
import { WebViewEventNames } from '../../../../src/core/shared/enums/webViewEvents.js';
import { IWheelOption } from '../../../../src/core/shared/interfaces/wheelMenu.js';
import WheelOption from './WheelOption.vue';

const ComponentName = 'WheelMenu';
export default defineComponent({
    name: ComponentName,
    components: {
        WheelOption,
    },
    data() {
        return {
            label: '',
            options: [] as Array<IWheelOption>,
            showMenu: false,
        };
    },
    methods: {
        addOption(option: IWheelOption) {
            this.options.push(option);
        },
        addOptions(label: string, options: Array<IWheelOption>) {
            this.label = label;
            this.options = [];

            if (options.length > 8) {
                console.warn(`Wheel menu only supports up to 8 items at a time, use nested menus for more options.`);
            }

            for (let i = 0; i < options.length; i++) {
                this.addOption(options[i]);
            }
        },
        selectOption(index: number) {
            if (!this.options[index]) {
                return;
            }

            if (!('alt' in window)) {
                console.log(`Selected: ${this.options[index].uid}`);
                return;
            }

            alt.emit(VIEW_EVENTS_WHEEL_MENU.EXECUTE, this.options[index].uid);
            this.options = [];
        },
        close() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit(VIEW_EVENTS_WHEEL_MENU.CLOSE);
        },
        show(value: boolean) {
            this.showMenu = value;

            if (this.showMenu && 'alt' in window) {
                alt.emit(VIEW_EVENTS_WHEEL_MENU.READY);
            }

            if (!this.showMenu) {
                this.options = [];
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

        if ('alt' in window) {
            alt.on(VIEW_EVENTS_WHEEL_MENU.ADD_OPTIONS, this.addOptions);
            alt.on(VIEW_EVENTS_WHEEL_MENU.SHOW, this.show);
            alt.emit(VIEW_EVENTS_WHEEL_MENU.READY);
            this.show(true);
            return;
        }

        this.label = 'Testing';

        for (let i = 0; i < 600; i++) {
            if (i === 4) {
                this.addOption({
                    name: `Option ${i}`,
                    uid: `option-${i}`,
                    image: '/assets/icons/bullpuprifle.png',
                    bgImage: '/assets/images/bg.png',
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

            this.show(true);
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handleKeyUp);

        if ('alt' in window) {
            alt.off(VIEW_EVENTS_WHEEL_MENU.ADD_OPTIONS, this.addOptions);
        }
    },
});
</script>
