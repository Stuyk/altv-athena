<template>
    <div class="suggestions">
        <div
            class="suggestion pa-2"
            v-for="(suggestion, index) in getSuggestions"
            @click="$emit('suggestion-select', `/${suggestion.name}`)"
            :key="index"
        >
            <template v-if="index === 0">
                <div>
                    <kbd class="black white--text pl-2 pr-2">TAB</kbd>
                    &nbsp;<span class="orange--text">{{ suggestion.description }}</span>
                </div>
            </template>
            <template v-else> > {{ suggestion.description }} </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const ComponentName = 'Suggestions';
export default defineComponent({
    name: ComponentName,
    props: {
        suggestions: {
            type: Array,
            default: [],
            required: true,
        },
    },
    computed: {
        getSuggestions() {
            return this.suggestions.slice(0, 4);
        },
    },
});
</script>

<style scoped>
.suggestions {
    display: flex;
    position: absolute;
    flex-direction: column;
    color: white;
    user-select: none;
    overflow-wrap: break-word;
    text-align: left;
    text-shadow: 1px 1px black;
    -webkit-font-smoothing: antialiased;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
}

.suggestion {
    box-sizing: border-box;
    font-size: 14px;
    font-family: 'Arial';
    font-weight: 600;
    width: 100%;
}

.suggestion:hover {
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
}

.suggestion:hover:last-child {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
}
</style>
