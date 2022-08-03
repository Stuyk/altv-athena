<template>
    <div class="test">
        <span>images folder jpeg</span>
        <img width="100" height="100" :src="ResolvePath('@plugins/images/example-extras/test.jpg')" />
        <span>icons folder</span>
        <img width="100" height="100" :src="ResolvePath('@plugins/icons/example-extras/test.png')" />
        <span>images folder png</span>
        <img width="100" height="100" :src="ResolvePath('@plugins/images/example-extras/test.png')" />
        <span>videos folder webm</span>
        <video controls width="250">
            <source :src="ResolvePath('@plugins/videos/example-extras/test.webm')" type="video/webm" />
            Sorry, your browser doesn't support embedded videos.
        </video>
        <span>audio folder ogg</span>
        <audio controls>
            <source :src="ResolvePath('@plugins/sounds/example-extras/test.ogg')" type="audio/ogg" />
            Your browser does not support the audio element.
        </audio>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResolvePath from '../../../../../src-webviews/src/utility/pathResolver';

const ComponentName = 'TestPathResolver';
export default defineComponent({
    name: ComponentName,
    data() {
        return {
            ResolvePath,
        };
    },
});
</script>

<style scoped>
.test {
    display: flex;
    flex-direction: column;
}

.test span {
    color: red;
    font-weight: 600;
}
</style>
