<template>
    <div class="suggestions">
        <div
            class="suggestion pa-1"
            v-for="(suggestion, index) in getSuggestions"
            @click="$emit('suggestion-select', `/${suggestion.name}`)"
            :key="index"
        >
            <template v-if="index === 0">
                <span class="blue--text">[TAB] {{ suggestion.description }}</span>
            </template>
            <template v-else>
                {{ suggestion.description }}
            </template>
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
            return this.suggestions.slice(0, 5);
        },
    },
});
</script>

<style scoped>
.suggestions {
    position: relative;
    display: flex;
    flex-direction: column;
    color: white;
    user-select: none;
    font-family: 'Roboto';
    font-weight: 500;
    overflow-wrap: break-word;
    text-align: left;
    text-shadow: 1px 1px black;
    letter-spacing: 0.05em;
    text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px 1px 0 #000, 0 1px 0 #000,
        -1px 1px 0 #000, -1px 0 0 #000;
    -webkit-font-smoothing: antialiased;
    background: rgba(0, 0, 0, 0.5);
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
}

.suggestion {
    box-sizing: border-box;
    font-size: 12px;
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
