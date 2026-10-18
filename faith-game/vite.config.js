import { defineConfig } from 'vite';

// 빌드 결과는 레포 루트의 faith/ 로 내보낸다.
// GitHub Pages가 레포 루트를 그대로 서비스하므로 /faith/ 에서 바로 플레이된다.
export default defineConfig({
  base: './',
  build: {
    outDir: '../faith',
    emptyOutDir: true,
  },
});
