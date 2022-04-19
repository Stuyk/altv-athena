import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: './',
    build: {
        outDir: '../resources/webviews',
        emptyOutDir: true,
    },
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(__dirname, './src') },
            { find: '@components', replacement: path.resolve(__dirname, './src/components') },
            { find: '@utility', replacement: path.resolve(__dirname, './src/utility') },
            { find: '@plugins', replacement: path.resolve(__dirname, '../src/core/plugins') },
        ],
    },
});
