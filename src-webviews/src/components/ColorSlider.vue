<template>
    <div class="color-slider">
        <div class="color-preview-wrap">
            <div class="color-preview" :style="getStyle"></div>
        </div>
        <br />
        <RangeInput
            @input="(e) => updateValue(e, 'r')"
            :minIndex="0"
            :maxIndex="255"
            :indexValue="r"
            :increment="1"
            :enableAudio="false"
            class="fill-full-width"
        />
        <br />
        <RangeInput
            @input="(e) => updateValue(e, 'g')"
            :minIndex="0"
            :maxIndex="255"
            :indexValue="g"
            :increment="1"
            :enableAudio="false"
            class="fill-full-width"
        />
        <br />
        <RangeInput
            @input="(e) => updateValue(e, 'b')"
            :minIndex="0"
            :maxIndex="255"
            :indexValue="b"
            :increment="1"
            :enableAudio="false"
            class="fill-full-width"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RangeInput from './RangeInput.vue';

const ComponentName = 'Button';
export default defineComponent({
    name: ComponentName,
    components: {
        RangeInput,
    },
    data() {
        return {
            r: 255,
            g: 255,
            b: 255,
        };
    },
    props: {
        rgb: {
            type: Object,
            required: true,
        },
    },
    methods: {
        updateValue(e: Event, property: string) {
            if (!e || !e.target || !e.target['value']) {
                return;
            }

            const value = e.target['value'];
            this[property] = parseInt(value);

            if (value === undefined || value === null) {
                return;
            }

            this.update();
        },
        update() {
            this.$emit('input', this.r, this.g, this.b);
            this.$emit('change', this.r, this.g, this.b);
        },
    },
    computed: {
        getStyle() {
            return {
                background: `rgb(${this.r}, ${this.g}, ${this.b}) !important`,
            };
        },
    },
    watch: {
        rgb(newValue, oldValue) {
            this.r = newValue.r;
            this.g = newValue.g;
            this.b = newValue.b;

            this.$emit('input', this.r, this.g, this.b);
            this.$emit('change', this.r, this.g, this.b);
        },
    },
    mounted() {
        this.r = this.rgb.r;
        this.g = this.rgb.g;
        this.b = this.rgb.b;

        this.$emit('input', this.r, this.g, this.b);
        this.$emit('change', this.r, this.g, this.b);
    },
});
</script>

<style scoped>
.color-preview-wrap {
    display: flex;
    width: 100%;
    min-width: 25px;
    min-height: 25px;
    border: 2px solid rgba(32, 32, 32, 1);
    border-radius: 6px;
    justify-content: center;
    align-content: center;
    align-items: center;
}

.color-preview {
    position: relative;
    width: 100%;
    min-width: calc(25px / 2);
    min-height: calc(25px / 2);
    border-radius: 3px;
    box-sizing: border-box;
    margin: 6px;
    display: flex;
}

.fill-full-width {
    width: 100%;
}
</style>
