<template>
    <div class="split split-full navigation space-between pa-6">
        <Button color="blue" @click="$emit('next')">
            <Icon class="blue--text" :size="24" icon="icon-chevron-left" />
        </Button>

        <span class="overline">
            {{ pageName }}
        </span>

        <Button color="blue" @click="$emit('prev')">
            <Icon class="blue--text" :size="24" icon="icon-chevron-right" />
        </Button>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

const ComponentName = 'Navigation';
export default defineComponent({
    name: ComponentName,
    props: {
        pageIndex: {
            type: Number,
            required: true,
        },
        labels: {
            type: Object,
            required: true,
        },
        pageName: {
            type: String,
            required: true,
        },
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
});
</script>
