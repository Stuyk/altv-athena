<template>
    <Frame minWidth="40vw" maxWidth="40vw" class="elevation-6">
        <template v-slot:toolbar>
            <Toolbar @close-page="close" pageName="Job">{{ header }}</Toolbar>
        </template>
        <template v-slot:content>
            <div class="img-frame">
                <img :src="ResolvePath(image)" style="width: 100%" />
            </div>
            <p class="body-2" v-html="getSummary"></p>
            <div class="split space-between split-full pt-4">
                <Button color="red" class="mr-2" style="width: 100%" @click="close">
                    {{ locales.LABEL_DECLINE }}
                </Button>
                <Button color="green" class="ml-2" style="width: 100%" @click="select">
                    {{ locales.LABEL_ACCEPT }}
                </Button>
            </div>
        </template>
    </Frame>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '../../components/Icon.vue';
import Button from '../../components/Button.vue';
import Toolbar from '../../components/Toolbar.vue';
import Frame from '../../components/Frame.vue';
import ResolvePath from '../../utility/pathResolver';

export const ComponentName = 'Job';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Toolbar,
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            image: '../../assets/images/job.jpg',
            header: 'Rob the Bank',
            summary: `This is a basic summary example.
                You use can this to set new lines. Also write really awesome text.

                <p style="color: yellow">Start work today!</p>`,
            locales: {
                LABEL_DECLINE: 'Decline',
                LABEL_ACCEPT: 'Accept',
            },
        };
    },
    mounted() {
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.on(`${ComponentName}:SetLocale`, this.setLocales);
            alt.on(`${ComponentName}:Data`, this.setData);
            alt.emit(`${ComponentName}:Ready`);
        }
    },
    unmounted() {
        document.removeEventListener('keyup', this.handlePress);

        if ('alt' in window) {
            alt.off(`${ComponentName}:Data`, this.setData);
            alt.off(`${ComponentName}:SetLocale`, this.setLocales);
        }
    },
    computed: {
        getSummary() {
            return this.summary.replace(/(?:\r\n|\r|\n)/g, '<br />');
        },
    },
    methods: {
        ResolvePath,
        setLocales(localeObject) {
            this.locales = localeObject;
        },
        handlePress(e) {
            if (e.keyCode !== 27) {
                return;
            }

            this.close();
        },
        setData(jobData) {
            this.image = jobData.image;
            this.header = jobData.header;
            this.summary = jobData.summary;
        },
        select() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${ComponentName}:Select`);
        },
        close() {
            if (!('alt' in window)) {
                return;
            }

            alt.emit(`${ComponentName}:Close`);
        },
    },
});
</script>

<style scoped>
.img-frame {
    display: flex;
    min-height: 150px;
    max-height: 150px;
    width: 100%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    overflow: hidden;
    background-size: cover;
}

.img-frame img {
    object-fit: cover;
    min-height: 150px;
    max-height: 150px;
    width: 100%;
}
</style>
