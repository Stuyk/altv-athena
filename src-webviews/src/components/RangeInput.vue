<template>
    <div class="stack">
        <div class="split">
            <div class="blue--text overline pr-2 align-right">{{ getValue }}</div>
            <input type="range" :min="_min" :max="_max" :step="_step" :value="_value" />
            <div class="blue--text overline pl-2 align-left">{{ _max }}</div>
        </div>
        <div v-if="values" class="overline grey--text pt-2 align-center">
            {{ getCurrentValue }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResolvePath from '../utility/pathResolver';

const ComponentName = 'RangeInput';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            _audio: null,
            _min: 0,
            _max: 1,
            _step: 1,
            _value: 0,
        };
    },
    props: {
        indexValue: {
            type: Number,
            required: true,
        },
        minIndex: {
            type: Number,
            required: true,
        },
        maxIndex: {
            type: Number,
            required: true,
        },
        increment: {
            type: Number,
            required: true,
        },
        values: {
            type: Array,
            required: false,
        },
        enableAudio: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        ResolvePath,
        isNotNumber(value) {
            if (value === undefined || value === null) {
                return true;
            }

            return false;
        },
    },
    computed: {
        inputClass() {
            const classes = {};

            if (this.stack) {
                classes['input-stack'] = true;
            } else {
                classes['input-full-width'] = true;
            }

            return classes;
        },
        getValue() {
            const value: string = this.indexValue;

            if (Math.abs(this._step) < 1) {
                return parseFloat(value).toFixed(2);
            }

            return value;
        },
        getCurrentValue() {
            if (!this.values[this._value]) {
                return 'Value Not Defined';
            }

            if (this.values[this._value].length >= 16) {
                return this.values[this._value].substring(0, 16) + '...';
            }

            return this.values[this._value];
        },
    },
    mounted() {
        if (!this.isNotNumber(this.minIndex)) {
            this._min = this.minIndex;
        }

        if (!this.isNotNumber(this.maxIndex)) {
            this._max = this.maxIndex;
        }

        if (!this.isNotNumber(this.increment)) {
            this._step = this.increment;
        }

        this._value = this.indexValue;
    },
    watch: {
        async indexValue(newValue) {
            this._value = newValue;

            if (!this.enableAudio) {
                return;
            }

            if (!this._audio) {
                this._audio = new Audio(this.ResolvePath('assets/sounds/ui/hover.ogg'));
                this._audio.volume = 0.1;
            }

            try {
                await this._audio.play();
            } catch (err) {}
        },
    },
});
</script>

<style scoped>
.align-left {
    text-align: left;
    min-width: 30px;
}

.align-right {
    text-align: right;
    min-width: 30px;
}

.align-center {
    text-align: center;
    font-size: 10px !important;
}
</style>
