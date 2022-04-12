import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

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
            { find: '@', replacement: '/src' },
            { find: '@components', replacement: '/src/components' },
            { find: '@utility', replacement: '/src/utility' },
            // '/@/': path.resolve(__dirname, './src'),
            // '/@plugins/': path.resolve(__dirname, '..', './src/core/plugins'),
            // '/@components/': path.resolve(__dirname, './src/components'),
        ],
    },
});
