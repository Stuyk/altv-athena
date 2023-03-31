import { defineConfig } from 'vite';
import * as path from 'path';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: './',
    build: {
        outDir: '../resources/webviews',
        emptyOutDir: true,
        minify: 'esbuild',
        reportCompressedSize: false,
    },
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(__dirname, './src') },
            { find: '@components', replacement: path.resolve(__dirname, './src/components') },
            { find: '@utility', replacement: path.resolve(__dirname, './src/utility') },
            { find: '@plugins', replacement: path.resolve(__dirname, '../src/core/plugins') },
            { find: '@ViewComponents', replacement: path.resolve(__dirname, './src/components') },
            { find: '@ViewUtility', replacement: path.resolve(__dirname, './src/utility') },
            { find: '@AthenaPlugins', replacement: path.resolve(__dirname, '../src/core/plugins') },
            { find: '@AthenaShared', replacement: path.resolve(__dirname, '../src/core/shared') },
        ],
    },
});
