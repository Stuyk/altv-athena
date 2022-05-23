<template>
    <div class="wrapper stack mt-2">
        <div class="container">
            <p style="text-align: center">{{ text }}</p>
            <div class="split split-full space-between mt-12">
                <Button color="green" class="ml-12" @click="$emit('prev-page')">
                    <Icon :size="14" icon="icon-arrow-bold-left"></Icon>
                    Prev Page</Button
                >
                <Button color="green" class="mr-12" @click="$emit('next-page')">
                    <Icon :size="14" icon="icon-arrow-bold-right"></Icon>
                    Next Page
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../../components/Button.vue';
import Icon from '../../../components/Icon.vue';

const ComponentName = 'YourThirdPage';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            text: 'Hello World! This is Page 3.'
        };
    },
    components: {
        Button, 
        Icon
    },
    methods: {},
});
</script>

<style scoped>
.container {
    background: black;
    width: 400px;
    height: 400px;
    background-image: url('../../../../public/assets/images/athena.png');
    background-size: 100%;
    background-repeat: no-repeat;
}
</style>