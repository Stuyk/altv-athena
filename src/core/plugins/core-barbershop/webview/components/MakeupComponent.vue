<template>
    <div class="makeup">
        <!-- Eyebrow Style -->
        <div class="header-info overline boldest white--text mb-2">{{ locale.STYLE }}</div>
        <div class="split split-full-width">
            <Button class="makeup-btn" color="blue" @click="$emit('decrement-index', 'beardIndex', makeup.length - 1)">
                <Icon icon="icon-chevron-left" :size="24" />
            </Button>
            <div class="text-sm-overline white--text mb-2 header-bold">
                {{ makeup[currentIndex] }}
            </div>
            <Button class="makeup-btn" color="blue" @click="$emit('increment-index', 'beardIndex', makeup.length - 1)">
                <Icon icon="icon-chevron-right" :size="24" />
            </Button>
        </div>
        <!-- Eyebrow Opacity -->
        <div class="header-info overline boldest white--text mb-2 mt-2">{{ locale.OPACITY }}</div>
        <div class="split split-full-width">
            <Button class="makeup-btn" color="blue" @click="$emit('decrement-index', 'beardOpacity', 1, 0.1)">
                <Icon icon="icon-chevron-left" :size="24" />
            </Button>
            <div class="text-sm-overline boldest white--text mb-2 header-bold">
                {{ opacity.toFixed(2) }}
            </div>
            <Button class="makeup-btn" color="blue" @click="$emit('increment-index', 'beardOpacity', 1, 0.1)">
                <Icon icon="icon-chevron-right" :size="24" />
            </Button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { makeup } from '../../../../shared/information/makeup';
import { BARBER_SHOP_LOCALE } from '../../shared/locales';

const ComponentName = 'MakeupComponent';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
    },
    props: {
        currentIndex: {
            type: Number,
            default: 0,
        },
        opacity: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            makeup: makeup,
            locale: BARBER_SHOP_LOCALE,
        };
    },
    methods: {
        getBackgroundColor(hex: string) {
            return `background: ${hex} !important; display: block;`;
        },
        selectColor(index: number) {
            this.$emit('select-color', index);
        },
    },
    mounted() {
        //
    },
});
</script>

<style>
.makeup {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: auto;
    width: 100%;
    box-sizing: border-box;
}

.split {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.makeup-btn {
    min-width: 54px;
    max-width: 54px;
    border-radius: 12px;
    transform: scale(0.75);
}

.header-info {
    text-shadow: 1px 2px 3px black;
    padding: 6px;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 6px;
    padding-left: 12px;
}

.header-bold {
    display: flex;
    text-shadow: 1px 2px 3px black;
    height: 100%;
    justify-content: center;
    align-items: center;
    word-wrap: break-word;
    max-width: 110px;
    text-align: center;
    word-break: keep-all;
}
</style>
