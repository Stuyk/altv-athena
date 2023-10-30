<template>
    <div class="flex flex-col">
        <div
            class="flex flex-row items-center justify-start pr-4 cursor-pointer hover:text-white h-8"
            @click="isExpanded = !isExpanded"
        >
            <div class="flex-grow text-left text-xs">{{ title }}</div>
            <span class="flex justify-center items-center">
                <Icon :icon="isExpanded ? 'icon-chevron-down' : 'icon-chevron-right'" :size="12" />
            </span>
        </div>
        <div v-if="isExpanded">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{ title: string }>();

let isExpanded = ref(false);
</script>
