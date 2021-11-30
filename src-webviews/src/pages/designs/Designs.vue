<!--
This is just a way to see all the different .css designs setup already.

Helpful for seeing what default components look like.

-->

<template>
    <div class="stack background">
        <h2 class="grey--text text--lighten-2">Buttons</h2>
        <div class="split space-between">
            <Button color="green" @click="doSomething">Accept</Button>
            <Button color="blue" @click="doSomething">Submit</Button>
            <Button color="amber" @click="doSomething">Warning</Button>
            <Button color="red" @click="doSomething">Cancel</Button>
            <Button :disable="true">Disabled</Button>
            <Button color="green" :raise="false" :flatten="true" @click="doSomething">Accept</Button>
            <Button color="blue" :raise="false" :flatten="true" @click="doSomething">Submit</Button>
            <Button color="amber" :raise="false" :flatten="true" @click="doSomething">Warning</Button>
            <Button color="red" :raise="false" :flatten="true" @click="doSomething">Cancel</Button>
        </div>
        <h2 class="grey--text text--lighten-2">Icons</h2>
        <div class="split space-between">
            <Button color="blue" @click="doSomething" class="fab">
                <Icon class="blue--text" :size="16" icon="icon-chevron-left" />
            </Button>
            <Button color="blue" @click="doSomething" class="fab">
                <Icon class="blue--text" :size="16" icon="icon-chevron-right" />
            </Button>
            <Button color="red" @click="doSomething">
                <Icon class="red--text" :size="32" icon="icon-cancel" />
            </Button>
            <Button color="green" @click="doSomething">
                <Icon class="green--text" :size="64" icon="icon-checkmark" />
            </Button>
            <Icon class="grey--text" :size="16" icon="icon-laptop" />
            <Icon class="grey--text" :size="32" icon="icon-server" />
            <Icon class="grey--text" :size="64" icon="icon-user" />
        </div>
        <h2 class="grey--text text--lighten-2">Input Boxes</h2>
        <h4 class="grey--text text--lighten-2">Basic</h4>
        <Input :stack="true" :onInput="onInputChange" placeholder="Input First Name..." />
        <h4 class="grey--text text--lighten-2">Basic Unstacked</h4>
        <Input label="First Name" :stack="false" :onInput="onInputChange" placeholder="Hello World" />
        <h4 class="grey--text text--lighten-2">Advanced with Rules</h4>
        <Input
            label="Age"
            :numberOnly="true"
            :stack="false"
            :onInput="ageInputChange"
            :validateCallback="ageValidCallback"
            :value="5"
            :rules="[
                (text) => {
                    return parseInt(text) >= 18 ? null : 'Age must be at least 18';
                },
                (text) => {
                    return parseInt(text) <= 99 ? null : 'Age cannot exceed 99';
                },
            ]"
            icon="icon-question"
            placeholder="25..."
        />
        <h4 class="grey--text text--lighten-2">Range Input</h4>
        <RangeInput
            :minIndex="0"
            :maxIndex="4"
            :indexValue="0"
            :increment="1"
            :values="rangeValues"
            @input="changedInput"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Input from '../../components/Input.vue';
import Button from '../../components/Button.vue';
import Icon from '../../components/Icon.vue';
import RangeInput from '../../components/RangeInput.vue';

const ComponentName = 'Designs';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            ageValid: false,
            rangeValues: ['Head', 'Mouth', 'Shoulders', 'Knees', 'Toes'],
        };
    },
    components: {
        Button,
        Icon,
        Input,
        RangeInput,
    },
    methods: {
        doSomething() {
            console.log('did something');
        },
        onInputChange(text: string) {
            console.log(text);
        },
        changedInput(e: Event) {
            console.log(parseFloat(e.target['value']));
        },
        ageValidCallback(valid: boolean) {
            this.ageValid = valid;
            console.log(`Is Age Valid: ${this.ageValid}`);
        },
        ageInputChange(text: string) {
            console.log(`Age Input as: ${text}`);
        },
    },
});
</script>

<style scoped>
.background {
    display: block;
    position: absolute;
    padding: 24px !important;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(10, 10, 10, 1) !important;
    box-sizing: border-box;
}
</style>
