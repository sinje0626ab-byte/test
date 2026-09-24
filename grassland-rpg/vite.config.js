import { defineConfig } from 'vite';

// 빌드 결과는 레포 루트의 grassland/ 로 내보낸다.
// GitHub Pages가 레포 루트를 그대로 서비스하므로 /grassland/ 에서 바로 플레이된다.
export default defineConfig({
  base: './',
  build: {
    outDir: '../grassland',
    emptyOutDir: true,
    chunkSizeWarningLimit: 800, // three.js 자체가 크다
    // three.js를 따로 떼어 게임 코드가 바뀌어도 브라우저 캐시를 다시 쓰게 한다
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
        },
      },
    },
  },
});
