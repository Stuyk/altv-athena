<template>
    <div class="barbershop-frame">
        <div class="hairstyles">
            <div class="image-wrap unfocus" @click="setIndex(getPrevIndex(2))">
                <div class="hint">
                    <Icon class="white--text" :size="82" icon="icon-fast_rewind" />
                </div>
                <div class="glow"></div>
                <img :src="getImage(hairStyles[getPrevIndex(2)])" />
            </div>
            <div class="image-wrap unfocus" @click="setIndex(getPrevIndex(1))">
                <div class="hint">
                    <Icon class="white--text" :size="96" icon="icon-arrow_left" />
                </div>
                <div class="glow"></div>
                <img :src="getImage(hairStyles[getPrevIndex(1)])" />
            </div>
            <div class="image-wrap" @click="setIndex(index)">
                <div class="hint">
                    <Icon class="white--text" :size="36" icon="icon-eye" />
                </div>
                <div class="glow"></div>
                <img :src="getImage(hairStyles[index])" />
            </div>
            <div class="image-wrap unfocus" @click="setIndex(getNextIndex(1))">
                <div class="hint">
                    <Icon class="white--text" :size="96" icon="icon-arrow_right" />
                </div>
                <div class="glow"></div>
                <img :src="getImage(hairStyles[getNextIndex(1)])" />
            </div>
            <div class="image-wrap unfocus" @click="setIndex(getNextIndex(2))">
                <div class="hint">
                    <Icon class="white--text" :size="82" icon="icon-fast_forward" />
                </div>
                <div class="glow"></div>
                <img :src="getImage(hairStyles[getNextIndex(2)])" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { maleHair } from '../shared/maleHair';
import { femaleHair } from '../shared/femaleHair';
import { BarbershopEvents } from '../shared/events';
import ResolvePath from '../../../../../src-webviews/src/utility/pathResolver';

export const ComponentName = 'Barbershop';
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            sex: 0,
            index: 0,
            hairStyles: [],
            hair: 0,
            hairColor: 0,
            resolvePath: ResolvePath,
        };
    },
    methods: {
        setIndex(index: number) {
            this.index = index;
        },
        getPrevIndex(amount = 1) {
            if (this.index <= 0 || this.index - amount <= 0) {
                return this.hairStyles.length - 1 - amount;
            }

            return this.index - amount;
        },
        getNextIndex(amount = 1) {
            if (this.index >= this.hairStyles.length) {
                return amount;
            }

            return this.index + amount;
        },
        getImage(hair: string) {
            let fileName = `../../assets/images/clothing/${hair}.png`;
            return ResolvePath(fileName);
        },
        setSex(value: number) {
            this.sex = value;
            this.hairStyles = this.sex === 0 ? femaleHair : maleHair;
        },
        closePage() {
            //
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on(BarbershopEvents.WebViewEvents.SET_SEX, this.setSex);
            alt.emit(BarbershopEvents.WebViewEvents.READY);
        } else {
            this.setSex(0);
        }
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(BarbershopEvents.WebViewEvents.SET_SEX, this.setSex);
        }
    },
});
</script>

<style scoped>
.barbershop-frame {
    position: fixed;
    bottom: 24px;
    border: 0px !important;
}

.hairstyles {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
    box-sizing: border-box;
    min-height: 130px;
    min-width: 100vw;
    max-width: 100vw;
}

.hairstyles .image-wrap {
    display: flex;
    min-height: 100px;
    max-height: 100px;
    transform: scale(0.9);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.hairstyles .image-wrap:hover {
    transform: scale(1);
}

.hairstyles .image-wrap:hover .hint {
    opacity: 0.8;
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
</style>
