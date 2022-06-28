<template>
    <div class="hairstyles">
        <div v-for="(incremental, index) in hairStyleIndexes" :key="index">
            <div
                class="image-wrap"
                :class="incremental === 0 ? 'highlight unfocus' : 'no-highlight'"
                @click="$emit('set-index', getHairPreviewIndex(incremental))"
            >
                <div class="hint">
                    <Icon class="white--text" :size="82" :icon="hairStyleIcons[index]" />
                </div>
                <div class="glow"></div>
                <img :src="getImage(hairStyles[getHairPreviewIndex(incremental)])" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import ResolvePath from '../../../../../../src-webviews/src/utility/pathResolver';
import { maleHair } from '../../shared/maleHair';
import { femaleHair } from '../../shared/femaleHair';

const ComponentName = 'HairstyleComponent';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    props: {
        currentIndex: {
            type: Number,
            default: 0,
        },
        sex: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            hairStyleIndexes: [-2, -1, 0, 1, 2],
            hairStyleIcons: [
                'icon-fast_rewind',
                'icon-arrow_left',
                'icon-eye',
                'icon-arrow_right',
                'icon-fast_forward',
            ],
            hairStyles: [],
        };
    },
    methods: {
        getImage(hair: string) {
            let fileName = `../../assets/images/clothing/${hair}.png`;
            return ResolvePath(fileName);
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
    },
    mounted() {
        this.hairStyles = this.sex === 0 ? femaleHair : maleHair;
    },
});
</script>

<style>
.hairstyles {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    min-height: 150px;
    max-height: 150px;
    padding-left: 64px;
    padding-right: 64px;
}

.hairstyles .image-wrap {
    display: flex;
    min-height: 100px;
    max-height: 100px;
    transform: scale(0.8);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.hairstyles .image-wrap:hover {
    transform: scale(0.85);
}

.hairstyles .image-wrap:hover .hint {
    opacity: 0.8;
}

.hairstyles .unfocus:hover {
    transform: scale(0.85);
}

.hairstyles .unfocus:hover .hint {
    transform: scale(0.85) !important;
    opacity: 0 !important;
}

.hairstyles .image-wrap img {
    min-height: 100px;
    max-height: 100px;
    background: rgb(0, 0, 0, 0.8);
    border-bottom: 32px solid rgb(0, 0, 0, 0.0008);
    border-left: 8px solid rgb(0, 0, 0, 0.0008);
    border-right: 8px solid rgb(0, 0, 0, 0.0008);
    border-radius: 12px;
    position: absolute;
}

.hairstyles .highlight {
    padding-bottom: 60px;
    border-radius: 32px;
    margin-bottom: 2px;
    transform: scale(0.9);
}

.hairstyles .highlight:hover {
    transform: scale(0.9) !important;
}

.hairstyles .no-highlight {
    border: 6px solid rgba(0, 0, 0, 0);
    padding-bottom: 24px;
    border-radius: 32px;
}

.hairstyles .glow {
    position: relative;
    width: 116px;
    height: 130px;
    z-index: 99;
    transition: all 0.2s ease-in-out;
    border-radius: 12px;
}

.hairstyles .glow:hover {
    box-shadow: 0px 0px 15px rgba(255, 166, 0, 0.9);
}

.hairstyles .hint {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 118px;
    height: 125px;
    z-index: 99;
    opacity: 0;
    transition: all 0.2s ease-in-out;
}
</style>
