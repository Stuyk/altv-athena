<template>
    <div class="container">
        <div class="selection">
            <div class="stack">
                <div class="options">
                    <div class="item hover-blue">Select</div>
                    <div class="item hover-red">Delete</div>
                    <div class="item hover-green">New</div>
                </div>
                <div class="split">
                    <div class="left-column">
                        <div class="left-arrow" @click="prev">
                            <Icon class="grey--text text--lighten-4" :size="48" icon="icon-chevron-left" />
                        </div>
                    </div>
                    <div class="center-column">{{ characterName }}</div>
                    <div class="right-column">
                        <div class="right-arrow" @click="next">
                            <Icon class="grey--text text--lighten-4" :size="48" icon="icon-chevron-right" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, defineAsyncComponent, ref } from 'vue';
import Icon from '@ViewComponents/Icon.vue';
import WebViewEvents from '@utility/webViewEvents';

let characterName = ref('Test Long Name');

function setName(name: string) {
    characterName.value = name;
}

function next() {
    WebViewEvents.emitServer('charSelectGoNext');
}

function prev() {
    WebViewEvents.emitServer('charSelectGoPrev');
}

onMounted(() => {
    WebViewEvents.on('charSelectCharacterName', setName);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');

.container {
    display: flex;
    flex-direction: row;
    position: absolute;
    min-width: 100vw;
    min-height: 100vh;
    background: linear-gradient(to top right, rgba(0, 0, 0, 1), transparent 50%);
}

.left-column {
    text-align: left;
}

.center-column {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    min-width: 300px;
    font-family: 'Permanent Marker', 'Roboto';
    opacity: 0.7;
    font-size: 16px;
}

.right-column {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
}

.left-arrow,
.right-arrow {
    cursor: pointer;
    opacity: 0.7 !important;
}

.left-arrow:hover,
.right-arrow:hover {
    transform: scale(0.95);
    cursor: pointer;
    opacity: 0.9;
}

.character-name {
    position: fixed;
    right: 150px;
    top: 20vh;
    font-size: 36px;
    font-family: 'Permanent Marker', 'Roboto';
    transform: scaleX(1) scaleY(1) scaleZ(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0px) translateY(0px)
        translateZ(0px) skewX(5deg) skewY(-2deg);

    opacity: 0.35;
}

.options {
    display: flex;
    flex-direction: column;
    font-family: 'Permanent Marker', 'Roboto';
    font-size: 24px;
    opacity: 0.7;
    margin-left: 20px;
    margin-bottom: 48px;
    box-sizing: border-box;
}

.options .item {
    margin-bottom: 24px;
    transform: scaleX(1) scaleY(1) scaleZ(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0px) translateY(0px)
        translateZ(0px) skewX(5deg) skewY(-2deg);
    transition: all 0.2s;
}

.options .item:hover {
    opacity: 0.9;
    transform: scale(0.98);
    cursor: pointer;
}

.hover-blue:hover {
    color: cyan;
}

.hover-red:hover {
    color: red;
}

.hover-green:hover {
    color: lime;
}

.selection {
    position: fixed;
    left: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
