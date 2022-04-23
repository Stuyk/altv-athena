<template>
    <div class="container">
        <div class="creator stack">
            <div class="navigation split split-full center mt-4 pl-4 pr-4 pb-4 space-between">
                <!-- Navigate Left -->
                <Button color="blue" @click="decrementIndex" v-if="!isInactiveBack">
                    <Icon class="blue--text" :size="24" icon="icon-chevron-left" />
                </Button>
                <Button :disable="true" v-else>
                    <Icon :size="24" icon="icon-chevron-left" />
                </Button>

                <!-- Title -->
                <span class="overline">{{ locales.titles[selection] }}</span>

                <!-- Navigate Right -->
                <template v-if="selection !== navOptions.length - 1">
                    <Button color="blue" @click="incrementIndex" v-if="!isInactiveNext">
                        <Icon class="blue--text" :size="24" icon="icon-chevron-right" />
                    </Button>
                    <Button :disable="true" v-else>
                        <Icon :size="24" icon="icon-chevron-right" />
                    </Button>
                </template>
            </div>
            <div class="inner-page pl-4 pt-4 pr-4">
                <component
                    v-bind:is="navOptions[selection]"
                    v-bind:data="data"
                    v-bind:locales="locales"
                    @set-parameter="setParameter"
                    @inc-parameter="incrementParameter"
                    @dec-parameter="decrementParameter"
                    @set-infodata="setInfoData"
                    v-bind:infodata="infoData"
                ></component>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '@components/Button.vue';
import Icon from '@components/Icon.vue';
import Modal from '@components/Modal.vue';
import Toolbar from '@components/Toolbar.vue';
import Frame from '@components/Frame.vue';

/** Components for this View Only */
import Appearance from './components/Appearance.vue';
import Hair from './components/Hair.vue';
import Info from './components/Info.vue';
import Makeup from './components/Makeup.vue';
import Overlays from './components/Overlays.vue';
import Structure from './components/Structure.vue';

import MakeupList from './utility/makeupList';
import OverlaysList from './utility/overlaysList';
import { MaleHairOverlays, FemaleHairOverlays } from './utility/hairOverlays';
import { MalePresets, FemalePresets } from './utility/presets';
import { CHARACTER_CREATOR_LOCALE } from '../shared/locale';
import { CHARACTER_CREATOR_WEBVIEW_EVENTS } from '../shared/events';

