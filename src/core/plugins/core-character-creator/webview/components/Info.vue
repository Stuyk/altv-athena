<template>
    <div class="wrapper stack" v-if="!processing">
        <div class="subtitle-2 grey--text mb-2 mt-2">Character Info</div>
        <div class="split split-full center">
            <Input
                :label="locales.LABEL_FIRST_NAME"
                :stack="true"
                :onInput="(text) => inputChange('first', text)"
                :validateCallback="(valid) => setValidityProp('first', valid)"
                :value="''"
                :rules="[
                    (text) => {
                        return new RegExp(/^[a-zA-Z]+$/gm).test(text) ? null : 'Name cannot include special characters';
                    },
                    (text) => {
                        return text.length >= 3 ? null : 'First name must be at least 3 characters';
                    },
                ]"
                :swapIconSide="true"
                :icon="valid?.first ? 'icon-checkmark' : 'icon-question'"
                placeholder="Ivy"
                class="fill-full-width"
            />
        </div>
        <div class="split split-full center mt-4">
            <Input
                :label="locales.LABEL_LAST_NAME"
                :stack="true"
                :onInput="(text) => inputChange('last', text)"
                :validateCallback="(valid) => setValidityProp('last', valid)"
                :value="''"
                :rules="[
                    (text) => {
                        return new RegExp(/^[a-zA-Z]+$/gm).test(text) ? null : 'Name cannot include special characters';
                    },
                    (text) => {
                        return text.length >= 3 ? null : 'Last name must be at least 3 characters';
                    },
                ]"
                :swapIconSide="true"
                :icon="valid?.last ? 'icon-checkmark' : 'icon-question'"
                placeholder="Vilachi"
                class="fill-full-width"
            />
        </div>

        <div class="subtitle-2 grey--text mb-2 mt-6">Age</div>
        <div class="split split-full center mt-2">
            <Input
                :label="locales.LABEL_MONTH"
                :stack="true"
                :numberOnly="true"
                :onInput="(text) => inputChange('month', text)"
                :validateCallback="(valid) => setValidityProp('month', valid)"
                :value="''"
                :rules="[
                    (text) => {
                        return parseFloat(text) >= 1 && parseFloat(text) <= 12 ? null : 'Month is 1 to 12';
                    },
                ]"
                :swapIconSide="true"
                :icon="valid?.month ? 'icon-checkmark' : 'icon-question'"
                :placeholder="month.toString()"
                class="fill-full-width"
            />
        </div>
        <div class="split split-full center mt-4">
            <Input
                :label="locales.LABEL_DAY"
                :stack="true"
                :numberOnly="true"
                :onInput="(text) => inputChange('day', text)"
                :validateCallback="(valid) => setValidityProp('day', valid)"
                :value="''"
                :rules="[
                    (text) => {
                        return parseFloat(text) >= 1 && parseFloat(text) <= 31 ? null : 'Day is 1 to 31';
                    },
                ]"
                :swapIconSide="true"
                :placeholder="day.toString()"
                :icon="valid?.day ? 'icon-checkmark' : 'icon-question'"
                class="fill-full-width"
            />
        </div>
        <div class="split split-full center mt-4">
            <Input
                :label="locales.LABEL_YEAR"
                :stack="true"
                :numberOnly="true"
                :onInput="(text) => inputChange('year', text)"
                :validateCallback="(valid) => setValidityProp('year', valid)"
                :value="''"
                :rules="[
                    (text) => {
                        return parseFloat(text) >= minYear ? null : `Minimum Year: ${minYear}`;
                    },
                    (text) => {
                        return parseFloat(text) <= maxYear ? null : `Maximum Year: ${maxYear}`;
                    },
                ]"
                :swapIconSide="true"
                :icon="valid?.year ? 'icon-checkmark' : 'icon-question'"
                :placeholder="year.toString()"
                class="fill-full-width"
            />
        </div>

        <div class="subtitle-2 grey--text mb-2 mt-6">Gender</div>
        <div class="split split-full center mt-2 mb-4">
            <Input
                :label="locales.characterGender"
                :stack="true"
                :onInput="(text) => inputChange('gender', text)"
                :validateCallback="(valid) => setValidityProp('gender', valid)"
                :value="''"
                :rules="[
                    (text) => {
                        return new RegExp(/^[a-zA-Z]+$/gm).test(text) ? null : 'No special characters';
                    },
                    (text) => {
                        return text.length >= 3 ? null : 'Gender must be at least 3 characters';
                    },
                ]"
                :swapIconSide="true"
                :icon="valid?.gender ? 'icon-checkmark' : 'icon-question'"
                :placeholder="gender"
                class="fill-full-width"
            />
        </div>
        <div class="split split-full center mt-8 pb-4" v-if="!isAllValid() && valid.first && valid.last">
            <Button color="amber" :raise="true" @click="verifyName">Verify Name</Button>
        </div>
        <div class="split split-full space-between center mt-8 pb-4" v-if="isAllValid() && valid?.first && valid.last">
            <Button class="mr-2 fill-full-width" color="amber" :raise="true" @click="verifyName">Verify Name</Button>
            <Button class="ml-2 fill-full-width" color="green" :raise="true" @click="save">Finish</Button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

