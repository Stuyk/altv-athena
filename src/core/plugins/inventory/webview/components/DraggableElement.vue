<script lang="ts" setup>
const props = defineProps<{ id: string }>();
const emits = defineEmits<{
    (e: 'start', id: string): void;
    (e: 'stop', id: string | undefined): void;
    (e: 'context', pos: { x: number; y: number }): void;
}>();

const MousePress = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
};

let originalNode: HTMLElement;
let draggableNode: HTMLElement;

function onMouseMove(e: MouseEvent) {
    if (!draggableNode) {
        return;
    }

    draggableNode.style.left = `${e.x - draggableNode.clientWidth / 2}px`;
    draggableNode.style.top = `${e.y - draggableNode.clientHeight / 2}px`;
}

function handleDrag(e: MouseEvent) {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    originalNode = e.target as HTMLElement;
    draggableNode = originalNode.cloneNode(true) as HTMLElement;
    draggableNode.style.position = 'fixed';
    draggableNode.style.cursor = 'grabbing';
    draggableNode.style.pointerEvents = 'none';
    document.body.appendChild(draggableNode);
    document.body.style.cursor = 'grabbing';

    originalNode.style.opacity = '0.2';

    emits('start', props.id);
}

function handleContext(e: MouseEvent) {
    emits('context', { x: e.clientX, y: e.clientY });
}

function onMouseDown(e: MouseEvent) {
    if (e.button === MousePress.LEFT) {
        if (e.shiftKey) {
            // Handle Shift Clicking
            return;
        }

        if (e.ctrlKey) {
            // Handle Ctrl Clicking
            return;
        }

        handleDrag(e);
        return;
    }

    if (e.button === MousePress.RIGHT) {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleContext(e);
        return;
    }
}

function onMouseUp(e: Event) {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    draggableNode.remove();
    originalNode.style.opacity = '1';
    document.body.style.cursor = 'unset';

    if (!e.target) {
        emits('stop', undefined);
        return;
    }

    const element = e.target as HTMLElement;
    if (!element.id) {
        emits('stop', undefined);
        return;
    }

    emits('stop', element.id);
}
</script>

<template>
    <div class="draggable-element" @mousedown="onMouseDown" :id="props.id">
        <slot></slot>
    </div>
</template>

<style scoped>
.draggable-element {
    position: relative;
    height: 100%;
    width: 100%;
}

.no-events > * {
    user-select: none !important;
    pointer-events: none !important;
}
</style>