const ComponentName = 'CharacterCreator';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Icon,
        Modal,
        Toolbar,
        Frame,
        Appearance,
        Structure,
        Hair,
        Overlays,
        Makeup,
        Info,
    },
    data() {
        return {
            show: false,
            selection: 0,
            forceUpdate: 0,
            controlsEnabled: true,
            data: {
                sex: 1,
                faceMother: 0,
                faceFather: 0,
                skinMother: 0,
                skinFather: 0,
                skinMix: 0.5,
                faceMix: 0.5,
                structure: new Array(20).fill(0),
                hair: 3,
                hairColor1: 1,
                hairColor2: 5,
                hairOverlay: '',
                facialHair: 29,
                facialHairColor1: 0,
                facialHairOpacity: 0,
                eyebrows: 0,
                eyebrowsOpacity: 1,
                eyebrowsColor1: 0,
                chestHair: 0,
                chestHairOpacity: 0,
                chestHairColor1: 0,
                eyes: 0,
                opacityOverlays: [],
                colorOverlays: [],
            },
            infoData: {
                age: new Date(1990, 1, 1),
                gender: null,
                name: '',
            },
            navOptions: ['Appearance', 'Structure', 'Hair', 'Overlays', 'Makeup', 'Info'],
            totalCharacters: 1,
            locales: CHARACTER_CREATOR_LOCALE,
        };
    },
    computed: {
        isInactive() {
            if (this.selection >= this.navOptions.length - 1) {
                return true;
            }

            if (this.selection === 5) {
                return true;
            }

            return false;
        },
        isInactiveNext() {
            if (this.selection >= this.navOptions.length - 1) {
                return true;
            }

            if (this.selection === 5) {
                return true;
            }

            return false;
        },
        isInactiveBack() {
            if (this.selection <= 0) {
                return true;
            }

            return false;
        },
    },
    methods: {
        incrementIndex() {
            if (this.selection + 1 >= this.navOptions.length) {
                this.selection = this.navOptions.length - 1;
                return;
            }

            this.selection += 1;

            if(this.selection >= this.navOptions.length - 1 && this.controlsEnabled) {
                alt.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.DISABLE_CONTROLS, true);
                this.controlsEnabled = false;
            }
        },
        decrementIndex() {
            if (this.selection - 1 <= -1) {
                this.selection = 0;
                return;
            }
            
            if(!this.controlsEnabled) {
                alt.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.DISABLE_CONTROLS, false);
                this.controlsEnabled = true;
            } 

            this.selection -= 1;
        },
        setReady(noDiscard = true, noName = true) {
            if (this.show) {
                return;
            }

            this.noDiscard = noDiscard;
            this.noName = noName;
            this.show = true;

            if (!('alt' in window)) {
                return;
            }

            alt.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.READY_SETUP_COMPLETE);
        },
        setParameter(parameter: string, value: any, arrayIndex: number = null) {
            if (typeof value !== 'number' && typeof value !== 'object') {
                value = parseFloat(value);
            }

            if (parameter === 'sex') {
                if (value === 0) {
                    this.data.faceFather = 33;
                    this.data.faceMother = 45;
                    this.data.skinFather = 45;
                    this.data.skinMother = 45;
                    this.data.skinMix = 0.5;
                    this.data.faceMix = 0.5;
                    this.data.facialHair = 29;
                    this.data.facialHairColor1 = 0;
                    this.data.eyebrows = 0;
                } else {
                    this.data.faceMother = 0;
                    this.data.faceFather = 0;
                    this.data.skinFather = 0;
                    this.data.skinMother = 0;
                    this.data.skinMix = 0.5;
                    this.data.faceMix = 0.5;
                    this.data.facialHair = 29;
                    this.data.facialHairColor1 = 0;
                    this.data.eyebrows = 0;
                }
            }

            if (parameter === 'preset') {
                this.preset = value;
                const index = value - 1;
                const preset = this.data.sex === 0 ? FemalePresets[index] : MalePresets[index];
                Object.keys(preset).forEach((key) => {
                    this.data[key] = preset[key];
                });

                this.data.facialHair = 29;
                this.data.facialHairColor1 = 0;
                this.data.eyebrows = 0;
            } else {
                if (arrayIndex === undefined || arrayIndex === null) {
                    if (isNaN(value as number)) {
                        this.data[parameter] = value;
                    } else {
                        this.data[parameter] = parseFloat(value.toString());
                    }
                } else {
                    if (isNaN(value as number)) {
                        this.data[parameter][arrayIndex] = value;
                    } else {
                        this.data[parameter][arrayIndex] = parseFloat(value.toString());
                    }
                }
            }

            this.forceUpdate += 1;
            this.updateCharacter();
        },
        decrementParameter(
            parameter: string,
            min: number,
            max: number,
            incrementValue: number,
            arrayIndex: number = null,
        ) {
            if (arrayIndex === null || arrayIndex === undefined) {
                this.data[parameter] -= incrementValue;

                if (this.data[parameter] < min) {
                    this.data[parameter] = max;
                }
            } else {
                this.data[parameter][arrayIndex] -= incrementValue;

                if (this.data[parameter][arrayIndex] < min) {
                    this.data[parameter][arrayIndex] = max;
                }
            }

            this.forceUpdate += 1;
            this.updateCharacter();
        },
        incrementParameter(
            parameter: string,
            min: number,
            max: number,
            incrementValue: number,
            arrayIndex: number = null,
        ) {
            if (arrayIndex === null || arrayIndex === undefined) {
                this.data[parameter] += incrementValue;

                if (this.data[parameter] > max) {
                    this.data[parameter] = min;
                }
            } else {
                this.data[parameter][arrayIndex] += incrementValue;

                if (this.data[parameter][arrayIndex] > max) {
                    this.data[parameter][arrayIndex] = min;
                }
            }

            this.forceUpdate += 1;
            this.updateCharacter();
        },
        setData(oldData, totalCharacters) {
            this.totalCharacters = totalCharacters;

            if (!oldData) {
                this.updateCharacter();
                return;
            }

            this.data = oldData;
            this.updateCharacter();
        },
        setInfoData(parameter: string, value: any) {
            this.infoData[parameter] = value;
        },
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        updateCharacter() {
            const isFemale = this.data.sex === 0;
            this.data.hairOverlay = isFemale ? FemaleHairOverlays[this.data.hair] : MaleHairOverlays[this.data.hair];

            if (isFemale) {
                this.data.facialHair = 30;
                this.data.facialHairOpacity = 0;
            }

            // Update Floats
            this.data.skinMix = parseFloat(this.data.skinMix);
            this.data.faceMix = parseFloat(this.data.faceMix);
            this.forceUpdate += 1;

            if (!('alt' in window)) {
                return;
            }

            alt.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.SYNC, JSON.parse(JSON.stringify(this.data)));
        },
        resetSelection() {
            this.selection = 0;
        },
    },
    mounted() {
        OverlaysList.forEach((overlay) => {
            const overlayData = { ...overlay };
            overlayData.value = 0;
            delete overlayData.max;
            delete overlayData.min;
            delete overlayData.increment;

            this.data.opacityOverlays.push(overlayData);
        });

        MakeupList.forEach((overlay) => {
            const overlayData = { ...overlay };
            overlayData.value = 0;
            delete overlayData.max;
            delete overlayData.min;
            delete overlayData.increment;

            this.data.colorOverlays.push(overlayData);
        });

        if ('alt' in window) {
            alt.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.READY, this.setReady);
            alt.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.SET_DATA, this.setData);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(CHARACTER_CREATOR_WEBVIEW_EVENTS.READY, this.setReady);
            alt.off(CHARACTER_CREATOR_WEBVIEW_EVENTS.SET_DATA, this.setData);
        }
    },
});
</script>

<style scoped>
/* This style is applied to only this page */
.container {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, rgba(0, 0, 0, 1), transparent 35%);
}

.creator {
    position: fixed;
    min-width: 400px;
    min-height: 100vh;
    max-height: 100vh;
    background: rgba(12, 12, 12, 1) !important;
    right: 0;
    border-left: 2px solid rgba(64, 64, 64, 1);
}

.navigation {
    border-bottom: 2px solid rgba(64, 64, 64, 1);
    min-height: 75px !important;
    box-sizing: border-box !important;
}

.inner-page {
    display: block;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
}
</style>

<style>
/* This style is applied to all components too */
.subtitle-2 {
    white-space: pre-line !important;
}
</style>
