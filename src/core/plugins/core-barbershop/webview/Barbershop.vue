<template>
    <div class="barbershop-frame">
        <div class="upper-section">
            <div class="color-palette mt-12">
                <Button
                    @click="selectColorType('hairColor1')"
                    class="mb-2"
                    :color="colorType === 'hairColor1' ? 'blue' : 'grey'"
                >
                    Hair
                </Button>
                <Button
                    @click="selectColorType('hairColor2')"
                    class="mb-2"
                    :color="colorType === 'hairColor2' ? 'blue' : 'grey'"
                >
                    Highlight
                </Button>
                <ColorComponent @select-color="selectColor" :currentIndex="getColorIndex" class="mb-4" />
            </div>
        </div>
        <!-- Hair Style Previews -->
        <div class="hairstyles">
            <div v-for="(incremental, index) in indexesToShow" :key="index">
                <div
                    class="image-wrap"
                    :class="incremental === 0 ? 'highlight unfocus' : 'no-highlight'"
                    @click="setIndex(getHairPreviewIndex(incremental))"
                >
                    <div class="hint">
                        <Icon class="white--text" :size="82" :icon="iconsToShow[index]" />
                    </div>
                    <div class="glow"></div>
                    <img :src="getImage(hairStyles[getHairPreviewIndex(incremental)])" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { maleHair } from '../shared/maleHair';
import { femaleHair } from '../shared/femaleHair';
import { BarbershopEvents } from '../shared/events';
import { BarbershopData } from '../shared/interfaces';
import ColorComponentVue from './components/ColorComponent.vue';

import ResolvePath from '../../../../../src-webviews/src/utility/pathResolver';

export const ComponentName = 'Barbershop';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
        ColorComponent: ColorComponentVue,
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            // Data Sets & Navigation
            indexesToShow: [-2, -1, 0, 1, 2],
            iconsToShow: ['icon-fast_rewind', 'icon-arrow_left', 'icon-eye', 'icon-arrow_right', 'icon-fast_forward'],
            currentIndex: 0,
            hairStyles: [],
            colorType: 'hairColor1',
            resolvePath: ResolvePath,
            hairColor1: 0,
            hairColor2: 0,
            beardColor1: 0,
        };
    },
    computed: {
        getColorIndex() {
            return this[this.colorType];
        },
    },
    methods: {
        selectColorType(type: 'hairColor1' | 'hairColor2' | 'beardColor') {
            this.colorType = type;
        },
        selectColor(index: number) {
            this[this.colorType] = index;
            this.update();
        },
        setIndex(index: number) {
            this.currentIndex = index;
            this.update();
        },
        getHairPreviewIndex(incremental: number) {
            if (incremental <= -1) {
                return this.getPrevIndex(Math.abs(incremental));
            }

            if (incremental >= 1) {
                return this.getNextIndex(Math.abs(incremental));
            }

            return this.currentIndex;
        },
        getPrevIndex(amount = 1) {
            if (this.currentIndex - amount <= -1 || this.currentIndex === 0) {
                const whatToRemove = Math.abs(this.currentIndex - amount);
                const endIndex = this.hairStyles.length;
                return endIndex - whatToRemove;
            }

            return this.currentIndex - amount;
        },
        getNextIndex(amount = 1) {
            if (this.currentIndex + amount >= this.hairStyles.length) {
                return this.currentIndex - this.hairStyles.length + amount;
            }

            return this.currentIndex + amount;
        },
        getImage(hair: string) {
            let fileName = `../../assets/images/clothing/${hair}.png`;
            return ResolvePath(fileName);
        },
        setData(data: BarbershopData) {
            this.hairStyles = data.sex === 0 ? femaleHair : maleHair;
            const hairStyleIndex = this.hairStyles.findIndex((x) =>
                x.includes(`2-${data.dlc}-${data.sex === 0 ? 'female' : 'male'}-${data.hair}`),
            );
            this.setIndex(hairStyleIndex === -1 ? 0 : hairStyleIndex);

            this.hairColor1 = data.hairColor1;
            this.hairColor2 = data.hairColor2;
        },
        getHairStyleDlc(): number {
            return parseInt(this.hairStyles[this.currentIndex].split('-')[1]);
        },
        getHairStyle(): number {
            return parseInt(this.hairStyles[this.currentIndex].split('-')[3]);
        },
        update() {
            const updateInformation: BarbershopData = {
                dlc: this.getHairStyleDlc(),
                hair: this.getHairStyle(),
                hairColor1: this.hairColor1,
                hairColor2: this.hairColor2,
                hairFullName: this.hairStyles[this.currentIndex],
            };

            if ('alt' in window) {
                alt.emit(BarbershopEvents.WebViewEvents.UPDATE, updateInformation);
            }
        },
        closePage() {
            //
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on(BarbershopEvents.WebViewEvents.SET_DATA, this.setData);
            alt.emit(BarbershopEvents.WebViewEvents.READY);
        } else {
            this.setData({
                sex: 0,
                dlc: 1152146508,
                hair: 1,
                hairColor1: 0,
                hairColor2: 0,
            });
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(BarbershopEvents.WebViewEvents.SET_DATA, this.setData);
        }
    },
});
</script>

<style scoped>
.barbershop-frame {
    display: flex;
    min-height: 100vh;
    max-height: 100vh;
    min-width: 100vw;
    max-width: 100vw;
    flex-direction: column;
    box-sizing: border-box;
}

.upper-section {
    display: flex;
    flex-direction: row;
    min-height: calc(100vh - 175px);
    max-height: calc(100vh - 175px);
}

.hairstyles {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-sizing: border-box;
    min-width: 100vw;
    max-width: 100vw;
    min-height: 150px;
    max-height: 150px;
    padding-left: 48px;
    padding-right: 48px;
}

.hairstyles .image-wrap {
    display: flex;
    min-height: 100px;
    max-height: 100px;
    transform: scale(0.75);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.hairstyles .image-wrap:hover {
    transform: scale(1);
}

.hairstyles .image-wrap:hover .hint {
    opacity: 0.8;
}

.hairstyles .unfocus:hover {
    transform: scale(0.9) !important;
}

.hairstyles .unfocus:hover .hint {
    transform: scale(0.9) !important;
    opacity: 0 !important;
}

.hairstyles .image-wrap img {
    min-height: 100px;
    max-height: 100px;
    background: rgb(0, 0, 0, 0.2);
    border-bottom: 25px solid rgb(0, 0, 0, 0.002);
    border-left: 25px solid rgb(0, 0, 0, 0.002);
    border-right: 25px solid rgb(0, 0, 0, 0.002);
    border-radius: 25px;
    position: absolute;
}

.hairstyles .highlight {
    border: 6px solid rgba(0, 0, 0, 0.5);
    padding-bottom: 24px;
    border-radius: 32px;
    margin-bottom: 2px;
}

.hairstyles .no-highlight {
    border: 6px solid rgba(0, 0, 0, 0);
    padding-bottom: 24px;
    border-radius: 32px;
    margin-bottom: 2px;
}

.hairstyles .glow {
    position: relative;
    width: 150px;
    height: 125px;
    z-index: 99;
    transition: all 0.2s ease-in-out;
    border-radius: 25px;
}

.hairstyles .glow:hover {
    box-shadow: 0px 0px 15px rgb(255, 255, 255);
}

.hairstyles .hint {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 150px;
    height: 125px;
    z-index: 99;
    opacity: 0;
    transition: all 0.2s ease-in-out;
}

.color-palette {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin-left: 64px;
}
</style>
