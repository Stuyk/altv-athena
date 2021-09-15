<template>
    <div class="module stack">
        <div class="split space-between" style="width: 100%;">
            <span class="overline" :class="show ? 'amber--text' : 'grey--text'">
                {{ name }}
            </span>
            <Button :color="!show ? 'blue' : 'amber'" @click="show = !show">
                <Icon :size="14" :icon="show ? 'icon-minus' : 'icon-plus'"></Icon>
            </Button>
        </div>
        <div class="border-slot pa-4 mt-2" v-if="show">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from './Button.vue';
import Icon from './Icon.vue';

const ComponentName = 'Module';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Icon
    },
    props: {
        name: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            show: false
        }
    }
});
</script>

<style scoped>
.module {
    width: 100%;
}

.border-slot {
    width: 100%;
    border: 2px solid rgba(32, 32, 32, 1);
    box-sizing: border-box;
    border-radius: 6px;
}
</style>
