<template>
    <div class="stack">
        <div class="split">
            <div class="blue--text overline pr-2" style="min-width: 30px; text-align: right;">{{ getValue }}</div>
            <input type="range" :min="_min" :max="_max" :step="_step" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
            <div class="blue--text overline pl-2" style="min-width: 30px; text-align: left;">{{ _max }}</div>
        </div>
        <div v-if="values" class="overline grey--text pt-2" style="text-align: center">{{ values[modelValue] }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'RangeInput';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            _min: 0,
            _max: 1,
            _step: 1
        };
    },
    props: {
        uid: {
            type: String,
            required: true
        },
        indexValue: {
            type: Number,
            required: true
        },
        minIndex: {
            type: Number,
            required: true
        },
        maxIndex: {
            type: Number,
            required: true
        },
        increment: {
            type: Number,
            required: true
        },
        values: {
            type: Array,
            required: false
        },
        modelValue: {
            type: Number
        }
    },
    methods: {
        async playTick() {
            const audio = new Audio('/sounds/ui/hover.ogg');
            audio.volume = 0.1;
            await audio.play();
        },
        isNotNumber(value) {
            if (value === undefined || value === null) {
                return true;
            }

            return false;
        }
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
            const value: string = this.modelValue;

            if (Math.abs(this._step) < 1) {
                return parseFloat(value).toFixed(2);
            }

            return value;
        }
    },
    mounted() {
        if (!this.isNotNumber(this.minIndex)) {
            console.log(this.minIndex);
            this._min = this.minIndex;
        }

        if (!this.isNotNumber(this.maxIndex)) {
            this._max = this.maxIndex;
        }

        if (!this.isNotNumber(this.increment)) {
            this._step = this.increment;
        }
    }
});
</script>
