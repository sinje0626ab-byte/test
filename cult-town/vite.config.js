import { defineConfig } from 'vite';

// 빌드 결과는 레포 루트의 cult/ 로 내보낸다 → GitHub Pages test/cult/
export default defineConfig({
  base: './',
  build: {
    outDir: '../cult',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
  },
});
