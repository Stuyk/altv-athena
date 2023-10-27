<!--
This is just a way to see all the different .css designs setup already.

Helpful for seeing what default components look like.

-->

<template>
    <div class="background"></div>
</template>

<script lang="ts" setup></script>

<style scoped>
.background {
    display: block;
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: url('https://i.imgur.com/8LOp5rf.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    z-index: -999;
}
</style>
