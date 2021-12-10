<template>
    <div class="paint-shop-wrapper">
        <input type="color" id="color1" name="color1" value="#ffffff" @input="setColor1" />
        <input type="color" id="color2" name="color2" value="#ffffff" @input="setColor2" />
        <Button class="mt-5" @click="purchase">Purchase</Button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../components/Button.vue';
import Frame from '../../components/Frame.vue';
import Icon from '../../components/Icon.vue';
import Input from '../../components/Input.vue';
import Modal from '../../components/Modal.vue';
import Module from '../../components/Module.vue';
import RangeInput from '../../components/RangeInput.vue';
import Toolbar from '../../components/Toolbar.vue';

const ComponentName = 'PaintShop';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Input,
        Modal,
        Module,
        RangeInput,
        Toolbar,
    },
    data() {
        return {
            color1: { r: 255, g: 255, b: 255 },
            color2: { r: 255, g: 255, b: 255 },
        };
    },
    mounted() {
        this.$nextTick(() => {
            document.getElementById('color1').focus();
        });
    },
    unmounted() {},
    methods: {
        hexToRgb(hex: string) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16),
                  }
                : null;
        },
        setColor1(e) {
            const hexColor = e.target['value'];
            if (!hexColor) {
                return;
            }

            this.color1 = this.hexToRgb(hexColor);
            this.update();
        },
        setColor2(e) {
            const hexColor = e.target['value'];
            if (!hexColor) {
                return;
            }

            this.color2 = this.hexToRgb(hexColor);
            this.update();
        },
        update() {
            if ('alt' in window) {
                alt.emit(`${ComponentName}:Update`, this.color1, this.color2);
            }
        },
        purchase() {
            if ('alt' in window) {
                alt.emit(`${ComponentName}:Purchase`, this.color1, this.color2);
            }
        },
    },
});
</script>

<style scoped>
.paint-shop-wrapper {
    position: fixed;
    top: 10vh !important;
}
</style>