import { CHARACTER_CREATOR_WEBVIEW_EVENTS } from '../../shared/events';

const ComponentName = 'Info';
export default defineComponent({
    name: ComponentName,
    props: {
        data: Object,
        locales: Object,
        infodata: Object,
        emit: Function,
    },
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Input: defineAsyncComponent(() => import('@components/Input.vue')),
    },
    data() {
        return {
            processing: false,
            first: '',
            last: '',
            gender: '',
            valid: {
                first: false,
                last: false,
                month: false,
                day: false,
                year: false,
                name: false,
                gender: false,
            },
            day: 1,
            month: 1,
            year: 1990,
            maxYear: 2006,
            minYear: 1940,
            minAge: 18,
        };
    },
    computed: {
        getNameClass() {
            const isValid = this.valid.first && this.valid.last;
            if (!isValid) {
                return { 'grey--text': true };
            }

            return {
                'green--text': true,
            };
        },
    },
    methods: {
        inputChange(name: string, text: string): void {
            this[name] = text;
        },
        setValidityProp(name: string, valid: boolean): void {
            this.valid[name] = valid;
        },
        normalizeName(value: string) {
            const firstLetter = value.substring(0, 1).toUpperCase();
            const theRestOfTheValue = value.substring(1, value.length);
            return `${firstLetter}${theRestOfTheValue}`;
        },
        constructName(): string {
            return `${this.normalizeName(this.first)}_${this.normalizeName(this.last)}`;
        },
        verifyName() {
            const name = this.constructName();
            this.isNameAvailable = null;
            this.$emit('set-infodata', 'name', name);

            if (!('alt' in window)) {
                return;
            }

            alt.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.VERIFY_NAME, name);
        },
        handleNameAvailable(result: boolean) {
            this.valid.name = result;

            if (!this.valid.name) {
                this.valid.first = false;
                this.valid.last = false;
                this.first = '';
                this.last = '';
                return;
            }
        },
        isAllValid() {
            let allValid = true;

            Object.keys(this.valid).forEach((key) => {
                if (!this.valid[key]) {
                    allValid = false;
                }
            });

            return allValid;
        },
        save() {
            this.processing = true;

            if (this.data.sex === 0) {
                this.data.facialHair = 29;
                this.data.facialHairColor1 = 0;
            }

            this.$emit('set-infodata', 'gender', this.gender);
            this.$emit('set-infodata', 'age', `${this.day}-${this.month}-${this.year}`);

            if (!('alt' in window)) {
                return;
            }

            alt.emit(
                CHARACTER_CREATOR_WEBVIEW_EVENTS.DONE,
                JSON.parse(JSON.stringify(this.data)),
                JSON.parse(JSON.stringify(this.infodata)),
                this.infodata.name,
            );
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.VERIFY_NAME, this.handleNameAvailable);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(CHARACTER_CREATOR_WEBVIEW_EVENTS.VERIFY_NAME, this.handleNameAvailable);
        }
    },
});
</script>
