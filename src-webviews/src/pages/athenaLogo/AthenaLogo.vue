<template>
    <div class="logo-frame">
        <img :src="ResolvePath(`../../assets/images/athena.png`)" width="500" />
        <h3>Athena Framework by Stuyk</h3>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResolvePath from '../../utility/pathResolver';

const ComponentName = 'AthenaLogo';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            //
        };
    },
    methods: {
        ResolvePath,
    },
});
</script>

<style scoped>
.logo-frame {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    user-select: none;
    min-width: 100vw;
    height: 100vh;
    backface-visibility: hidden;
    animation: fadein ease 0.5s;
    background: rgba(25, 25, 25, 1) !important;
    align-content: center;
    align-items: center;
    justify-content: center;
    animation: fade-in-out 1.5s ease-in-out;
    opacity: 0;
}

@keyframes fade-in-out {
    0% {
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>
