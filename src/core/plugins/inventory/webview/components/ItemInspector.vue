<script lang="ts" setup>
import { Item } from '@AthenaShared/interfaces/item';
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps<{ item: Item }>();
const Icon = defineAsyncComponent(() => import('@ViewComponents/Icon.vue'));
const emits = defineEmits<{ (e: 'hideInspector'): void }>();

const fieldsToRemove = ['x', 'y'];

const item = computed(() => {
    const itemClone = { ...props.item };

    for (let field of fieldsToRemove) {
        delete itemClone[field];
    }

    return itemClone;
});
</script>

<template>
    <div class="inspector">
        <div class="side-by-side">
            <div class="action-title">Inspector</div>
            <div class="action" @click="emits('hideInspector')">
                <Icon icon="icon-close" :size="12" />
            </div>
        </div>
        <pre>{{ JSON.stringify(item, null, 2) }}</pre>
    </div>
</template>

<style scoped>
.side-by-side {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}

.inspector {
    display: flex;
    flex-direction: column;
    position: absolute;
    background: var(--inventory-bg-darker);
    top: 0;
    left: 0;
    padding: 12px;
    z-index: 30;
    box-sizing: border-box;
    width: 100%;
    gap: 12px;
    z-index: 50;
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.5);
}

.action,
.action-title {
    background: var(--inventory-bg-light);
    border-radius: 6px;
    padding: 12px;
    border: 1px solid var(--inventory-bg-lighter);
}

.action {
    padding: 13px;
}

.action-title {
    font-size: 12px !important;
    width: 100%;
    margin-right: 12px;
}

.action:hover {
    color: #d88e8e;
    cursor: pointer;
    border: 1px solid #d88e8e;
}

.action:active {
    transform: scale(0.98);
}

.inspector pre {
    background: var(--inventory-bg-light);
    border: 1px solid var(--inventory-bg-lighter);
    border-radius: 6px;
    padding: 12px;
    margin: 0;
    user-select: text !important;
}
</style>
