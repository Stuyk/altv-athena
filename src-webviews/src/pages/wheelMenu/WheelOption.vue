<template>
    <div
        class="bg-neutral-900 w-36 h-36 flex flex-col items-center justify-center rounded-lg overflow-hidden p-2 select-none"
        :class="getCornerClasses"
    >
        <template v-if="props.option">
            <div
                :class="getCornerClasses"
                :style="getBackgroundImage"
                class="flex flex-col flex-grow items-center justify-center border w-full rounded border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 active:bg-neutral-600 cursor-pointer"
            >
                <div :class="getKeybindClass">
                    {{ props.index + 1 }}
                </div>
                <div class="flex flex-col justify-center items-end flex-grow pt-3 pl-4 pr-4">
                    <Icon
                        v-if="option.icon && !option.image"
                        :icon="option.icon ? option.icon : 'icon-question'"
                        :size="24"
                        :class="getColor"
                    />
                    <Icon v-if="!option.icon && !option.image" icon="icon-filter_none" :size="24" :class="getColor" />
                    <img v-if="option.image" :src="ResolvePath(option.image)" :alt="option.name" />
                </div>
                <span class="flex items-end text-neutral-200 text-xs pb-3 h-12" :class="getColor">
                    {{ getName }}
                </span>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { IWheelOption } from '@AthenaShared/interfaces/wheelMenu.js';
import ResolvePath from '../../utility/pathResolver.js';

const props = defineProps<{ option: IWheelOption | undefined; index: number }>();

const getCornerClasses = computed(() => {
    switch (props.index) {
        case 0: {
            return ['rounded-tl-half'];
        }
        case 2: {
            return ['rounded-tr-half'];
        }
        case 5: {
            return ['rounded-bl-half'];
        }
        case 7: {
            return ['rounded-br-half'];
        }
    }

    return [];
});

const getKeybindClass = computed(() => {
    switch (props.index) {
        case 0: {
            return 'absolute text-neutral-200 -translate-x-28 -translate-y-28 bg-neutral-800 p-2 pl-4 pr-4 rounded-full pointer-events-none opacity-80';
        }
        case 1: {
            return 'absolute text-neutral-200 -translate-y-28 bg-neutral-800 p-2 pl-4 pr-4 rounded-full pointer-events-none opacity-80';
        }
        case 2: {
            return 'absolute text-neutral-200 translate-x-28 -translate-y-28 bg-neutral-800 p-2 pl-4 pr-4 rounded-full pointer-events-none opacity-80';
        }
        case 3: {
            return 'absolute text-neutral-200 -translate-x-28  bg-neutral-800 p-2 pl-4 pr-4 rounded-full pointer-events-none opacity-80';
        }
        case 4: {
            return 'absolute text-neutral-200 translate-x-28  bg-neutral-800 p-2 pl-4 pr-4 rounded-full pointer-events-none opacity-80';
        }
        case 5: {
            return 'absolute text-neutral-200 -translate-x-28 translate-y-28 bg-neutral-800 p-2 pl-4 pr-4 rounded-full pointer-events-none opacity-80';
        }
        case 6: {
            return 'absolute text-neutral-200 translate-y-28 bg-neutral-800 p-2 pl-4 pr-4 rounded-full pointer-events-none opacity-80';
        }
        case 7: {
            return 'absolute text-neutral-200 translate-x-28 translate-y-28 bg-neutral-800 p-2 pl-4 pr-4 rounded-full pointer-events-none opacity-80';
        }
    }
});

const getColor = computed(() => {
    if (!props.option.color) {
        return ['text-neutral-200'];
    }

    return { [`text-${props.option.color}-400`]: true };
});

const getName = computed(() => {
    if (props.option.name.length >= 18) {
        return props.option.name.slice(0, 15) + '...';
    }

    return props.option.name;
});

const getBackgroundImage = computed(() => {
    if (props.option.bgImage) {
        return `background-image: url(${ResolvePath(props.option.bgImage)}); background-size: cover;`;
    }

    return '';
});
</script>

<style scoped>
.rounded-tl-half {
    border-top-left-radius: 25%;
}

.rounded-tr-half {
    border-top-right-radius: 25%;
}

.rounded-bl-half {
    border-bottom-left-radius: 25%;
}

.rounded-br-half {
    border-bottom-right-radius: 25%;
}
</style>
