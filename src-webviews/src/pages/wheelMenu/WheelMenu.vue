<template>
    <div class="grid grid-cols-3 gap-2 opacity-90" v-if="showMenu && options.length >= 1">
        <!-- Renders 1 - 4 -->
        <WheelOption
            v-for="n in 4"
            :option="options[n - 1] ? options[n - 1] : undefined"
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
            :option="options[n + 3] ? options[n + 3] : undefined"
            :index="n + 3"
            @click="selectOption(n + 3)"
        />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { VIEW_EVENTS_WHEEL_MENU } from '../../../../src/core/shared/enums/views.js';
import { IWheelOption } from '../../../../src/core/shared/interfaces/wheelMenu.js';
import WheelOption from './WheelOption.vue';

let label = ref<string>('');
let options = ref<IWheelOption[]>([]);
let showMenu = ref<boolean>();
let interval = ref<number>();

function addOption(option: IWheelOption) {
    options.value.push(option);
}

function addOptions(menuName: string, newOptions: Array<IWheelOption>) {
    label.value = menuName;
    options.value = [];

    if (newOptions.length > 8) {
        console.warn(`Wheel menu only supports up to 8 items at a time, use nested menus for more options.`);
    }

    for (let i = 0; i < newOptions.length; i++) {
        addOption(newOptions[i]);
    }
}

function selectOption(index: number) {
    if (!options.value[index]) {
        return;
    }

    if (!('alt' in window)) {
        console.log(`Selected: ${options.value[index].uid}`);
        return;
    }

    alt.emit(VIEW_EVENTS_WHEEL_MENU.EXECUTE, options.value[index].uid);
    options.value = [];
}

function close() {
    if (!('alt' in window)) {
        return;
    }

    alt.emit(VIEW_EVENTS_WHEEL_MENU.CLOSE);
}

function show(value: boolean) {
    showMenu.value = value;

    if (showMenu.value && 'alt' in window) {
        alt.emit(VIEW_EVENTS_WHEEL_MENU.READY);

        if (typeof interval.value === 'undefined') {
            interval.value = setInterval(() => {
                alt.emit(VIEW_EVENTS_WHEEL_MENU.IS_SHOWING, true);
            }, 100);
        }
    }

    if (!showMenu.value) {
        if (interval.value) {
            clearInterval(interval.value);
            interval.value = undefined;
        }

        options.value = [];
    }
}

function handleKeyUp(e) {
    // if (e.keyCode < 49 || e.keyCode > 56) {
    //     return;
    // }
    // const index = e.keyCode - 49;
    // const option = options.value[index + optionIndex.value];
    // if (!option) {
    //     return;
    // }
    // this.selectOption(option.uid);
}

onMounted(() => {
    if ('alt' in window) {
        alt.on(VIEW_EVENTS_WHEEL_MENU.ADD_OPTIONS, addOptions);
        alt.on(VIEW_EVENTS_WHEEL_MENU.SHOW, show);
        return;
    }

    label.value = 'Testing';

    for (let i = 0; i < 600; i++) {
        if (i === 4) {
            addOption({
                name: `Option ${i}`,
                uid: `option-${i}`,
                image: '/assets/icons/bullpuprifle.png',
                bgImage: '/assets/images/bg.png',
            });
            continue;
        }

        if (i === 5) {
            addOption({
                name: `Option ${i}`,
                uid: `option-${i}`,
                icon: 'icon-checkmark',
                color: 'green',
            });
            continue;
        }

        if (i === 2) {
            addOption({
                name: `Option ${i}`,
                uid: `option-${i}`,
                icon: 'icon-close',
                color: 'yellow',
            });
            continue;
        }

        if (i >= 4) {
            addOption({
                name: `Option REALLY LONG THO ${i}`,
                uid: `option-${i}`,
            });
            continue;
        }

        addOption({
            name: `Option ${i}`,
            uid: `option-${i}`,
            icon: 'icon-home',
        });

        show(true);
    }
});
</script>
